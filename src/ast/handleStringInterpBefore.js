const nt = require("./nodeTypes")
const st = require("./scopeTypes")
const trimStringTokenValue = require("./trimStringTokenValue")

const handleStringInterpBefore = ({
  node,
  pushToExpressionList,
  setNode,
  scopes,
  token,
}) => {
  scopes.push(st.STRING)

  const child = {
    parent: node,
    type: nt.LITERAL_STRING,
    subStrings: [trimStringTokenValue(token.value)],
    interpolations: [],
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }

  pushToExpressionList(child)

  scopes.push(st.STRING_INTERPOLATION)

  const interpolation = {
    parent: child,
    type: nt.STRING_INTERPOLATION,
    children: [],
  }

  child.interpolations.push(interpolation)

  setNode(interpolation)
}

module.exports = handleStringInterpBefore
