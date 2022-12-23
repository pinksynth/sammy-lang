const getTerminalNode = require("./getTerminalNode")
const st = require("./scopeTypes")
const tt = require("../tokenTypes")

const handleFunctiondefinitionArgs = ({
  consumeExtra,
  nextToken,
  nextTokenType,
  node,
  swapScope,
  token,
  tokenType,
}) => {
  if (tt.TERMINALS.includes(tokenType)) {
    node.args.push(getTerminalNode({ parent: node, token }))

    return
  } else if (tokenType === tt.PAREN_CLOSE) {
    if (nextTokenType !== tt.CURLY_OPEN) {
      // TODO: Implement test
      throw new Error(
        `Unexpected token "${nextToken.value}" when defining a function on line ${token.lineNumberStart}`
      )
    }

    // When going from function definition arguments to the body, we consume the closing paren and opening curly brace ") {", so increment the index by an extra 1.
    consumeExtra()

    // Note that unlike other things, our scope changes but the parent node (the function definition) does not change.
    swapScope(st.FUNCTION_DEC_BODY)

    return
  } else {
    // TODO: Implement test
    throw new Error(
      `Unexpected token "${nextToken.value}" when defining function arguments on line ${token.lineNumberStart}`
    )
  }
}

module.exports = handleFunctiondefinitionArgs
