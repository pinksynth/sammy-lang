/* global console */
const {
  characterTypes: {
    CT_AMPERSAND,
    CT_BACKSLASH,
    CT_BANG,
    CT_DOLLAR_SIGN,
    CT_DOUBLE_QUOTE,
    CT_EQUALS,
    CT_GREATER_THAN,
    CT_HASH,
    CT_IDENTIFIER,
    CT_LEFT_BRACKET,
    CT_LESS_THAN,
    CT_NUMBER,
    CT_PERCENT,
    CT_PERIOD,
    CT_PIPE,
    CT_UNDERSCORE,
    CT_WHITESPACE,
  },
} = require("./characterTypes")
const charTypeFrom = require("./charTypeFrom")
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
} = require("./tokenTypes")

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

  if (latestCharType === CT_WHITESPACE && charType === CT_WHITESPACE) {
    return false
  }
  if (
    (latestCharType === CT_IDENTIFIER || latestCharType === CT_UNDERSCORE) &&
    (charType === CT_IDENTIFIER || charType === CT_UNDERSCORE)
  ) {
    return false
  }
  if (latestCharType === CT_IDENTIFIER && charType === CT_IDENTIFIER) {
    return false
  }
  if (lambdaArgIdentifierMode && charType === CT_NUMBER) {
    return false
  }
  if (numberMode) {
    if (charType === CT_PERIOD && !numberFloatingPointApplied) {
      return false
    }
    if (charType === CT_NUMBER || charType === CT_UNDERSCORE) {
      return false
    }
  }
  if (latestCharType === CT_LESS_THAN && charType === CT_LESS_THAN) {
    return false
  }
  if (latestCharType === CT_GREATER_THAN && charType === CT_GREATER_THAN) {
    return false
  }
  if (latestCharType === CT_PERCENT && charType === CT_LEFT_BRACKET) {
    // input object syntax: %[ ]
    return false
  }
  if (latestCharType === CT_EQUALS && charType === CT_EQUALS) {
    return false
  }
  if (latestCharType === CT_AMPERSAND && charType === CT_AMPERSAND) {
    return false
  }
  if (latestCharType === CT_PIPE && charType === CT_PIPE) {
    return false
  }
  // >=, <=, !=
  if (
    (latestCharType === CT_GREATER_THAN && charType === CT_EQUALS) ||
    (latestCharType === CT_LESS_THAN && charType === CT_EQUALS) ||
    (latestCharType === CT_BANG && charType === CT_EQUALS)
  ) {
    return false
  }
  if (latestCharType === CT_PERIOD && charType === CT_PERIOD) {
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
  } else if (charTypeFrom(value[0]) === CT_DOUBLE_QUOTE) {
    tokenType = STRING
  } else if (charTypeFrom(value[0]) === CT_DOLLAR_SIGN) {
    tokenType = CONCISE_LAMBDA_ARGUMENT
  } else if (charTypeFrom(value[0]) === CT_HASH) {
    tokenType = COMMENT
  } else if (latestCharType === CT_WHITESPACE) {
    tokenType = WHITESPACE
  } else if (latestCharType === CT_NUMBER) {
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
  } else if (latestCharType === CT_IDENTIFIER) {
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
  const tokens = []
  const state = {
    charAccumulator: [],
    currentLineValue: "",
    tokenLineNumberStart: 1,
    tokenColumnNumberStart: 1,
    currentLineNumber: 1,
    currentColumnNumber: 1,
    stringLiteralMode: false,
    singleLineCommentMode: false,
    multilineCommentMode: false,
    numberMode: false,
    numberFloatingPointApplied: false,
    lambdaArgIdentifierMode: false,
  }

  for (let index = 0; index < input.length; index++) {
    state.char = input[index]
    state.nextChar = input[index + 1]
    state.thirdChar = input[index + 2]
    state.charType = charTypeFrom(state.char)
    state.nextCharType = state.nextChar && charTypeFrom(state.nextChar)
    state.thirdCharType = state.thirdChar && charTypeFrom(state.thirdChar)

    const token = getToken(state)

    if (token) {
      tokens.push(token)
      state.tokenLineNumberStart = state.currentLineNumber
      state.tokenColumnNumberStart = state.currentColumnNumber
      state.charAccumulator = []
    }

    if (state.lambdaArgIdentifierMode && state.charType !== CT_NUMBER) {
      state.lambdaArgIdentifierMode = false
    }

    if (
      state.charAccumulator.length === 0 &&
      state.charType === CT_DOLLAR_SIGN
    ) {
      state.lambdaArgIdentifierMode = true
    }

    if (state.charAccumulator.length === 0 && state.charType === CT_NUMBER) {
      state.numberMode = true
    }

    // If encountering a period followed by another period, turn off number mode because this will be a range operator (..)
    if (
      state.numberMode &&
      state.nextCharType === CT_PERIOD &&
      state.thirdCharType === CT_PERIOD
    ) {
      state.numberMode = false
    }

    // If encountering a period in number mode, assume it is our decimal point.
    if (state.numberMode && state.charType === CT_PERIOD) {
      if (state.numberFloatingPointApplied) {
        state.numberMode = false
        state.numberFloatingPointApplied = false
        // If we've already placed our decimal point and see another dot, it's a new token.
      } else {
        state.numberFloatingPointApplied = true
      }
    }

    if (
      state.numberMode &&
      state.charType !== CT_NUMBER &&
      state.charType !== CT_UNDERSCORE &&
      state.charType !== CT_PERIOD
    ) {
      state.numberMode = false
      state.numberFloatingPointApplied = false
    }

    if (state.charType === CT_DOUBLE_QUOTE) {
      if (state.stringLiteralMode) {
        if (charTypeFrom(input[index - 1]) !== CT_BACKSLASH) {
          state.stringLiteralMode = false
        }
      } else {
        state.stringLiteralMode = true
      }
    }

    if (state.charType === CT_HASH && !state.stringLiteralMode) {
      state.singleLineCommentMode = true
    }
    if (state.char === "\n" && state.singleLineCommentMode) {
      state.singleLineCommentMode = false
    }

    if (
      state.charType === CT_LESS_THAN &&
      !state.stringLiteralMode &&
      !state.singleLineCommentMode &&
      state.charAccumulator.join("") === "<<"
    ) {
      state.multilineCommentMode = true
    }

    if (
      state.charType === CT_GREATER_THAN &&
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

  tokens.push(getToken(state))

  return tokens
}

module.exports = lex
