const { once } = require('events')
const signer = require('../../src/signer.js')
const { ALGORITHMS } = require('../../src/constants.js')

describe('pub createSigner()', () => {
  const secret = 'secret'
  const header = 'HEADER'
  const payload = 'PAYLOAD'

  test('work fine with valid algorithms', () => {
    ALGORITHMS.forEach((alg) => {
      expect(() => {
        const token = signer.createSigner(secret, { alg })
          .sign({ header, payload })
        expect(token).toMatch(/[\w-]+.[\w-]+.[\w-]+/)
      }).not.toThrowError()
    })
  })

  test('throw err response', async () => {
    expect.assertions(1)

    try {
      const stream = signer.createSigner(secret, { alg: 'HS256' })
      setImmediate(() => stream.emit('error', new Error('test')))
      await once(stream, 'end')
    } catch (err) {
      expect(err).toHaveProperty('message', 'test')
    }
  })
})
