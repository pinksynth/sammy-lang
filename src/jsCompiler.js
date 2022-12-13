/* global console */
const nt = require("./ast/nodeTypes")

const { nullConsole } = require("./debug")

let debugConsole

const RANGE_FUNC_NAME = "__RANGE__"
const RANGE_FUNC = `function ${RANGE_FUNC_NAME}(t,f){if(t===f)return[t];const r=[];if(typeof t==="number"&&typeof f==="number"){if(t<f)for(let e=t;e<=f;e++)r.push(e);else for(let e=t;e>=f;e--)r.push(e)}else if(typeof t==="string"&&typeof f==="string"&&t.length&&f.length){const n=String.fromCharCode;const o=t.charCodeAt(),i=f.charCodeAt();if(o<i)for(let e=o;e<=i;e++)r.push(n(e));else for(let e=o;e>=i;e--)r.push(n(e))}return r}`
let shouldDefineRangeFunc = false

// As we iterate through expressions in a block scope, if those expressions are assignment expressions, we must make them available to subsequent siblings.
const mapBlockScope = ({ nodes, assignmentStr = "return ", varsInScope }) => {
  let lambdaVarsRequested = []
  if (nodes.length === 0) return ""
  const thisBlockVars = {
    weaks: [...varsInScope.weaks],
    consts: [...varsInScope.consts],
  }
  const childStrings = []
  for (const node of nodes) {
    // For function declarations, make the name available to siblings
    if (node.type === nt.FUNCTION_DECLARATION) {
      thisBlockVars.weaks.push(node.name)
    }
    const [childString, { lambdaVarsRequested: childLambdaVarsRequested }] =
      walkNode({ node, varsInScope: thisBlockVars })

    // For assignments, make the variable available to siblings but not to self
    if (node.type === nt.ASSIGNMENT && !inScope(node.variable, thisBlockVars)) {
      if (node.weak) {
        thisBlockVars.weaks.push(node.variable)
      } else {
        thisBlockVars.consts.push(node.variable)
      }
    }
    lambdaVarsRequested = [...lambdaVarsRequested, ...childLambdaVarsRequested]
    childStrings.push(childString)
  }
  const finalNode = nodes[nodes.length - 1]
  const finalNodeIsAssignment = finalNode.type === nt.ASSIGNMENT
  if (assignmentStr) {
    // If the final node in a block is an assignment or return, we return the variable.
    if (finalNodeIsAssignment) {
      childStrings.push(`${assignmentStr}${finalNode.variable}`)
    } else {
      childStrings[childStrings.length - 1] = `${assignmentStr}${
        childStrings[childStrings.length - 1]
      }`
    }
  }
  return [childStrings.join(";"), { lambdaVarsRequested }]
}

const walkAssumedPrimitive = (node) => walkNode({ node, varsInScope: false })[0]

const inScope = (theVar, varsInScope) =>
  varsInScope.weaks.includes(theVar) || varsInScope.consts.includes(theVar)

const inScopeAsConstant = (theVar, varsInScope) =>
  varsInScope.consts.includes(theVar)

const inScopeAsWeak = (theVar, varsInScope) =>
  varsInScope.weaks.includes(theVar)

const walkNode = ({
  node,
  varsInScope,
  isPropertyAccess,
  unshiftedFirstArgFromPipe,
}) => {
  debugConsole.log("--------------------------")
  debugConsole.log("node", node)
  debugConsole.log("varsInScope", varsInScope)
  switch (node.type) {
    case nt.ROOT: {
      // eslint-disable-next-line no-unused-vars
      const [result, context] = mapBlockScope({
        nodes: node.children,
        varsInScope,
        assignmentStr: "",
      })
      return [result, context]
    }

    case nt.FUNCTION_DECLARATION: {
      // Make function arguments available the function body, and treat them as `const` so they may not be overridden.
      const consts = [...varsInScope.consts]
      for (const { type, value } of node.args) {
        if (type === nt.IDENTIFIER) {
          if (inScope(value, varsInScope)) {
            throw new Error(
              `Cannot use "${value}" as a function argument because it is already defined in the current scope.`
            )
          }
          consts.push(value)
        }
      }
      const [statements, context] = mapBlockScope({
        nodes: node.children,
        varsInScope: { ...varsInScope, consts },
      })
      const expression = `function ${node.name}(${node.args
        .map(walkAssumedPrimitive)
        .join(",")}){${statements}}`
      return [expression, context]
    }

    case nt.FUNCTION_CALL: {
      const args = [...node.children]
      if (unshiftedFirstArgFromPipe) {
        args.unshift(unshiftedFirstArgFromPipe)
      }
      let lambdaVarsRequested = []
      const [functionName] = walkNode({ node: node.function, varsInScope })
      const expression = `${functionName}(${args
        .map((node) => {
          const [
            expression,
            { lambdaVarsRequested: expressionLambdaVarsRequested },
          ] = walkNode({ node, varsInScope })
          lambdaVarsRequested = [
            ...lambdaVarsRequested,
            ...expressionLambdaVarsRequested,
          ]
          return expression
        })
        .join(",")})`

      return [expression, { lambdaVarsRequested }]
    }

    case nt.IF_EXPR: {
      let lambdaVarsRequested = []
      const conditions = node.condition
        .map((node) => {
          const [
            expression,
            { lambdaVarsRequested: expressionLambdaVarsRequested },
          ] = walkNode({ node, varsInScope })
          lambdaVarsRequested = [
            ...lambdaVarsRequested,
            ...expressionLambdaVarsRequested,
          ]
          return expression
        })
        .join("&&")
      const [body, { lambdaVarsRequested: bodyLambdaVarsRequested }] =
        mapBlockScope({
          nodes: node.children,
          assignmentStr: "tmp=",
          varsInScope,
        })
      lambdaVarsRequested = [...lambdaVarsRequested, ...bodyLambdaVarsRequested]
      let statements = `if(${conditions}){${body}}`
      if (node.else.length > 0) {
        const [elseBody, { lambdaVarsRequested: elseLambdaVarsRequested }] =
          mapBlockScope({
            nodes: node.else,
            assignmentStr: "tmp=",
            varsInScope,
          })
        statements += `else{${elseBody}}`
        lambdaVarsRequested = [
          ...lambdaVarsRequested,
          ...elseLambdaVarsRequested,
        ]
      }
      return [
        `(()=>{let tmp;${statements}return tmp})()`,
        { lambdaVarsRequested },
      ]
    }

    case nt.TRY_EXPR: {
      let lambdaVarsRequested = []
      const [body, { lambdaVarsRequested: bodyLambdaVarsRequested }] =
        mapBlockScope({
          nodes: node.children,
          assignmentStr: "tmp=",
          varsInScope,
        })
      lambdaVarsRequested = [...lambdaVarsRequested, ...bodyLambdaVarsRequested]
      const patternNode = node.handlerPatterns[0]
      const secondPatternNode = node.handlerPatterns[1]
      if (secondPatternNode) {
        throw new Error(
          `Multiple error handlers are not supported for the jsCompiler (yet). Evaluating ${secondPatternNode.type}:${secondPatternNode.value}`
        )
      }

      let errorVariable = "_",
        catchContentsToPrint = ""
      if (patternNode) {
        if (patternNode.type !== nt.IDENTIFIER) {
          throw new Error(
            `Pattern matching is not supported for error handlers in the jsCompiler (yet). Evaluating ${patternNode.type}`
          )
        }

        errorVariable = patternNode.value

        const handlerNode = node.handlers[0]
        const [catchContents, { lambdaVarsRequested: lamdbaVarsFromCatch }] =
          mapBlockScope({
            nodes: handlerNode.children,
            assignmentStr: "tmp=",
            varsInScope: {
              ...varsInScope,
              consts: [...varsInScope.consts, errorVariable],
            },
          })
        catchContentsToPrint = catchContents
        lambdaVarsRequested = [...lambdaVarsRequested, lamdbaVarsFromCatch]
      }

      return [
        `(()=>{let tmp;try{${body}}catch(${errorVariable}){${catchContentsToPrint}}return tmp})()`,
        { lambdaVarsRequested },
      ]
    }

    case nt.LITERAL_OBJECT: {
      let lambdaVarsRequested = []
      const expression = `({${node.keys
        .map((key, index) => {
          const [value, { lambdaVarsRequested: valueLambdaVarsRequested }] =
            walkNode({
              node: node.values[index],
              varsInScope,
            })
          lambdaVarsRequested = [
            ...lambdaVarsRequested,
            ...valueLambdaVarsRequested,
          ]
          return `${key.value}:${value}`
        })
        .join(",")}})`
      return [expression, { lambdaVarsRequested }]
    }

    case nt.LITERAL_ARRAY: {
      let lambdaVarsRequested = []
      if (node.children.length === 0) return ["[]", { lambdaVarsRequested }]
      const expression = `[${node.children
        .map((node) => {
          const [element, { lambdaVarsRequested: elementLambdaVarsRequested }] =
            walkNode({ node, varsInScope })
          lambdaVarsRequested = [
            ...lambdaVarsRequested,
            ...elementLambdaVarsRequested,
          ]
          return element
        })
        .join(",")}]`
      return [expression, { lambdaVarsRequested }]
    }

    case nt.UNARY_EXPRESSION: {
      const space = node.operator === "-" ? " " : ""
      const [operand, context] = walkNode({
        node: node.operand,
        varsInScope,
      })
      return [`${space}${node.operator}${operand}`, context]
    }

    case nt.BINARY_EXPR: {
      if (node.operator === "->") {
        if (node.right.type !== nt.FUNCTION_CALL) {
          // TODO: Should this check happen in lexer? Either way we should describe the failing token with line/column number.
          throw new Error(
            `Attempted to pipe into an expression which is not a function call: ${node.right.type}`
          )
        }

        return walkNode({
          node: node.right,
          varsInScope,
          isPropertyAccess: node.operator === ".",
          unshiftedFirstArgFromPipe: node.left,
        })
      }

      const [left, { lambdaVarsRequested: leftLambdaVarsRequested }] = walkNode(
        { node: node.left, varsInScope }
      )
      const [right, { lambdaVarsRequested: rightLambdaVarsRequested }] =
        walkNode({
          node: node.right,
          varsInScope,
          isPropertyAccess: node.operator === ".",
        })
      let jsOperator

      switch (node.operator) {
        case "*":
        case "/":
        case "+":
        case "-":
        case "%":
        case ".":
        case ">":
        case "<":
        case ">=":
        case "<=":
          jsOperator = node.operator
          break
        case "==":
          jsOperator = "==="
          break
        case "!=":
          jsOperator = "!=="
          break
        default:
          break
      }

      const lambdaVarsRequested = [
        ...leftLambdaVarsRequested,
        ...rightLambdaVarsRequested,
      ]

      const context = { lambdaVarsRequested }

      if (node.operator === "..") {
        shouldDefineRangeFunc = true
        return [`(${RANGE_FUNC_NAME}(${left},${right}))`, context]
      } else {
        return [`${left}${jsOperator}${right}`, context]
      }
    }

    case nt.GENERIC_EXPRESSION: {
      let lambdaVarsRequested = []
      const expression = `(${node.children
        .map((node) => {
          const [sibling, { lambdaVarsRequested: siblingLambdaVarsRequested }] =
            walkNode({ node, varsInScope })
          lambdaVarsRequested = [
            ...lambdaVarsRequested,
            ...siblingLambdaVarsRequested,
          ]
          return sibling
        })
        .join(",")})`
      return [expression, { lambdaVarsRequested }]
    }

    case nt.LAMBDA: {
      let argsStrings = []
      const consts = [...varsInScope.consts]
      if (node.args.length > 0) {
        argsStrings = node.args.map(walkAssumedPrimitive)
      }

      const [statements, { lambdaVarsRequested }] = mapBlockScope({
        nodes: node.children,
        varsInScope: { ...varsInScope, consts: [...consts, ...argsStrings] },
      })

      if (argsStrings.length === 0 && lambdaVarsRequested) {
        const sortedLambdaArgs = lambdaVarsRequested
          .map((string) => parseInt(string.substr(1), 10))
          .sort()
        for (
          let argNum = 1;
          argNum <= sortedLambdaArgs[sortedLambdaArgs.length - 1];
          argNum++
        ) {
          if (sortedLambdaArgs.includes(argNum)) {
            argsStrings.push(`$${argNum}`)
          } else {
            argsStrings.push(`$_${argNum}`)
          }
        }
      }

      return [
        `(${argsStrings.join(",")})=>{${statements}}`,
        { lambdaVarsRequested },
      ]
    }

    case nt.ASSIGNMENT: {
      if (inScopeAsConstant(node.variable, varsInScope)) {
        throw new Error(
          `Variable "${node.variable}" has already been assigned. To allow it to be reassigned, declare it as: "weak ${node.variable}"`
        )
      }
      const [rightSide, context] = walkNode({
        node: node.children[0],
        varsInScope,
      })

      let expressionString
      if (inScopeAsWeak(node.variable, varsInScope)) {
        expressionString = `${node.variable}=${rightSide}`
      } else if (node.weak) {
        expressionString = `let ${node.variable}=${rightSide}`
      } else {
        expressionString = `const ${node.variable}=${rightSide}`
      }

      return [expressionString, context]
    }

    case nt.CONCISE_LAMBDA_ARGUMENT:
    case nt.IDENTIFIER:
    case nt.LITERAL_BOOLEAN:
    case nt.LITERAL_NULL:
    case nt.LITERAL_NUMBER:
    case nt.LITERAL_STRING:
    case nt.LITERAL_UNDEFINED: {
      // Raise errors if attempting to use variables that have not been defined.
      if (node.type === nt.IDENTIFIER && varsInScope) {
        if (!isPropertyAccess && !inScope(node.value, varsInScope)) {
          throw new Error(
            `Variable ${node.value} is not defined in the current scope.`
          )
        }
      }
      const lambdaVarsRequested = []
      if (node.type === nt.CONCISE_LAMBDA_ARGUMENT) {
        lambdaVarsRequested.push(node.value)
      }
      return [node.value, { lambdaVarsRequested }]
    }

    default:
      throw new Error(
        `AST node type "${node.type}" has not been implemented for the jsCompiler.`
      )
      break
  }
}

const defineHelpers = (string) => {
  let withHelpers = string
  if (shouldDefineRangeFunc) {
    withHelpers = `${RANGE_FUNC};` + string
  }
  return withHelpers
}

const jsCompile = ({ ast, debug, jsGlobals }) => {
  debugConsole = debug ? console : nullConsole
  debugConsole.dir(["ast", ast], { depth: null })
  let [result] = walkNode({
    node: ast,
    varsInScope: { weaks: [], consts: [...jsGlobals] },
  })
  result = defineHelpers(result)
  debugConsole.log("result:\n", result)
  return result
}

module.exports = jsCompile
