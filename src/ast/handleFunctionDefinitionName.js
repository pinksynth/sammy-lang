const nt = require("./nodeTypes")
const st = require("./scopeTypes")
const tt = require("../tokenTypes")

const handleFunctiondefinitionName = ({
  consumeExtra,
  nextToken,
  node,
  pushToExpressionList,
  scopes,
  setNode,
  thirdTokenType,
  token,
}) => {
  if (thirdTokenType !== tt.PAREN_OPEN) {
    throw new Error(
      `Syntax Error for function ${nextToken.value} on line ${token.lineNumberStart}`
    )
  }
  scopes.push(st.FUNCTION_DEC_ARGS)
  const child = {
    args: [],
    children: [],
    parent: node,
    name: nextToken.value,
    type: nt.FUNCTION_definition,
    lineNumberStart: token.lineNumberStart,
    columnNumberStart: token.columnNumberStart,
  }
  pushToExpressionList(child)
  setNode(child)

  // For named function definitions, we have consumed the keyword, the name, and the opening paren fot the args, so we'll manually increment the tokens by an extra 2.
  consumeExtra()
  consumeExtra()
}

module.exports = handleFunctiondefinitionName
