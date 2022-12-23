const {
  expectCompiledEval,
  performSnapshotAssertions,
} = require("../../helpers")
performSnapshotAssertions("Variables", __dirname)

test("Booleans implementation", () => {
  expectCompiledEval(`false`).toBe(false)
  expectCompiledEval(`true`).toBe(true)
})
