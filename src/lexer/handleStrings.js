const ct = require("../characterTypes")
const charTypeFrom = require("../charTypeFrom")

// Use the Interpolation Context Stack to keep track of interpolation contexts.
const handleStrings = (state) => {
  if (state.multilineCommentMode || state.singleLineCommentMode) {
    return
  }
  if (state.charType === ct.CT_DOUBLE_QUOTE) {
    if (state.stringLiteralMode) {
      if (charTypeFrom(state.input[state.index - 1]) !== ct.CT_BACKSLASH) {
        // Found unescaped double quote inside string literal mode. Exit string literal mode.
        state.stringLiteralMode = false
      }
    } else {
      // Found double quote outside string literal mode. Enter string literal mode.
      state.stringLiteralMode = true
    }
  } else if (state.charType === ct.CT_LEFT_CURLY) {
    if (state.stringLiteralMode) {
      if (charTypeFrom(state.input[state.index - 1]) !== ct.CT_BACKSLASH) {
        // Found unescaped left curly while in string literal mode. Exit string literal mode and an interpolation context to the stack.
        state.stringLiteralMode = false
        state.ics.pushContext()
      }
    } else {
      // Found left curly while not in string literal mode. Increment the current interpolation context counter. For example, if this is the third curly we've seen since entering the context, we'll need three corresponding righthand curlies before before we can leave the interpolation context and go back to string mode.
      state.ics.incrementContext()
    }
  } else if (state.charType === ct.CT_RIGHT_CURLY) {
    if (!state.stringLiteralMode) {
      // Encountered righthand curly when not in string literal mode.
      if (state.ics.peek() === 0) {
        // We have 0 unclosed lefthand curlies, so this righthand curly means we're re-entering string mode and popping the current interpolation context.
        state.ics.popContext()
        state.stringLiteralMode = true
      } else {
        // We still have to see more righthand curlies before we're ready to re-enter string mode.
        state.ics.decrementContext()
      }
    }
  }
}

module.exports = handleStrings
