const ct = require("../characterTypes")
const charTypeFrom = require("../charTypeFrom")

const handleOpenStringInterpolation = (state) => {
  if (!state.stringLiteralMode) return
  const prevChar = state.input[state.index - 1]
  const isEscaped = prevChar && charTypeFrom(prevChar) === ct.CT_BACKSLASH
  if (isEscaped) return
  const isInterpolation = state.charType === ct.CT_LEFT_CURLY
  if (isInterpolation) state.stringLiteralMode = false
}

module.exports = handleOpenStringInterpolation
