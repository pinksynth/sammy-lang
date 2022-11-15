const { compile } = require(".")

compile({
  input: `
	"a".."z".map(@{console.log($1)})
	`,
  debug: true,
  jsGlobals: ["console", "Math", "a", "b", "c", "d", "e", "f"],
})
