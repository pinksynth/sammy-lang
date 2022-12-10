const { getAstFromTokens, deleteParents } = require("./ast")
const { nullConsole } = require("./debug")
const jsCompile = require("./jsCompiler")
const lex = require("./lexer")

const compile = ({ input, debug, jsGlobals }) => {
  // eslint-disable-next-line no-unused-vars, no-undef
  const debugConsole = debug ? console : nullConsole

  const tokens = lex(input)
  // debugConsole.dir({ tokens }, { depth: null, maxArrayLength: null })

  const ast = getAstFromTokens({ tokens, debug })
  // debugConsole.dir({ ast }, { depth: null, maxArrayLength: null })

  return jsCompile({ ast, debug, jsGlobals })
}

module.exports = { compile }
