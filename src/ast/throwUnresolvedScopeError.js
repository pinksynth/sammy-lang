const st = require("./scopeTypes")

const throwUnresolvedScopeError = (scopes) => {
  const currentScope = scopes[scopes.length - 1]
  const expectedToken = [st.ARRAY, st.OBJECT_VALUE].includes(currentScope)
    ? '"]"'
    : [
        st.FUNCTION_CALL_ARGS,
        st.FUNCTION_DEC_ARGS,
        st.GENERIC_EXPRESSION,
        st.IF_CONDITION,
      ].includes(currentScope)
    ? '")"'
    : [st.IF_BODY, st.FUNCTION_DEC_BODY, st.IF_ELSE].includes(currentScope)
    ? '"}"'
    : [st.UNARY_OPERATOR, st.BINARY_OPERATOR, st.ASSIGNMENT].includes(
        currentScope
      )
    ? "an expression"
    : "(unknown)"
  // TODO: Implement test
  throw new Error(`Unexpected end of input. Expected ${expectedToken}.`)
}
module.exports = throwUnresolvedScopeError
