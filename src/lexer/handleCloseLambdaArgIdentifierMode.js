const ct = require("../characterTypes")

const handleCloseLambdaArgIdentifierMode = (state) => {
  if (state.lambdaArgIdentifierMode && state.charType !== ct.CT_NUMBER) {
    state.lambdaArgIdentifierMode = false
  }
}

module.exports = handleCloseLambdaArgIdentifierMode
