const {
  performSnapshotAssertions,
  expectCompiledEval,
} = require("../../helpers")
performSnapshotAssertions("Operator precedence", __dirname, {
  jsGlobals: "bcdeghijklmnpqrsxyz".split(""),
})

test("Operator precedence implementation", () => {
  expectCompiledEval(`2 * 3 + 4 / 5`).toEqual(6.8)
  expectCompiledEval(`(-10) + 3 % 5`).toEqual(-7)
  expectCompiledEval(`6 ^ 2 * 3`).toEqual(108)
  expectCompiledEval(`
		foo = %[bar:  @{3}]
		baz = %[quux: @{4}]
	
		foo.bar() * baz.quux()
	`).toEqual(12)
})
