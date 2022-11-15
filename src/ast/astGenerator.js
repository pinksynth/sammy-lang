/* global console */

const { nullConsole } = require("../debug")

const tt = require("../tokenTypes")
const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const getTerminalNode = require("./getTerminalNode")
const handleFunctionDeclarationArgs = require("./handleFunctionDeclarationArgs")
const handleKeywordIf = require("./handleKeywordIf")
const handleLambdaArgs = require("./handleLambdaArgs")
const handleLambdaOpen = require("./handleLambdaOpen")
const handleObjectKeyOrClose = require("./handleObjectKeyOrClose")
const opPriority = require("./opPriority")
const handleFunctionDeclarationName = require("./handleFunctionDeclarationName")
const handleVariableAssignment = require("./handleVariableAssignment")
const handleFunctionCall = require("./handleFunctionCall")
const handleObjectOpen = require("./handleObjectOpen")
const handleArrayOpen = require("./handleArrayOpen")
const handleGenericExpressionOpen = require("./handleGenericExpressionOpen")
const handleCloseParen = require("./handleCloseParen")
const handleCloseBracket = require("./handleCloseBracket")
const handleKeywordElse = require("./handleKeywordElse")
const handleCloseCurly = require("./handleCloseCurly")

const getAstFromTokens = ({ tokens, debug }) => {
  const debugConsole = debug ? console : nullConsole
  const ast = { type: nt.ROOT, children: [] }
  const scopes = [st.ROOT]
  let currentExpressionList

  let node = ast
  const setNode = (newNode) => {
    node = newNode
  }
  const pop = () => {
    scopes.pop()
    const currentScope = scopes[scopes.length - 1]
    const tmp = node
    node = node.parent
    delete tmp.parent

    // For right-hand of assignment and binary operators, pop the stack until we reach the heighest unclosed scope.
    if (
      currentScope === st.ASSIGNMENT ||
      currentScope === st.UNARY_OPERATOR ||
      currentScope === st.BINARY_OPERATOR
    ) {
      pop()
    }
  }

  const swapScope = (newScope) => {
    scopes.pop()
    scopes.push(newScope)
  }

  tokens = tokens.filter(
    ({ tokenType }) => tokenType !== tt.WHITESPACE && tokenType !== tt.COMMENT
  )

  let index
  const consumeExtra = () => index++

  for (index = 0; index < tokens.length; index++) {
    debugConsole.log("------------------")
    const token = tokens[index],
      tokenType = token.tokenType,
      nextToken = tokens[index + 1],
      nextTokenType = nextToken && nextToken.tokenType,
      thirdToken = tokens[index + 2],
      thirdTokenType = thirdToken && thirdToken.tokenType
    const currentScope = scopes[scopes.length - 1]
    currentExpressionList = node.children

    if (currentScope === st.IF_CONDITION) {
      currentExpressionList = node.condition
    } else if (currentScope === st.OBJECT_KEY) {
      currentExpressionList = node.keys
    } else if (currentScope === st.OBJECT_VALUE) {
      currentExpressionList = node.values
    } else if (currentScope === st.IF_ELSE) {
      currentExpressionList = node.else
    } else if (currentScope === st.BINARY_OPERATOR) {
      currentExpressionList = undefined
    } else if (currentScope === st.UNARY_OPERATOR) {
      currentExpressionList = undefined
    }

    const pushToExpressionList = (childNode) => {
      if (currentScope === st.OBJECT_VALUE) {
        if (node.keys.length === node.values.length + 1) {
          currentExpressionList.push(childNode)

          return
        } else {
          throw new Error(
            `Invalid expression ${token.value} on line ${token.lineNumberStart}. Expected "]" or ",".`
          )
        }

        // For binary operators, we do not push to a list but instead just define the right operand.
      } else if (currentScope === st.BINARY_OPERATOR) {
        node.right = childNode

        return
      } else if (currentScope === st.UNARY_OPERATOR) {
        node.operand = childNode

        return
      }

      currentExpressionList.push(childNode)
    }

    const context = {
      consumeExtra,
      currentScope,
      nextToken,
      nextTokenType,
      node,
      pop,
      pushToExpressionList,
      scopes,
      setNode,
      swapScope,
      thirdTokenType,
      token,
      tokenType,
    }

    debugConsole.log("scopes", scopes)
    debugConsole.log(token.value, tokenType)

    // Right side of "dot" can only be identifier
    if (node.type === nt.BINARY_EXPR && node.operator === ".") {
      if (tokenType !== tt.VAR) {
        throw new Error(
          `Syntax error on line ${token.lineNumberStart}. Unexpected token "${token.value}"`
        )
      }
    }

    // Function declaration args
    if (currentScope === st.FUNCTION_DEC_ARGS) {
      handleFunctionDeclarationArgs(context)
      continue
    }

    // Lambda args
    if (currentScope === st.LAMBDA_ARGS) {
      handleLambdaArgs(context)
      continue
    }

    // Move from if condition to if body
    if (currentScope === st.IF_CONDITION && tokenType === tt.CURLY_OPEN) {
      swapScope(st.IF_BODY)
      continue
    }

    // Opening of if statement
    if (tokenType === tt.IF) {
      handleKeywordIf(context)
      continue
    }

    // Opening of lambda function with @
    if (tokenType === tt.LAMBDA_OPEN) {
      handleLambdaOpen(context)
      continue
    }

    // Object key or closing curly
    if (currentScope === st.OBJECT_KEY) {
      handleObjectKeyOrClose(context)
      continue
    }

    // Opening of function declaration
    if (tokenType === tt.FUNCTION && nextTokenType === tt.VAR) {
      handleFunctionDeclarationName(context)
      continue
    }

    // Handle comma after seeing object value
    if (currentScope === st.OBJECT_VALUE && tokenType === tt.COMMA) {
      swapScope(st.OBJECT_KEY)
      continue
    }

    // Variable assignment
    if (tokenType === tt.VAR && nextTokenType === tt.ASSIGNMENT) {
      handleVariableAssignment(context)
      continue
    }

    // Function call
    if (tokenType === tt.VAR && nextTokenType === tt.PAREN_OPEN) {
      handleFunctionCall(context)
      continue
    }

    // Object open
    if (tokenType === tt.OBJECT_OPEN) {
      handleObjectOpen(context)
      continue
    }

    // Array open
    if (tokenType === tt.BRACKET_OPEN) {
      handleArrayOpen(context)
      continue
    }

    // Open paren (expression group)
    if (tokenType === tt.PAREN_OPEN) {
      handleGenericExpressionOpen(context)
      continue
    }

    // Close paren
    if (tokenType === tt.PAREN_CLOSE) {
      handleCloseParen(context)
      continue
    }

    // Close array or object
    if (tokenType === tt.BRACKET_CLOSE) {
      handleCloseBracket(context)
      continue
    }

    // Keyword "else"
    if (
      tokenType === tt.CURLY_CLOSE &&
      nextTokenType === tt.ELSE &&
      thirdTokenType === tt.CURLY_OPEN
    ) {
      handleKeywordElse(context)
      continue
    }

    // Close a function or other block
    if (tokenType === tt.CURLY_CLOSE) {
      handleCloseCurly(context)
      continue
    }

    // Binary operators
    if (
      tt.BINARY_OPERATORS.includes(tokenType) &&
      // Some binary operators can also be unary operators ( e.g. "-"). If there are no sibling expressions to the left of binary operator, continue observing rules.
      currentExpressionList?.length > 0
    ) {
      scopes.push(st.BINARY_OPERATOR)

      const leftOperand = currentExpressionList.pop()

      // Here we do some swapping to handle operator precedence.
      // That is, we check to see if we found 2 + 3 * 4.
      // The algorithm wants this to be ((2 + 3) * 4).
      // So we have to tell it to be (2 + (3 * 4)).
      // In order to do this, we take the left operand ((2 + 3)) and check if it is a boolean expression with a lower-priority operator. If it is, then we instead replace the whole node with its lefthand operand (2).
      if (
        leftOperand.type === nt.BINARY_EXPR &&
        opPriority(leftOperand.operator) < opPriority(token.value)
      ) {
        const parentLeft = leftOperand.left
        const childLeft = leftOperand.right
        const parentOperator = leftOperand.operator

        const replacedParent = {
          left: parentLeft,
          operator: parentOperator,
          parent: node,
          type: nt.BINARY_EXPR,
        }
        const rightChild = {
          left: childLeft,
          operator: token.value,
          parent: replacedParent,
          type: nt.BINARY_EXPR,
        }

        scopes.push(st.BINARY_OPERATOR)
        replacedParent.right = rightChild
        pushToExpressionList(replacedParent)

        node = rightChild

        continue
      } else if (leftOperand.type === nt.ASSIGNMENT) {
        const parentVariable = leftOperand.variable
        const childLeft = leftOperand.children[0]

        const replacedParent = {
          variable: parentVariable,
          parent: node,
          type: nt.ASSIGNMENT,
        }
        const rightChild = {
          left: childLeft,
          operator: token.value,
          parent: replacedParent,
          type: nt.BINARY_EXPR,
        }

        scopes.push(st.BINARY_OPERATOR)
        replacedParent.children = [rightChild]
        pushToExpressionList(replacedParent)

        node = rightChild

        continue
      } else {
        const child = {
          left: leftOperand,
          operator: token.value,
          parent: node,
          type: nt.BINARY_EXPR,
        }
        pushToExpressionList(child)
        node = child

        continue
      }
    }

    // Unary operators, such as !
    if (tt.UNARY_OPERATORS.includes(tokenType)) {
      scopes.push(st.UNARY_OPERATOR)

      const child = {
        operator: token.value,
        parent: node,
        type: nt.UNARY_EXPRESSION,
      }
      pushToExpressionList(child)
      node = child

      continue
    }

    // Terminals
    if (tt.TERMINALS.includes(tokenType)) {
      pushToExpressionList(getTerminalNode(token))

      if (
        currentScope === st.ASSIGNMENT ||
        currentScope === st.UNARY_OPERATOR ||
        currentScope === st.BINARY_OPERATOR
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
    throw new Error(`Unexpected end of input. Expected ${expectedToken}.`)
  }

  debugConsole.dir(ast, { depth: null })
  return ast
}

module.exports = {
  ...st,
  getAstFromTokens,
}
