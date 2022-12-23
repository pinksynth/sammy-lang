const {
  expectCompiledEval,
  performSnapshotAssertions,
} = require("../../helpers")
performSnapshotAssertions("Variables", __dirname)

test("Variables implementation", () => {
  expectCompiledEval(`
  a = 2
  b = 3

  a * b
  `).toBe(6)

  expectCompiledEval(() => `a + b`).toThrow(
    "Variable a on line 1 is not defined in the current scope."
  )
})
