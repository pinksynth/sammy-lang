const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleLambdaOpen = ({
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  scopes.push(st.LAMBDA_ARGS)

  const child = {
    args: [],
    children: [],
    parent: node,
    type: nt.LAMBDA,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleLambdaOpen
