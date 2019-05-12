const InvalidTokenError = require('./InvalidTokenError.js')

module.exports = class InvalidSubjectError extends InvalidTokenError {
  /**
   * @param {string} prop - The targeted property that is not valid.
   * @param {any} current - The current value.
   * @param {any} expected - The validations value.
   */
  constructor (prop, current, expected) {
    super(
      'The JWT subject (sub) is not valid.',
      prop,
      current,
      expected
    )
  }
}
