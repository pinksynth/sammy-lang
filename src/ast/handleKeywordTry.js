const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const handleKeywordTry = ({ node, pushToExpressionList, scopes, setNode }) => {
  scopes.push(st.TRY_BODY)

  const child = {
    children: [],
    handlers: [],
    handlerPatterns: [],
    parent: node,
    type: nt.TRY_EXPR,
  }
  pushToExpressionList(child)
  setNode(child)
}

module.exports = handleKeywordTry
