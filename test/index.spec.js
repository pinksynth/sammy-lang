/* global test expect */
const fixture1 = require("./fixtures/1")
const { getAstFromTokens, deleteParents } = require("../src/ast")
const { compile } = require("../src/index")
const jsCompile = require("../src/jsCompiler")
const lex = require("../src/lexer")

const jsGlobals = ["console", "Math", "foo", "baz"]

test("compile", () => {
  const {
    input,
    ast: astFixture,
    jsOutput: jsOutputFixture,
    tokens: tokensFixture,
  } = fixture1

  const tokens = lex(input)
  expect(tokens).toEqual(tokensFixture)
  const ast = getAstFromTokens({ tokens })
  expect(deleteParents(ast)).toEqual(astFixture)
  const js = jsCompile({ ast, jsGlobals })
  expect(js).toEqual(jsOutputFixture)

  expect(compile({ input, jsGlobals })).toEqual(jsOutputFixture)
})