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

```sh
npm run start:echo
```

**Run with cat (pipe file to parser):**

```sh
npm run start:cat
```

- This demonstrates parsing a file piped to the script via stdin.
  In both cases, if no file argument is provided, the script reads from stdin, processes URLs as soon as they are detected, and exits when the stream ends.
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

**Lint your code with ESLint:**
```sh
npm run lint
```

**Run prettier:**
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
src/                # Main application code
__tests__/          # Unit and integration tests
  test-data/        # Test input files
run_all_examples.sh # Batch script to run all test-data files
package.json
```

---
