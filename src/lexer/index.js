const charTypeFrom = require("../charTypeFrom")
const getToken = require("./getToken")
const handleCloseLambdaArgIdentifierMode = require("./handleCloseLambdaArgIdentifierMode")
const handleCloseMultilineComment = require("./handleCloseMultilineComment")
const handleCloseSingleLineComment = require("./handleCloseSingleLineComment")
const handleDoubleQuote = require("./handleDoubleQuote")
const handleEndNumberMode = require("./handleEndNumberMode")
const handleIncrementLinesAndColumns = require("./handleIncrementLinesAndColumns")
const handleOpenLambdaArgIdentifierMode = require("./handleOpenLambdaArgIdentifierMode")
const handleOpenMultilineComment = require("./handleOpenMultilineComment")
const handleOpenSingleLineComment = require("./handleOpenSingleLineComment")
const handlePeriodWhileInNumberMode = require("./handlePeriodWhileInNumberMode")
const handleRangeOperator = require("./handleRangeOperator")
const handleTokenStartNumber = require("./handleTokenStartNumber")
const pushToken = require("./pushToken")

const lex = (input) => {
  const state = {
    charAccumulator: [],
    currentColumnNumber: 1,
    currentLineNumber: 1,
    currentLineValue: "",
    input,
    lambdaArgIdentifierMode: false,
    multilineCommentMode: false,
    numberFloatingPointApplied: false,
    numberMode: false,
    singleLineCommentMode: false,
    stringLiteralMode: false,
    tokenColumnNumberStart: 1,
    tokenLineNumberStart: 1,
    tokens: [],
  }

  for (let index = 0; index < input.length; index++) {
    state.index = index
    state.char = input[index]
    state.nextChar = input[index + 1]
    state.thirdChar = input[index + 2]
    state.charType = charTypeFrom(state.char)
    state.nextCharType = state.nextChar && charTypeFrom(state.nextChar)
    state.thirdCharType = state.thirdChar && charTypeFrom(state.thirdChar)

    const token = getToken(state)
    if (token) pushToken(token, state)

    handleCloseLambdaArgIdentifierMode(state)
    handleOpenLambdaArgIdentifierMode(state)
    handleTokenStartNumber(state)
    handleRangeOperator(state)
    handlePeriodWhileInNumberMode(state)
    handleEndNumberMode(state)
    handleDoubleQuote(state)
    handleOpenSingleLineComment(state)
    handleCloseSingleLineComment(state)
    handleOpenMultilineComment(state)
    handleCloseMultilineComment(state)
    handleIncrementLinesAndColumns(state)

    state.charAccumulator.push(state.char)
  }

  // Once we're no longer accumulating characters, delete all character properties from the state.
  delete state.char
  delete state.nextChar
  delete state.thirdChar
  delete state.charType
  delete state.nextCharType
  delete state.thirdCharType

  pushToken(getToken(state), state)

  return state.tokens
}

module.exports = lex
