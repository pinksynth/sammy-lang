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
  debugConsole.log("Mapping")
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
    childStrings.push(walkNode({ node, varsInScope: thisBlockVars }))
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
  return childStrings.join(";")
}

const walkAssumedPrimitive = (node) => walkNode({ node, varsInScope: false })

const inScope = (theVar, varsInScope) =>
  varsInScope.lets.includes(theVar) || varsInScope.consts.includes(theVar)

const walkNode = ({ node, varsInScope, isPropertyAccess }) => {
  debugConsole.log("--------------------------")
  debugConsole.log("node", node)
  debugConsole.log("varsInScope", varsInScope)
  switch (node.type) {
    case NT_ROOT:
      return mapBlockScope({
        nodes: node.children,
        varsInScope,
        assignmentStr: "",
      })

    case NT_FUNCTION_DECLARATION: {
      // Make function arguments available the function body, and treat them as `const` so they may not be overridden.
      const consts = [...varsInScope.consts]
      for (const { type, value } of node.args) {
        if (type === NT_IDENTIFIER) {
          consts.push(value)
        }
      }
      return `function ${node.name}(${node.args
        .map(walkAssumedPrimitive)
        .join(",")}){${mapBlockScope({
        nodes: node.children,
        varsInScope: { ...varsInScope, consts },
      })}}`
    }

    case NT_FUNCTION_CALL: {
      const functionName = node.function.value
      if (!isPropertyAccess && !inScope(functionName, varsInScope)) {
        throw new Error(
          `Function ${functionName} is not defined in the current scope.`
        )
      }
      return `${node.function.value}(${node.children
        .map((node) => walkNode({ node, varsInScope }))
        .join(",")})`
    }

    case NT_IF_EXPR: {
      let statements = `if(${node.condition
        .map((node) => walkNode({ node, varsInScope }))
        .join("&&")}){${mapBlockScope({
        nodes: node.children,
        assignmentStr: "tmp=",
        varsInScope,
      })}}`
      if (node.else.length > 0) {
        statements += `else{${mapBlockScope({
          nodes: node.else,
          assignmentStr: "tmp=",
          varsInScope,
        })}}`
      }
      return `(()=>{let tmp;${statements}return tmp})()`
    }

    case NT_LITERAL_OBJECT:
      return `({${node.keys
        .map((key, index) => {
          return `${key.value}:${walkNode({
            node: node.values[index],
            varsInScope,
          })}`
        })
        .join(",")}})`

    case NT_LITERAL_ARRAY:
      if (node.children.length === 0) return "[]"
      return `[${node.children
        .map((node) => walkNode({ node, varsInScope }))
        .join(",")}]`

    case NT_UNARY_EXPRESSION: {
      const space = node.operator === "-" ? " " : ""
      return `${space}${node.operator}${walkNode({
        node: node.operand,
        varsInScope,
      })}`
    }

    case NT_BINARY_EXPR: {
      const left = walkNode({ node: node.left, varsInScope })
      const right = walkNode({
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

      if (node.operator === "..") {
        shouldDefineRangeFunc = true
        return `(${RANGE_FUNC_NAME}(${left},${right}))`
      } else {
        return `${left}${jsOperator}${right}`
      }
    }

    case NT_GENERIC_EXPRESSION: {
      return `(${node.children
        .map((node) => walkNode({ node, varsInScope }))
        .join(",")})`
    }

    case NT_LAMBDA: {
      let argsStrings
      const consts = [...varsInScope.consts]
      if (node.args.length > 0) {
        argsStrings = node.args.map(walkAssumedPrimitive)
      } else {
        // TODO: This is really dumb. The lambda should know how many of its arguments are desired and define concise args accordingly.
        argsStrings = ["$1", "$2", "$4", "$5", "$6", "$7", "$8", "$9", "$10"]
      }

      return `(${argsStrings.join(",")})=>{${mapBlockScope({
        nodes: node.children,
        varsInScope: { ...varsInScope, consts: [...consts, ...argsStrings] },
      })}}`
    }

    case NT_ASSIGNMENT: {
      return `const ${node.variable}=${walkNode({
        node: node.children[0],
        varsInScope,
      })}`
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
      return node.value
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
  let result = walkNode({
    node: ast,
    varsInScope: { lets: [], consts: [...jsGlobals] },
  })
  result = defineHelpers(result)
  debugConsole.log("result:\n", result)
  return result
}

module.exports = jsCompile
