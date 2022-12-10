const nt = require("./nodeTypes")
const st = require("./scopeTypes")

// If we find that our lefthand sibling is callable but is nested within binary expressions (such as `a + b()` or `a.b()` or `a * b.c()`, etc), we push "BINARY_OPERATOR" to current scopes as many times as necessary.
const getCallable = (leftSiblingExpression, appendedScopes = []) => {
  // Identifiers are callable.
  if (leftSiblingExpression.type === nt.IDENTIFIER) {
    return [leftSiblingExpression, appendedScopes]
  }

  // Property access is considered callable.
  if (
    leftSiblingExpression.type === nt.BINARY_EXPR &&
    leftSiblingExpression.operator === "."
  ) {
    return [leftSiblingExpression, appendedScopes]
  }

  // For binary expressions, keep recursing through the righthand side to see if we find a callable.
  const right = leftSiblingExpression.right

  if (right && right.type === nt.BINARY_EXPR) {
    // if (right) {
    appendedScopes.push(st.BINARY_OPERATOR)
    return getCallable(right, appendedScopes)
  } else {
    // Left sibling in current scope is not callable.
    return [false, []]
  }
}

const prepareCallableLeftSibling = ({ currentExpressionList, scopes }) => {
  if (!currentExpressionList) return false

  const leftSiblingExpression =
    currentExpressionList[currentExpressionList.length - 1]

  if (!leftSiblingExpression) return false

  const [callee, appendedScopes] = getCallable(leftSiblingExpression)
  // debugConsole.log("callee", callee)
  // debugConsole.log("appendedScopes", appendedScopes)
  if (callee) {
    for (const scope of appendedScopes) scopes.push(scope)
  }

  return callee
}

module.exports = prepareCallableLeftSibling
