/* global console */

const { nullConsole } = require("../debug")

const tt = require("../tokenTypes")
const nt = require("./nodeTypes")
const st = require("./scopeTypes")

const getCurrentExpressionListForScope = require("./getCurrentExpressionListForScope")
const getPushToExpressionListFn = require("./getPushToExpressionListFn")
const handleArrayOpen = require("./handleArrayOpen")
const handleBinaryOperator = require("./handleBinaryOperator")
const handleCloseBracket = require("./handleCloseBracket")
const handleCloseCurly = require("./handleCloseCurly")
const handleCloseParen = require("./handleCloseParen")
const handleFunctionCall = require("./handleFunctionCall")
const handleFunctionDeclarationArgs = require("./handleFunctionDeclarationArgs")
const handleFunctionDeclarationName = require("./handleFunctionDeclarationName")
const handleGenericExpressionOpen = require("./handleGenericExpressionOpen")
const handleKeywordElse = require("./handleKeywordElse")
const handleKeywordIf = require("./handleKeywordIf")
const handleLambdaArgs = require("./handleLambdaArgs")
const handleLambdaOpen = require("./handleLambdaOpen")
const handleObjectKeyOrClose = require("./handleObjectKeyOrClose")
const handleObjectOpen = require("./handleObjectOpen")
const handleTerminal = require("./handleTerminal")
const handleUnaryOperator = require("./handleUnaryOperator")
const handleVariableAssignment = require("./handleVariableAssignment")
const throwUnresolvedScopeError = require("./throwUnresolvedScopeError")

const getAstFromTokens = ({ tokens, debug }) => {
  const debugConsole = debug ? console : nullConsole
  const ast = { type: nt.ROOT, children: [] }
  const scopes = [st.ROOT]
  let currentExpressionList

  // Before traversing tokens, filter out whitespace and comments.
  tokens = tokens.filter(
    ({ tokenType }) => tokenType !== tt.WHITESPACE && tokenType !== tt.COMMENT
  )

  let node = ast

  // As we consume tokens, we use this to set the current to descendant or ancestor nodes based on scope changes.
  const setNode = (newNode) => {
    node = newNode
  }

  // When popping up the stack to a ancestor node (such as when a function body has been closed by a "}"), pop the scope stack and set the node to the ancestor. Also, delete the "parent" reference because it is a cyclic reference.
  const pop = () => {
    scopes.pop()
    const currentScope = scopes[scopes.length - 1]
    const tmp = node
    node = node.parent
    delete tmp.parent

    // For right-hand of assignment, binary operators, and unary operators, pop the stack until we reach a scope which must be explicitly closed.
    if (
      currentScope === st.ASSIGNMENT ||
      currentScope === st.UNARY_OPERATOR ||
      currentScope === st.BINARY_OPERATOR
    ) {
      pop()
    }
  }

  // Sometimes we transition from one scope to another which are part of the same AST node but have different rules. For example, transitioning from an "if" condition to an "if" body.
  const swapScope = (newScope) => {
    scopes.pop()
    scopes.push(newScope)
  }

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

    // TODO: Clean up this currentExpressionList stuff, the pushToExpressionList stuff, and any nodes with "children" that should use another name for descendants.
    currentExpressionList = getCurrentExpressionListForScope({
      currentScope,
      node,
    })

    // When adding a descendant to the AST, the way that we add it depends on our current scope.
    const pushToExpressionList = getPushToExpressionListFn({
      currentExpressionList,
      currentScope,
      node,
      token,
    })

    const context = {
      consumeExtra,
      currentExpressionList,
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
      handleBinaryOperator(context)
      continue
    }

    // Unary operators, such as !
    if (tt.UNARY_OPERATORS.includes(tokenType)) {
      handleUnaryOperator(context)
      continue
    }

    // Terminals
    if (tt.TERMINALS.includes(tokenType)) {
      handleTerminal(context)
      continue
    }

    throw new Error(
      `Unexpected token "${token.value}" (${tokenType}) on line ${token.lineNumberStart}`
    )
  }

  if (scopes.length > 1) throwUnresolvedScopeError(scopes)

  debugConsole.dir(ast, { depth: null })
  return ast
}

module.exports = {
  ...st,
  getAstFromTokens,
}
