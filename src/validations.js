const { ALGORITHMS } = require('./constants.js')
const { isArrayOf, isPlainObject } = require('./utils.js')

const checks = {
  isString: (arg) => (
    typeof arg === 'string'
  ),

  isBoolean: (arg) => (
    typeof arg === 'boolean'
  ),

  isCompleteString: (arg) => (
    typeof arg === 'string' && arg.trim().length > 0
  ),

  isValidAlgorithm: (arg) => (
    ALGORITHMS.includes(arg) || arg === 'NONE'
  ),

  isValidTimestamp: (arg) => (
    Number.isInteger(arg) && arg > 0
  ),

  isValidTimestampOrTrue: (arg) => (
    arg === true || checks.isValidTimestamp(arg)
  ),

  isValidJwtHeader: (arg) => (
    typeof arg === 'object' && arg !== null && !('alg' in arg) && !('typ' in arg)
  ),

  isValidStringRange: (arg) => (
    typeof arg === 'string' || isArrayOf(arg, (x) => typeof x === 'string')
  ),

  isValidCompleteStringRange: (arg) => (
    checks.isCompleteString(arg) || isArrayOf(arg, checks.isCompleteString)
  ),

  isValidAlgorithmRange: (arg) => (
    ALGORITHMS.includes(arg) || isArrayOf(arg, (x) => ALGORITHMS.includes(x))
  ),

  isValidMultiRange: (arg) => (
    typeof arg === 'string' ||
    arg instanceof RegExp ||
    isArrayOf(arg, (x) => typeof x === 'string') ||
    isArrayOf(arg, (x) => x instanceof RegExp)
  ),

  isValidMultiRangeObj: (arg) => (
    isPlainObject(arg)
      ? !Object.values(arg).map(checks.isValidMultiRange).includes(false)
      : false
  )
}

const messages = {
  alg: 'must match with implemented algorithms.',
  str: 'must be type string.',
  strComplete: 'must be a string that is not empty.',
  boolean: 'must be a boolean.',
  timestamp: 'must be a timestamp number.',
  timestampTrue: 'must be a timestamp number or true.',
  clearHeader: 'must be an object that does not contain any option property.',
  algRange: 'must be an allowed algorithm or an array of that.',
  strRange: 'must be a string or an array of that.',
  strCompleteRange: 'must be a valid string that not empty or an array of that.',
  multiRange: 'must be a string, a regex or an array of that.',
  multiRangeObj: 'must be an object who contain string, regex or an array of that.'
}

const signDefinitions = {
  alg: { required: true, isValid: checks.isValidAlgorithm, message: messages.alg },
  typ: { required: true, isValid: checks.isString, message: messages.str },
  iat: { isValid: checks.isValidTimestampOrTrue, message: messages.timestampTrue },
  exp: { isValid: checks.isValidTimestamp, message: messages.timestamp },
  nbf: { isValid: checks.isValidTimestamp, message: messages.timestamp },
  iss: { isValid: checks.isCompleteString, message: messages.strComplete },
  aud: { isValid: checks.isCompleteString, message: messages.strComplete },
  sub: { isValid: checks.isCompleteString, message: messages.strComplete },
  jti: { isValid: checks.isCompleteString, message: messages.strComplete },
  header: { isValid: checks.isValidJwtHeader, message: messages.clearHeader }
}

const verifyDefinitions = {
  alg: { required: true, isValid: checks.isValidAlgorithmRange, message: messages.algRange },
  typ: { isValid: checks.isValidStringRange, message: messages.strRange },
  iat: { isValid: checks.isValidTimestamp, message: messages.timestamp },
  exp: { isValid: checks.isBoolean, message: messages.boolean },
  nbf: { isValid: checks.isBoolean, message: messages.boolean },
  iss: { isValid: checks.isValidMultiRange, message: messages.multiRange },
  aud: { isValid: checks.isValidMultiRange, message: messages.multiRange },
  sub: { isValid: checks.isValidMultiRange, message: messages.multiRange },
  jti: { isValid: checks.isValidMultiRange, message: messages.multiRange },
  header: { isValid: checks.isValidMultiRangeObj, message: messages.multiRangeObj },
  payload: { isValid: checks.isValidMultiRangeObj, message: messages.multiRangeObj },
  decode: { isValid: checks.isBoolean, message: messages.boolean }
}

/**
 * Validate a set of data using a schema.
 * @param {object} schema - The validations schema.
 * @param {object} data - The set of data.
 * @param {object} reference - The set of default data used as reference.
 * @returns {object} The valid data set.
 */
function validate (schema, data, reference = {}) {
  const safe = { ...reference, ...data }

  Object.entries(safe).forEach(([key, value]) => {
    if (!(key in schema)) {
      throw new Error(`The "${key}" argument is not an allowed option property.`)
    }

    schema[key](value)
  })

  return safe
}

/**
 * Build an usable schema from definitions.
 * @param {object} schemaDefinitions - The schema definition to build.
 * @returns {Array<object>} The usable schema.
 * @throws {Error} Required or invalid data.
 */
function _prepareSchema (schemaDefinitions) {
  return Object.fromEntries(
    Object.entries(schemaDefinitions).map(([key, definition]) => [
      key,
      (value) => {
        if ((!definition.required && !value) || definition.isValid(value)) {
          return value
        }

        throw new Error(`The "${key}" argument ${definition.message}`)
      }
    ])
  )
}

module.exports = (() => {
  const pending = {
    sign: signDefinitions,
    verify: verifyDefinitions
  }

  // Make usables schemas (Build validation method for each properties using definitions).
  const schemas = Object.fromEntries(
    Object.entries(pending).map(([key, definitions]) => [
      key,
      _prepareSchema(definitions)
    ])
  )

  console.log(schemas)

  return { validate, schemas, checks }
})()
