const st = require("./scopeTypes")

const handleKeywordEnd = ({ currentScope, pop, token }) => {
  if (![st.TRY_BODY].includes(currentScope)) {
    throw new Error(`Unexpected keyword "end" on line ${token.lineNumberStart}`)
  }
  pop()
}

module.exports = handleKeywordEnd
