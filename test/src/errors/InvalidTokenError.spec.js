const InvalidTokenError = require('../../../src/errors/InvalidTokenError.js')

describe('InvalidTokenError new()', () => {
  test('constructor()', () => {
    const err = new InvalidTokenError('message', 'prop', 'current', 'expected')
    expect(err).toBeInstanceOf(Error)
  })

  test('asPlain()', () => {
    const err = new InvalidTokenError('message', 'prop', 'current', 'expected')
    expect(err).toHaveProperty('asPlain')
    const errObj = err.asPlain()
    expect(errObj).toEqual({
      name: 'InvalidTokenError',
      message: 'message',
      prop: 'prop',
      current: 'current',
      expected: 'expected'
    })
  })
})
