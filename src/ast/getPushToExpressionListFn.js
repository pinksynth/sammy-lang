const st = require("./scopeTypes")

const getPushToExpressionListFn =
  ({ currentExpressionList, currentScope, node, token }) =>
  (childNode, scopeOverride) => {
    // FIXME: The lines between this function and the currentExpressionList function are becoming pretty blurred. This whole override thing feely really smelly. It's probably time to clean stuff up.
    const scope = scopeOverride || currentScope

    // We want one expression per key in object literals.
    if (
      scope === st.OBJECT_VALUE &&
      node.keys.length !== node.values.length + 1
    ) {
      throw new Error(
        `Invalid expression ${token.value} on line ${token.lineNumberStart}. Expected "]" or ",".`
      )
    }

    // For binary operators, we do not push to a list but instead just define the right operand.
    if (scope === st.BINARY_OPERATOR) {
      node.right = childNode
      return
    }

    if (scope === st.UNARY_OPERATOR) {
      node.operand = childNode
      return
    }

    if (
      scope === st.TRY_HANDLER_PATTERN &&
      node.handlers.length !== node.handlerPatterns.length
    ) {
      throw new Error(
        `Invalid expression ${token.value} on line ${token.lineNumberStart}. Expected a colon to open an error handler.`
      )
    }

    if (scope === st.TRY_HANDLER_PATTERN) {
      node.handlerPatterns.push(childNode)
      return
    }

    currentExpressionList.push(childNode)
    return
  }

module.exports = getPushToExpressionListFn
