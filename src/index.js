const { getAstFromTokens, deleteParents } = require("./ast")
const { nullConsole } = require("./debug")
const jsCompile = require("./jsCompiler")
const lex = require("./lexer")

const fs = require("fs")

const compile = ({ input, debug, jsGlobals, writeToFiles }) => {
  // eslint-disable-next-line no-unused-vars, no-undef
  const debugConsole = debug ? console : nullConsole

  const tokens = lex(input)
  // debugConsole.dir({ tokens }, { depth: null, maxArrayLength: null })

  const ast = getAstFromTokens({ tokens, debug })
  // debugConsole.dir({ ast }, { depth: null, maxArrayLength: null })

  const js = jsCompile({ ast, debug, jsGlobals })

  if (writeToFiles) {
    if (fs.existsSync("output")) {
      fs.rmSync("output", { recursive: true, force: true })
    }
    fs.mkdirSync("output")
    fs.writeFileSync("output/input.sammy", input)
    fs.writeFileSync("output/tokens.json", JSON.stringify(tokens))
    fs.writeFileSync("output/ast.json", JSON.stringify(deleteParents(ast)))
    fs.writeFileSync("output/jsOutput.js", js)
  }

  return js
}

module.exports = { compile }
