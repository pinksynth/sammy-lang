const nt = require("./nodeTypes")
const trimStringTokenValue = require("./trimStringTokenValue")

const handleStringInterpBetween = ({ node, setNode, token }) => {
  const stringNode = node.parent
  const subStrings = stringNode.subStrings
  const interpolations = stringNode.interpolations

  subStrings.push(trimStringTokenValue(token.value))

  const interpolation = {
    parent: stringNode,
    type: nt.STRING_INTERPOLATION,
    children: [],
  }

  interpolations.push(interpolation)

  setNode(interpolation)
}

module.exports = handleStringInterpBetween
