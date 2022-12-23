// Zips two arrays together, allowing arrayA to be the arrayB.length or arrayB.length + 1
// Examples:
//     zipArrays([1, 2, 3], ["a", "b", "c"]) //=> [1, "a", 2, "b", 3, "c"]
//     zipArrays([1, 2, 3, 4], ["a", "b", "c"]) //=> [1, "a", 2, "b", 3, "c", 4]
//     zipArrays([1, 2, 3, 4, 5], ["a", "b", "c"]) //=> Error
const zipArrays = (arrayA, arrayB) => {
  if (arrayA.length !== arrayB.length && arrayA.length !== arrayB.length + 1) {
    // TODO: Implement test
    throw new Error(
      `Arrays provided to zipArrays were not of valid lengths. First array length: ${arrayA.length}; Second array length: ${arrayB.length}.`
    )
  }
  const newArray = []
  // We use the length of arrayB for the initial zipping, so the new array will have an even number.
  for (let childIndex = 0; childIndex < arrayB.length; childIndex++) {
    const elementA = arrayA[childIndex]
    const elementB = arrayB[childIndex]
    newArray.push(elementA)
    newArray.push(elementB)
  }

  // If arrayA has one more element, add it to the end.
  if (arrayA.length === arrayB.length + 1) {
    newArray.push(arrayA[arrayA.length - 1])
  }

  return newArray
}

module.exports = zipArrays
