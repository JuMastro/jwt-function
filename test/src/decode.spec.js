const decode = require('../../src/decode.js')

describe('decode()', () => {
  const b64Header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  const b64Payload = 'eyJidnYiOiJIZWxsb3dvcmxkIn0'
  const b64Signature = 'S5aCs8bDB9YHUbVcnm6QH29S708tjEjVO8CWhzJPQJs'
  const token = [b64Header, b64Payload, b64Signature].join('.')

  test('work fine with decodable token', async () => {
    const { header, payload } = await decode(token)
    expect(header).toHaveProperty('alg', 'HS256')
    expect(header).toHaveProperty('typ', 'JWT')
    expect(payload).toHaveProperty('bvv', 'Helloworld')
  })

  test('work fine with decodable token and base64 option', async () => {
    const { header, payload, base64 } = await decode(token, { base64: true })
    expect(header).toHaveProperty('alg', 'HS256')
    expect(header).toHaveProperty('typ', 'JWT')
    expect(payload).toHaveProperty('bvv', 'Helloworld')
    expect(base64).toHaveProperty('header', b64Header)
    expect(base64).toHaveProperty('payload', b64Payload)
    expect(base64).toHaveProperty('signature', b64Signature)
  })

  test('throw an error when provide no-decodable token', async () => {
    try {
      await decode('aa.bb.cc')
    } catch (err) {
      expect(err).toHaveProperty('name', 'InvalidTokenError')
    }
  })
})
