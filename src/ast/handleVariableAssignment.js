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
    ![
      st.ENUM_DEFINITION,
      st.FUNCTION_DEC_BODY,
      st.IF_BODY,
      st.LAMBDA_BODY,
      st.ROOT,
      st.STRING_INTERPOLATION,
      st.STRUCT_DEFINITION,
    ].includes(currentScope)
  ) {
    // TODO: Implement test
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
    weak: false,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)

  // For normal var assignments, we have consumed both the identifier and the operator, so we'll manually increment the tokens by an extra 1.
  consumeExtra()
}

module.exports = handleVariableAssignment
