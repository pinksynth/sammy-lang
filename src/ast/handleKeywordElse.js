const st = require("./scopeTypes")

const handleKeywordElse = ({ consumeExtra, swapScope }) => {
  swapScope(st.IF_ELSE)

  // We are consuming the "if" body's closing curly, the "else" keyword, and the "else" opening curly, so increment by 2 extra tokens.
  consumeExtra()
  consumeExtra()
}

module.exports = handleKeywordElse
