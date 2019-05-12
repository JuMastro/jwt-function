const readOnlyDescriptor = {
  configurable: false,
  enumerable: true,
  writable: false
}

module.exports = class InvalidTokenError extends Error {
  /**
   * @param {string} message - The error message.
   * @param {string} prop - The targeted property that is not valid.
   * @param {any} current - The current value.
   * @param {any} expected - The validations value.
   */
  constructor (message, prop, current, expected) {
    super(message)

    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      configurable: false,
      enumerable: false,
      writable: false
    })

    Object.defineProperties(this, {
      prop: { value: prop, ...readOnlyDescriptor },
      current: { value: current, ...readOnlyDescriptor },
      expected: { value: expected, ...readOnlyDescriptor }
    })
  }

  asPlain () {
    return Object.fromEntries(
      Object.getOwnPropertyNames(this)
        .slice(1)
        .map((key) => [key, this[key]])
    )
  }
}
