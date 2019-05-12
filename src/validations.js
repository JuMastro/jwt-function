const { ALGORITHMS } = require('./constants.js')

const checks = {
  isString: (arg) => (
    typeof arg === 'string'
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
  )
}

const messages = {
  alg: 'must match with implemented algorithms.',
  str: 'must be type string.',
  strComplete: 'must be a string that is not empty.',
  timestamp: 'must be a timestamp number.',
  timestampTrue: 'must be a timestamp number or true.',
  clearHeader: 'must be an object that does not contain any option property.'
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
  header: { isValid: checks.isValidJwtHeader, message: messages.clearHeader }
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
  const schema = {}

  Object.entries(schemaDefinitions).map(([key, definition]) => {
    Object.assign(schema, {
      [key]: (value) => {
        if ((!definition.required && !value) || definition.isValid(value)) {
          return value
        }

        throw new Error(`The "${key}" argument ${definition.message}`)
      }
    })
  })

  return schema
}

module.exports = (() => {
  const schemas = {}
  const pending = {
    sign: signDefinitions
  }

  // Make usables schemas (Build validation method for each properties using definitions).
  Object.entries(pending).forEach(([schemaKey, schemaDefinitions]) => {
    Object.assign(schemas, {
      [schemaKey]: _prepareSchema(schemaDefinitions)
    })
  })

  return { validate, schemas, checks }
})()
