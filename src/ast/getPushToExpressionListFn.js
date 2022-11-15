const st = require("./scopeTypes")

const getPushToExpressionListFn =
  ({ currentExpressionList, currentScope, node, token }) =>
  (childNode) => {
    if (currentScope === st.OBJECT_VALUE) {
      if (node.keys.length === node.values.length + 1) {
        currentExpressionList.push(childNode)
      } else {
        throw new Error(
          `Invalid expression ${token.value} on line ${token.lineNumberStart}. Expected "]" or ",".`
        )
      }
      // For binary operators, we do not push to a list but instead just define the right operand.
    } else if (currentScope === st.BINARY_OPERATOR) {
      node.right = childNode
    } else if (currentScope === st.UNARY_OPERATOR) {
      node.operand = childNode
    } else {
      currentExpressionList.push(childNode)
    }
  }

module.exports = getPushToExpressionListFn
