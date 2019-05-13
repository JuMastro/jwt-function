const sign = require('../../src/sign.js')

const body = { user: '42' }
const secret = 'secret'

describe('sign()', () => {
  test('throw when provide invalid type (plain-object (required))', () => {
    expect(() => sign('badType', secret))
      .toThrowError('The "data" argument must be a plain object.')
  })

  test('throw when provided invalid private or secret key', () => {
    expect(() => sign(body, 12545))
      .toThrowError('The "key" argument must be type string or a Buffer.')
  })

  test('work fine and return valid JWT with default options', () => {
    expect(sign(body, secret))
      .toEqual(expect.stringMatching(/[\w-]+\.[\w-]+\.[\w-]+/))
  })

  test('work fine and return valid JWT with false "iat" options', () => {
    expect(sign(body, secret, { iat: false }))
      .toEqual(expect.stringMatching(/[\w-]+\.[\w-]+\.[\w-]+/))
  })
})
