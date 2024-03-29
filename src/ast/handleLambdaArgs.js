const getTerminalNode = require("./getTerminalNode")
const st = require("./scopeTypes")
const tt = require("../tokenTypes")

const handleLambdaArgs = ({ node, swapScope, token, tokenType }) => {
  if (tt.TERMINALS.includes(tokenType)) {
    node.args.push(getTerminalNode({ parent: node, token }))

    return
  } else if (tokenType === tt.CURLY_OPEN) {
    // Note that unlike other things, our scope changes but the parent node (the lambda) does not change.
    swapScope(st.LAMBDA_BODY)

    return
  } else {
    // TODO: Implement test
    throw new Error(
      `Unexpected token "${token.value}" when defining a function on line ${token.lineNumberStart}`
    )
  }
}
module.exports = handleLambdaArgs
