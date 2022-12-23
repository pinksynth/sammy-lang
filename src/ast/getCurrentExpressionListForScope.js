const st = require("./scopeTypes")

const getCurrentExpressionListForScope = ({ currentScope, node }) => {
  let currentExpressionList = node.children
  if (currentScope === st.IF_CONDITION) {
    currentExpressionList = node.condition
  } else if (currentScope === st.MAP_KEY) {
    currentExpressionList = node.keys
  } else if (currentScope === st.MAP_VALUE) {
    currentExpressionList = node.values
  } else if (currentScope === st.IF_ELSE) {
    currentExpressionList = node.else
  } else if (currentScope === st.TRY_HANDLER_PATTERN) {
    currentExpressionList = node.handlers
  } else if (currentScope === st.BINARY_OPERATOR) {
    currentExpressionList = undefined
  } else if (currentScope === st.UNARY_OPERATOR) {
    currentExpressionList = undefined
  }

  return currentExpressionList
}

module.exports = getCurrentExpressionListForScope
