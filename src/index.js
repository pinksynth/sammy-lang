const { getAstFromTokens } = require("./ast")
const jsCompile = require("./jsCompiler")
const lex = require("./lexer")

const compile = ({ input, debug, jsGlobals }) => {
  const tokens = lex(input)
  // console.dir({ tokens }, { depth: null, maxArrayLength: null })
  const ast = getAstFromTokens({ tokens, debug })
  return jsCompile({ ast, debug, jsGlobals })
}

module.exports = { compile }
