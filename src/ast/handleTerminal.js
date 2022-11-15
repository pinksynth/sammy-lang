const getTerminalNode = require("./getTerminalNode")
const st = require("./scopeTypes")

const handleTerminal = ({ currentScope, pop, pushToExpressionList, token }) => {
  pushToExpressionList(getTerminalNode(token))

  if (
    currentScope === st.ASSIGNMENT ||
    currentScope === st.UNARY_OPERATOR ||
    currentScope === st.BINARY_OPERATOR
  ) {
    pop()
  }
}

module.exports = handleTerminal
