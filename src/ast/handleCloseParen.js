const st = require("./scopeTypes")

const handleCloseParen = ({ currentScope, pop, token }) => {
  if (
    ![
      st.FUNCTION_CALL_ARGS,
      st.FUNCTION_DEC_ARGS,
      st.GENERIC_EXPRESSION,
      st.IF_CONDITION,
    ].includes(currentScope)
  ) {
    throw new Error(
      `Unexpected closing bracket ")" on line ${token.lineNumberStart}`
    )
  }
  pop()
}

module.exports = handleCloseParen
