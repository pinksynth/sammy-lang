/* global console */

const {
  TT_WHITESPACE,
  TT_VAR,
  TT_PAREN_OPEN,
  TT_BRACKET_OPEN,
  TT_NUMBER,
  TT_BOOLEAN,
  TT_NULL,
  TT_BRACKET_CLOSE,
  TT_OPERATOR_INFIX,
  TT_BINARY_OPERATORS,
  TT_TERMINALS,
  TT_UNDEFINED,
  TT_STRING,
  TT_PAREN_CLOSE,
} = require("./tokenTypes")

// AST Node Types
const NT_BINARY_EXPR /*            */ = "NT_BINARY_EXPR"
const NT_DOT_ACCESS_EXPR /*        */ = "NT_DOT_ACCESS_EXPR"
const NT_FUNCTION_CALL /*          */ = "NT_FUNCTION_CALL"
const NT_FUNCTION_DECLARATION /*   */ = "NT_FUNCTION_DECLARATION"
const NT_IDENTIFIER /*             */ = "NT_IDENTIFIER"
const NT_IF_EXPR /*                */ = "NT_IF_EXPR"
const NT_LITERAL_ARRAY /*          */ = "NT_LITERAL_ARRAY"
const NT_LITERAL_BOOLEAN /*        */ = "NT_LITERAL_BOOLEAN"
const NT_LITERAL_NULL /*           */ = "NT_LITERAL_NULL"
const NT_LITERAL_NUMBER /*         */ = "NT_LITERAL_NUMBER"
const NT_LITERAL_OBJECT /*         */ = "NT_LITERAL_OBJECT"
const NT_LITERAL_STRING /*         */ = "NT_LITERAL_STRING"
const NT_LITERAL_UNDEFINED /*      */ = "NT_LITERAL_UNDEFINED"
const NT_ROOT /*                   */ = "NT_ROOT"
const NT_TERNARY_EXPR /*           */ = "NT_TERNARY_EXPR"

// Scope types
const ST_ARRAY /*                  */ = "ST_ARRAY"
const ST_FUNCTION_CALL_ARGS /*     */ = "ST_FUNCTION_CALL_ARGS"
const ST_FUNCTION_DEC_ARGS /*      */ = "ST_FUNCTION_DEC_ARGS"
const ST_FUNCTION_DEC_BODY /*      */ = "ST_FUNCTION_DEC_BODY"
const ST_IF_BODY /*                */ = "ST_IF_BODY"
const ST_IF_CONDITION /*           */ = "ST_IF_CONDITION"
const ST_OBJECT /*                 */ = "ST_OBJECT"

const getNodeFromToken = ({ value, tokenType }) => {
  let type
  switch (tokenType) {
    case TT_BOOLEAN:
      type = NT_LITERAL_BOOLEAN
      break
    case TT_NULL:
      type = NT_LITERAL_NULL
      break
    case TT_UNDEFINED:
      type = NT_LITERAL_UNDEFINED
      break
    case TT_STRING:
      type = NT_LITERAL_STRING
      break
    case TT_NUMBER:
      type = NT_LITERAL_NUMBER
      break
    case TT_VAR:
      type = NT_IDENTIFIER
      break
    default:
      throw new Error(`Invalid type ${tokenType}`)
  }
  return {
    type,
    value,
  }
}

const getAstFromTokens = (tokens) => {
  const ast = { type: NT_ROOT, children: [] }
  const scopes = []
  tokens = tokens.filter((t) => t.tokenType !== TT_WHITESPACE)

  let node = ast
  const pop = () => {
    scopes.pop()
    const tmp = node
    node = node.parent
    delete tmp.parent
  }

  for (let index = 0; index < tokens.length; index++) {
    const currentScope = scopes[scopes.length - 1]
    console.log("---------")
    const token = tokens[index],
      tokenType = token.tokenType,
      nextToken = tokens[index + 1],
      nextTokenType = nextToken && nextToken.tokenType
    console.log(token.value, tokenType)
    // console.log("node", node)
    if (tokenType === TT_VAR && nextTokenType === TT_PAREN_OPEN) {
      scopes.push(ST_FUNCTION_CALL_ARGS)
      const child = {
        function: getNodeFromToken(token),
        type: NT_FUNCTION_CALL,
        parent: node,
        children: [],
      }
      node.children.push(child)
      node = child

      continue
    }
    if (tokenType === TT_PAREN_CLOSE) {
      if (
        ![
          ST_FUNCTION_CALL_ARGS,
          ST_IF_CONDITION,
          ST_FUNCTION_DEC_ARGS,
        ].includes(currentScope)
      ) {
        throw new Error(
          `Unexpected closing bracket ")" on line ${token.lineNumberStart}`
        )
      }
      pop()

      continue
    }
    if (tokenType === TT_BRACKET_OPEN) {
      scopes.push(ST_ARRAY)
      const child = { type: NT_LITERAL_ARRAY, parent: node, children: [] }
      node.children.push(child)
      node = child

      continue
    }
    if (tokenType === TT_BRACKET_CLOSE) {
      if (![ST_ARRAY, ST_OBJECT].includes(currentScope)) {
        throw new Error(
          `Unexpected closing bracket "]" on line ${token.lineNumberStart}`
        )
      }
      pop()

      continue
    }
    if (
      TT_TERMINALS.includes(tokenType) &&
      !TT_BINARY_OPERATORS.includes(nextTokenType)
    ) {
      node.children.push(getNodeFromToken(token))

      continue
    }
  }

  console.dir(ast, { depth: null })
  return ast
}

module.exports = getAstFromTokens
