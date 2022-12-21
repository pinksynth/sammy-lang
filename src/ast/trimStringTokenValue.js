// Raw delimiters such as " and } are included in the token value from the lexer. See note in maybeGetStringTokenType.js.
const trimStringTokenValue = (value) => value.substring(1, value.length - 1)

module.exports = trimStringTokenValue
