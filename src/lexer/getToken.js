const charTypeFrom = require("../charTypeFrom")
const ct = require("../characterTypes")
const shouldContinueConsumingToken = require("./shouldContinueConsumingToken")
const tt = require("../tokenTypes")

const getToken = (state) => {
  const {
    charAccumulator,
    currentColumnNumber,
    currentLineNumber,
    currentLineValue,
    latestCharType,
    tokenColumnNumberStart,
    tokenLineNumberStart,
  } = state

  if (charAccumulator.length === 0) return false

  if (shouldContinueConsumingToken(state)) return false

  const value = charAccumulator.join("")

  let tokenType
  if (value === "null") {
    tokenType = tt.NULL
  } else if (value === "undefined") {
    tokenType = tt.UNDEFINED
  } else if (value === "weak") {
    tokenType = tt.WEAK
  } else if (value === "if") {
    tokenType = tt.IF
  } else if (value === "else") {
    tokenType = tt.ELSE
  } else if (value === "function") {
    tokenType = tt.FUNCTION
  } else if (value === "true" || value === "false") {
    tokenType = tt.BOOLEAN
  } else if (value === "%[") {
    tokenType = tt.OBJECT_OPEN
  } else if (value === "->") {
    tokenType = tt.FORWARD_PIPE
  } else if (value === "@") {
    tokenType = tt.LAMBDA_OPEN
  } else if (value.substring(0, 3) === "<<<") {
    tokenType = tt.COMMENT
  } else if (
    value === "==" ||
    value === "!=" ||
    value === ">" ||
    value === "<" ||
    value === ">=" ||
    value === "<="
  ) {
    tokenType = tt.COMPARE
  } else if (charTypeFrom(value[0]) === ct.CT_DOUBLE_QUOTE) {
    tokenType = tt.STRING
  } else if (charTypeFrom(value[0]) === ct.CT_DOLLAR_SIGN) {
    tokenType = tt.CONCISE_LAMBDA_ARGUMENT
  } else if (charTypeFrom(value[0]) === ct.CT_HASH) {
    tokenType = tt.COMMENT
  } else if (latestCharType === ct.CT_WHITESPACE) {
    tokenType = tt.WHITESPACE
  } else if (latestCharType === ct.CT_NUMBER) {
    tokenType = tt.NUMBER
  } else if (value === ".") {
    tokenType = tt.DOT
  } else if (value === "=") {
    tokenType = tt.ASSIGNMENT
  } else if (value === ":") {
    tokenType = tt.COLON
  } else if (value === ",") {
    tokenType = tt.COMMA
  } else if (value === "[") {
    tokenType = tt.BRACKET_OPEN
  } else if (value === "]") {
    tokenType = tt.BRACKET_CLOSE
  } else if (value === "(") {
    tokenType = tt.PAREN_OPEN
  } else if (value === ")") {
    tokenType = tt.PAREN_CLOSE
  } else if (value === "{") {
    tokenType = tt.CURLY_OPEN
  } else if (value === "}") {
    tokenType = tt.CURLY_CLOSE
  } else if (value === "!") {
    tokenType = tt.BANG
  } else if (
    value === "+" ||
    value === "*" ||
    value === "/" ||
    value === "%" ||
    value === "^" ||
    value === "||" ||
    value === "&&" ||
    value === ".."
  ) {
    tokenType = tt.OPERATOR_INFIX
  } else if (value === "-") {
    tokenType = tt.HYPHEN
  } else if (latestCharType === ct.CT_IDENTIFIER) {
    tokenType = tt.VAR
  }

  if (tokenType === undefined) {
    let squiggles = ""
    for (let index = 0; index < tokenColumnNumberStart - 1; index++) {
      squiggles += " "
    }
    squiggles += "^"
    throw new Error(
      `Unexpected token ${value} on line ${currentLineNumber}:\n${currentLineValue}\n${squiggles}`
    )
  }

  return {
    tokenType,
    value,
    lineNumberStart: tokenLineNumberStart,
    columnNumberStart: tokenColumnNumberStart,
    lineNumberEnd: currentLineNumber,
    columnNumberEnd: currentColumnNumber,
  }
}

module.exports = getToken
