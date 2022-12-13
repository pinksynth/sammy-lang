const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleStructLiteral = ({
  consumeExtra,
  nextToken,
  node,
  pushToExpressionList,
  setNode,
  scopes,
}) => {
  scopes.push(st.OBJECT_KEY)

  const child = {
    type: nt.LITERAL_STRUCT,
    structType: nextToken.value,
    keys: [],
    values: [],
    parent: node,
  }
  pushToExpressionList(child)
  setNode(child)

  // Current token is the %, so we consume the struct type as well as the opening bracket
  consumeExtra()
  consumeExtra()
}

module.exports = handleStructLiteral
