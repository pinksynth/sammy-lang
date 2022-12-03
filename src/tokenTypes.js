// Token types
const t = {
  ASSIGNMENT: /*               */ "ASSIGNMENT",
  BANG: /*                     */ "BANG",
  BOOLEAN: /*                  */ "BOOLEAN",
  BRACKET_CLOSE: /*            */ "BRACKET_CLOSE",
  BRACKET_OPEN: /*             */ "BRACKET_OPEN",
  COLON: /*                    */ "COLON",
  COMMA: /*                    */ "COMMA",
  COMMENT: /*                  */ "COMMENT",
  COMPARE: /*                  */ "COMPARE",
  CONCISE_LAMBDA_ARGUMENT: /*  */ "CONCISE_LAMBDA_ARGUMENT",
  CURLY_CLOSE: /*              */ "CURLY_CLOSE",
  CURLY_OPEN: /*               */ "CURLY_OPEN",
  DOT: /*                      */ "DOT",
  ELSE: /*                     */ "ELSE",
  FORWARD_PIPE: /*             */ "FORWARD_PIPE",
  FUNCTION: /*                 */ "FUNCTION",
  HYPHEN: /*                   */ "HYPHEN",
  IF: /*                       */ "IF",
  LAMBDA_OPEN: /*              */ "LAMBDA_OPEN",
  NULL: /*                     */ "NULL",
  NUMBER: /*                   */ "NUMBER",
  OBJECT_OPEN: /*              */ "OBJECT_OPEN",
  OPERATOR_INFIX: /*           */ "OPERATOR_INFIX",
  PAREN_CLOSE: /*              */ "PAREN_CLOSE",
  PAREN_OPEN: /*               */ "PAREN_OPEN",
  STRING: /*                   */ "STRING",
  UNDEFINED: /*                */ "UNDEFINED",
  VAR: /*                      */ "VAR",
  WEAK: /*                     */ "WEAK",
  WHITESPACE: /*               */ "WHITESPACE",
}

const tt = {
  ...t,
  TERMINALS: [
    t.BOOLEAN,
    t.CONCISE_LAMBDA_ARGUMENT,
    t.NULL,
    t.NUMBER,
    t.STRING,
    t.VAR,
  ],
  BINARY_OPERATORS: [
    t.ASSIGNMENT,
    t.COMPARE,
    t.DOT,
    t.FORWARD_PIPE,
    t.OPERATOR_INFIX,
    t.HYPHEN,
  ],
  //
  //
  // FIXME: SAMMY! Some tokens, such as "-", can be binary or unary operators depending on their context. I think that the only context necessary is to determine whether there is a left sibling node.
  //
  //
  UNARY_OPERATORS: [t.HYPHEN, t.BANG],
}

module.exports = tt
