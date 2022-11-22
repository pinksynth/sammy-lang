const charTypeFrom = require("../charTypeFrom")
const ct = require("../characterTypes")
const tt = require("../tokenTypes")

const getToken = ({
  charAccumulator,
  charType,
  currentColumnNumber,
  currentLineNumber,
  currentLineValue,
  lambdaArgIdentifierMode,
  multilineCommentMode,
  numberFloatingPointApplied,
  numberMode,
  singleLineCommentMode,
  stringLiteralMode,
  tokenColumnNumberStart,
  tokenLineNumberStart,
}) => {
  if (charAccumulator.length === 0) return false

  if (stringLiteralMode) {
    return false
  }
  if (singleLineCommentMode) {
    return false
  }
  if (multilineCommentMode) {
    return false
  }

  const latestCharType = charTypeFrom(
    charAccumulator[charAccumulator.length - 1]
  )

  if (latestCharType === ct.CT_WHITESPACE && charType === ct.CT_WHITESPACE) {
    return false
  }
  if (
    (latestCharType === ct.CT_IDENTIFIER ||
      latestCharType === ct.CT_UNDERSCORE) &&
    (charType === ct.CT_IDENTIFIER || charType === ct.CT_UNDERSCORE)
  ) {
    return false
  }
  if (latestCharType === ct.CT_IDENTIFIER && charType === ct.CT_IDENTIFIER) {
    return false
  }
  if (lambdaArgIdentifierMode && charType === ct.CT_NUMBER) {
    return false
  }
  if (numberMode) {
    if (charType === ct.CT_PERIOD && !numberFloatingPointApplied) {
      return false
    }
    if (charType === ct.CT_NUMBER || charType === ct.CT_UNDERSCORE) {
      return false
    }
  }
  if (latestCharType === ct.CT_LESS_THAN && charType === ct.CT_LESS_THAN) {
    return false
  }
  if (
    latestCharType === ct.CT_GREATER_THAN &&
    charType === ct.CT_GREATER_THAN
  ) {
    return false
  }
  if (latestCharType === ct.CT_PERCENT && charType === ct.CT_LEFT_BRACKET) {
    // input object syntax: %[ ]
    return false
  }
  if (latestCharType === ct.CT_EQUALS && charType === ct.CT_EQUALS) {
    return false
  }
  if (latestCharType === ct.CT_AMPERSAND && charType === ct.CT_AMPERSAND) {
    return false
  }
  if (latestCharType === ct.CT_PIPE && charType === ct.CT_PIPE) {
    return false
  }
  // >=, <=, !=
  if (
    (latestCharType === ct.CT_GREATER_THAN && charType === ct.CT_EQUALS) ||
    (latestCharType === ct.CT_LESS_THAN && charType === ct.CT_EQUALS) ||
    (latestCharType === ct.CT_BANG && charType === ct.CT_EQUALS)
  ) {
    return false
  }
  if (latestCharType === ct.CT_PERIOD && charType === ct.CT_PERIOD) {
    return false
  }

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
