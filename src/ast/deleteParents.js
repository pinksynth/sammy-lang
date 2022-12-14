const deleteParents = (node) => {
  if (Array.isArray(node)) {
    return node.map(deleteParents)
  } else if (typeof node === "object") {
    const obj = {}
    for (const [key, value] of Object.entries(node)) {
      if (key === "parent") continue

      obj[key] = deleteParents(value)
    }
    return obj
  }
  return node
}

module.exports = deleteParents
