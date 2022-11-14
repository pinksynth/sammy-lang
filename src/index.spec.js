/* global test expect */
const fixture1 = require("./fixtures/1")
const { compiletoAST, compile } = require("./index")

test("compile", () => {
  const { input, ast, jsOutput } = fixture1
  expect(compiletoAST({ input })).toEqual(ast)
  expect(compile({ input, jsGlobals: ["console", "Math"] })).toEqual(jsOutput)
})
