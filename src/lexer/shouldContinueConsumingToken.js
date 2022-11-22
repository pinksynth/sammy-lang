const ct = require("../characterTypes")

// Uses the current state and accumulated characters to determine whether the next character should be a part of the current token.
const shouldContinueConsumingToken = ({
  charType,
  lambdaArgIdentifierMode,
  latestCharType,
  multilineCommentMode,
  numberFloatingPointApplied,
  numberMode,
  singleLineCommentMode,
  stringLiteralMode,
}) => {
  if (stringLiteralMode) {
    return true
  }
  if (singleLineCommentMode) {
    return true
  }
  if (multilineCommentMode) {
    return true
  }

  if (latestCharType === ct.CT_WHITESPACE && charType === ct.CT_WHITESPACE) {
    return true
  }
  if (
    (latestCharType === ct.CT_IDENTIFIER ||
      latestCharType === ct.CT_UNDERSCORE) &&
    (charType === ct.CT_IDENTIFIER || charType === ct.CT_UNDERSCORE)
  ) {
    return true
  }
  if (latestCharType === ct.CT_IDENTIFIER && charType === ct.CT_IDENTIFIER) {
    return true
  }
  if (lambdaArgIdentifierMode && charType === ct.CT_NUMBER) {
    return true
  }
  if (numberMode) {
    if (charType === ct.CT_PERIOD && !numberFloatingPointApplied) {
      return true
    }
    if (charType === ct.CT_NUMBER || charType === ct.CT_UNDERSCORE) {
      return true
    }
  }
  if (latestCharType === ct.CT_LESS_THAN && charType === ct.CT_LESS_THAN) {
    return true
  }
  if (
    latestCharType === ct.CT_GREATER_THAN &&
    charType === ct.CT_GREATER_THAN
  ) {
    return true
  }
  if (latestCharType === ct.CT_PERCENT && charType === ct.CT_LEFT_BRACKET) {
    // input object syntax: %[ ]
    return true
  }
  if (latestCharType === ct.CT_EQUALS && charType === ct.CT_EQUALS) {
    return true
  }
  if (latestCharType === ct.CT_AMPERSAND && charType === ct.CT_AMPERSAND) {
    return true
  }
  if (latestCharType === ct.CT_PIPE && charType === ct.CT_PIPE) {
    return true
  }
  // >=, <=, !=
  if (
    (latestCharType === ct.CT_GREATER_THAN && charType === ct.CT_EQUALS) ||
    (latestCharType === ct.CT_LESS_THAN && charType === ct.CT_EQUALS) ||
    (latestCharType === ct.CT_BANG && charType === ct.CT_EQUALS)
  ) {
    return true
  }
  if (latestCharType === ct.CT_PERIOD && charType === ct.CT_PERIOD) {
    return true
  }

  return false
}

module.exports = shouldContinueConsumingToken
