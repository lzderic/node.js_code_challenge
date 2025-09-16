export function printErrorAndExit(message, code = 1) {
  process.stderr.write(message + '\n');
  process.exit(code);
}

export function printError(message) {
  process.stderr.write(message + '\n');
}
