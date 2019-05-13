const decode = require('./decode.js')
const InvalidSignatureError = require('./errors/InvalidSignatureError.js')
const verifErrors = require('./errors/verifErrors.js')
const validations = require('./validations.js')
const utils = require('./utils.js')
const { createSigner } = require('./signer.js')

const defaultOptions = {
  alg: 'HS256',
  typ: 'JWT',
  iat: null,
  exp: null,
  nbf: null,
  iss: null,
  aud: null,
  sub: null,
  jti: null,
  header: null,
  payload: null,
  decode: false
}

const HEADER_ARGS = ['alg', 'typ']
const PAYLOAD_ARGS = ['iss', 'aud', 'sub']

/**
 * Verify a JsonWebToken.
 * @param {string} token - The JsonWebToken.
 * @param {string|Buffer} key - The secret or private key.
 * @param {object} options - The verify object options.
 * @returns {boolean|object} True or decoded token.
 */
module.exports = exports = function verify (token, key, options = {}) {
  return new Promise(async (resolve, reject) => {
    utils.checkKey(key)

    const opts = validations.validate(validations.schemas.verify, {
      ...defaultOptions,
      ...options
    })

    const { header, payload, base64 } = await decode(token, { base64: true })

    verifyHeader(header, opts)
    verifyPayload(payload, opts)

    const signer = createSigner(key, { alg: header.alg })
    const stream = signer.sign({
      header: base64.header,
      payload: base64.payload
    })

    stream.once('error', reject)
    stream.once('respond', (signed) => {
      if (signed !== token) {
        reject(new InvalidSignatureError(signed, token))
      } else {
        resolve(!opts.decode ? true : { header, payload })
      }
    })
  })
}

/**
 * Verify a token header.
 * @param {object} header - The header object.
 * @param {object} options - The verify options.
 * @returns {object} Valid header
 */
function verifyHeader (header, options) {
  return verifySegment('header', header, {
    ...utils.mergeTruthy({}, options, HEADER_ARGS),
    ...options.header
  })
}

/**
 * Verify a token payload.
 * @param {object} payload - The payload object.
 * @param {object} options - The verify options.
 * @returns {object} Valid payload
 */
function verifyPayload (payload, options) {
  const now = new Date().getTime()

  if ((options.iat && options.iat > payload.iat)) {
    const Err = verifErrors.iat
    throw new Err('iat', now, payload.iat)
  }

  if ((options.nbf === null && payload.nbf && payload.nbf > now) ||
    (options.nbf === true && payload.nbf > now)) {
    const Err = verifErrors.nbf
    throw new Err('nbf', now, payload.nbf)
  }

  if ((options.exp === null && payload.exp && payload.exp < now) ||
    (options.exp === true && payload.exp < now)) {
    const Err = verifErrors.exp
    throw new Err('exp', now, payload.exp)
  }

  return verifySegment('payload', payload, {
    ...utils.mergeTruthy({}, options, PAYLOAD_ARGS),
    ...options.payload
  })
}

/**
 * Verify a token segment.
 * @param {string} type - The segment type.
 * @param {object} payload - The payload object.
 * @param {object} options - The verify options.
 * @returns {object} Valid segment
 */
function verifySegment (type, segment, definitions) {
  Object.entries(definitions).forEach(([key, definition]) => {
    if (!verifyByDefinition(definition, segment[key])) {
      const Err = verifErrors[key] || verifErrors[type]
      throw new Err(key, segment[key], definition)
    }
  })
  return segment
}

/**
 * Check a token argument, it can be a regex, a string or an array of that.
 * @param {RegExp|string|Array<RegExp|string>} initialDef - The initial input definition.
 * @param {any} value - The tested value.
 * @returns {boolean} Validity state
 */
function verifyByDefinition (initialDef, value) {
  const definitions = Array.isArray(initialDef) ? initialDef : [initialDef]

  if (definitions[0] instanceof RegExp) {
    for (const definition of definitions) {
      if (value.match(definition)) {
        return true
      }
    }
  } else {
    for (const definition of definitions) {
      if (value === definition) {
        return true
      }
    }
  }

  return false
}

(() => {
  const obscureDescriptors = { configurable: false, enumerable: false, writable: false }

  Object.defineProperties(exports, {
    verifyHeader: { value: verifyHeader, ...obscureDescriptors },
    verifyPayload: { value: verifyPayload, ...obscureDescriptors },
    verifySegment: { value: verifySegment, ...obscureDescriptors },
    verifyByDefinition: { value: verifyByDefinition, ...obscureDescriptors },
    getDefaultOptions: { value: () => ({ ...defaultOptions }), ...obscureDescriptors }
  })
})()
