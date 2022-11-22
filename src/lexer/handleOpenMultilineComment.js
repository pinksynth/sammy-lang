const ct = require("../characterTypes")

const handleOpenMultilineComment = (state) => {
  if (
    state.charType === ct.CT_LESS_THAN &&
    !state.stringLiteralMode &&
    !state.singleLineCommentMode &&
    state.charAccumulator.join("") === "<<"
  ) {
    state.multilineCommentMode = true
  }
}

module.exports = handleOpenMultilineComment
