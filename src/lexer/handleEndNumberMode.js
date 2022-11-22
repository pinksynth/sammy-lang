const ct = require("../characterTypes")

const handleEndNumberMode = (state) => {
  if (
    state.numberMode &&
    state.charType !== ct.CT_NUMBER &&
    state.charType !== ct.CT_UNDERSCORE &&
    state.charType !== ct.CT_PERIOD
  ) {
    state.numberMode = false
    state.numberFloatingPointApplied = false
  }
}

module.exports = handleEndNumberMode
