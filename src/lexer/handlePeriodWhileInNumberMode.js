const ct = require("../characterTypes")

const handlePeriodWhileInNumberMode = (state) => {
  // If encountering a period in number mode, assume it is our decimal point.
  if (state.numberMode && state.charType === ct.CT_PERIOD) {
    if (state.numberFloatingPointApplied) {
      state.numberMode = false
      state.numberFloatingPointApplied = false
      // If we've already placed our decimal point and see another dot, it's a new token.
    } else {
      state.numberFloatingPointApplied = true
    }
  }
}

module.exports = handlePeriodWhileInNumberMode
