const { compile } = require(".")

compile({
  input: `
	%[my_key: "my_val", other_key: @{ console.log($1) }]
	`,
  debug: true,
  jsGlobals: ["console", "Math"],
})
