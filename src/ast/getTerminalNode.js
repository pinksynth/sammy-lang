const tt = require("../tokenTypes")
const nt = require("./nodeTypes")

// Gets a terminal node from primitive tokens such as booleans, numbers, or strings.
const getTerminalNode = ({ value, tokenType }) => {
  let type,
    nodeValue = value
  switch (tokenType) {
    case tt.BOOLEAN:
      type = nt.LITERAL_BOOLEAN
      break
    case tt.NULL:
      type = nt.LITERAL_NULL
      break
    case tt.UNDEFINED:
      type = nt.LITERAL_UNDEFINED
      break
    case tt.STRING:
      type = nt.LITERAL_STRING
      break
    // For numbers, we strip the allowed underscores and just basic float syntax
    case tt.NUMBER: {
      type = nt.LITERAL_NUMBER
      let numberValue = ""
      for (const char of value) {
        if (char !== "_") numberValue += char
      }
      nodeValue = numberValue
      break
    }
    case tt.VAR:
      type = nt.IDENTIFIER
      break
    case tt.CONCISE_LAMBDA_ARGUMENT:
      type = nt.CONCISE_LAMBDA_ARGUMENT
      break
    default:
      throw new Error(`Invalid type ${tokenType}`)
  }
  return {
    type,
    value: nodeValue,
  }
}

module.exports = getTerminalNode
