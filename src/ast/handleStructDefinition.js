const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleStructDefinition = ({
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
      `Cannot declare struct "${nextToken.value}" in scope ${currentScope}. Structs may only be declared in the root scope.`
    )
  }
  scopes.push(st.STRUCT)
  const child = {
    type: nt.STRUCT,
    name: nextToken.value,
    children: [],
    parent: node,
  }
  pushToExpressionList(child)
  setNode(child)

  // The current token is the "struct" keyword, so we can consume the struct name and the opening curly
  consumeExtra()
  consumeExtra()
}

module.exports = handleStructDefinition
