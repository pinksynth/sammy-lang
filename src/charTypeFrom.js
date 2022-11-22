const characterRanges = require("./characterRanges")

// To efficiently check types of character codes, use an object in which all possible character values
const charTypesByCharCode = {}
for (const [charType, ranges] of Object.entries(characterRanges)) {
  for (const [min, max] of ranges) {
    if (max === undefined) {
      charTypesByCharCode[min.charCodeAt()] = charType
    } else {
      for (
        let charCode = min.charCodeAt();
        charCode <= max.charCodeAt();
        charCode++
      ) {
        charTypesByCharCode[charCode] = charType
      }
    }
  }
}

const charTypeFrom = (char) => charTypesByCharCode[char.charCodeAt(0)]

module.exports = charTypeFrom
