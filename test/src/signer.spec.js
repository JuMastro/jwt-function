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
        const stream = signer.createSigner(secret, { alg })
        expect(stream.sign({ header, payload })).toBe(stream)
      }).not.toThrowError()
    })
  })

  test('work fine and emit stream valid response', async () => {
    expect.assertions(1)
    const stream = signer.createSigner(secret, { alg: 'HS256' })
    setImmediate(() => stream.sign({ header, payload }))
    const [res] = await once(stream, 'respond')
    expect(res).toBe('HEADER.PAYLOAD.oow3estNnQUVp3fLALUr1TZiSlOoE7jI9KVSVNDThiI')
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

describe('getToken()', () => {
  test('work fine and return "x.y.z" string format', () => {
    expect(signer.getToken([Buffer.from('0')], 'x', 'y'))
      .toBe('x.y.MA')
  })
})
