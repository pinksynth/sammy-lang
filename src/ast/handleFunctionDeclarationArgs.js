const getTerminalNode = require("./getTerminalNode")
const st = require("./scopeTypes")
const tt = require("../tokenTypes")

const handleFunctionDeclarationArgs = ({
  consumeExtra,
  nextToken,
  nextTokenType,
  node,
  swapScope,
  token,
  tokenType,
}) => {
  if (tt.TERMINALS.includes(tokenType)) {
    node.args.push(getTerminalNode(token))

    return
  } else if (tokenType === tt.PAREN_CLOSE) {
    if (nextTokenType !== tt.CURLY_OPEN) {
      throw new Error(
        `Unexpected token "${nextToken.value}" when defining a function on line ${token.lineNumberStart}`
      )
    }

    // When going from function declaration arguments to the body, we consume the closing paren and opening curly brace ") {", so increment the index by an extra 1.
    consumeExtra()

    // Note that unlike other things, our scope changes but the parent node (the function declaration) does not change.
    swapScope(st.FUNCTION_DEC_BODY)

    return
  } else {
    throw new Error(
      `Unexpected token "${nextToken.value}" when declaring function arguments on line ${token.lineNumberStart}`
    )
  }
}

module.exports = handleFunctionDeclarationArgs
