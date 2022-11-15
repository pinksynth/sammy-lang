const getTerminalNode = require("./getTerminalNode")
const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleFunctionCall = ({
  consumeExtra,
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  scopes.push(st.FUNCTION_CALL_ARGS)
  const child = {
    children: [],
    function: getTerminalNode(token),
    parent: node,
    type: nt.FUNCTION_CALL,
  }
  pushToExpressionList(child)
  setNode(child)

  // For function calls, we have consumed both the function and the opening paren, so we'll manually increment the tokens by an extra 1.
  consumeExtra()
}

module.exports = handleFunctionCall
