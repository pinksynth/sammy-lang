const ct = require("../characterTypes")

const handleOpenSingleLineComment = (state) => {
  if (state.charType === ct.CT_HASH && !state.stringLiteralMode) {
    state.singleLineCommentMode = true
  }
}

module.exports = handleOpenSingleLineComment
