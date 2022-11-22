const handleIncrementLinesAndColumns = (state) => {
  if (state.char === "\n") {
    state.currentLineNumber++
    state.currentColumnNumber = 1
    state.currentLineValue = ""
  } else {
    state.currentColumnNumber++
    state.currentLineValue += state.char
  }
}

module.exports = handleIncrementLinesAndColumns
