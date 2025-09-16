/**
 * Normalizes a URL by ensuring it starts with http:// or https://.
 * If the input does not start with a protocol, http:// is prepended.
 * @param {string} u - The URL string to normalize.
 * @returns {string} The normalized URL.
 */
export function normalizeUrl(u) {
  return /^https?:\/\//i.test(u) ? u : `http://${u}`;
}

/**
 * Extracts the last URL from each set of outermost brackets in the given text.
 * Handles escaped brackets and nested brackets according to the parsing rules.
 * @param {string} text - The input text to search for bracketed URLs.
 * @returns {string[]} An array of extracted URLs (one per bracketed group).
 */
export function extractUrlsFromText(text) {
  const bracketContents = [];
  const stack = [];
  let current = '';

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '\\') {
      const next = text[i + 1];
      if (next === '[' || next === ']') {
        if (stack.length > 0) current += next;
        i++;
        continue;
      } else {
        if (stack.length > 0) current += ch;
        continue;
      }
    }

    if (ch === '[') {
      if (stack.length === 0) current = '';
      else current += ch;
      stack.push('[');
      continue;
    }

    if (ch === ']') {
      if (stack.length > 0) {
        stack.pop();
        if (stack.length === 0) {
          bracketContents.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      continue;
    }

    if (stack.length > 0) current += ch;
  }

  const results = [];
  for (const pair of bracketContents) {
    const cleaned = pair.replace(/[\[\]]/g, ' ');
    const urls = cleaned.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi);
    if (urls && urls.length) results.push(urls[urls.length - 1]);
  }
  return results;
}
