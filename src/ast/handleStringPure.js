const nt = require("./nodeTypes")
const { operandScopeTypes } = require("./scopeTypes")
const trimStringTokenValue = require("./trimStringTokenValue")

const handleStringPure = ({
  currentScope,
  node,
  pop,
  pushToExpressionList,
  token,
}) => {
  const child = {
    parent: node,
    type: nt.LITERAL_STRING,
    subStrings: [trimStringTokenValue(token.value)],
    interpolations: [],
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }

  pushToExpressionList(child)

  if (operandScopeTypes.includes(currentScope)) pop()
}

module.exports = handleStringPure
