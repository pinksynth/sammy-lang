/* global console */

const {
  TT_ASSIGNMENT,
  TT_BINARY_OPERATORS,
  TT_BOOLEAN,
  TT_BRACKET_CLOSE,
  TT_BRACKET_OPEN,
  TT_COLON,
  TT_COMMA,
  TT_COMMENT,
  TT_CURLY_CLOSE,
  TT_CURLY_OPEN,
  TT_ELSE,
  TT_FUNCTION,
  TT_IF,
  TT_NULL,
  TT_NUMBER,
  TT_OBJECT_OPEN,
  TT_PAREN_CLOSE,
  TT_PAREN_OPEN,
  TT_STRING,
  TT_TERMINALS,
  TT_UNDEFINED,
  TT_VAR,
  TT_WHITESPACE,
  TT_LAMBDA_OPEN,
  TT_CONCISE_LAMBDA_ARGUMENT,
} = require("./tokenTypes")

// AST Node Types
const NT_ASSIGNMENT /*             */ = "NT_ASSIGNMENT"
const NT_BINARY_EXPR /*            */ = "NT_BINARY_EXPR"
const NT_CONCISE_LAMBDA_ARGUMENT /* */ = "NT_CONCISE_LAMBDA_ARGUMENT"
const NT_FUNCTION_CALL /*          */ = "NT_FUNCTION_CALL"
const NT_FUNCTION_DECLARATION /*   */ = "NT_FUNCTION_DECLARATION"
const NT_IDENTIFIER /*             */ = "NT_IDENTIFIER"
const NT_GENERIC_EXPRESSION /*     */ = "NT_GENERIC_EXPRESSION"
const NT_IF_EXPR /*                */ = "NT_IF_EXPR"
const NT_LAMBDA /*                 */ = "NT_LAMBDA"
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
const ST_BINARY_OPERATOR /*        */ = "ST_BINARY_OPERATOR"
const ST_FUNCTION_CALL_ARGS /*     */ = "ST_FUNCTION_CALL_ARGS"
const ST_FUNCTION_DEC_ARGS /*      */ = "ST_FUNCTION_DEC_ARGS"
const ST_FUNCTION_DEC_BODY /*      */ = "ST_FUNCTION_DEC_BODY"
const ST_GENERIC_EXPRESSION /*     */ = "ST_GENERIC_EXPRESSION"
const ST_LAMBDA_ARGS /*            */ = "ST_LAMBDA_ARGS"
const ST_LAMBDA_BODY /*            */ = "ST_LAMBDA_BODY"
const ST_IF_BODY /*                */ = "ST_IF_BODY"
const ST_IF_CONDITION /*           */ = "ST_IF_CONDITION"
const ST_IF_ELSE /*                */ = "ST_IF_ELSE"
const ST_OBJECT_VALUE /*           */ = "ST_OBJECT_VALUE"
const ST_OBJECT_KEY /*             */ = "ST_OBJECT_KEY"
const ST_ROOT /*                   */ = "ST_ROOT"

const opPriority = (operator) => {
  switch (operator) {
    case ".":
      return 0
    case "^":
      return -1
    case "*":
    case "/":
      return -2
    case "+":
    case "-":
      return -3
    case "=":
      return -4
    case "==":
      return -5
    default:
      throw new Error(`Could not determine precedence for operator ${operator}`)
  }
}

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
    case TT_CONCISE_LAMBDA_ARGUMENT:
      type = NT_CONCISE_LAMBDA_ARGUMENT
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
  let currentExpressionList

  let node = ast
  const pop = () => {
    scopes.pop()
    const currentScope = scopes[scopes.length - 1]
    const tmp = node
    node = node.parent
    delete tmp.parent

    // For right-hand of assignment and binary operators, pop the stack until we reach the heighest unclosed scope.
    if (currentScope === ST_ASSIGNMENT || currentScope === ST_BINARY_OPERATOR) {
      pop()
    }
  }
  const swapScope = (newScope) => {
    scopes.pop()
    scopes.push(newScope)
  }

  tokens = tokens.filter(
    ({ tokenType: tt }) => tt !== TT_WHITESPACE && tt !== TT_COMMENT
  )

  for (let index = 0; index < tokens.length; index++) {
    console.log("------------------")
    const token = tokens[index],
      tokenType = token.tokenType,
      nextToken = tokens[index + 1],
      nextTokenType = nextToken && nextToken.tokenType,
      thirdToken = tokens[index + 2],
      thirdTokenType = thirdToken && thirdToken.tokenType
    const currentScope = scopes[scopes.length - 1]
    currentExpressionList = node.children

    if (currentScope === ST_IF_CONDITION) {
      currentExpressionList = node.condition
    } else if (currentScope === ST_OBJECT_KEY) {
      currentExpressionList = node.keys
    } else if (currentScope === ST_OBJECT_VALUE) {
      currentExpressionList = node.values
    } else if (currentScope === ST_IF_ELSE) {
      currentExpressionList = node.else
    } else if (currentScope === ST_BINARY_OPERATOR) {
      currentExpressionList = node.right
      if (currentExpressionList.length > 1) {
        const prevToken = tokens[index - 1]
        throw new Error(
          `Unexpected token "${prevToken.value}" on line ${prevToken.lineNumberStart}`
        )
      }
    }

    const pushToExpressionList = (childNode) => {
      if (currentScope === ST_OBJECT_VALUE) {
        if (node.keys.length === node.values.length + 1) {
          currentExpressionList.push(childNode)

          return
        } else {
          throw new Error(
            `Invalid expression ${token.value} on line ${token.lineNumberStart}. Expected "]" or ",".`
          )
        }
      }
      currentExpressionList.push(childNode)
    }

    console.log("scopes", scopes)
    console.log(token.value, tokenType)

    // Function declaration args
    if (currentScope === ST_FUNCTION_DEC_ARGS) {
      if (TT_TERMINALS.includes(tokenType)) {
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
        swapScope(ST_FUNCTION_DEC_BODY)

        continue
      } else {
        throw new Error(
          `Unexpected token "${nextToken.value}" when declaring function arguments on line ${token.lineNumberStart}`
        )
      }
    }

    // Lambda args
    if (currentScope === ST_LAMBDA_ARGS) {
      if (TT_TERMINALS.includes(tokenType)) {
        node.args.push(getNodeFromToken(token))

        continue
      } else if (tokenType === TT_CURLY_OPEN) {
        // Note that unlike other things, our scope changes but the parent node (the lambda) does not change.
        swapScope(ST_LAMBDA_BODY)

        continue
      } else {
        throw new Error(
          `Unexpected token "${token.value}" when defining a function on line ${token.lineNumberStart}`
        )
      }
    }

    // Move from if condition to if body
    if (currentScope === ST_IF_CONDITION && tokenType === TT_CURLY_OPEN) {
      swapScope(ST_IF_BODY)

      continue
    }

    // Opening of if statement
    if (tokenType === TT_IF) {
      scopes.push(ST_IF_CONDITION)

      const child = {
        condition: [],
        children: [],
        else: [],
        parent: node,
        type: NT_IF_EXPR,
      }
      pushToExpressionList(child)
      node = child

      continue
    }

    if (tokenType === TT_LAMBDA_OPEN) {
      scopes.push(ST_LAMBDA_ARGS)

      const child = {
        args: [],
        children: [],
        parent: node,
        type: NT_LAMBDA,
      }
      pushToExpressionList(child)
      node = child

      continue
    }

    // Object key and
    if (currentScope === ST_OBJECT_KEY) {
      if (TT_TERMINALS.includes(tokenType)) {
        if (nextTokenType === TT_COLON) {
          pushToExpressionList(getNodeFromToken(token))
          swapScope(ST_OBJECT_VALUE)
          // We have consumed the key as well as the colon, so increment the tokens by an extra one.
          index++

          continue
        } else {
          throw new Error(
            `Syntax Error inside object literal. Unexpected token ${nextToken.value} (${nextTokenType}) on line ${nextToken.lineNumberStart}`
          )
        }
      } else if (tokenType === TT_BRACKET_CLOSE) {
        pop()

        continue
      } else {
        throw new Error(
          `Syntax Error inside object literal. Unexpected token ${token.value} (${tokenType}) on line ${token.lineNumberStart}`
        )
      }
    }

    // Opening of function declaration
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
      pushToExpressionList(child)
      node = child

      // For named function declarations, we have consumed the keyword, the name, and the opening paren fot the args, so we'll manually increment the tokens by an extra 2.
      index++
      index++

      continue
    }

    if (currentScope === ST_OBJECT_VALUE && tokenType === TT_COMMA) {
      swapScope(ST_OBJECT_KEY)

      continue
    }

    // Variable assignment
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
      pushToExpressionList(child)
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
      pushToExpressionList(child)
      node = child

      // For function calls, we have consumed both the function and the opening paren, so we'll manually increment the tokens by an extra 1.
      index++

      continue
    }

    // Object open
    if (tokenType === TT_OBJECT_OPEN) {
      scopes.push(ST_OBJECT_KEY)

      const child = {
        keys: [],
        values: [],
        parent: node,
        type: NT_LITERAL_OBJECT,
      }
      pushToExpressionList(child)
      node = child

      continue
    }

    // Array open
    if (tokenType === TT_BRACKET_OPEN) {
      scopes.push(ST_ARRAY)
      const child = { type: NT_LITERAL_ARRAY, parent: node, children: [] }
      pushToExpressionList(child)
      node = child

      continue
    }

    // Open paren (expression group)
    if (tokenType === TT_PAREN_OPEN) {
      scopes.push(ST_GENERIC_EXPRESSION)
      const child = { type: NT_GENERIC_EXPRESSION, parent: node, children: [] }
      pushToExpressionList(child)
      node = child

      continue
    }

    // Close paren
    if (tokenType === TT_PAREN_CLOSE) {
      if (
        ![
          ST_FUNCTION_CALL_ARGS,
          ST_FUNCTION_DEC_ARGS,
          ST_GENERIC_EXPRESSION,
          ST_IF_CONDITION,
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
      if (![ST_ARRAY, ST_OBJECT_VALUE].includes(currentScope)) {
        throw new Error(
          `Unexpected closing bracket "]" on line ${token.lineNumberStart}`
        )
      }
      pop()

      continue
    }

    // If else
    if (
      tokenType === TT_CURLY_CLOSE &&
      nextTokenType === TT_ELSE &&
      thirdTokenType === TT_CURLY_OPEN
    ) {
      swapScope(ST_IF_ELSE)
      // We are consuming the "if" body's closing curly, the "else" keyword, and the "else" opening curly, so increment by 2 extra tokens.

      index++
      index++

      continue
    }

    // Close a function or other block
    if (tokenType === TT_CURLY_CLOSE) {
      if (
        ![
          ST_FUNCTION_DEC_BODY,
          ST_IF_BODY,
          ST_IF_ELSE,
          ST_LAMBDA_BODY,
        ].includes(currentScope)
      ) {
        throw new Error(
          `Unexpected closing brace "}" on line ${token.lineNumberStart}`
        )
      }
      pop()

      continue
    }

    // Binary operators
    if (TT_BINARY_OPERATORS.includes(tokenType)) {
      scopes.push(ST_BINARY_OPERATOR)

      const leftOperand = currentExpressionList.pop()

      // Here we do some swapping to handle operator precedence.
      // That is, we check to see if we found 2 + 3 * 4.
      // The algorithm wants this to be ((2 + 3) * 4).
      // So we have to tell it to be (2 + (3 * 4)).
      // In order to do this, we take the left operand ((2 + 3)) and check if it is a boolean expression with a lower-priority operator. If it is, then we instead replace the whole node with its lefthand operand (2).
      if (
        leftOperand.type === NT_BINARY_EXPR &&
        opPriority(leftOperand.operator) < opPriority(token.value)
      ) {
        const parentLeft = leftOperand.left
        const childLeft = leftOperand.right
        const parentOperator = leftOperand.operator

        const replacedParent = {
          left: parentLeft,
          operator: parentOperator,
          parent: node,
          right: [],
          type: NT_BINARY_EXPR,
        }
        const rightChild = {
          left: childLeft,
          operator: token.value,
          parent: replacedParent,
          right: [],
        }

        scopes.push(ST_BINARY_OPERATOR)
        replacedParent.right.push(rightChild)
        pushToExpressionList(replacedParent)

        node = rightChild

        continue
      } else {
        const child = {
          left: leftOperand,
          operator: token.value,
          parent: node,
          right: [],
          type: NT_BINARY_EXPR,
        }
        pushToExpressionList(child)
        node = child

        continue
      }
    }

    // Terminals
    if (TT_TERMINALS.includes(tokenType)) {
      pushToExpressionList(getNodeFromToken(token))

      if (
        currentScope === ST_ASSIGNMENT ||
        currentScope === ST_BINARY_OPERATOR
      ) {
        pop()
      }

      continue
    }

    throw new Error(
      `Unexpected token "${token.value}" (${tokenType}) on line ${token.lineNumberStart}`
    )
  }

  if (scopes.length > 1) {
    const currentScope = scopes[scopes.length - 1]
    const expectedToken = [ST_ARRAY, ST_OBJECT_VALUE].includes(currentScope)
      ? '"]"'
      : [
          ST_FUNCTION_CALL_ARGS,
          ST_FUNCTION_DEC_ARGS,
          ST_GENERIC_EXPRESSION,
          ST_IF_CONDITION,
        ].includes(currentScope)
      ? '")"'
      : [ST_IF_BODY, ST_FUNCTION_DEC_BODY, ST_IF_ELSE].includes(currentScope)
      ? '"}"'
      : [ST_BINARY_OPERATOR, ST_ASSIGNMENT].includes(currentScope)
      ? "an expression"
      : "(unknown)"
    throw new Error(`Unexpected end of input. Expected ${expectedToken}.`)
  }

  console.dir(ast, { depth: null })
  return ast
}

module.exports = getAstFromTokens
