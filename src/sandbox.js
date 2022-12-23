const fs = require("fs")
const { compile } = require(".")

// Change these to any desired test case file, other file, or raw string.
const SANDBOX_CASE = "big-file-1"
const INPUT_FILE = `test/cases/${SANDBOX_CASE}/input.sammy`
const INPUT = fs.readFileSync(INPUT_FILE).toString()

compile({
  input: INPUT,
  debug: true,
  jsGlobals: ["console", "Math", "foo", "baz"],
  writeToFiles: true,
})
