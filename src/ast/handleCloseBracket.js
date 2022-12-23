const st = require("./scopeTypes")

const handleCloseBracket = ({ currentScope, pop, token }) => {
  if (![st.ARRAY, st.MAP_VALUE].includes(currentScope)) {
    // TODO: Implement test
    throw new Error(
      `Unexpected closing bracket "]" on line ${token.lineNumberStart}`
    )
  }
  pop()
}

module.exports = handleCloseBracket
