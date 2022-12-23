const {
  performSnapshotAssertions,
  expectCompiledEval,
} = require("../../helpers")
performSnapshotAssertions("Lambda definitions", __dirname)

test("Lambda implementation", () => {
  expectCompiledEval(`
		multiply = @ a b { a * b }
		divide = @{ $1 / $2 }

		[
			multiply(2 3)
			divide(11 2)
		]
	`).toEqual([6, 5.5])
})
