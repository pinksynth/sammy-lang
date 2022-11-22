const ct = require("../characterTypes")
const charTypeFrom = require("../charTypeFrom")
const {
  ASSIGNMENT,
  BANG,
  BOOLEAN,
  BRACKET_CLOSE,
  BRACKET_OPEN,
  COLON,
  COMMA,
  COMMENT,
  COMPARE,
  CONCISE_LAMBDA_ARGUMENT,
  CURLY_CLOSE,
  CURLY_OPEN,
  DOT,
  ELSE,
  FUNCTION,
  HYPHEN,
  IF,
  LAMBDA_OPEN,
  NULL,
  NUMBER,
  OBJECT_OPEN,
  OPERATOR_INFIX,
  PAREN_CLOSE,
  PAREN_OPEN,
  STRING,
  UNDEFINED,
  VAR,
  WEAK,
  WHITESPACE,
} = require("../tokenTypes")
const handleCloseLambdaArgIdentifierMode = require("./handleCloseLambdaArgIdentifierMode")
const handleOpenLambdaArgIdentifierMode = require("./handleOpenLambdaArgIdentifierMode")
const handlePeriodWhileInNumberMode = require("./handlePeriodWhileInNumberMode")
const handleRangeOperator = require("./handleRangeOperator")
const handleTokenStartNumber = require("./handleTokenStartNumber")
const pushToken = require("./pushToken")

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
    tokenType = NULL
  } else if (value === "undefined") {
    tokenType = UNDEFINED
  } else if (value === "weak") {
    tokenType = WEAK
  } else if (value === "if") {
    tokenType = IF
  } else if (value === "else") {
    tokenType = ELSE
  } else if (value === "function") {
    tokenType = FUNCTION
  } else if (value === "true" || value === "false") {
    tokenType = BOOLEAN
  } else if (value === "%[") {
    tokenType = OBJECT_OPEN
  } else if (value === "@") {
    tokenType = LAMBDA_OPEN
  } else if (value.substring(0, 3) === "<<<") {
    tokenType = COMMENT
  } else if (
    value === "==" ||
    value === "!=" ||
    value === ">" ||
    value === "<" ||
    value === ">=" ||
    value === "<="
  ) {
    tokenType = COMPARE
  } else if (charTypeFrom(value[0]) === ct.CT_DOUBLE_QUOTE) {
    tokenType = STRING
  } else if (charTypeFrom(value[0]) === ct.CT_DOLLAR_SIGN) {
    tokenType = CONCISE_LAMBDA_ARGUMENT
  } else if (charTypeFrom(value[0]) === ct.CT_HASH) {
    tokenType = COMMENT
  } else if (latestCharType === ct.CT_WHITESPACE) {
    tokenType = WHITESPACE
  } else if (latestCharType === ct.CT_NUMBER) {
    tokenType = NUMBER
  } else if (value === ".") {
    tokenType = DOT
  } else if (value === "=") {
    tokenType = ASSIGNMENT
  } else if (value === ":") {
    tokenType = COLON
  } else if (value === ",") {
    tokenType = COMMA
  } else if (value === "[") {
    tokenType = BRACKET_OPEN
  } else if (value === "]") {
    tokenType = BRACKET_CLOSE
  } else if (value === "(") {
    tokenType = PAREN_OPEN
  } else if (value === ")") {
    tokenType = PAREN_CLOSE
  } else if (value === "{") {
    tokenType = CURLY_OPEN
  } else if (value === "}") {
    tokenType = CURLY_CLOSE
  } else if (value === "!") {
    tokenType = BANG
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
    tokenType = OPERATOR_INFIX
  } else if (value === "-") {
    tokenType = HYPHEN
  } else if (latestCharType === ct.CT_IDENTIFIER) {
    tokenType = VAR
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

const lex = (input) => {
  const state = {
    charAccumulator: [],
    currentColumnNumber: 1,
    currentLineNumber: 1,
    currentLineValue: "",
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

    if (
      state.numberMode &&
      state.charType !== ct.CT_NUMBER &&
      state.charType !== ct.CT_UNDERSCORE &&
      state.charType !== ct.CT_PERIOD
    ) {
      state.numberMode = false
      state.numberFloatingPointApplied = false
    }

    if (state.charType === ct.CT_DOUBLE_QUOTE) {
      if (state.stringLiteralMode) {
        if (charTypeFrom(input[index - 1]) !== ct.CT_BACKSLASH) {
          state.stringLiteralMode = false
        }
      } else {
        state.stringLiteralMode = true
      }
    }

    if (state.charType === ct.CT_HASH && !state.stringLiteralMode) {
      state.singleLineCommentMode = true
    }
    if (state.char === "\n" && state.singleLineCommentMode) {
      state.singleLineCommentMode = false
    }

    if (
      state.charType === ct.CT_LESS_THAN &&
      !state.stringLiteralMode &&
      !state.singleLineCommentMode &&
      state.charAccumulator.join("") === "<<"
    ) {
      state.multilineCommentMode = true
    }

    if (
      state.charType === ct.CT_GREATER_THAN &&
      !state.stringLiteralMode &&
      state.charAccumulator
        .join("")
        .substring(state.charAccumulator.length - 2) === ">>"
    ) {
      state.multilineCommentMode = false
    }

    if (state.char === "\n") {
      state.currentLineNumber++
      state.currentColumnNumber = 1
      state.currentLineValue = ""
    } else {
      state.currentColumnNumber++
      state.currentLineValue += state.char
    }

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
