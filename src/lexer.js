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
  TT_ASSIGNMENT,
  TT_BANG,
  TT_BOOLEAN,
  TT_BRACKET_CLOSE,
  TT_BRACKET_OPEN,
  TT_COLON,
  TT_COMMA,
  TT_COMMENT,
  TT_COMPARE,
  TT_CONCISE_LAMBDA_ARGUMENT,
  TT_CURLY_CLOSE,
  TT_CURLY_OPEN,
  TT_DOT,
  TT_ELSE,
  TT_FUNCTION,
  TT_IF,
  TT_LAMBDA_OPEN,
  TT_NULL,
  TT_NUMBER,
  TT_OBJECT_OPEN,
  TT_OPERATOR_INFIX,
  TT_PAREN_CLOSE,
  TT_PAREN_OPEN,
  TT_STRING,
  TT_UNDEFINED,
  TT_VAR,
  TT_WEAK,
  TT_WHITESPACE,
  TT_HYPHEN,
} = require("./tokenTypes")

const getToken = ({
  charAccumulator,
  charType,
  columnNumberEnd,
  columnNumberStart,
  currentLineValue,
  lambdaArgIdentifierMode,
  lineNumberEnd,
  lineNumberStart,
  multilineCommentMode,
  numberFloatingPointApplied,
  numberMode,
  singleLineCommentMode,
  stringLiteralMode,
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
    tokenType = TT_NULL
  } else if (value === "undefined") {
    tokenType = TT_UNDEFINED
  } else if (value === "weak") {
    tokenType = TT_WEAK
  } else if (value === "if") {
    tokenType = TT_IF
  } else if (value === "else") {
    tokenType = TT_ELSE
  } else if (value === "function") {
    tokenType = TT_FUNCTION
  } else if (value === "true" || value === "false") {
    tokenType = TT_BOOLEAN
  } else if (value === "%[") {
    tokenType = TT_OBJECT_OPEN
  } else if (value === "@") {
    tokenType = TT_LAMBDA_OPEN
  } else if (value.substring(0, 3) === "<<<") {
    tokenType = TT_COMMENT
  } else if (
    value === "==" ||
    value === "!=" ||
    value === ">" ||
    value === "<" ||
    value === ">=" ||
    value === "<="
  ) {
    tokenType = TT_COMPARE
  } else if (charTypeFrom(value[0]) === CT_DOUBLE_QUOTE) {
    tokenType = TT_STRING
  } else if (charTypeFrom(value[0]) === CT_DOLLAR_SIGN) {
    tokenType = TT_CONCISE_LAMBDA_ARGUMENT
  } else if (charTypeFrom(value[0]) === CT_HASH) {
    tokenType = TT_COMMENT
  } else if (latestCharType === CT_WHITESPACE) {
    tokenType = TT_WHITESPACE
  } else if (latestCharType === CT_NUMBER) {
    tokenType = TT_NUMBER
  } else if (value === ".") {
    tokenType = TT_DOT
  } else if (value === "=") {
    tokenType = TT_ASSIGNMENT
  } else if (value === ":") {
    tokenType = TT_COLON
  } else if (value === ",") {
    tokenType = TT_COMMA
  } else if (value === "[") {
    tokenType = TT_BRACKET_OPEN
  } else if (value === "]") {
    tokenType = TT_BRACKET_CLOSE
  } else if (value === "(") {
    tokenType = TT_PAREN_OPEN
  } else if (value === ")") {
    tokenType = TT_PAREN_CLOSE
  } else if (value === "{") {
    tokenType = TT_CURLY_OPEN
  } else if (value === "}") {
    tokenType = TT_CURLY_CLOSE
  } else if (value === "!") {
    tokenType = TT_BANG
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
    tokenType = TT_OPERATOR_INFIX
  } else if (value === "-") {
    tokenType = TT_HYPHEN
  } else if (latestCharType === CT_IDENTIFIER) {
    tokenType = TT_VAR
  }

  if (tokenType === undefined) {
    let squiggles = ""
    for (let index = 0; index < columnNumberStart - 1; index++) {
      squiggles += " "
    }
    squiggles += "^"
    throw new Error(
      `Unexpected token ${value} on line ${lineNumberEnd}:\n${currentLineValue}\n${squiggles}`
    )
  }

  return {
    tokenType,
    value,
    lineNumberStart,
    columnNumberStart,
    lineNumberEnd,
    columnNumberEnd,
  }
}

const lex = (input) => {
  const tokens = []

  let charAccumulator = []
  let currentLineValue = ""
  let tokenLineNumberStart = 1
  let tokenColumnNumberStart = 1
  let currentLineNumber = 1
  let currentColumnNumber = 1
  let stringLiteralMode = false
  let singleLineCommentMode = false
  let multilineCommentMode = false
  let numberMode = false
  let numberFloatingPointApplied = false
  let lambdaArgIdentifierMode = false

  for (let index = 0; index < input.length; index++) {
    const char = input[index],
      nextChar = input[index + 1],
      thirdChar = input[index + 2]
    const charType = charTypeFrom(char),
      nextCharType = nextChar && charTypeFrom(nextChar),
      thirdCharType = thirdChar && charTypeFrom(thirdChar)

    const token = getToken({
      charAccumulator,
      charType,
      columnNumberEnd: currentColumnNumber,
      columnNumberStart: tokenColumnNumberStart,
      currentLineValue,
      lambdaArgIdentifierMode,
      lineNumberEnd: currentLineNumber,
      lineNumberStart: tokenLineNumberStart,
      multilineCommentMode,
      numberFloatingPointApplied,
      numberMode,
      singleLineCommentMode,
      stringLiteralMode,
    })

    if (token) {
      tokens.push(token)
      tokenLineNumberStart = currentLineNumber
      tokenColumnNumberStart = currentColumnNumber
      charAccumulator = []
    }

    if (lambdaArgIdentifierMode && charType !== CT_NUMBER) {
      lambdaArgIdentifierMode = false
    }

    if (charAccumulator.length === 0 && charType === CT_DOLLAR_SIGN) {
      lambdaArgIdentifierMode = true
    }

    if (charAccumulator.length === 0 && charType === CT_NUMBER) {
      numberMode = true
    }

    // If encountering a period followed by another period, turn off number mode because this will be a range operator (..)
    if (
      numberMode &&
      nextCharType === CT_PERIOD &&
      thirdCharType === CT_PERIOD
    ) {
      numberMode = false
    }

    // If encountering a period in number mode, assume it is our decimal point.
    if (numberMode && charType === CT_PERIOD) {
      if (numberFloatingPointApplied) {
        numberMode = false
        numberFloatingPointApplied = false
        // If we've already placed our decimal point and see another dot, it's a new token.
      } else {
        numberFloatingPointApplied = true
      }
    }

    if (
      numberMode &&
      charType !== CT_NUMBER &&
      charType !== CT_UNDERSCORE &&
      charType !== CT_PERIOD
    ) {
      numberMode = false
      numberFloatingPointApplied = false
    }

    if (charType === CT_DOUBLE_QUOTE) {
      if (stringLiteralMode) {
        if (charTypeFrom(input[index - 1]) !== CT_BACKSLASH) {
          stringLiteralMode = false
        }
      } else {
        stringLiteralMode = true
      }
    }

    if (charType === CT_HASH && !stringLiteralMode) {
      singleLineCommentMode = true
    }
    if (char === "\n" && singleLineCommentMode) {
      singleLineCommentMode = false
    }

    if (
      charType === CT_LESS_THAN &&
      !stringLiteralMode &&
      !singleLineCommentMode &&
      charAccumulator.join("") === "<<"
    ) {
      multilineCommentMode = true
    }

    if (
      charType === CT_GREATER_THAN &&
      !stringLiteralMode &&
      charAccumulator.join("").substring(charAccumulator.length - 2) === ">>"
    ) {
      multilineCommentMode = false
    }

    if (char === "\n") {
      currentLineNumber++
      currentColumnNumber = 1
      currentLineValue = ""
    } else {
      currentColumnNumber++
      currentLineValue += char
    }

    charAccumulator.push(char)
  }

  tokens.push(
    getToken({
      charAccumulator,
      columnNumberEnd: currentColumnNumber,
      columnNumberStart: tokenColumnNumberStart,
      currentLineValue,
      lambdaArgIdentifierMode,
      lineNumberEnd: currentLineNumber,
      lineNumberStart: tokenLineNumberStart,
      numberFloatingPointApplied,
      numberMode,
      stringLiteralMode,
    })
  )

  return tokens
}

module.exports = lex
