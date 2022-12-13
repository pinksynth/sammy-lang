const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleHandlerOpen = ({
  node,
  pushToExpressionList,
  setNode,
  swapScope,
}) => {
  swapScope(st.TRY_HANDLER_BODY)
  const child = {
    type: nt.TRY_HANDLER,
    parent: node,
    children: [],
  }
  setNode(child)
  pushToExpressionList(child, st.TRY_HANDLER_BODY)
}

module.exports = handleHandlerOpen
