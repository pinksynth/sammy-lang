const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleGenericExpressionOpen = ({
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  scopes.push(st.GENERIC_EXPRESSION)
  const child = {
    type: nt.GENERIC_EXPRESSION,
    parent: node,
    children: [],
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }

  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleGenericExpressionOpen
