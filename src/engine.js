import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { setTimeout as delay } from 'timers/promises';
import readline from 'node:readline';
import { normalizeUrl, extractUrlsFromText } from './parser.js';
import { printError, printErrorAndExit } from './utils/error.js';

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i;
const TITLE_REGEX = /<title[^>]*>([\s\S]*?)<\/title>/i;

const visitedUrls = new Set();
const queue = [];
let processingQueue = false;
let lastRequestTimestamp = 0;
let pendingRequests = 0;
let inputFinished = false;

/**
 * Adds a URL request to the processing queue.
 * @param {string} rawUrl - The original URL to process.
 * @param {number} [attempt=1] - The attempt number (1 for first try, 2 for retry).
 * @param {boolean} [scheduled=false] - Whether this request is scheduled (for retry).
 */
export function enqueueRequest(rawUrl, attempt = 1, scheduled = false) {
  const normalized = normalizeUrl(rawUrl);

  if (attempt === 1) {
    if (visitedUrls.has(normalized)) return;
    visitedUrls.add(normalized);
  }

  if (!scheduled) pendingRequests++;
  queue.push({ rawUrl, normalized, attempt });
  processQueue().catch((err) => {
    printError(`Queue processing error: ${err && err.stack ? err.stack : String(err)}`);
  });
}

/**
 * Schedules a retry for a failed URL request after a delay.
 * @param {string} rawUrl - The URL to retry.
 * @param {number} [ms=60000] - Delay in milliseconds before retrying.
 */
function scheduleRetry(rawUrl, ms = 60000) {
  pendingRequests++;
  setTimeout(() => enqueueRequest(rawUrl, 2, true), ms);
}

/**
 * Checks if all input and requests are finished, and exits the process if so.
 */
function tryExitIfDone() {
  if (inputFinished && pendingRequests <= 0 && queue.length === 0 && !processingQueue) {
    process.exit(0);
  }
}

/**
 * Processes the URL queue, making HTTP requests and handling responses.
 * Handles rate limiting, retries, and output formatting.
 * @returns {Promise<void>}
 */
async function processQueue() {
  if (processingQueue) return;
  processingQueue = true;

  try {
    while (queue.length > 0) {
      const { rawUrl, normalized, attempt } = queue.shift();

      const now = Date.now();
      const diff = now - lastRequestTimestamp;
      if (diff < 1000) await delay(1000 - diff);
      lastRequestTimestamp = Date.now();

      try {
        const res = await fetch(normalized);
        if (!res.ok) {
          if (attempt === 1) {
            scheduleRetry(rawUrl);
          } else {
            process.stderr.write(`Failed after retry: ${normalized} (${res.status})\n`);
          }
        } else {
          const body = await res.text();
          const out = { url: rawUrl };

          const titleMatch = body.match(TITLE_REGEX);
          if (titleMatch && titleMatch[1]) out.title = titleMatch[1].trim();

          const emailMatch = body.match(EMAIL_REGEX);
          if (emailMatch && emailMatch[0]) {
            const secret = process.env.IM_SECRET;
            if (secret) {
              const hash = crypto.createHmac('sha256', secret).update(emailMatch[0]).digest('hex');
              out.email = `<${hash}>`;
            }
          }

          process.stdout.write(JSON.stringify(out) + '\n');
        }
      } catch (err) {
        if (attempt === 1) {
          scheduleRetry(rawUrl);
        } else {
          process.stderr.write(
            `Error fetching ${normalized}: ${err && err.message ? err.message : String(err)}\n`,
          );
        }
      } finally {
        pendingRequests--;
        tryExitIfDone();
      }
    }
  } finally {
    processingQueue = false;
  }
}

/**
 * Reads a file, extracts URLs, and enqueues them for processing.
 * @param {string} fileArg - Path to the input file.
 * @returns {Promise<void>}
 */
export async function runWithFile(fileArg) {
  const filePath = path.resolve(process.cwd(), fileArg);
  let text;
  try {
    text = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    printErrorAndExit(
      `Error reading file "${fileArg}": ${err && err.message ? err.message : String(err)}`,
    );
  }

  const urls = extractUrlsFromText(text);
  for (const u of urls) enqueueRequest(u);

  inputFinished = true;
  tryExitIfDone();
}

/**
 * Reads lines from a stream (such as stdin), extracts URLs, and enqueues them.
 * @param {stream.Readable} stream - The input stream to read lines from.
 * @returns {Promise<void>}
 */
export async function processLinesFromStream(stream) {
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  rl.on('line', (line) => {
    const urls = extractUrlsFromText(line);
    for (const u of urls) enqueueRequest(u);
  });

  await new Promise((resolve) => rl.on('close', resolve));
  inputFinished = true;
  tryExitIfDone();
}

/**
 * Main entry point for the CLI tool.
 * If a file argument is provided, processes the file; otherwise, reads from stdin.
 * @returns {Promise<void>}
 */
export async function main() {
  const fileArg = process.argv[2];
  if (fileArg) {
    await runWithFile(fileArg);
  } else {
    process.stdin.setEncoding('utf8');
    await processLinesFromStream(process.stdin);
  }
}
