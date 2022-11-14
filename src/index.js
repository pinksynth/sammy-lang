const { getAstFromTokens } = require("./ast")
const jsCompile = require("./jsCompiler")
const lex = require("./lexer")

// eslint-disable-next-line no-unused-vars
const astToJS = (ast) => {}

const compiletoAST = ({ input, debug }) => {
  const tokens = lex(input)
  return getAstFromTokens({ tokens, debug })
}

const compile = ({ input, debug, jsGlobals }) => {
  const ast = compiletoAST({ input, debug })
  return jsCompile({ ast, debug, jsGlobals })
}

// compile({ input: `[@{b = $1.flarn}]` })
compile({
  input: `
y = @{ console.log() }
function my_func (x) {
	if x == 0 {
		y()
		true
	} else {
		my_func(x - 1)
	}
}
`,
  jsGlobals: ["console"],
})

module.exports = { compile, compiletoAST }
