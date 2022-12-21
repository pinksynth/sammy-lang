const charTypeFrom = require("../charTypeFrom")
const ct = require("../characterTypes")
const tt = require("../tokenTypes")

/* NOTE: When generating tokens, we use four token types for strings which correspond to the presence of interpolations:
STRING_PURE:            No interpolation. String starts with " and ends with ".
STRING_INTERP_BEFORE:   Before interpolation. String starts with " and ends with {.
STRING_INTERP_BETWEEN:  Between interpolations. String starts with } and ends with {.
STRING_INTERP_AFTER:    After interpolations. String starts with } and ends with ".
So for the following expression:
    "a { b "c" } d { e } f"
The tokens would be:
    <tokenType: STRING_INTERP_BEFORE    value: "a {  >
    <tokenType: VAR                     value: b     >
    <tokenType: STRING_PURE             value: "c"   >
    <tokenType: STRING_INTERP_BETWEEN   value: } d { >
    <tokenType: VAR                     value: e     >
    <tokenType: STRING_INTERP_AFTER     value: } f"  >
*/
const maybeGetStringTokenType = (value) => {
  // First character type
  const ct1 = charTypeFrom(value[0])
  // Last character type
  const ct2 = charTypeFrom(value[value.length - 1])

  if (ct1 === ct.CT_DOUBLE_QUOTE && ct2 === ct.CT_DOUBLE_QUOTE) {
    return tt.STRING_PURE
  } else if (ct1 === ct.CT_DOUBLE_QUOTE && ct2 == ct.CT_LEFT_CURLY) {
    return tt.STRING_INTERP_BEFORE
  } else if (ct1 === ct.CT_RIGHT_CURLY && ct2 == ct.CT_LEFT_CURLY) {
    return tt.STRING_INTERP_BETWEEN
  } else if (ct1 === ct.CT_RIGHT_CURLY && ct2 == ct.CT_DOUBLE_QUOTE) {
    return tt.STRING_INTERP_AFTER
  }

  return false
}

module.exports = maybeGetStringTokenType
