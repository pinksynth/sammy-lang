const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleKeywordIf = ({
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  scopes.push(st.IF_CONDITION)

  const child = {
    condition: [],
    children: [],
    else: [],
    parent: node,
    type: nt.IF_EXPR,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleKeywordIf
