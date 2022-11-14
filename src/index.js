const { getAstFromTokens } = require("./ast")
const jsCompile = require("./jsCompiler")
const lex = require("./lexer")

// eslint-disable-next-line no-unused-vars
const astToJS = (ast) => {}

const compiletoAST = ({ input, debug }) => {
  const tokens = lex(input)
  return getAstFromTokens({ tokens, debug })
}

const compile = ({ input, debug }) => {
  const ast = compiletoAST({ input, debug })
  return jsCompile({ ast, debug })
}

// compile({ input: `[@{b = $1.flarn}]` })
compile({
  input: `
function my_func(a b) {
	%[a: 1, "c": a, 55: [@{b = $1.flarn}]]
}
foo = 1
bar = 1
x = @ a { console.log(a) }
if foo == bar {
	x()
}
if
	foo
	bar
{
	x(1 2)
} else {
	my_func(foo bar)
}
`,
})

module.exports = { compile, compiletoAST }
