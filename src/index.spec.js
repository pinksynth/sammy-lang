/* global test expect */
const { getAstFromTokens } = require("./ast")
const fixture1 = require("./fixtures/1")
const { compile } = require("./index")
const jsCompile = require("./jsCompiler")
const lex = require("./lexer")

const jsGlobals = ["console", "Math"]

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
  expect(ast).toEqual(astFixture)
  const js = jsCompile({ ast, jsGlobals })
  expect(js).toEqual(jsOutputFixture)

  expect(compile({ input, jsGlobals })).toEqual(jsOutputFixture)
})
