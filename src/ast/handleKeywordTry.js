const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleKeywordTry = ({
  node,
  pushToExpressionList,
  scopes,
  setNode,
  token,
}) => {
  scopes.push(st.TRY_BODY)

  const child = {
    children: [],
    handlers: [],
    handlerPatterns: [],
    parent: node,
    type: nt.TRY_EXPR,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleKeywordTry
