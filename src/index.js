const lex = require("./lexer")

const getAst = (_tokens) => {}

// eslint-disable-next-line no-unused-vars
const astToJS = (ast) => {}

// eslint-disable-next-line no-unused-vars
const compile = (sammyScript) => {
  const tokens = lex(sammyScript)
  const ast = getAst(tokens)
  return astToJS(ast)
}

lex(
  `i have 1_000 things and 2.59 other things. And 26.4 things. And 1_234_567.55 other things.`
)
