const pushToken = (token, state) => {
  state.tokens.push(token)
  state.tokenLineNumberStart = state.currentLineNumber
  state.tokenColumnNumberStart = state.currentColumnNumber
  state.charAccumulator = []
}

module.exports = pushToken
