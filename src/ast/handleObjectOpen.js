const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleObjectOpen = ({ node, pushToExpressionList, scopes, setNode }) => {
  scopes.push(st.OBJECT_KEY)

  const child = {
    keys: [],
    values: [],
    parent: node,
    type: nt.LITERAL_OBJECT,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleObjectOpen
