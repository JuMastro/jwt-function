const { createHmac } = require('crypto')
const { urlEncode } = require('./utils.js')

const ALG_DECOMPOSER = /^(\w{2})(\d{3})$/
const ALG_SIGN_TYPES = {
  // TODO: Implement RS alg
  'HS': (bits, secret) => createHmac(`sha${bits}`, secret)
}

/**
 * Create a signer stream depend on safe valid algorithm.
 * @param {string|Buffer} secret - Secret or private key.
 * @param {string} alg - The safe valid algorithm.
 * @returns {Stream} Signer stream.
 */
function createSigner (secret, { alg }) {
  const [_, type, bits] = alg.match(ALG_DECOMPOSER)
  const signer = ALG_SIGN_TYPES[type](bits, secret)
  return Object.assign(signer, {
    sign: signToken.bind(signer)
  })
}

/**
 * Signature method to bind to a signer stream.
 * @param {object} header - The token header.
 * @param {object} payload - The token payload.
 * @returns {Stream} SignerStream context.
 */
function signToken ({ header, payload }) {
  const chunks = []

  this.once('end', () => this.emit('respond', getToken(chunks, header, payload)))
  this.on('data', (chunk) => chunks.push(chunk))
  this.end(`${header}.${payload}`)

  return this
}

/**
 * Wrap tokens parts (header, payload, signature) to get a JsonWebToken.
 * @param {Array<string>} chunks - The signature chunks.
 * @param {string} header - The base64 header.
 * @param {string} payload - The base64 payload.
 * @returns {string} JsonWebToken.
 */
function getToken (chunks, header, payload) {
  const signature = chunks
    .map((buff) => buff.toString('base64'))
    .join('')

  return [header, payload, urlEncode(signature)].join('.')
}

module.exports = {
  createSigner,
  getToken,
  ALG_DECOMPOSER,
  ALG_SIGN_TYPES
}
