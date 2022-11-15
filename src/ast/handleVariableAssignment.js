const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleVariableAssignment = ({
  consumeExtra,
  currentScope,
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  if (
    ![st.FUNCTION_DEC_BODY, st.IF_BODY, st.LAMBDA_BODY, st.ROOT].includes(
      currentScope
    )
  ) {
    throw new Error(
      `Unexpected assigment on line ${token.lineNumberStart}: ${token.value}`
    )
  }

  scopes.push(st.ASSIGNMENT)
  const child = {
    children: [],
    parent: node,
    type: nt.ASSIGNMENT,
    variable: token.value,
  }
  pushToExpressionList(child)
  setNode(child)

  // For normal var assignments, we have consumed both the identifier and the operator, so we'll manually increment the tokens by an extra 1.
  consumeExtra()
}

module.exports = handleVariableAssignment
