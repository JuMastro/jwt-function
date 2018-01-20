'use strict'

const hmacSHA256 = require('crypto-js/hmac-sha256')
const error = require('./sendError')

/**
 * generate jwt
 * @param {Object} user - the user object contain id and username
 * @param {string} secret - the secret key used to encoded
 * @param {Object} [options={}] - payload token options
 * @returns {string} token - the token generated with the secret
 */
function generate (user, secret, options = {}) {
  if (!user) {
    return error('The user you transmit is invalid!')
  }

  if (!user.id) {
    return error('id is a required prop for user!');
  }

  if (options === {} || typeof options !== 'object') {
    return error('Invalid options!')
  }

  if (!options.iss || typeof options.iss !== 'string') {
    return error(
      'Invalid props options : "iss" is a required props, and it need to be a string!'
    )
  }

  if (options.exp && !Number.isInteger(options.exp)) {
    return error('options.exp is optional but if it\'s declared it need to be an integer!')
  }

  const now = new Date().getTime()

  let params = {
    iss: options.iss,
    iat: now,
    exp: now + options.exp || 1 * 24 * 60 * 60 * 1000,
    id: user.id,
    username: user.username || 'unknown'
  }

  const optionsKeys = Object.keys(options)

  /** transfer new params from options */
  for (let i = 0; i < optionsKeys.length; ++i) {
    if (!Object.keys(params).includes(optionsKeys[i])) {
      params[optionsKeys[i]] = options[optionsKeys[i]]
    }
  }

  const header = toBase64({ typ: 'JWT', alg: 'HS256' })
  const payload = toBase64(params)
  const signature = hmacSHA256(`${header}.${payload}`, secret).toString()
  const token = `${header}.${payload}.${signature}`

  return { status: 'success', token: token }
}

/**
 * convert object to base64 string 
 * @param {Object} obj 
 */
function toBase64 (obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64')
}

module.exports = generate
