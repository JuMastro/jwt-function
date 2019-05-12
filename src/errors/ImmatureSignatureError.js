const InvalidTokenError = require('./InvalidTokenError.js')

module.exports = class ImmatureSignatureError extends InvalidTokenError {
  /**
   * @param {string} prop - The targeted property that is not valid.
   * @param {any} current - The current value.
   * @param {any} expected - The validations value.
   */
  constructor (prop, current, expected) {
    super(
      'The JWT is not yet mature. The JWT notBefore (nbf) is not reached.',
      prop,
      current,
      expected
    )
  }
}
