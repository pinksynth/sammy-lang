const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleMapOpen = ({
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  scopes.push(st.MAP_KEY)

  const child = {
    type: nt.LITERAL_MAP,
    keys: [],
    values: [],
    parent: node,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleMapOpen
