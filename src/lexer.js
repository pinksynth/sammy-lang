/* global console */
const {
  characterTypes: {
    CT_BACKSLASH,
    CT_DOUBLE_QUOTE,
    CT_EQUALS,
    CT_GREATER_THAN,
    CT_HASH,
    CT_IDENTIFIER,
    CT_LEFT_BRACKET,
    CT_LESS_THAN,
    CT_NUMBER,
    CT_PERCENT,
    CT_UNDERSCORE,
    CT_WHITESPACE,
  },
} = require("./characterTypes")
const charTypeFrom = require("./charTypeFrom")
const {
  TT_ASSIGNMENT,
  TT_BOOLEAN,
  TT_BRACKET_CLOSE,
  TT_BRACKET_OPEN,
  TT_COLON,
  TT_COMMA,
  TT_COMMENT,
  TT_COMPARE,
  TT_CURLY_CLOSE,
  TT_CURLY_OPEN,
  TT_DOT,
  TT_FUNCTION,
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
} = require("./tokenTypes")

const getToken = ({
  charAccumulator,
  charType,
  columnNumberEnd,
  columnNumberStart,
  currentLineValue,
  lineNumberEnd,
  lineNumberStart,
  multilineCommentMode,
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
  if (
    (latestCharType === CT_NUMBER || latestCharType === CT_UNDERSCORE) &&
    (charType === CT_NUMBER || charType === CT_UNDERSCORE)
  ) {
    return false
  }
  if (latestCharType === CT_LESS_THAN && charType === CT_LESS_THAN) {
    return false
  }
  if (latestCharType === CT_GREATER_THAN && charType === CT_GREATER_THAN) {
    return false
  }
  if (latestCharType === CT_PERCENT && charType === CT_LEFT_BRACKET) {
    // SammyScript object syntax: %[ ]
    return false
  }
  if (latestCharType === CT_EQUALS && charType === CT_EQUALS) {
    return false
  }

  const value = charAccumulator.join("")
  TT_OBJECT_OPEN
  let tokenType
  if (value === "null") {
    tokenType = TT_NULL
  } else if (value === "undefined") {
    tokenType = TT_UNDEFINED
  } else if (value === "weak") {
    tokenType = TT_WEAK
  } else if (value === "function") {
    tokenType = TT_FUNCTION
  } else if (value === "true" || value === "false") {
    tokenType = TT_BOOLEAN
  } else if (value === "%[") {
    tokenType = TT_OBJECT_OPEN
  } else if (value.substring(0, 3) === "<<<") {
    tokenType = TT_COMMENT
  } else if (value === "==") {
    tokenType = TT_COMPARE
  } else if (charTypeFrom(value[0]) === CT_DOUBLE_QUOTE) {
    tokenType = TT_STRING
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
  } else if (
    value === "+" ||
    value === "-" ||
    value === "*" ||
    value === "/" ||
    value === "%"
  ) {
    tokenType = TT_OPERATOR_INFIX
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

const lex = (sammyScript) => {
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

  for (let index = 0; index < sammyScript.length; index++) {
    const char = sammyScript[index]
    const charType = charTypeFrom(char)

    const token = getToken({
      charAccumulator,
      charType,
      columnNumberEnd: currentColumnNumber,
      columnNumberStart: tokenColumnNumberStart,
      currentLineValue,
      lineNumberEnd: currentLineNumber,
      lineNumberStart: tokenLineNumberStart,
      multilineCommentMode,
      singleLineCommentMode,
      stringLiteralMode,
    })

    if (token) {
      tokens.push(token)
      tokenLineNumberStart = currentLineNumber
      tokenColumnNumberStart = currentColumnNumber
      charAccumulator = []
    }

    if (charType === CT_DOUBLE_QUOTE) {
      if (stringLiteralMode) {
        if (charTypeFrom(sammyScript[index - 1]) !== CT_BACKSLASH) {
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
      !singleLineCommentMode &&
      charAccumulator.join("").substring(charAccumulator.length - 2) === ">>"
    ) {
      multilineCommentMode = false
    }

    charAccumulator.push(char)

    if (char === "\n") {
      currentLineNumber++
      currentColumnNumber = 1
      currentLineValue = ""
    } else {
      currentColumnNumber++
      currentLineValue += char
    }
  }

  tokens.push(
    getToken({
      charAccumulator,
      columnNumberEnd: currentColumnNumber,
      columnNumberStart: tokenColumnNumberStart,
      currentLineValue,
      lineNumberEnd: currentLineNumber,
      lineNumberStart: tokenLineNumberStart,
      stringLiteralMode,
    })
  )

  console.dir(
    tokens
      .filter((t) => t.tokenType !== TT_WHITESPACE)
      .map((t) => [t.value, t.tokenType]),
    { maxArrayLength: null }
  )
}

module.exports = lex
