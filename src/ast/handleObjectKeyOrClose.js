const st = require("./scopeTypes")
const tt = require("../tokenTypes")
const getTerminalNode = require("./getTerminalNode")

const handleObjectKeyOrClose = ({
  consumeExtra,
  nextToken,
  nextTokenType,
  pop,
  pushToExpressionList,
  swapScope,
  token,
  tokenType,
}) => {
  if (tt.TERMINALS.includes(tokenType)) {
    if (nextTokenType === tt.COLON) {
      pushToExpressionList(getTerminalNode(token))
      swapScope(st.OBJECT_VALUE)
      // We have consumed the key as well as the colon, so increment the tokens by an extra one.
      consumeExtra()

      return
    } else {
      throw new Error(
        `Syntax Error inside object literal. Unexpected token ${nextToken.value} (${nextTokenType}) on line ${nextToken.lineNumberStart}`
      )
    }
  } else if (tokenType === tt.BRACKET_CLOSE) {
    pop()

    return
  } else {
    throw new Error(
      `Syntax Error inside object literal. Unexpected token ${token.value} (${tokenType}) on line ${token.lineNumberStart}`
    )
  }
}

module.exports = handleObjectKeyOrClose
