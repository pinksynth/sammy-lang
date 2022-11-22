const ct = require("../characterTypes")

const handleOpenLambdaArgIdentifierMode = (state) => {
  if (
    state.charAccumulator.length === 0 &&
    state.charType === ct.CT_DOLLAR_SIGN
  ) {
    state.lambdaArgIdentifierMode = true
  }
}

module.exports = handleOpenLambdaArgIdentifierMode
