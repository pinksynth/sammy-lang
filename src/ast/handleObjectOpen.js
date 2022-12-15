const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleObjectOpen = ({
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  scopes.push(st.OBJECT_KEY)

  const child = {
    type: nt.LITERAL_OBJECT,
    keys: [],
    values: [],
    parent: node,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleObjectOpen
