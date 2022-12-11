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
  let siblingDescendant, scope
  if (leftSiblingExpression.type === nt.BINARY_EXPR) {
    siblingDescendant = leftSiblingExpression.right
    scope = st.ASSIGNMENT
  } else if (leftSiblingExpression.type === nt.ASSIGNMENT) {
    // FIXME: Assignments should have one descendant under a "value" property, not a "children" list.
    siblingDescendant = leftSiblingExpression.children[0]
    scope = st.BINARY_OPERATOR
  }

  if (siblingDescendant) {
    appendedScopes.push(scope)
    return getCallable(siblingDescendant, appendedScopes)
  } else {
    // Left sibling in current scope is not callable.
    return [false, []]
  }
}

const prepareCallableLeftSibling = (currentExpressionList) => {
  if (!currentExpressionList) return [false, []]

  const leftSiblingExpression =
    currentExpressionList[currentExpressionList.length - 1]

  if (!leftSiblingExpression) return [false, []]

  const [callee, appendedScopes] = getCallable(leftSiblingExpression)

  return [callee, appendedScopes]
}

module.exports = prepareCallableLeftSibling
