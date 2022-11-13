// Character types
const c = {
  CT_AMPERSAND: /*        */ "CT_AMPERSAND",
  CT_ASTERISK: /*         */ "CT_ASTERISK",
  CT_BACKSLASH: /*        */ "CT_BACKSLASH",
  CT_COLON: /*            */ "CT_COLON",
  CT_COMMA: /*            */ "CT_COMMA",
  CT_DOLLAR_SIGN: /*      */ "CT_DOLLAR_SIGN",
  CT_DOUBLE_QUOTE: /*     */ "CT_DOUBLE_QUOTE",
  CT_EQUALS: /*           */ "CT_EQUALS",
  CT_GREATER_THAN: /*     */ "CT_GREATER_THAN",
  CT_HASH: /*             */ "CT_HASH",
  CT_HYPHEN: /*           */ "CT_HYPHEN",
  CT_IDENTIFIER: /*       */ "CT_IDENTIFIER",
  CT_LEFT_BRACKET: /*     */ "CT_LEFT_BRACKET",
  CT_LEFT_CURLY: /*       */ "CT_LEFT_CURLY",
  CT_LEFT_PAREN: /*       */ "CT_LEFT_PAREN",
  CT_LESS_THAN: /*        */ "CT_LESS_THAN",
  CT_NUMBER: /*           */ "CT_NUMBER",
  CT_PERCENT: /*          */ "CT_PERCENT",
  CT_PERIOD: /*           */ "CT_PERIOD",
  CT_PIPE: /*             */ "CT_PIPE",
  CT_PLUS_SIGN: /*        */ "CT_PLUS_SIGN",
  CT_RIGHT_BRACKET: /*    */ "CT_RIGHT_BRACKET",
  CT_RIGHT_CURLY: /*      */ "CT_RIGHT_CURLY",
  CT_RIGHT_PAREN: /*      */ "CT_RIGHT_PAREN",
  CT_SINGLE_QUOTE: /*     */ "CT_SINGLE_QUOTE",
  CT_SLASH: /*            */ "CT_SLASH",
  CT_UNDERSCORE: /*       */ "CT_UNDERSCORE",
  CT_WHITESPACE: /*       */ "CT_WHITESPACE",
}
const characterTypes = c

const characterRanges = {
  [c.CT_AMPERSAND]: /*         */ [["&"]],
  [c.CT_ASTERISK]: /*          */ [["*"]],
  [c.CT_BACKSLASH]: /*         */ [["\\"]],
  [c.CT_COLON]: /*             */ [[":"]],
  [c.CT_COMMA]: /*             */ [[","]],
  [c.CT_DOLLAR_SIGN]: /*       */ [["$"]],
  [c.CT_DOUBLE_QUOTE]: /*      */ [['"']],
  [c.CT_EQUALS]: /*            */ [["="]],
  [c.CT_GREATER_THAN]: /*      */ [[">"]],
  [c.CT_HASH]: /*              */ [["#"]],
  [c.CT_HYPHEN]: /*            */ [["-"]],
  [c.CT_IDENTIFIER]: /*        */ [
    ["a", "z"],
    ["A", "Z"],
  ],
  [c.CT_LEFT_BRACKET]: /*      */ [["["]],
  [c.CT_LEFT_CURLY]: /*        */ [["{"]],
  [c.CT_LEFT_PAREN]: /*        */ [["("]],
  [c.CT_LESS_THAN]: /*         */ [["<"]],
  [c.CT_NUMBER]: /*            */ [["0", "9"]],
  [c.CT_PERCENT]: /*           */ [["%"]],
  [c.CT_PERIOD]: /*            */ [["."]],
  [c.CT_PIPE]: /*              */ [["|"]],
  [c.CT_PLUS_SIGN]: /*         */ [["+"]],
  [c.CT_RIGHT_BRACKET]: /*     */ [["]"]],
  [c.CT_RIGHT_CURLY]: /*       */ [["}"]],
  [c.CT_RIGHT_PAREN]: /*       */ [[")"]],
  [c.CT_SINGLE_QUOTE]: /*      */ [["'"]],
  [c.CT_SLASH]: /*             */ [["/"]],
  [c.CT_UNDERSCORE]: /*        */ [["_"]],
  [c.CT_WHITESPACE]: /*        */ [["\n"], ["\t"], [" "]],
}

module.exports = { characterRanges, characterTypes }
