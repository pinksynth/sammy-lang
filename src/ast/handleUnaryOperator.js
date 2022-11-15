const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleUnaryOperator = ({
  scopes,
  token,
  node,
  pushToExpressionList,
  setNode,
}) => {
  scopes.push(st.UNARY_OPERATOR)

  const child = {
    operator: token.value,
    parent: node,
    type: nt.UNARY_EXPRESSION,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleUnaryOperator
