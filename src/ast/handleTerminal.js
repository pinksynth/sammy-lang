const getTerminalNode = require("./getTerminalNode")
const { operandScopeTypes } = require("./scopeTypes")

const handleTerminal = ({
  currentScope,
  node,
  pop,
  pushToExpressionList,
  token,
}) => {
  pushToExpressionList(getTerminalNode({ parent: node, token }))

  if (operandScopeTypes.includes(currentScope)) pop()
}

module.exports = handleTerminal
