const ct = require("../characterTypes")
const charTypeFrom = require("../charTypeFrom")

const handleDoubleQuote = (state) => {
  if (state.charType === ct.CT_DOUBLE_QUOTE) {
    if (state.stringLiteralMode) {
      if (charTypeFrom(state.input[state.index - 1]) !== ct.CT_BACKSLASH) {
        state.stringLiteralMode = false
      }
    } else {
      state.stringLiteralMode = true
    }
  }
}

module.exports = handleDoubleQuote
