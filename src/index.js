const getAstFromTokens = require("./ast")
const lex = require("./lexer")

// eslint-disable-next-line no-unused-vars
const astToJS = (ast) => {}

// eslint-disable-next-line no-unused-vars
const compile = (sammyScript) => {
  const tokens = lex(sammyScript)
  const ast = getAstFromTokens(tokens)
  return astToJS(ast)
}

compile(`
[
	1
	2
	[
		a
		b
		c()
	]
]
`)
