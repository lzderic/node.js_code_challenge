import fs from 'fs/promises';
import { Readable } from 'stream';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../src/parser.js', () => ({
  normalizeUrl: (u) => u.trim(),
  extractUrlsFromText: (t) => (t ? t.split(/\s+/).filter(Boolean) : []),
}));

jest.useFakeTimers();

jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
  if (typeof fn === 'function') fn();
  return { unref: () => {} };
});

jest.unstable_mockModule('timers/promises', () => ({
  setTimeout: () => Promise.resolve(),
}));

const { enqueueRequest, runWithFile, processLinesFromStream, main } = await import(
  '../../src/engine.js'
);

async function flushAll() {
  jest.runAllTimers();
  await Promise.resolve();
  await Promise.resolve();
}

describe('engine.js unit tests', () => {
  let stdoutSpy, stderrSpy, exitSpy;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('<title>My Title</title> user@example.com'),
      }),
    );
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
    exitSpy.mockRestore();
    jest.clearAllMocks();
  });

  test('enqueueRequest triggers fetch and stdout', async () => {
    enqueueRequest('http://example.com');
    await flushAll();

    expect(global.fetch).toHaveBeenCalledWith('http://example.com');
    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('"url":"http://example.com"'));
  });

  test('enqueueRequest schedules retry when fetch fails', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    enqueueRequest('http://retry.com');
    await flushAll();

    expect(stderrSpy).not.toHaveBeenCalledWith(expect.stringContaining('Failed after retry'));
  });

  test('runWithFile reads file and enqueues URLs', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue('http://file.com');

    await runWithFile('fakefile.txt');
    await flushAll();
    await flushAll();

    expect(global.fetch).toHaveBeenCalledWith('http://file.com');

    fs.readFile.mockRestore();
  });

  test('runWithFile handles file read error', async () => {
    jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('nope'));

    await runWithFile('bad.txt');
    await flushAll();

    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('Error reading file'));
    expect(exitSpy).toHaveBeenCalledWith(1);

    fs.readFile.mockRestore();
  });

  test('processLinesFromStream consumes lines and enqueues URLs', async () => {
    const input = Readable.from(['http://line1.com\n', 'http://line2.com\n']);
    await processLinesFromStream(input);
    await flushAll();

    expect(global.fetch).toHaveBeenCalledWith('http://line1.com');
    expect(global.fetch).toHaveBeenCalledWith('http://line2.com');
  });

  test('main runs with file arg', async () => {
    const originalArgv = [...process.argv];
    process.argv[2] = 'fakefile.txt';
    jest.spyOn(fs, 'readFile').mockResolvedValue('http://mainfile.com');

    await main();
    await flushAll();

    expect(global.fetch).toHaveBeenCalledWith('http://mainfile.com');

    fs.readFile.mockRestore();
    process.argv = originalArgv;
  });

  test('main runs with stdin', async () => {
    process.argv[2] = undefined;
    const input = Readable.from(['http://stdin.com\n']);
    Object.defineProperty(process, 'stdin', { value: input });

    process.stdin.setEncoding = jest.fn();

    await main();
    await flushAll();

    expect(global.fetch).toHaveBeenCalledWith('http://stdin.com');
  });
});
