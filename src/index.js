const getAstFromTokens = require("./ast")
const lex = require("./lexer")

// eslint-disable-next-line no-unused-vars
const astToJS = (ast) => {}

const compiletoAST = ({ input: sammyScript, debug }) => {
  const tokens = lex(sammyScript)
  return getAstFromTokens({ tokens, debug })
}

compiletoAST({
  input: `
function my_func(a b) {
	%[a: 1, "c": true, 55: [@{$1.flarn}]]
}
if foo == bar {
	x()
}
if
	a
	b
	c
{
	d()
}
`,
  debug: true,
})

module.exports = { compiletoAST }
