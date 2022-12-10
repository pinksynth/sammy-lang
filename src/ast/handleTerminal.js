const getTerminalNode = require("./getTerminalNode")
const st = require("./scopeTypes")

const handleTerminal = ({
  currentScope,
  node,
  pop,
  pushToExpressionList,
  token,
}) => {
  pushToExpressionList(getTerminalNode({ parent: node, token }))

  if (
    currentScope === st.ASSIGNMENT ||
    currentScope === st.UNARY_OPERATOR ||
    currentScope === st.BINARY_OPERATOR
  ) {
    pop()
  }
}

module.exports = handleTerminal
