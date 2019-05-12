const sign = require('../../src/sign.js')

const body = { user: '42' }
const secret = 'secret'

describe('sign()', () => {
  test('throw when provide invalid type (plain-object (required))', async () => {
    expect.assertions(1)

    try {
      await sign('badType', secret)
    } catch (err) {
      expect(err).toHaveProperty(
        'message',
        'The "data" argument must be a plain object.'
      )
    }
  })

  test('throw when provided invalid private or secret key', async () => {
    expect.assertions(1)

    try {
      await sign(body, 12545)
    } catch (err) {
      expect(err).toHaveProperty(
        'message',
        'The "key" argument must be type string or a Buffer.'
      )
    }
  })

  test('work fine and return valid JWT with default options', async () => {
    expect.assertions(1)
    const res = await sign(body, secret)
    expect(res).toEqual(expect.stringMatching(/[\w-]+\.[\w-]+\.[\w-]+/))
  })

  test('work fine and return valid JWT with false "iat" options', async () => {
    expect.assertions(1)
    const res = await sign(body, secret, { iat: false })
    expect(res).toEqual(expect.stringMatching(/[\w-]+\.[\w-]+\.[\w-]+/))
  })
})
