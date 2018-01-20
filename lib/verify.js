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

  const readablePayload = JSON.parse(Buffer.from(payload, 'base64').toString())
  const now = new Date().getTime()
  const tokenLimit = Number.isInteger(readablePayload.exp) ? readablePayload.exp : now - 1

  if (sign !== hmacSHA256(`${header}.${payload}`, secret).toString() || now > tokenLimit) {
    return error('This token is invalid!')
  }

  return { status: 'success', isValidToken: true }
}

module.exports = verify
