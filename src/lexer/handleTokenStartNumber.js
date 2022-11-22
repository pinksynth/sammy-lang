const ct = require("../characterTypes")

const handleTokenStartNumber = (state) => {
  if (state.charAccumulator.length === 0 && state.charType === ct.CT_NUMBER) {
    state.numberMode = true
  }
}

module.exports = handleTokenStartNumber
