SCRIPT="src/main.js"
TEST_DIR="__tests__/test-data"

for file in $(ls "$TEST_DIR"/*.txt | sort -V); do
  echo "🔍 Running test: $(basename "$file")"
  node "$SCRIPT" "$file"
  echo ""
done