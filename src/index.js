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
function my_func(a b c) {
	my_var = [
		6
		function other_func(x y z) {}
		x
	]
	x
}
`)
