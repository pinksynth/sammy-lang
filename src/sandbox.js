const { compile } = require(".")

compile({
  input: `
	a = !true
	`,
  debug: true,
  jsGlobals: ["console", "Math"],
})
