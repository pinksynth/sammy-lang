const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleObjectOpen = ({ node, pushToExpressionList, scopes, setNode }) => {
  scopes.push(st.OBJECT_KEY)

  const child = {
    type: nt.LITERAL_OBJECT,
    keys: [],
    values: [],
    parent: node,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleObjectOpen
