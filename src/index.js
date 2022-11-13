const getAstFromTokens = require("./ast")
const lex = require("./lexer")

// eslint-disable-next-line no-unused-vars
const astToJS = (ast) => {}

const compile = (sammyScript) => {
  const tokens = lex(sammyScript)
  const ast = getAstFromTokens(tokens)
  return astToJS(ast)
}

compile(`
if a && b {
	x()
}
`)
