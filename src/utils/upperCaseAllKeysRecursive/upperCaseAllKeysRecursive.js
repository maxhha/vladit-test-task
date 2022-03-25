export function upperCaseAllKeysRecursive(obj) {
  if (typeof obj !== "object" || Array.isArray(obj) || obj === null) {
    return obj
  }

  const result = {}

  for (let key of Object.keys(obj)) {
    const newKey = key.toUpperCase()

    if (newKey in result) {
      throw new Error(`Already have uppercased key "${newKey}"`)
    }

    result[newKey] = upperCaseAllKeysRecursive(obj[key])
  }

  return result
}
