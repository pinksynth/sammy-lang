const {
  performSnapshotAssertions,
  expectCompiledEval,
} = require("../../helpers")
performSnapshotAssertions("Recursive string interpolation", __dirname)

test("String interpolation implementation", () => {
  expectCompiledEval(`
	"Hello, {
		name = if true { "Patrick {
			if true { "Star" } else { "Stewart" }
		}" } else { "Jimbo" }
	}!"
	`).toBe("Hello, Patrick Star!")
})
