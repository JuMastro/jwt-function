const InvalidTokenError = require('./errors/InvalidTokenError.js')
const { base64ToObject } = require('./utils.js')

const REGEX_JWT = /^([\w-]+)\.([\w-]+)\.([\w-]+)$/

/**
 * Decode a JsonWebToken.
 * @param {string} token - The JsonWebToken.
 * @returns {Promise<InvalidTokenError, object>} { header, payload, base64? }
 */
module.exports = function decode (token, options = {}) {
  try {
    const base64 = Boolean(options.base64)
    const [_, b64Header, b64Payload, b64Signature] = token.match(REGEX_JWT)
    const objects = {
      header: base64ToObject(b64Header),
      payload: base64ToObject(b64Payload)
    }

    const decoded = {
      ...objects,
      ...(base64 && {
        base64: {
          header: b64Header,
          payload: b64Payload,
          signature: b64Signature
        }
      })
    }

    return decoded
  } catch (err) {
    throw new InvalidTokenError('The provided JWT is not valid.')
  }
}
