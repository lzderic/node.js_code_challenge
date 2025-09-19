import { spawn } from 'child_process';
import path from 'path';

export const EXPECTED_TASK_EXAMPLES = [
  { url: 'www.google.com', title: 'Google' },
  { url: 'www.second.com', title: 'cyberfinder.com' },
  {
    url: 'www.third.com',
    title: 'GapGun And Vectro Non-Contact Laser Measurement',
    email: '<cf0b6d277fae581bda5e730a963072b8a10ee084b374034f49030256bf4adc4a>',
  },
];
export const EXPECTED_1_NOT_IN_BRACKETS = [];

export const EXPECTED_2_SIMPLE_BRACKET_URL = [
  { url: 'www.google.com', title: 'Google' },
  {
    url: 'www.wikipedia.org',
    title: 'Wikipedia',
  },
  {
    url: 'www.nasa.gov',
    title: 'NASA',
  },
];

export const EXPECTED_3_URL_WITH_TEXT_INSIDE_BRACKETS = [
  { url: 'www.google.com', title: 'Google' },
  {
    url: 'www.reddit.com',
    title: 'Reddit - The heart of the internet',
  },
  {
    url: 'www.bbc.com',
    title:
      'BBC Home - Breaking News, World News, US News, Sports, Business, Innovation, Climate, Culture, Travel, Video &amp; Audio',
  },
];

export const EXPECTED_4_MULTIPLE_URLS_ONLY_LAST_DETECTED = [
  { url: 'www.second.com', title: 'cyberfinder.com' },
];

export const EXPECTED_5_NESTED_BRACKETS_OUTERMOST_COUNTS_1 = [
  { url: 'www.second.com', title: 'cyberfinder.com' },
  { url: 'www.beta.com', title: "We're currently rebuilding" },
];

export const EXPECTED_6_NESTED_BRACKETS_OUTERMOST_COUNTS_2 = [
  {
    url: 'www.third.com',
    title: 'GapGun And Vectro Non-Contact Laser Measurement',
    email: '<cf0b6d277fae581bda5e730a963072b8a10ee084b374034f49030256bf4adc4a>',
  },
  { url: 'www.middle.com', title: 'middle.com' },
  { url: 'www.outer.com', title: 'outer.com' },
];

export const EXPECTED_7_ESCAPED_BRACKETS_IGNORE_1 = [];

export const EXPECTED_8_ESCAPED_BRACKETS_IGNORE_2 = [];

export const EXPECTED_9_UNCLOSED_BRACKET = [];

export const EXPECTED_10_CLOSED_WITHOUT_OPENING = [];

export const EXPECTED_11_MULTIPLE_LINES_AND_DUPLICATES = [
  {
    url: 'www.different.com',
    title: 'Different Web Site Design: Home',
    email: '<3e7e9f72f04a8b3aea5e47e6a69948ac3041e18b3dc2b9f94958aefed42bf49c>',
  },
];

export const EXPECTED_12_MIXED_CASES = [
  {
    url: 'www.real.com',
    title: 'Home to the video player and downloader, RealPlayer from RealNetworks',
  },
  {
    url: 'www.right.com',
    title: 'Right Management | The Right Partner for Your Talent',
  },
  { url: 'www.final.com', title: 'final.com' },
];

/**
 * Spawns the main CLI script with the given arguments and options, capturing stdout and stderr.
 * Used for integration testing to simulate CLI usage with various inputs.
 *
 * @param {string[]} [args=[]] - Arguments to pass to the CLI script (e.g., file paths).
 * @param {object} [opts={}] - Options for the child process (e.g., env vars).
 * @param {string} [opts.input] - If provided, this string will be piped to the script's stdin.
 * @returns {Promise<{ code: number, stdout: string, stderr: string }>} Resolves with exit code, stdout, and stderr.
 */
export function runScriptWithArgs(args = [], opts = {}) {
  const nodeBin = process.execPath;
  const mainScript = path.join(process.cwd(), 'src', 'main.js');
  const env = opts.env || { ...process.env, IM_SECRET: 'testsecret' };

  return new Promise((resolve, reject) => {
    const proc = spawn(nodeBin, [mainScript, ...args], {
      ...opts,
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => (stdout += d));
    proc.stderr.on('data', (d) => (stderr += d));
    proc.on('close', (code) => resolve({ code, stdout, stderr }));
    proc.on('error', reject);
    if (opts.input) {
      proc.stdin.write(opts.input);
      proc.stdin.end();
    }
  });
}
