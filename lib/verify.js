'use strict'

const hmacSHA256 = require('crypto-js/hmac-sha256')
const error = require('./sendError')

/**
 * verify if JWT is valid
 * @param {string} token
 * @param {string} secret
 */
function verify (token, secret) {
  if (!token || typeof token !== 'string') {
    console.log(token)
    return error('A problem with the token has been detected!')
  }

  if (!secret || typeof secret !== 'string') {
    return error('A problem with the secret key has been detected!')
  }

  const cases = token.split('.')

  if (cases.length !== 3) {
    return error('This token has an invalid format!')
  }

  const [header, payload, sign] = cases

  if (sign !== hmacSHA256(header + '.' + payload, secret).toString()) {
    return error('This token is invalid!')
  }

  return { status: 'success', isValidToken: true }
}

module.exports = verify
