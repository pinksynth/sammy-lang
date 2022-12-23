const fs = require("fs")
const path = require("path")
const { compile } = require("../src")

const getAstFromTokens = require("../src/ast")
const deleteParents = require("../src/ast/deleteParents")
const jsCompile = require("../src/jsCompiler")
const lex = require("../src/lexer")
const jsGlobals = ["console", "Math", "foo", "baz"]

const performSnapshotAssertions = (testCaseName, inputDir) => {
  const inputFile = path.resolve(inputDir, "input.sammy")
  const input = fs.readFileSync(inputFile).toString()

  test(`📸 ${testCaseName}`, () => {
    const tokens = lex(input)
    expect(tokens).toMatchSnapshot()
    const ast = getAstFromTokens({ tokens })
    expect(deleteParents(ast)).toMatchSnapshot()
    const jsOutput = jsCompile({ ast, jsGlobals })
    expect(jsOutput).toMatchSnapshot()
  })
}

const expectCompiledEval = (input) => {
  // Allow input string to be used with "toThrow" in a way similar to normal Jest.
  if (typeof input === "function") {
    return expect(() => eval(compile({ input: input() })))
  }

  return expect(eval(compile({ input })))
}

module.exports = { expectCompiledEval, performSnapshotAssertions }
