const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleArrayOpen = ({ node, pushToExpressionList, scopes, setNode }) => {
  scopes.push(st.ARRAY)
  const child = { type: nt.LITERAL_ARRAY, parent: node, children: [] }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleArrayOpen
