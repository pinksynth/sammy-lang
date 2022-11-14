const {
  NT_ROOT,
  NT_FUNCTION_DECLARATION,
  NT_IDENTIFIER,
  NT_LITERAL_OBJECT,
  NT_LITERAL_BOOLEAN,
  NT_LITERAL_UNDEFINED,
  NT_LITERAL_NULL,
  NT_LITERAL_ARRAY,
  NT_LITERAL_NUMBER,
  NT_LAMBDA,
  NT_BINARY_EXPR,
  NT_CONCISE_LAMBDA_ARGUMENT,
  NT_IF_EXPR,
  NT_FUNCTION_CALL,
  NT_ASSIGNMENT,
  NT_LITERAL_STRING,
} = require("./ast")
const { nullConsole } = require("./debug")

// As we iterate through expressions in a block scope, if those expressions are assignment expressions, we must make them available to subsequent siblings.
const mapBlockScope = ({ nodes, assignmentStr = "return ", varsInScope }) => {
  console.log("Mapping")
  if (nodes.length === 0) return ""
  const thisBlockVars = {
    lets: [...varsInScope.lets],
    consts: [...varsInScope.consts],
  }
  const childStrings = []
  for (const node of nodes) {
    if (node.type === NT_ASSIGNMENT) {
      thisBlockVars.consts.push(node.variable)
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

const initVarsInScope = { lets: [], consts: [] }

const walkAssumedPrimitive = (node) => walkNode({ node, varsInScope: false })

const walkNode = ({ node, varsInScope = initVarsInScope }) => {
  console.log("--------------------------")
  console.log("node", node)
  switch (node.type) {
    case NT_ROOT:
      return mapBlockScope({
        nodes: node.children,
        varsInScope,
        assignmentStr: "",
      })

    case NT_FUNCTION_DECLARATION:
      return `function ${node.name}(${node.args
        .map(walkAssumedPrimitive)
        .join(",")}){${mapBlockScope({
        nodes: node.children,
        varsInScope,
      })}}`

    case NT_FUNCTION_CALL:
      return `${node.function.value}(${node.children
        .map(walkAssumedPrimitive)
        .join(",")})`

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
      return node.children
        .map((node) => walkNode({ node, varsInScope }))
        .join(",")

    case NT_BINARY_EXPR: {
      const left = walkNode({ node: node.left, varsInScope })
      const right = walkNode({ node: node.right, varsInScope })
      let jsOperator

      switch (node.operator) {
        case "*":
        case "/":
        case "+":
        case "-":
        case ".":
          jsOperator = node.operator
          break
        case "==":
          jsOperator = "==="
          break
        default:
          break
      }

      return `${left}${jsOperator}${right}`
    }

    case NT_LAMBDA: {
      let argsString
      if (node.args.length > 0) {
        argsString = node.args.map(walkAssumedPrimitive)
      } else {
        // TODO: This is really dumb. The lambda should know how many of its arguments are desired and define concise args accordingly.
        argsString = "$1,$2,$4,$5,$6,$7,$8,$9,$10"
      }
      return `(${argsString})=>{${mapBlockScope({
        nodes: node.children,
        varsInScope,
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
      // if (node.type === NT_IDENTIFIER) {
      // }
      return node.value
    }

    default:
      break
  }
}

const jsCompile = ({ ast, debug }) => {
  // const debugConsole = debug ? console : nullConsole
  console.dir(["ast", ast], { depth: null })
  const result = walkNode({ node: ast })
  console.log("result:\n", result)
  return result
}

module.exports = jsCompile
