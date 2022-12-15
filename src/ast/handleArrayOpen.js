const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleArrayOpen = ({
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  scopes.push(st.ARRAY)
  const child = {
    type: nt.LITERAL_ARRAY,
    parent: node,
    children: [],
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleArrayOpen
