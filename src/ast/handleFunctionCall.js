const getCurrentExpressionListForScope = require("./getCurrentExpressionListForScope")
const getTerminalNode = require("./getTerminalNode")
const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleFunctionCall = ({
  currentExpressionList,
  node,
  pushToExpressionList,
  scopes,
  setNode,
}) => {
  scopes.push(st.FUNCTION_CALL_ARGS)
  const functionIdentifier = currentExpressionList.pop()
  const child = {
    type: nt.FUNCTION_CALL,
    function: functionIdentifier,
    children: [],
    parent: node,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleFunctionCall
