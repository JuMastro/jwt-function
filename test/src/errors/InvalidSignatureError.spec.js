const InvalidSignatureError = require('../../../src/errors/InvalidSignatureError.js')

describe('InvalidTokenError new()', () => {
  test('constructor()', () => {
    const err = new InvalidSignatureError('current', 'expected')
    const obj = err.asPlain()
    expect(obj).toHaveProperty('name', 'InvalidSignatureError')
    expect(obj).toHaveProperty('current', 'current')
    expect(obj).toHaveProperty('expected', 'expected')
  })
})
