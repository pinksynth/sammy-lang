const {
  performSnapshotAssertions,
  expectCompiledEval,
} = require("../../helpers")
performSnapshotAssertions("Function definitions", __dirname)

test("Functions with multiple signatures", () => {
  expectCompiledEval(`
		function greet() { "Hello." }
		function greet(name) { "{greet()} My name's {name}." }
		function greet(name age) { "{greet(name)} I'm {age}." }

		[
			greet("Jim" 30)
			greet("James")
			greet()
		]
	`).toEqual([
    "Hello. My name's Jim. I'm 30.",
    "Hello. My name's James.",
    "Hello.",
  ])
})
