const jwtfn = require('../../src/index.js')

describe('root', () => {
  test('lib input has valid object export', () => {
    expect(jwtfn).toHaveProperty('sign')
    expect(jwtfn).toHaveProperty('verify')
    expect(jwtfn).toHaveProperty('decode')
  })
})
