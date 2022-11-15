const { compile } = require(".")

compile({
  input: `
	foo = "bar"
  bar = "baz"
	`,
  debug: true,
  jsGlobals: ["console", "Math"],
})
