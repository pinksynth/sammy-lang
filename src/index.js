const { getAstFromTokens } = require("./ast")
const jsCompile = require("./jsCompiler")
const lex = require("./lexer")

const compiletoAST = ({ input, debug }) => {
  const tokens = lex(input)
  return getAstFromTokens({ tokens, debug })
}

const compile = ({ input, debug, jsGlobals }) => {
  const ast = compiletoAST({ input, debug })
  return jsCompile({ ast, debug, jsGlobals })
}

module.exports = { compile, compiletoAST }
