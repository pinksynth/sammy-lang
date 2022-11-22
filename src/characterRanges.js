const ct = require("./characterTypes")

const characterRanges = {
  [ct.CT_AMPERSAND]: /*         */ [["&"]],
  [ct.CT_ASTERISK]: /*          */ [["*"]],
  [ct.CT_BACKSLASH]: /*         */ [["\\"]],
  [ct.CT_BANG]: /*              */ [["!"]],
  [ct.CT_COLON]: /*             */ [[":"]],
  [ct.CT_COMMA]: /*             */ [[","]],
  [ct.CT_DOLLAR_SIGN]: /*       */ [["$"]],
  [ct.CT_DOUBLE_QUOTE]: /*      */ [['"']],
  [ct.CT_EQUALS]: /*            */ [["="]],
  [ct.CT_GREATER_THAN]: /*      */ [[">"]],
  [ct.CT_HASH]: /*              */ [["#"]],
  [ct.CT_HYPHEN]: /*            */ [["-"]],
  [ct.CT_IDENTIFIER]: /*        */ [
    ["a", "z"],
    ["A", "Z"],
  ],
  [ct.CT_LEFT_BRACKET]: /*      */ [["["]],
  [ct.CT_LEFT_CURLY]: /*        */ [["{"]],
  [ct.CT_LEFT_PAREN]: /*        */ [["("]],
  [ct.CT_LESS_THAN]: /*         */ [["<"]],
  [ct.CT_NUMBER]: /*            */ [["0", "9"]],
  [ct.CT_PERCENT]: /*           */ [["%"]],
  [ct.CT_PERIOD]: /*            */ [["."]],
  [ct.CT_PIPE]: /*              */ [["|"]],
  [ct.CT_PLUS_SIGN]: /*         */ [["+"]],
  [ct.CT_RIGHT_BRACKET]: /*     */ [["]"]],
  [ct.CT_RIGHT_CURLY]: /*       */ [["}"]],
  [ct.CT_RIGHT_PAREN]: /*       */ [[")"]],
  [ct.CT_SINGLE_QUOTE]: /*      */ [["'"]],
  [ct.CT_SLASH]: /*             */ [["/"]],
  [ct.CT_UNDERSCORE]: /*        */ [["_"]],
  [ct.CT_WHITESPACE]: /*        */ [["\n"], ["\t"], [" "]],
}

module.exports = characterRanges
