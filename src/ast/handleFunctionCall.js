const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleFunctionCall = ({
  appendedScopes,
  callableLeftSibling,
  scopes,
  setNode,
}) => {
  for (const scope of appendedScopes) scopes.push(scope)
  // Note that if callableLeftSibling involved drilling into any binary expression scopes, those have already been pushed.
  scopes.push(st.FUNCTION_CALL_ARGS)

  // There might be a prettier way to do this. But for now, we take the callable left sibling and mutate it into the actual function call node, while preserving its properties and putting them in a "callee" object.
  const callee = {
    ...callableLeftSibling,
    parent: callableLeftSibling,
  }

  delete callableLeftSibling.type
  delete callableLeftSibling.value
  delete callableLeftSibling.left
  delete callableLeftSibling.right
  delete callableLeftSibling.operator
  callableLeftSibling.type = nt.FUNCTION_CALL
  callableLeftSibling.function = callee
  callableLeftSibling.children = []

  setNode(callableLeftSibling)
}

module.exports = handleFunctionCall
