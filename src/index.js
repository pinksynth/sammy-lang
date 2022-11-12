// Character types
const CT_ASTERISK /*         */ = "CT_ASTERISK"
const CT_BACKSLASH /*        */ = "CT_BACKSLASH"
const CT_COLON /*            */ = "CT_COLON"
const CT_COMMA /*            */ = "CT_COMMA"
const CT_DOUBLE_QUOTE /*     */ = "CT_DOUBLE_QUOTE"
const CT_EQUALS /*           */ = "CT_EQUALS"
const CT_GREATER_THAN /*     */ = "CT_GREATER_THAN"
const CT_HASH /*             */ = "CT_HASH"
const CT_HYPHEN /*           */ = "CT_HYPHEN"
const CT_IDENTIFIER /*       */ = "CT_IDENTIFIER"
const CT_LEFT_BRACKET /*     */ = "CT_LEFT_BRACKET"
const CT_LEFT_CURLY /*       */ = "CT_LEFT_CURLY"
const CT_LEFT_PAREN /*       */ = "CT_LEFT_PAREN"
const CT_LESS_THAN /*        */ = "CT_LESS_THAN"
const CT_NUMBER /*           */ = "CT_NUMBER"
const CT_PERCENT /*          */ = "CT_PERCENT"
const CT_PERIOD /*           */ = "CT_PERIOD"
const CT_PLUS_SIGN /*        */ = "CT_PLUS_SIGN"
const CT_RIGHT_BRACKET /*    */ = "CT_RIGHT_BRACKET"
const CT_RIGHT_CURLY /*      */ = "CT_RIGHT_CURLY"
const CT_RIGHT_PAREN /*      */ = "CT_RIGHT_PAREN"
const CT_SINGLE_QUOTE /*     */ = "CT_SINGLE_QUOTE"
const CT_SLASH /*            */ = "CT_SLASH"
const CT_UNDERSCORE /*       */ = "CT_UNDERSCORE"
const CT_WHITESPACE /*       */ = "CT_WHITESPACE"

// Token types
const TT_ASSIGNMENT /*       */ = "TT_ASSIGNMENT"
const TT_BOOLEAN /*          */ = "TT_BOOLEAN"
const TT_BRACKET_CLOSE /*    */ = "TT_BRACKET_CLOSE"
const TT_BRACKET_OPEN /*     */ = "TT_BRACKET_OPEN"
const TT_COLON /*            */ = "TT_COLON"
const TT_COMMA /*            */ = "TT_COMMA"
const TT_COMMENT /*          */ = "TT_COMMENT"
const TT_CURLY_CLOSE /*      */ = "TT_CURLY_CLOSE"
const TT_CURLY_OPEN /*       */ = "TT_CURLY_OPEN"
const TT_DOT /*              */ = "TT_DOT"
const TT_MULTILINE_OPEN /*   */ = "TT_MULTILINE_OPEN"
const TT_MULTILINE_CLOSE /*  */ = "TT_MULTILINE_CLOSE"
const TT_NULL /*             */ = "TT_NULL"
const TT_NUMBER /*           */ = "TT_NUMBER"
const TT_OBJECT_OPEN /*      */ = "TT_OBJECT_OPEN"
const TT_OPERATOR_INFIX /*   */ = "TT_OPERATOR_INFIX"
const TT_PAREN_CLOSE /*      */ = "TT_PAREN_CLOSE"
const TT_PAREN_OPEN /*       */ = "TT_PAREN_OPEN"
const TT_STRICT_COMPARE /*   */ = "TT_STRICT_COMPARE"
const TT_STRING /*           */ = "TT_STRING"
const TT_UNDEFINED /*        */ = "TT_UNDEFINED"
const TT_VAR /*              */ = "TT_VAR"
const TT_WHITESPACE /*       */ = "TT_WHITESPACE"

const characterRanges = {
  [CT_ASTERISK]: /*          */ [["*"]],
  [CT_BACKSLASH]: /*         */ [["\\"]],
  [CT_COLON]: /*             */ [[":"]],
  [CT_COMMA]: /*             */ [[","]],
  [CT_DOUBLE_QUOTE]: /*      */ [['"']],
  [CT_EQUALS]: /*            */ [["="]],
  [CT_GREATER_THAN]: /*      */ [[">"]],
  [CT_HASH]: /*              */ [["#"]],
  [CT_HYPHEN]: /*            */ [["-"]],
  [CT_IDENTIFIER]: /*        */ [
    ["a", "z"],
    ["A", "Z"],
  ],
  [CT_LEFT_BRACKET]: /*      */ [["["]],
  [CT_LEFT_CURLY]: /*        */ [["{"]],
  [CT_LEFT_PAREN]: /*        */ [["("]],
  [CT_LESS_THAN]: /*         */ [["<"]],
  [CT_NUMBER]: /*            */ [["0", "9"]],
  [CT_PERCENT]: /*           */ [["%"]],
  [CT_PERIOD]: /*            */ [["."]],
  [CT_PLUS_SIGN]: /*         */ [["+"]],
  [CT_RIGHT_BRACKET]: /*     */ [["]"]],
  [CT_RIGHT_CURLY]: /*       */ [["}"]],
  [CT_RIGHT_PAREN]: /*       */ [[")"]],
  [CT_SINGLE_QUOTE]: /*      */ [["'"]],
  [CT_SLASH]: /*             */ [["/"]],
  [CT_UNDERSCORE]: /*        */ [["_"]],
  [CT_WHITESPACE]: /*        */ [["\n"], ["\t"], [" "]],
}

// To efficiently check types of character codes, use an object in which all possible character values
const charTypesByCharCode = {}
for (const [charType, ranges] of Object.entries(characterRanges)) {
  for (const [min, max] of ranges) {
    if (max === undefined) {
      charTypesByCharCode[min.charCodeAt()] = charType
    } else {
      for (
        let charCode = min.charCodeAt();
        charCode <= max.charCodeAt();
        charCode++
      ) {
        charTypesByCharCode[charCode] = charType
      }
    }
  }
}

const charTypeFrom = (char) => charTypesByCharCode[char.charCodeAt(0)]

const getToken = ({
  charAccumulator,
  charType,
  columnNumberEnd,
  columnNumberStart,
  lineNumberEnd,
  lineNumberStart,
  singleLineCommentMode,
  stringLiteralMode,
  multilineCommentMode,
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

  const value = charAccumulator.join("")

  let tokenType
  if (value === "%[") {
    tokenType = TT_OBJECT_OPEN
  } else if (value === "<<<") {
    tokenType = TT_MULTILINE_OPEN
  } else if (value === ">>>") {
    tokenType = TT_MULTILINE_CLOSE
  } else if (charTypeFrom(value[0]) === CT_DOUBLE_QUOTE) {
    tokenType = TT_STRING
  } else if (charTypeFrom(value[0]) === CT_HASH) {
    tokenType = TT_COMMENT
  } else if (latestCharType === CT_WHITESPACE) {
    tokenType = TT_WHITESPACE
  } else if (latestCharType === CT_NUMBER) {
    tokenType = TT_NUMBER
  } else if (latestCharType === CT_PERIOD) {
    tokenType = TT_DOT
  } else if (latestCharType === CT_EQUALS) {
    tokenType = TT_ASSIGNMENT
  } else if (latestCharType === CT_COLON) {
    tokenType = TT_COLON
  } else if (latestCharType === CT_COMMA) {
    tokenType = TT_COMMA
  } else if (latestCharType === CT_LEFT_BRACKET) {
    tokenType = TT_BRACKET_OPEN
  } else if (latestCharType === CT_RIGHT_BRACKET) {
    tokenType = TT_BRACKET_CLOSE
  } else if (latestCharType === CT_LEFT_PAREN) {
    tokenType = TT_PAREN_OPEN
  } else if (latestCharType === CT_RIGHT_PAREN) {
    tokenType = TT_PAREN_CLOSE
  } else if (latestCharType === CT_LEFT_CURLY) {
    tokenType = TT_CURLY_OPEN
  } else if (latestCharType === CT_RIGHT_CURLY) {
    tokenType = TT_CURLY_CLOSE
  } else if (
    latestCharType === CT_PLUS_SIGN ||
    latestCharType === CT_HYPHEN ||
    latestCharType === CT_ASTERISK ||
    latestCharType === CT_SLASH
  ) {
    tokenType = TT_OPERATOR_INFIX
  } else if (latestCharType === CT_IDENTIFIER) {
    if (value === "null") tokenType = TT_NULL
    else if (value === "undefined") tokenType = TT_UNDEFINED
    else if (value === "true" || value === "false") tokenType = TT_BOOLEAN
    else tokenType = TT_VAR
  }
  // Determine keyword based on value

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

  let prevCharType = CT_WHITESPACE
  let charAccumulator = []
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
      lineNumberStart: tokenLineNumberStart,
      columnNumberStart: tokenColumnNumberStart,
      lineNumberEnd: currentLineNumber,
      columnNumberEnd: currentColumnNumber,
      stringLiteralMode,
      singleLineCommentMode,
      multilineCommentMode,
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
      charAccumulator.join("") === "<<<"
    ) {
      multilineCommentMode = true
    }

    if (
      charType === CT_GREATER_THAN &&
      !stringLiteralMode &&
      !singleLineCommentMode &&
      charAccumulator.join("") === ">>>"
    ) {
      multilineCommentMode = false
    }

    charAccumulator.push(char)

    if (char === "\n") {
      currentLineNumber++
      currentColumnNumber = 1
    } else {
      currentColumnNumber++
    }
  }

  tokens.push(
    getToken({
      charAccumulator,
      lineNumberStart: tokenLineNumberStart,
      columnNumberStart: tokenColumnNumberStart,
      lineNumberEnd: currentLineNumber,
      columnNumberEnd: currentColumnNumber,
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

const getAst = (tokens) => {}

const astToJS = (ast) => {}

const compile = (sammyScript) => {
  const tokens = lex(sammyScript)
  const ast = getAst(tokens)
  return astToJS(ast)
}

lex(`
# A nice comment
my_num = 1_000.5 * 10.5
other_num = 5 / 5
yet_another_num = 3 / 6 * 4
my_string = "a nifty
string"
my_array = [1  2  3
4 5]
my_object = %[key: true, other_key: false]
function my_func() {
	if things === true
		obj.call(a b 100)
	endif

	false
}
<<<
A rad comment
>>>
my_func()
another_array = [
	%[some_thing: else]
	true
	100 * 5
]
`)
