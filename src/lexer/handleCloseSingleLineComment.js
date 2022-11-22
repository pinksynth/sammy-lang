const handleCloseSingleLineComment = (state) => {
  if (state.char === "\n" && state.singleLineCommentMode) {
    state.singleLineCommentMode = false
  }
}

module.exports = handleCloseSingleLineComment
