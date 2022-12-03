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
  // "String literal mode"
  if (stringLiteralMode) return true
  // # Single line comment
  if (singleLineCommentMode) return true
  // <<< Multiline
  //     Comment >>>
  if (multilineCommentMode) return true
  // Adjacent whitespace is grouped together into a single token
  if (latestCharType === ct.CT_WHITESPACE && charType === ct.CT_WHITESPACE) {
    return true
  }
  // Alpha characters and underscores are considered part of identifiers
  if (
    (latestCharType === ct.CT_IDENTIFIER ||
      latestCharType === ct.CT_UNDERSCORE) &&
    (charType === ct.CT_IDENTIFIER || charType === ct.CT_UNDERSCORE)
  ) {
    return true
  }
  // Concise lambda argument syntax, such as $1 or $23
  if (lambdaArgIdentifierMode && charType === ct.CT_NUMBER) {
    return true
  }
  if (numberMode) {
    // Number encountering a period if one has not already been encountered, such as 90.5
    if (charType === ct.CT_PERIOD && !numberFloatingPointApplied) {
      return true
    }
    // Number encountering an underscore to be used as a thousands separator, such as in 1_230_000
    if (charType === ct.CT_NUMBER || charType === ct.CT_UNDERSCORE) {
      return true
    }
  }
  // Group "less than" signs together for opening multiline comments: <<<
  if (latestCharType === ct.CT_LESS_THAN && charType === ct.CT_LESS_THAN) {
    return true
  }
  // Group "greater than" signs together for opening multiline comments: >>>
  if (
    latestCharType === ct.CT_GREATER_THAN &&
    charType === ct.CT_GREATER_THAN
  ) {
    return true
  }
  // Opening a map literal via "%["
  if (latestCharType === ct.CT_PERCENT && charType === ct.CT_LEFT_BRACKET) {
    return true
  }
  // Assignment via "=", as in "foo = bar"
  if (latestCharType === ct.CT_EQUALS && charType === ct.CT_EQUALS) {
    return true
  }
  // Logical "and" via "&&"
  if (latestCharType === ct.CT_AMPERSAND && charType === ct.CT_AMPERSAND) {
    return true
  }
  // Logical "or" via "||"
  if (latestCharType === ct.CT_PIPE && charType === ct.CT_PIPE) {
    return true
  }
  // Comparison operators ">=", "<=", and "!="
  if (
    (latestCharType === ct.CT_GREATER_THAN && charType === ct.CT_EQUALS) ||
    (latestCharType === ct.CT_LESS_THAN && charType === ct.CT_EQUALS) ||
    (latestCharType === ct.CT_BANG && charType === ct.CT_EQUALS)
  ) {
    return true
  }
  // Range operator via ".."
  if (latestCharType === ct.CT_PERIOD && charType === ct.CT_PERIOD) {
    return true
  }
  // Pipe operator via "->"
  if (latestCharType === ct.CT_HYPHEN && charType === ct.CT_GREATER_THAN) {
    return true
  }

  return false
}

module.exports = shouldContinueConsumingToken
