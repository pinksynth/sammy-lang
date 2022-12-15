const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleUnaryOperator = ({
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  scopes.push(st.UNARY_OPERATOR)

  const child = {
    operator: token.value,
    parent: node,
    type: nt.UNARY_EXPRESSION,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleUnaryOperator
