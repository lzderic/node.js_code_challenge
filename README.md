# Node.js Code Challenge

A CLI tool for parsing URLs and extracting information from text files.

## 📝 Notes

- Requires Node.js 18+ (for native ESM and fetch support).
- Set the `IM_SECRET` environment variable before running for email hashing.
  - You can do this by creating a `.env` file in your project root:
    ```
    IM_SECRET=your_secret_value
    ```
  - Or set it directly in your terminal before running:
    ```sh
    export IM_SECRET=your_secret_value   # On Linux/macOS
    set IM_SECRET=your_secret_value      # On Windows CMD
    $env:IM_SECRET="your_secret_value"   # On PowerShell
    ```

---

## 🚀 Install

Make sure you have [Node.js](https://nodejs.org/) (which includes npm) installed.

```sh
npm install
```

---

## ▶️ Run

**Run with a file:**

```sh
npm run start:file
```

_(Parses **tests**/test-data/task_examples.txt by default — this file contains the example data provided in the task PDF)_

**Run with echo (single line):**

Both of the following scripts demonstrate parsing input from stdin:

- `npm run start:echo` — parses a single line of input provided via `echo`.
- `npm run start:cat` — parses a file piped to the script using `cat`.

In both cases, if no file argument is provided, the script reads from stdin, processes URLs as soon as they are detected, and exits when the stream ends.

```sh
npm run start:echo
```

```sh
npm run start:cat
```

- **Run all test-data files (batch):**

```sh
npm run start:batch
```

_This will run the script with all .txt files inside the **tests**/test-data directory, processing each test file one by one._

---

## 🧪 Test

**Run all tests:**

```sh
npm test
```

**Run only unit tests:**

```sh
npm run test:unit
```

**Run only integration tests:**

```sh
npm run test:integration
```

---


## 🛠️ Code Style

**Run Prettier only:**

```sh
npm run prettier
```

**Lint your code with ESLint only:**

```sh
npm run lint
```

**Format and lint (Prettier then ESLint):**

```sh
npm run format
```

---

## 💡 Example Usage

Parse a file:

```sh
node src/main.js __tests__/test-data/task_examples.txt
```

Pipe input:

```sh
echo "[ www.google.com ]" | node src/main.js
```

---

## 📁 Project Structure

```
src/                  # Main application code
  utils/              # Utility modules (e.g., error handling)
__tests__/            # Unit and integration tests
  integration-tests/  # Integration test scripts
  unit-tests/         # Unit test scripts
  test-data/          # Test input files
run_all_examples.sh   # Batch script to run all test-data files (Unix)
package.json          # Project metadata and scripts
eslint.config.js      # ESLint configuration
.prettierrc           # Prettier configuration
.gitignore            # Git ignore rules
README.md             # Project documentation
```

---
