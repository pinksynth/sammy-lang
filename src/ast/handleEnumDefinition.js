const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleEnumDefinition = ({
  consumeExtra,
  currentScope,
  nextToken,
  node,
  pushToExpressionList,
  scopes,
  setNode,
}) => {
  if (currentScope !== st.ROOT) {
    throw new Error(
      `Cannot define enum "${nextToken.value}" in scope ${currentScope}. Enums may only be define in the root scope.`
    )
  }
  scopes.push(st.ENUM_DEFINITION)
  const child = {
    type: nt.ENUM_DEFINITION,
    name: nextToken.value,
    children: [],
    parent: node,
  }
  pushToExpressionList(child)
  setNode(child)

  // The current token is the "enum" keyword, so we can consume the enum name and the opening curly
  consumeExtra()
  consumeExtra()
}

module.exports = handleEnumDefinition
