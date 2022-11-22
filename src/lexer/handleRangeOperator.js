const ct = require("../characterTypes")

const handleRangeOperator = (state) => {
  // If encountering a period followed by another period, turn off number mode because this will be a range operator (..)
  if (
    state.numberMode &&
    state.nextCharType === ct.CT_PERIOD &&
    state.thirdCharType === ct.CT_PERIOD
  ) {
    state.numberMode = false
  }
}

module.exports = handleRangeOperator
