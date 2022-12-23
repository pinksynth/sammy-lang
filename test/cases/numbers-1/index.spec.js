const {
  expectCompiledEval,
  performSnapshotAssertions,
} = require("../../helpers")
performSnapshotAssertions("Numbers", __dirname)

test("Numbers implementation", () => {
  expectCompiledEval(`1`).toBe(1)
  expectCompiledEval(`1_234_567`).toBe(1234567)
  expectCompiledEval(`-1`).toBe(-1)
  expectCompiledEval(`3.14159`).toBe(3.14159)
})
