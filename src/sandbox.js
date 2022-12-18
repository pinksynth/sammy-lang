/* global __dirname */
const fs = require("fs")
const path = require("path")
const input = fs.readFileSync("test/fixtures/1/input.sammy").toString()

const { compile } = require(".")

compile({
  input,
  debug: true,
  jsGlobals: ["console", "Math", "foo", "baz"],
  writeToFiles: true,
})
