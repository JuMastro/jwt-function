const InvalidTokenError = require('./InvalidTokenError.js')

module.exports = class InvalidPayloadError extends InvalidTokenError {
  /**
   * @param {string} prop - The targeted property that is not valid.
   * @param {any} current - The current value.
   * @param {any} expected - The validations value.
   */
  constructor (prop, current, expected) {
    super(
      `The JWT payload supplied property "${prop}" is not valid.`,
      prop,
      current,
      expected
    )
  }
}
