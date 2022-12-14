const fs = require("fs")

const { nullConsole } = require("./debug")
const deleteParents = require("./ast/deleteParents")
const getAstFromTokens = require("./ast")
const jsCompile = require("./jsCompiler")
const lex = require("./lexer")

const noop = () => {}

const compile = ({ input, debug, jsGlobals, writeToFiles }) => {
  // eslint-disable-next-line no-unused-vars, no-undef
  const debugConsole = debug ? console : nullConsole

  const write = writeToFiles
    ? (filename, contents) => fs.writeFileSync(filename, contents || "")
    : noop

  if (writeToFiles) {
    if (fs.existsSync("output")) {
      fs.rmSync("output", { recursive: true, force: true })
    }
    fs.mkdirSync("output")
  }

  write("output/input.sammy", input)

  const tokens = lex(input)
  // debugConsole.dir({ tokens }, { depth: null, maxArrayLength: null })
  write("output/tokens.json", JSON.stringify(tokens))

  const ast = getAstFromTokens({ tokens, debug })
  // debugConsole.dir({ ast }, { depth: null, maxArrayLength: null })
  write("output/ast.json", JSON.stringify(deleteParents(ast)))

  const js = jsCompile({ ast, debug, jsGlobals })
  write("output/jsOutput.js", js)

  return js
}

module.exports = { compile }
