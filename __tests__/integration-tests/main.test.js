import path from 'path';
import {
  EXPECTED_TASK_EXAMPLES,
  EXPECTED_1_NOT_IN_BRACKETS,
  EXPECTED_2_SIMPLE_BRACKET_URL,
  EXPECTED_3_URL_WITH_TEXT_INSIDE_BRACKETS,
  EXPECTED_4_MULTIPLE_URLS_ONLY_LAST_DETECTED,
  EXPECTED_5_NESTED_BRACKETS_OUTERMOST_COUNTS_1,
  EXPECTED_6_NESTED_BRACKETS_OUTERMOST_COUNTS_2,
  EXPECTED_7_ESCAPED_BRACKETS_IGNORE_1,
  EXPECTED_8_ESCAPED_BRACKETS_IGNORE_2,
  EXPECTED_9_UNCLOSED_BRACKET,
  EXPECTED_10_CLOSED_WITHOUT_OPENING,
  EXPECTED_11_MULTIPLE_LINES_AND_DUPLICATES,
  EXPECTED_12_MIXED_CASES,
  runScriptWithArgs,
} from './test_utils';

const testDataDir = path.join(process.cwd(), '__tests__', 'test-data');

describe('Integration: main.js with all test-data files', () => {
  test('task_examples.txt', async () => {
    const filePath = path.join(testDataDir, 'task_examples.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_TASK_EXAMPLES.length);
    for (let i = 0; i < lines.length; ++i) {
      const actual = JSON.parse(lines[i]);
      expect(actual).toEqual(EXPECTED_TASK_EXAMPLES[i]);
    }
  });

  test('1_not_in_brackets.txt', async () => {
    const filePath = path.join(testDataDir, '1_not_in_brackets.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_1_NOT_IN_BRACKETS.length);
  });

  test('2_simple_bracket_url.txt', async () => {
    const filePath = path.join(testDataDir, '2_simple_bracket_url.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_2_SIMPLE_BRACKET_URL.length);
    for (let i = 0; i < lines.length; ++i) {
      const actual = JSON.parse(lines[i]);
      expect(actual).toEqual(EXPECTED_2_SIMPLE_BRACKET_URL[i]);
    }
  });

  test('3_url_with_text_inside_brackets.txt', async () => {
    const filePath = path.join(testDataDir, '3_url_with_text_inside_brackets.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toContain('Failed after retry: http://www.facebook.com (400)');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_3_URL_WITH_TEXT_INSIDE_BRACKETS.length);
    for (let i = 0; i < lines.length; ++i) {
      const actual = JSON.parse(lines[i]);
      expect(actual).toEqual(EXPECTED_3_URL_WITH_TEXT_INSIDE_BRACKETS[i]);
    }
  }, 130000);

  test('4_multiple_urls_only_last_detected.txt', async () => {
    const filePath = path.join(testDataDir, '4_multiple_urls_only_last_detected.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toContain('Failed after retry: http://www.ibm.com (404)');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_4_MULTIPLE_URLS_ONLY_LAST_DETECTED.length);
    for (let i = 0; i < lines.length; ++i) {
      const actual = JSON.parse(lines[i]);
      expect(actual).toEqual(EXPECTED_4_MULTIPLE_URLS_ONLY_LAST_DETECTED[i]);
    }
  }, 130000);

  test('5_nested_brackets_outermost_counts_1.txt', async () => {
    const filePath = path.join(testDataDir, '5_nested_brackets_outermost_counts_1.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_5_NESTED_BRACKETS_OUTERMOST_COUNTS_1.length);
    for (let i = 0; i < lines.length; ++i) {
      const actual = JSON.parse(lines[i]);
      expect(actual).toEqual(EXPECTED_5_NESTED_BRACKETS_OUTERMOST_COUNTS_1[i]);
    }
  });

  test('6_nested_brackets_outermost_counts_2.txt', async () => {
    const filePath = path.join(testDataDir, '6_nested_brackets_outermost_counts_2.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_6_NESTED_BRACKETS_OUTERMOST_COUNTS_2.length);
    for (let i = 0; i < lines.length; ++i) {
      const actual = JSON.parse(lines[i]);
      expect(actual).toEqual(EXPECTED_6_NESTED_BRACKETS_OUTERMOST_COUNTS_2[i]);
    }
  });

  test('7_escaped_brackets_ignore_1.txt', async () => {
    const filePath = path.join(testDataDir, '7_escaped_brackets_ignore_1.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_7_ESCAPED_BRACKETS_IGNORE_1.length);
  });

  test('8_escaped_brackets_ignore_2.txt', async () => {
    const filePath = path.join(testDataDir, '8_escaped_brackets_ignore_2.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_8_ESCAPED_BRACKETS_IGNORE_2.length);
  });

  test('9_unclosed_bracket.txt', async () => {
    const filePath = path.join(testDataDir, '9_unclosed_bracket.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_9_UNCLOSED_BRACKET.length);
  });

  test('10_closed_without_opening.txt', async () => {
    const filePath = path.join(testDataDir, '10_closed_without_opening.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_10_CLOSED_WITHOUT_OPENING.length);
  });

  test('11_multiple_lines_and_duplicates.txt', async () => {
    const filePath = path.join(testDataDir, '11_multiple_lines_and_duplicates.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toContain('Failed after retry: http://www.test.com (403)');
    expect(stderr).toContain('Error fetching http://www.unique.com: fetch failed');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_11_MULTIPLE_LINES_AND_DUPLICATES.length);
    for (let i = 0; i < lines.length; ++i) {
      const actual = JSON.parse(lines[i]);
      expect(actual).toEqual(EXPECTED_11_MULTIPLE_LINES_AND_DUPLICATES[i]);
    }
  }, 130000);

  test('12_mixed_cases.txt', async () => {
    const filePath = path.join(testDataDir, '12_mixed_cases.txt');
    const { code, stdout, stderr } = await runScriptWithArgs([filePath]);
    expect(code).toBe(0);
    expect(stderr).toBe('');
    const lines = stdout.trim().split('\n').filter(Boolean);
    expect(lines.length).toBe(EXPECTED_12_MIXED_CASES.length);
    for (let i = 0; i < lines.length; ++i) {
      const actual = JSON.parse(lines[i]);
      expect(actual).toEqual(EXPECTED_12_MIXED_CASES[i]);
    }
  }, 130000);
});

describe('Error handling', () => {
  test('Exits with error code and message on missing file', async () => {
    const { code, stdout, stderr } = await runScriptWithArgs(['no_such_file.txt']);
    expect(code).toBe(1);
    expect(stdout).toBe('');
    expect(stderr).toMatch(/Error reading file/);
  });

  test('should exit with code 1 and print error to stderr', async () => {
    const env = { ...process.env, IM_SECRET: '' };
    const { code, stdout, stderr } = await runScriptWithArgs([], { env });
    expect(code).toBe(1);
    expect(stdout).toBe('');
    expect(stderr).toMatch(/IM_SECRET environment variable is missing/);
  });
});
