'use strict'

const hmacSHA256 = require('crypto-js/hmac-sha256')

/**
 * Function verify. This function check json web token validity.
 * @param {string} secret - The secret key used to hash parts. 
 * @param {string} token - The token it needed to be check.
 */
const verify = function (secret, token) {
  if (!token || typeof token !== 'string') {
    return error('Invalid token!')
  }

  if (!secret || typeof secret !== 'string') {
    return error('Invalid secret key!')
  }

  const cases = token.split('.')

  if (cases.length !== 3) {
    return error('Invalid json web token format!')
  }
  
  const [encodedHeader, encodedPayload, hashedSign] = cases
  const header = base64ToObject(encodedHeader)
  const payload = base64ToObject(encodedPayload)

  if (hashedSign !== hmacSHA256(`${encodedHeader}.${encodedPayload}`, secret).toString() ||
      !header.hasOwnProperty('typ') || header.typ !== 'JWT' ||
      !header.hasOwnProperty('alg') || header.alg !== 'HS256' ||
      new Date().getTime() > payload.exp) {
    return error('Invalid json web token!')
  }
  
  return { status: 'success', payload: payload }
}

/**
 * This function is private function used to convert a base64 string to object.
 * First step it's to decode from base64, then it's parsed.
 * @param {string} string - The base64 string we need to convert.
 * @returns {object} Decoded object from string parameter.
 */
const base64ToObject = function (string) {
  return JSON.parse(Buffer.from(string, 'base64').toString())
}

const error = function (message) {
  return { type: 'error', msg: message }
}

module.exports = verify
