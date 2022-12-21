const trimStringTokenValue = require("./trimStringTokenValue")

const handleStringInterpAfter = ({ node, pop, token }) => {
  const stringNode = node.parent
  const subStrings = stringNode.subStrings

  subStrings.push(trimStringTokenValue(token.value))

  // Pop out of string interpolation
  pop()
  // Pop out of string expression
  pop()
}

module.exports = handleStringInterpAfter
