const st = require("./scopeTypes")

const handleKeywordHandle = ({ currentScope, pop, scopes, swapScope }) => {
  if (currentScope === st.TRY_HANDLER_BODY) {
    pop()
  }

  scopes.push(st.TRY_HANDLER_PATTERN)
}

module.exports = handleKeywordHandle
