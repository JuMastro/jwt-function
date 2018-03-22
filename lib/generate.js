'use strict'

const hmacSHA256 = require('crypto-js/hmac-sha256')

/**
 * Function generate. This function build a json web token.
 * @param {string} secret - The secret key to hash the jwt.
 * @param {object} [options={}] - The parameters of jwt payload.
 * @returns {object} An object contains valid or invalid response.
 */
const generate = function (secret, options = {}) {
  if (typeof options !== 'object' || Object.keys(options).length === 0) {
    throw new Error('Invalid options object!')
  }

  if (!options.iss || typeof options.iss !== 'string') {
    throw new Error('Invalid options property: "iss" is a required, and it need to be a string!')
  }

  if (options.exp && !Number.isInteger(options.exp)) {
    throw new Error('Invalid options property, exp is optional but if it\'s declared it need to be an integer!')
  }

  const now = new Date().getTime()

  let parameters = {
    iss: options.iss,
    iat: now,
    exp: now + (options.exp ? options.exp : 1 * 24 * 60 * 60 * 1000),
  }

  const keys = Object.keys(options)

  for (let i =  0; i < keys.length; ++i) {
    if (!parameters.hasOwnProperty(keys[i])) {
      parameters[keys[i]] = options[keys[i]]
    }
  }

  const header = objectToBase64({ typ: 'JWT', alg: 'HS256' })
  const payload = objectToBase64(parameters)
  const sign = hmacSHA256(`${header}.${payload}`, secret).toString()

  return `${header}.${payload}.${sign}`
}

/**
 * This function is private function used to convert an object to base64 string.
 * First step it's stringify the object, then encode it to base64.
 * @param {object} object - The object we need to convert.
 * @returns {Buffer} A buffer build from object parameter.
 */
const objectToBase64 = function (object) {
  return Buffer.from(JSON.stringify(object)).toString('base64')
}

module.exports = generate
