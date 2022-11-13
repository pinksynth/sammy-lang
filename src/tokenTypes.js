// Token types
const t = {
  TT_ASSIGNMENT: /*       */ "TT_ASSIGNMENT",
  TT_BOOLEAN: /*          */ "TT_BOOLEAN",
  TT_BRACKET_CLOSE: /*    */ "TT_BRACKET_CLOSE",
  TT_BRACKET_OPEN: /*     */ "TT_BRACKET_OPEN",
  TT_COLON: /*            */ "TT_COLON",
  TT_COMMA: /*            */ "TT_COMMA",
  TT_COMMENT: /*          */ "TT_COMMENT",
  TT_COMPARE: /*          */ "TT_COMPARE",
  TT_CURLY_CLOSE: /*      */ "TT_CURLY_CLOSE",
  TT_CURLY_OPEN: /*       */ "TT_CURLY_OPEN",
  TT_DOT: /*              */ "TT_DOT",
  TT_FUNCTION: /*         */ "TT_FUNCTION",
  TT_IF: /*               */ "TT_IF",
  TT_NULL: /*             */ "TT_NULL",
  TT_NUMBER: /*           */ "TT_NUMBER",
  TT_OBJECT_OPEN: /*      */ "TT_OBJECT_OPEN",
  TT_OPERATOR_INFIX: /*   */ "TT_OPERATOR_INFIX",
  TT_PAREN_CLOSE: /*      */ "TT_PAREN_CLOSE",
  TT_PAREN_OPEN: /*       */ "TT_PAREN_OPEN",
  TT_STRING: /*           */ "TT_STRING",
  TT_UNDEFINED: /*        */ "TT_UNDEFINED",
  TT_VAR: /*              */ "TT_VAR",
  TT_WEAK: /*             */ "TT_WEAK",
  TT_WHITESPACE: /*       */ "TT_WHITESPACE",
}

module.exports = {
  ...t,
  TT_TERMINALS: [t.TT_BOOLEAN, t.TT_NULL, t.TT_NUMBER, t.TT_STRING, t.TT_VAR],
  TT_BINARY_OPERATORS: [
    t.TT_ASSIGNMENT,
    t.TT_COMPARE,
    t.TT_DOT,
    t.TT_OPERATOR_INFIX,
  ],
}
