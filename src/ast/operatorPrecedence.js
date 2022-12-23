const operatorPrecedence = (operator) => {
  switch (operator) {
    case "..":
      return 0
    case ".":
      return -1
    case "^":
    case "%":
      return -2
    case "*":
    case "/":
      return -3
    case "+":
    case "-":
      return -4
    case "=":
      return -5
    case "==":
    case "!=":
    case ">":
    case "<":
    case ">=":
    case "<=":
      return -6
    case "->":
      return -7
    default:
      // TODO: Implement test
      throw new Error(`Could not determine precedence for operator ${operator}`)
  }
}

module.exports = operatorPrecedence
