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

lex(`
# A nice comment
my_num = 1_000.5 * 10.5
other_num = 5 / 5
yet_another_num = 3 / 6 * 4
weak my_string = "a nifty
string"
my_array = [1  2  3
4 5]
my_object = %[key: true, other_key: false]
function my_func() {
	if things == true
		obj.call(a b 100)
	endif

	false
}


<<<
A rad comment
>>>
my_func()
another_array = [
	%[some_thing: else]
	true
	100 * 5
]
`)
