const InvalidTokenError = require('./InvalidTokenError.js')

module.exports = class ExpiredSignatureError extends InvalidTokenError {
  /**
   * @param {string} prop - The targeted property that is not valid.
   * @param {any} current - The current value.
   * @param {any} expected - The validations value.
   */
  constructor (prop, current, expected) {
    super(
      'The JWT is no longer valid. The expiration (exp) date is outdated.',
      prop,
      current,
      expected
    )
  }
}
