/* global __dirname */
const fs = require("fs")
const path = require("path")
const input = fs.readFileSync(path.resolve(__dirname, "input.sammy")).toString()
const ast = require("./ast")
const jsOutput = require("./jsOutput")
const tokens = require("./tokens")

module.exports = { input, ast, jsOutput, tokens }
