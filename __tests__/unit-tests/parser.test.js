import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractUrlsFromText, normalizeUrl } from '../../src/parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function load(file) {
  return fs.readFileSync(path.join(__dirname, '../../__tests__/test-data', file), 'utf8');
}

describe('parser', () => {
  describe('extractUrlsFromText', () => {
    test('task_examples.txt', () => {
      const txt = load('task_examples.txt');
      const lines = txt.split('\n').filter((line) => line.trim() && !line.trim().startsWith('#'));
      const expected = [
        [],
        ['www.google.com'],
        ['www.google.com'],
        ['www.second.com'],
        ['www.second.com'],
        ['www.third.com'],
        [],
        [],
      ];
      lines.forEach((line, i) => {
        expect(extractUrlsFromText(line)).toEqual(expected[i]);
      });
    });

    test('1_not_in_brackets.txt', () => {
      const txt = load('1_not_in_brackets.txt');
      txt.split('\n').forEach((line) => {
        expect(extractUrlsFromText(line)).toEqual([]);
      });
    });

    test('2_simple_bracket_url.txt', () => {
      const txt = load('2_simple_bracket_url.txt');
      const expected = [['www.google.com'], ['www.wikipedia.org'], ['www.nasa.gov']];
      txt.split('\n').forEach((line, i) => {
        if (line.trim()) {
          expect(extractUrlsFromText(line)).toEqual(expected[i]);
        }
      });
    });

    test('3_url_with_text_inside_brackets.txt', () => {
      const txt = load('3_url_with_text_inside_brackets.txt');
      const expected = [
        ['www.google.com'],
        ['www.facebook.com'],
        ['www.reddit.com'],
        ['www.bbc.com'],
      ];
      txt.split('\n').forEach((line, i) => {
        if (line.trim()) {
          expect(extractUrlsFromText(line)).toEqual(expected[i]);
        }
      });
    });

    test('4_multiple_urls_only_last_detected.txt', () => {
      const txt = load('4_multiple_urls_only_last_detected.txt');
      const expected = [['www.second.com'], ['www.ibm.com']];
      txt.split('\n').forEach((line, i) => {
        if (line.trim()) {
          expect(extractUrlsFromText(line)).toEqual(expected[i]);
        }
      });
    });

    test('5_nested_brackets_outermost_counts_1.txt', () => {
      const txt = load('5_nested_brackets_outermost_counts_1.txt');
      const expected = [['www.second.com'], ['www.beta.com'], []];
      txt.split('\n').forEach((line, i) => {
        if (line.trim()) {
          expect(extractUrlsFromText(line)).toEqual(expected[i]);
        }
      });
    });

    test('6_nested_brackets_outermost_counts_2.txt', () => {
      const txt = load('6_nested_brackets_outermost_counts_2.txt');
      const expected = [['www.third.com'], ['www.middle.com'], ['www.outer.com'], []];
      txt.split('\n').forEach((line, i) => {
        if (line.trim()) {
          expect(extractUrlsFromText(line)).toEqual(expected[i]);
        }
      });
    });

    test('7_escaped_brackets_ignore_1.txt', () => {
      const txt = load('7_escaped_brackets_ignore_1.txt');
      txt.split('\n').forEach((line) => {
        expect(extractUrlsFromText(line)).toEqual([]);
      });
    });

    test('8_escaped_brackets_ignore_2.txt', () => {
      const txt = load('8_escaped_brackets_ignore_2.txt');
      txt.split('\n').forEach((line) => {
        expect(extractUrlsFromText(line)).toEqual([]);
      });
    });

    test('9_unclosed_bracket.txt', () => {
      const txt = load('9_unclosed_bracket.txt');
      txt.split('\n').forEach((line) => {
        expect(extractUrlsFromText(line)).toEqual([]);
      });
    });

    test('10_closed_without_opening.txt', () => {
      const txt = load('10_closed_without_opening.txt');
      txt.split('\n').forEach((line) => {
        expect(extractUrlsFromText(line)).toEqual([]);
      });
    });

    test('11_multiple_lines_and_duplicates.txt', () => {
      const txt = load('11_multiple_lines_and_duplicates.txt');
      const expected = [
        ['www.test.com'],
        ['www.test.com'],
        ['www.unique.com'],
        ['www.unique.com'],
        ['www.different.com'],
      ];
      txt.split('\n').forEach((line, i) => {
        if (line.trim()) {
          expect(extractUrlsFromText(line)).toEqual(expected[i]);
        }
      });
    });

    test('12_mixed_cases.txt', () => {
      const txt = load('12_mixed_cases.txt');
      const expected = [[], ['www.real.com'], ['www.right.com'], ['www.final.com'], [], []];
      txt.split('\n').forEach((line, i) => {
        if (line.trim()) {
          expect(extractUrlsFromText(line)).toEqual(expected[i]);
        }
      });
    });
  });

  describe('normalizeUrl', () => {
    test('adds http:// to www domains', () => {
      expect(normalizeUrl('www.google.com')).toBe('http://www.google.com');
    });

    test('does not modify http URLs', () => {
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    });

    test('does not modify https URLs', () => {
      expect(normalizeUrl('https://secure.com')).toBe('https://secure.com');
    });

    test('handles mixed case protocols', () => {
      expect(normalizeUrl('HTTP://upper.com')).toBe('HTTP://upper.com');
      expect(normalizeUrl('Https://upper.com')).toBe('Https://upper.com');
    });
  });
});
