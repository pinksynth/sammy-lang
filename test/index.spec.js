/* global test expect */
const { compile } = require("../src/index")
const deleteParents = require("../src/ast/deleteParents")
const fixture1 = require("./fixtures/1")
const fixture2 = require("./fixtures/1")
const getAstFromTokens = require("../src/ast")
const jsCompile = require("../src/jsCompiler")
const lex = require("../src/lexer")

const jsGlobals = ["console", "Math", "foo", "baz"]

const performAssertions = (fixture) => {
  const {
    input,
    ast: astFixture,
    jsOutput: jsOutputFixture,
    tokens: tokensFixture,
  } = fixture

  const tokens = lex(input)
  expect(tokens).toEqual(tokensFixture)
  const ast = getAstFromTokens({ tokens })
  expect(deleteParents(ast)).toEqual(astFixture)
  const js = jsCompile({ ast, jsGlobals })
  expect(js).toEqual(jsOutputFixture)

  expect(compile({ input, jsGlobals })).toEqual(jsOutputFixture)
}

test("compile", () => {
  performAssertions(fixture1)
  performAssertions(fixture2)
})
