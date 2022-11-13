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
  TT_COMMENT,
  TT_ASSIGNMENT,
  TT_FUNCTION,
  TT_CURLY_OPEN,
  TT_CURLY_CLOSE,
} = require("./tokenTypes")

// AST Node Types
const NT_ASSIGNMENT /*             */ = "NT_ASSIGNMENT"
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
const ST_ASSIGNMENT /*             */ = "ST_ASSIGNMENT"
const ST_FUNCTION_CALL_ARGS /*     */ = "ST_FUNCTION_CALL_ARGS"
const ST_FUNCTION_DEC_ARGS /*      */ = "ST_FUNCTION_DEC_ARGS"
const ST_FUNCTION_DEC_BODY /*      */ = "ST_FUNCTION_DEC_BODY"
const ST_IF_BODY /*                */ = "ST_IF_BODY"
const ST_IF_CONDITION /*           */ = "ST_IF_CONDITION"
const ST_OBJECT /*                 */ = "ST_OBJECT"
const ST_ROOT /*                   */ = "ST_ROOT"

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
  const scopes = [ST_ROOT]

  let node = ast
  const pop = () => {
    scopes.pop()
    const tmp = node
    node = node.parent
    delete tmp.parent
    if (scopes[scopes.length - 1] === ST_ASSIGNMENT) pop()
  }

  tokens = tokens.filter(
    ({ tokenType: tt }) => tt !== TT_WHITESPACE && tt !== TT_COMMENT
  )

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index],
      tokenType = token.tokenType,
      nextToken = tokens[index + 1],
      nextTokenType = nextToken && nextToken.tokenType,
      thirdToken = tokens[index + 2],
      thirdTokenType = thirdToken && thirdToken.tokenType
    const currentScope = scopes[scopes.length - 1]
    console.log("------------------")
    console.log("scopes", scopes)
    console.log(token.value, tokenType)

    if (currentScope === ST_FUNCTION_DEC_ARGS) {
      if (tokenType === TT_VAR) {
        node.args.push(getNodeFromToken(token))

        continue
      } else if (tokenType === TT_PAREN_CLOSE) {
        if (nextTokenType !== TT_CURLY_OPEN) {
          throw new Error(
            `Unexpected token "${nextToken.value}" when defining a function on line ${token.lineNumberStart}`
          )
        }
        // When going from function declaration arguments to the body, we consume the closing paren and opening curly brace ") {", so increment the index by an extra 1.
        index++

        // Note that unlike other things, our scope changes but the parent node (the function declaration) does not change.
        scopes.pop()
        scopes.push(ST_FUNCTION_DEC_BODY)

        continue
      } else {
        throw new Error(
          `Unexpected token "${nextToken.value}" when declaring function arguments on line ${token.lineNumberStart}`
        )
      }
    }
    if (tokenType === TT_FUNCTION && nextTokenType === TT_VAR) {
      if (thirdTokenType !== TT_PAREN_OPEN) {
        throw new Error(
          `Syntax Error for function ${nextToken.value} on line ${token.lineNumberStart}`
        )
      }
      scopes.push(ST_FUNCTION_DEC_ARGS)
      const child = {
        args: [],
        children: [],
        parent: node,
        type: NT_FUNCTION_DECLARATION,
      }
      node.children.push(child)
      node = child

      // For named function declarations, we have consumed the keyword, the name, and the opening paren fot the args, so we'll manually increment the tokens by an extra 2.
      index++
      index++

      continue
    }

    if (tokenType === TT_VAR && nextTokenType === TT_ASSIGNMENT) {
      if (![ST_IF_BODY, ST_FUNCTION_DEC_BODY, ST_ROOT].includes(currentScope)) {
        throw new Error(
          `Unexpected assigment on line ${token.lineNumberStart}: ${token.value}`
        )
      }

      scopes.push(ST_ASSIGNMENT)
      const child = {
        children: [],
        parent: node,
        type: NT_ASSIGNMENT,
        variable: token.value,
      }
      node.children.push(child)
      node = child

      // For normal var assignments, we have consumed both the identifier and the operator, so we'll manually increment the tokens by an extra 1.
      index++

      continue
    }

    // Function call
    if (tokenType === TT_VAR && nextTokenType === TT_PAREN_OPEN) {
      scopes.push(ST_FUNCTION_CALL_ARGS)
      const child = {
        children: [],
        function: getNodeFromToken(token),
        parent: node,
        type: NT_FUNCTION_CALL,
      }
      node.children.push(child)
      node = child

      // For function calls, we have consumed both the function and the opening paren, so we'll manually increment the tokens by an extra 1.
      index++

      continue
    }

    // Array open
    if (tokenType === TT_BRACKET_OPEN) {
      scopes.push(ST_ARRAY)
      const child = { type: NT_LITERAL_ARRAY, parent: node, children: [] }
      node.children.push(child)
      node = child

      continue
    }

    // Close paren
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

    // Close array or object
    if (tokenType === TT_BRACKET_CLOSE) {
      if (![ST_ARRAY, ST_OBJECT].includes(currentScope)) {
        throw new Error(
          `Unexpected closing bracket "]" on line ${token.lineNumberStart}`
        )
      }
      pop()

      continue
    }

    // Close a function or other block
    if (tokenType === TT_CURLY_CLOSE) {
      if (![ST_IF_BODY, ST_FUNCTION_DEC_BODY].includes(currentScope)) {
        throw new Error(
          `Unexpected closing brace "}" on line ${token.lineNumberStart}`
        )
      }
      pop()

      continue
    }

    // Terminals
    if (
      TT_TERMINALS.includes(tokenType) &&
      !TT_BINARY_OPERATORS.includes(nextTokenType)
    ) {
      node.children.push(getNodeFromToken(token))

      if (currentScope === ST_ASSIGNMENT) {
        pop()
      }

      continue
    }

    throw new Error(
      `Unexpected token "${token.value}" on line ${token.lineNumberStart}`
    )
  }

  if (scopes.length > 1) {
    const currentScope = scopes[scopes.length - 1]
    const expectedToken = [ST_ARRAY, ST_OBJECT].includes(currentScope)
      ? "]"
      : [ST_FUNCTION_DEC_ARGS, ST_FUNCTION_CALL_ARGS, ST_IF_CONDITION].includes(
          currentScope
        )
      ? ")"
      : [ST_IF_BODY, ST_FUNCTION_DEC_BODY].includes(currentScope)
      ? "}"
      : "(unknown)"
    throw new Error(`Unexpected end of input. Expected "${expectedToken}".`)
  }

  console.dir(ast, { depth: null })
  return ast
}

module.exports = getAstFromTokens
