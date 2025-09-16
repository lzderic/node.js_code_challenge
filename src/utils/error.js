/**
 * Prints an error message to stderr and exits the process with the given exit code.
 * @param {string} message - The error message to print.
 * @param {number} [code=1] - The exit code to use (default is 1).
 */
export function printErrorAndExit(message, code = 1) {
  process.stderr.write(message + '\n');
  process.exit(code);
}

/**
 * Prints an error message to stderr without exiting the process.
 * @param {string} message - The error message to print.
 */
export function printError(message) {
  process.stderr.write(message + '\n');
}
