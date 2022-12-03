const nt = require("./nodeTypes")

const leftSiblingIsCallable = (currentExpressionList) => {
  const leftSiblingExpression =
    currentExpressionList[currentExpressionList.length - 1]
  if (!leftSiblingExpression) return

  const { type, operator } = leftSiblingExpression
  const isMethodCall = type === nt.BINARY_EXPR && operator === "."
  const isLiteralCall = type === nt.IDENTIFIER
  return isMethodCall || isLiteralCall
}

module.exports = leftSiblingIsCallable
