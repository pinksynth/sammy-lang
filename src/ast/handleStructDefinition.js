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
  token,
}) => {
  if (currentScope !== st.ROOT) {
    throw new Error(
      `Cannot define struct "${nextToken.value}" in scope ${currentScope} on line ${token.lineNumberStart}. Structs may only be defined in the root scope.`
    )
  }
  scopes.push(st.STRUCT_DEFINITION)
  const child = {
    type: nt.STRUCT_DEFINITION,
    name: nextToken.value,
    children: [],
    parent: node,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)

  // The current token is the "struct" keyword, so we can consume the struct name and the opening curly
  consumeExtra()
  consumeExtra()
}

module.exports = handleStructDefinition
