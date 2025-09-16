import { main } from './engine.js';
import dotenv from 'dotenv';
import { printErrorAndExit } from './utils/error.js';

dotenv.config({ debug: false, quiet: true });

if (!process.env.IM_SECRET) {
  printErrorAndExit('IM_SECRET environment variable is missing.');
}

await main();
