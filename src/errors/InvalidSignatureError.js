const InvalidTokenError = require('./InvalidTokenError.js')

module.exports = class InvalidSignatureError extends InvalidTokenError {
  /**
   * @param {any} current - The current value.
   * @param {any} expected - The validations value.
   */
  constructor (current, expected) {
    super(
      `The JWT signature is not valid, it does not match with provided token.`,
      null,
      current,
      expected
    )
  }
}
