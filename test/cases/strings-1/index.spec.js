const {
  expectCompiledEval,
  performSnapshotAssertions,
} = require("../../helpers")
performSnapshotAssertions("Strings", __dirname)

test("Strings implementation", () => {
  expectCompiledEval(`"Foo"`).toBe("Foo")
})
