const ct = require("../characterTypes")

const handleCloseMultilineComment = (state) => {
  if (
    state.charType === ct.CT_GREATER_THAN &&
    !state.stringLiteralMode &&
    state.charAccumulator
      .join("")
      .substring(state.charAccumulator.length - 2) === ">>"
  ) {
    state.multilineCommentMode = false
  }
}

module.exports = handleCloseMultilineComment
