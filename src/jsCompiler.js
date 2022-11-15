/* global console */
const {
  NT_ASSIGNMENT,
  NT_BINARY_EXPR,
  NT_CONCISE_LAMBDA_ARGUMENT,
  NT_FUNCTION_CALL,
  NT_FUNCTION_DECLARATION,
  NT_IDENTIFIER,
  NT_IF_EXPR,
  NT_LAMBDA,
  NT_LITERAL_ARRAY,
  NT_LITERAL_BOOLEAN,
  NT_LITERAL_NULL,
  NT_LITERAL_NUMBER,
  NT_LITERAL_OBJECT,
  NT_LITERAL_STRING,
  NT_LITERAL_UNDEFINED,
  NT_ROOT,
  NT_GENERIC_EXPRESSION,
  NT_UNARY_EXPRESSION,
} = require("./ast")

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
    lets: [...varsInScope.lets],
    consts: [...varsInScope.consts],
  }
  const childStrings = []
  for (const node of nodes) {
    if (node.type === NT_ASSIGNMENT) {
      thisBlockVars.consts.push(node.variable)
    } else if (node.type === NT_FUNCTION_DECLARATION) {
      thisBlockVars.lets.push(node.name)
    }
    const [childString, { lambdaVarsRequested: childLambdaVarsRequested }] =
      walkNode({ node, varsInScope: thisBlockVars })
    lambdaVarsRequested = [...lambdaVarsRequested, ...childLambdaVarsRequested]
    childStrings.push(childString)
  }
  const finalNode = nodes[nodes.length - 1]
  const finalNodeIsAssignment = finalNode.type === NT_ASSIGNMENT
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
  varsInScope.lets.includes(theVar) || varsInScope.consts.includes(theVar)

const walkNode = ({ node, varsInScope, isPropertyAccess }) => {
  debugConsole.log("--------------------------")
  debugConsole.log("node", node)
  debugConsole.log("varsInScope", varsInScope)
  switch (node.type) {
    case NT_ROOT: {
      // eslint-disable-next-line no-unused-vars
      const [result, context] = mapBlockScope({
        nodes: node.children,
        varsInScope,
        assignmentStr: "",
      })
      return [result, context]
    }

    case NT_FUNCTION_DECLARATION: {
      // Make function arguments available the function body, and treat them as `const` so they may not be overridden.
      const consts = [...varsInScope.consts]
      for (const { type, value } of node.args) {
        if (type === NT_IDENTIFIER) {
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

    case NT_FUNCTION_CALL: {
      let lambdaVarsRequested = []
      const functionName = node.function.value
      if (!isPropertyAccess && !inScope(functionName, varsInScope)) {
        throw new Error(
          `Function ${functionName} is not defined in the current scope.`
        )
      }
      const expression = `${node.function.value}(${node.children
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

    case NT_IF_EXPR: {
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

    case NT_LITERAL_OBJECT: {
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

    case NT_LITERAL_ARRAY: {
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

    case NT_UNARY_EXPRESSION: {
      const space = node.operator === "-" ? " " : ""
      const [operand, context] = walkNode({
        node: node.operand,
        varsInScope,
      })
      return [`${space}${node.operator}${operand}`, context]
    }

    case NT_BINARY_EXPR: {
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

    case NT_GENERIC_EXPRESSION: {
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

    case NT_LAMBDA: {
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

    case NT_ASSIGNMENT: {
      const [rightSide, context] = walkNode({
        node: node.children[0],
        varsInScope,
      })
      return [`const ${node.variable}=${rightSide}`, context]
    }

    case NT_CONCISE_LAMBDA_ARGUMENT:
    case NT_IDENTIFIER:
    case NT_LITERAL_BOOLEAN:
    case NT_LITERAL_NULL:
    case NT_LITERAL_NUMBER:
    case NT_LITERAL_STRING:
    case NT_LITERAL_UNDEFINED: {
      // Raise errors if attempting to use variables that have not been defined.
      if (node.type === NT_IDENTIFIER && varsInScope) {
        if (!isPropertyAccess && !inScope(node.value, varsInScope)) {
          throw new Error(
            `Variable ${node.value} is not defined in the current scope.`
          )
        }
      }
      const lambdaVarsRequested = []
      if (node.type === NT_CONCISE_LAMBDA_ARGUMENT) {
        lambdaVarsRequested.push(node.value)
      }
      return [node.value, { lambdaVarsRequested }]
    }

    default:
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
    varsInScope: { lets: [], consts: [...jsGlobals] },
  })
  result = defineHelpers(result)
  debugConsole.log("result:\n", result)
  return result
}

module.exports = jsCompile
