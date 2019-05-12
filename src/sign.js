const utils = require('./utils.js')
const validations = require('./validations.js')
const signer = require('./signer.js')

const headerOptions = ['alg', 'typ']
const payloadOptions = ['iat', 'exp', 'nbf', 'iss', 'aud', 'sub', 'jti']
const defaultOptions = {
  alg: 'HS256',
  typ: 'JWT',
  iat: true,
  exp: null,
  nbf: null,
  iss: null,
  aud: null,
  sub: null,
  jti: null,
  header: null
}

/**
 * Sign an object and return a JsonWebToken.
 * @param {object} data - The payload data.
 * @param {string} key - The secret or private key.
 * @param {object} options - The payload options.
 * @returns {Promise<Error, string>} JsonWebToken
 */
module.exports = function sign (data, key, options = {}) {
  return new Promise((resolve, reject) => {
    if (!utils.isPlainObject(data)) {
      return reject(new TypeError('The "data" argument must be a plain object.'))
    }

    const opts = validations.validate(validations.schemas.sign, {
      ...defaultOptions,
      ...options
    })

    utils.checkKey(key)

    opts.iat = (opts.iat && typeof opts.iat === 'boolean')
      ? new Date().getTime()
      : opts.iat

    const headerObj = {
      ...utils.mergeTruthy({}, opts, headerOptions),
      ...(opts.header || {})
    }

    const payloadObj = utils.mergeTruthy(data, opts, payloadOptions)
    const header = utils.objectToBase64Url(headerObj)
    const payload = utils.objectToBase64Url(payloadObj)

    signer.createSigner(key, opts)
      .once('error', reject)
      .once('respond', resolve)
      .sign({ header, payload })
  })
}
