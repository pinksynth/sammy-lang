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

  expectCompiledEval(
    () => `
    a = 1
    a = 2
  `
  ).toThrow(
    'Error on line 3: Variable "a" has already been assigned. To allow it to be reassigned, initially assign it as: "weak a"'
  )

  expectCompiledEval(`
    weak a = 1
    a = 2
  `).toBe(2)

  expectCompiledEval(
    () => `
    enum Foo {}
    Foo = true
  `
  ).toThrow(
    'Error on line 3: Could not assign "Foo" as a variable because it has already been defined as an enum.'
  )
})
