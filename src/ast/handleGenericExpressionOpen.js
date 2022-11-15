const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleGenericExpressionOpen = ({
  node,
  pushToExpressionList,
  scopes,
  setNode,
}) => {
  scopes.push(st.GENERIC_EXPRESSION)
  const child = {
    type: nt.GENERIC_EXPRESSION,
    parent: node,
    children: [],
  }

  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleGenericExpressionOpen
