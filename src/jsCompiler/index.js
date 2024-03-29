/* global console */
const nt = require("../ast/nodeTypes")

const { nullConsole } = require("../debug")
const zipArrays = require("../util/zipArrays")

let debugConsole

const RANGE_FUNC_NAME = "__RANGE__"
const RANGE_FUNC = `function ${RANGE_FUNC_NAME}(t,f){if(t===f)return[t];const r=[];if(typeof t==="number"&&typeof f==="number"){if(t<f)for(let e=t;e<=f;e++)r.push(e);else for(let e=t;e>=f;e--)r.push(e)}else if(typeof t==="string"&&typeof f==="string"&&t.length&&f.length){const n=String.fromCharCode;const o=t.charCodeAt(),i=f.charCodeAt();if(o<i)for(let e=o;e<=i;e++)r.push(n(e));else for(let e=o;e>=i;e--)r.push(n(e))}return r}`
let shouldDefineRangeFunc = false

const getFunctionName = (name, argsCount) => `${name}$${argsCount}`

// As we iterate through expressions in a block scope, if those expressions are assignment expressions, we must make them available to subsequent siblings.
const mapBlockScope = ({
  nodes,
  assignmentStr = "return ",
  enumDefinitions,
  varsInScope,
}) => {
  let lambdaVarsRequested = []
  const thisBlockEnumDefinitions = [...enumDefinitions]
  if (nodes.length === 0) return ["", { lambdaVarsRequested }]
  const thisBlockVars = {
    weaks: [...varsInScope.weaks],
    consts: [...varsInScope.consts],
  }
  const childStrings = []
  for (const node of nodes) {
    // For function definitions, make the name available to siblings
    if (node.type === nt.FUNCTION_DEFINITION) {
      // Push both the arity function name (e.g., my_func$3)
      thisBlockVars.consts.push(getFunctionName(node.name, node.args.length))
      thisBlockVars.consts.push(node.name)
    }
    const [
      childString,
      { lambdaVarsRequested: childLambdaVarsRequested, enumDefinition },
    ] = walkNode({
      node,
      varsInScope: thisBlockVars,
      enumDefinitions: thisBlockEnumDefinitions,
    })
    if (enumDefinition) {
      thisBlockEnumDefinitions.push(enumDefinition)
    }
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

const validEnumValues = [
  nt.LITERAL_BOOLEAN,
  nt.LITERAL_NUMBER,
  nt.LITERAL_STRING,
]

const walkEnumCases = ({ children, name: enumName }) =>
  children.map((child) => {
    const childType = child.type
    if (childType === nt.IDENTIFIER) {
      const childValue = child.value
      const id = `$__${enumName}.${childValue}`
      return { name: childValue, assigned: false, id }
    } else if (childType === nt.ASSIGNMENT) {
      const childVariable = child.variable
      const childValueNode = child.children[0]
      const id = `$__${enumName}.${childVariable}`
      if (!validEnumValues.includes(childValueNode.type)) {
        // TODO: Implement test
        throw new Error(
          `Invalid enum case value of type ${childValueNode.type} on line ${child.lineNumberStart} when defining enum ${enumName}. Valid values are strings, numbers, and booleans.`
        )
      }
      return { name: childVariable, assigned: true, id, value: childValueNode }
    }
  })

const getEnumDefinitionByName = (identifier, enumDefinitions) =>
  enumDefinitions.find(({ name: enumName }) => enumName === identifier)
const getEnumCase = (identifier, enumDefinition) =>
  enumDefinition.cases.find(({ name: caseName }) => caseName === identifier)

const walkAssumedPrimitive = (node) =>
  walkNode({ node, varsInScope: false, enumDefinitions: false })[0]

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
  enumDefinitions,
}) => {
  debugConsole.log("--------------------------")
  debugConsole.log("node", node)
  debugConsole.log("varsInScope", varsInScope)
  switch (node.type) {
    case nt.ROOT: {
      // eslint-disable-next-line no-unused-vars
      const [result, context] = mapBlockScope({
        nodes: node.children,
        enumDefinitions,
        varsInScope,
        assignmentStr: "",
      })
      return [result, context]
    }

    case nt.FUNCTION_DEFINITION: {
      // Make function arguments available the function body, and treat them as `const` so they may not be overridden.
      const consts = [...varsInScope.consts]
      for (const { type, value } of node.args) {
        if (type === nt.IDENTIFIER) {
          if (inScope(value, varsInScope)) {
            // TODO: Implement test
            throw new Error(
              `Cannot use "${value}" as a function argument on line ${node.lineNumberStart} because it is already defined in the current scope.`
            )
          }
          consts.push(value)
        }
      }
      const [statements, context] = mapBlockScope({
        nodes: node.children,
        enumDefinitions,
        varsInScope: { ...varsInScope, consts },
      })
      const functionName = getFunctionName(node.name, node.args.length)
      const expression = `function ${functionName}(${node.args
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
      const [callableExpression] = walkNode({
        node: node.function,
        enumDefinitions,
        varsInScope,
      })
      let functionName = callableExpression

      if (node.function.type === nt.IDENTIFIER) {
        const nonLambdaName = getFunctionName(callableExpression, args.length)
        if (inScope(nonLambdaName, varsInScope)) functionName = nonLambdaName
      }

      const expression = `${functionName}(${args
        .map((node) => {
          const [
            expression,
            { lambdaVarsRequested: expressionLambdaVarsRequested },
          ] = walkNode({ node, enumDefinitions, varsInScope })
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
          ] = walkNode({ node, enumDefinitions, varsInScope })
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
          enumDefinitions,
          assignmentStr: "tmp=",
          varsInScope,
        })
      lambdaVarsRequested = [...lambdaVarsRequested, ...bodyLambdaVarsRequested]
      let statements = `if(${conditions}){${body}}`
      if (node.else.length > 0) {
        const [elseBody, { lambdaVarsRequested: elseLambdaVarsRequested }] =
          mapBlockScope({
            nodes: node.else,
            enumDefinitions,
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
        `(()=>{let tmp=null;${statements}return tmp})()`,
        { lambdaVarsRequested },
      ]
    }

    case nt.TRY_EXPR: {
      let lambdaVarsRequested = []
      const [body, { lambdaVarsRequested: bodyLambdaVarsRequested }] =
        mapBlockScope({
          nodes: node.children,
          enumDefinitions,
          assignmentStr: "tmp=",
          varsInScope,
        })
      lambdaVarsRequested = [...lambdaVarsRequested, ...bodyLambdaVarsRequested]
      const patternNode = node.handlerPatterns[0]
      const secondPatternNode = node.handlerPatterns[1]
      if (secondPatternNode) {
        // TODO: Implement test
        throw new Error(
          `Multiple error handlers are not supported for the jsCompiler (yet). Evaluating ${secondPatternNode.type}:${secondPatternNode.value} on line ${secondPatternNode.lineNumberStart}`
        )
      }

      let errorVariable = "_",
        catchContentsToPrint = ""
      if (patternNode) {
        if (patternNode.type !== nt.IDENTIFIER) {
          // TODO: Implement test
          throw new Error(
            `Pattern matching is not supported for error handlers in the jsCompiler (yet). Evaluating ${patternNode.type} on line ${patternNode.lineNumberStart}`
          )
        }

        errorVariable = patternNode.value

        const handlerNode = node.handlers[0]
        const [catchContents, { lambdaVarsRequested: lamdbaVarsFromCatch }] =
          mapBlockScope({
            nodes: handlerNode.children,
            assignmentStr: "tmp=",
            enumDefinitions,
            varsInScope: {
              ...varsInScope,
              consts: [...varsInScope.consts, errorVariable],
            },
          })
        catchContentsToPrint = catchContents
        lambdaVarsRequested = [...lambdaVarsRequested, lamdbaVarsFromCatch]
      }

      return [
        `(()=>{let tmp=null;try{${body}}catch(${errorVariable}){${catchContentsToPrint}}return tmp})()`,
        { lambdaVarsRequested },
      ]
    }

    // TODO: Enforce keys for structs. In the short term, struct keys will have to be enforced at runtime using struct helper functions.
    case nt.LITERAL_STRUCT:
    case nt.LITERAL_MAP: {
      let lambdaVarsRequested = []
      const expression = `({${node.keys
        .map((key, index) => {
          const [value, { lambdaVarsRequested: valueLambdaVarsRequested }] =
            walkNode({
              node: node.values[index],
              enumDefinitions,
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
            walkNode({ node, enumDefinitions, varsInScope })
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
        enumDefinitions,
        node: node.operand,
        varsInScope,
      })
      return [`${space}${node.operator}${operand}`, context]
    }

    case nt.BINARY_EXPR: {
      if (node.operator === "->") {
        if (node.right.type !== nt.FUNCTION_CALL) {
          // TODO: Should this check happen in lexer? Either way we should describe the failing token with line/column number.
          // TODO: Implement test
          throw new Error(
            `Attempted to pipe into an expression which is not a function call: "${node.right.type}" on line ${node.right.lineNumberStart}`
          )
        }

        return walkNode({
          node: node.right,
          enumDefinitions,
          varsInScope,
          unshiftedFirstArgFromPipe: node.left,
        })
      }

      let isEnumAccess = false

      if (node.operator === "." && node.left.type === nt.IDENTIFIER) {
        const enumDefinition = getEnumDefinitionByName(
          node.left.value,
          enumDefinitions
        )
        if (enumDefinition) {
          const caseName = node.right.value
          const enumCase = getEnumCase(caseName, enumDefinition)
          if (enumCase) {
            if (enumCase.assigned) {
              return walkNode({
                node: enumCase.value,
                enumDefinitions,
                varsInScope,
              })
            } else {
              const context = { lambdaVarsRequested: [] }
              return [`"${enumCase.id}"`, context]
            }
          } else {
            // TODO: Implement test
            throw new Error(
              `Error on line ${node.right.lineNumberStart}. Case "${caseName}" does not exist on enum "${enumDefinition.name}"`
            )
          }
        }
      }

      const [left, { lambdaVarsRequested: leftLambdaVarsRequested }] = walkNode(
        { node: node.left, enumDefinitions, varsInScope, isEnumAccess }
      )
      const [right, { lambdaVarsRequested: rightLambdaVarsRequested }] =
        walkNode({
          node: node.right,
          enumDefinitions,
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
      } else if (node.operator === "^") {
        return [`Math.pow(${left},${right})`, context]
      } else {
        return [`${left}${jsOperator}${right}`, context]
      }
    }

    case nt.GENERIC_EXPRESSION: {
      let lambdaVarsRequested = []
      const expression = `(${node.children
        .map((node) => {
          const [sibling, { lambdaVarsRequested: siblingLambdaVarsRequested }] =
            walkNode({ node, enumDefinitions, varsInScope })
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
        enumDefinitions,
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
          `Error on line ${node.lineNumberStart}: Variable "${node.variable}" has already been assigned. To allow it to be reassigned, initially assign it as: "weak ${node.variable}"`
        )
      } else if (getEnumDefinitionByName(node.variable, enumDefinitions)) {
        throw new Error(
          `Error on line ${node.lineNumberStart}: Could not assign "${node.variable}" as a variable because it has already been defined as an enum.`
        )
      }
      const [rightSide, context] = walkNode({
        node: node.children[0],
        enumDefinitions,
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

    case nt.STRUCT_DEFINITION: {
      return ["", { lambdaVarsRequested: [] }]
    }

    case nt.ENUM_DEFINITION: {
      const cases = walkEnumCases(node)
      return [
        "",
        {
          lambdaVarsRequested: [],
          enumDefinition: {
            name: node.name,
            cases,
          },
        },
      ]
    }

    case nt.LITERAL_STRING: {
      const lambdaVarsRequested = []
      const escapedSubStrings = node.subStrings.map((subString) =>
        subString.replace(/`/g, "\\`")
      )
      const interpolatedExpressions = node.interpolations.map(
        (interpolationNode) => {
          const [
            expression,
            { lambdaVarsRequested: lambdaVarsFromInterpolation },
          ] = mapBlockScope({
            nodes: interpolationNode.children,
            assignmentStr: "return ",
            enumDefinitions,
            varsInScope,
          })
          lambdaVarsRequested.push(lambdaVarsFromInterpolation)

          return `\${(()=>{${expression}})()}`
        }
      )

      const expression = zipArrays(
        escapedSubStrings,
        interpolatedExpressions
      ).join("")
      return [`\`${expression}\``, { lambdaVarsRequested }]
    }

    case nt.CONCISE_LAMBDA_ARGUMENT:
    case nt.IDENTIFIER:
    case nt.LITERAL_BOOLEAN:
    case nt.LITERAL_NULL:
    case nt.LITERAL_NUMBER: {
      // Raise errors if attempting to use variables that have not been defined.
      if (node.type === nt.IDENTIFIER && varsInScope) {
        if (!isPropertyAccess && !inScope(node.value, varsInScope)) {
          // TODO: Implement test
          throw new Error(
            `Variable ${node.value} on line ${node.lineNumberStart} is not defined in the current scope.`
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
      // TODO: Implement test
      throw new Error(
        `AST node type "${node.type}" has not been implemented for the jsCompiler. See line ${node.lineNumberStart}.`
      )
  }
}

const defineHelpers = (string) => {
  let withHelpers = string
  if (shouldDefineRangeFunc) {
    withHelpers = `${RANGE_FUNC};` + string
  }
  return withHelpers
}

const jsCompile = ({ ast, debug, jsGlobals = [] }) => {
  debugConsole = debug ? console : nullConsole
  debugConsole.dir(["ast", ast], { depth: null })

  let [result] = walkNode({
    node: ast,
    varsInScope: { weaks: [], consts: [...jsGlobals] },
    enumDefinitions: [],
  })
  result = defineHelpers(result)
  debugConsole.log("result:\n", result)
  return result
}

module.exports = jsCompile
