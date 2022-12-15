const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleWeakVariableAssignment = ({
  consumeExtra,
  currentScope,
  nextToken,
  nextTokenType,
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
      `Unexpected weak assigment on line ${nextToken.lineNumberStart}: ${nextToken.value}`
    )
  }

  scopes.push(st.ASSIGNMENT)
  const child = {
    children: [],
    parent: node,
    type: nt.ASSIGNMENT,
    variable: nextToken.value,
    weak: true,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)

  // For weak var assignments, we have consumed the "weak" keyword, the identifier, and the operator, so we'll manually increment the tokens by an extra 2.
  consumeExtra()
  consumeExtra()
}

module.exports = handleWeakVariableAssignment
