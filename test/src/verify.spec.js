const sign = require('../../src/sign.js')
const verify = require('../../src/verify.js')

describe('verify()', () => {
  const secret = 'secret'

  test('work fine and return true', () => {
    const token = sign({ user: 'a1' }, secret)
    const state = verify(token, secret)
    expect(state).toBe(true)
  })

  test('work fine and return decoded token', () => {
    const token = sign({ user: 'a1' }, secret)
    const decoded = verify(token, secret, { decode: true })
    expect(decoded).toHaveProperty('header')
    expect(decoded).toHaveProperty('payload')
  })

  test('throw InvalidSignatureError', () => {
    const token = sign({ user: 'a1' }, 'invalid-secret')
    expect(() => verify(token, secret)).toThrowError('The JWT signature is not valid')
  })
})

describe('verifyHeader()', () => {
  test('work fine with default header', () => {
    const header = { alg: 'HS256', typ: 'JWT' }
    const options = verify.getDefaultOptions()
    expect(() => verify.verifyHeader(header, options))
      .not
      .toThrowError()
  })
})

describe('verifyPayload()', () => {
  test('work fine with default payload', () => {
    expect(() => verify.verifyPayload({}, verify.getDefaultOptions()))
      .not
      .toThrowError()
  })

  test('work fine with iat check', () => {
    const options = { ...verify.getDefaultOptions(), iat: 100 }
    expect(() => verify.verifyPayload({ iat: 110 }, options))
      .not
      .toThrowError()
  })

  test('throw error with iat check', () => {
    const options = { ...verify.getDefaultOptions(), iat: 100 }
    expect(() => verify.verifyPayload({ iat: 90 }, options))
      .toThrowError('iat')
  })

  test('work fine with nbf check', () => {
    const options = { ...verify.getDefaultOptions(), nbf: null }
    expect(() => verify.verifyPayload({ nbf: 100 }, options))
      .not
      .toThrowError()
  })

  test('throw error with nbf check', () => {
    const options = { ...verify.getDefaultOptions(), nbf: true }
    expect(() => verify.verifyPayload({ nbf: 1e21 }, options))
      .toThrowError('nbf')
  })

  test('work fine with exp check', () => {
    const options = { ...verify.getDefaultOptions(), exp: null }
    expect(() => verify.verifyPayload({ exp: 1e21 }, options))
      .not
      .toThrowError()
  })

  test('throw error with exp check', () => {
    const options = { ...verify.getDefaultOptions(), exp: true }
    expect(() => verify.verifyPayload({ exp: 100 }, options))
      .toThrowError('exp')
  })
})

describe('verifySegment()', () => {
  const definitions = { sub: 'x_x', aud: /hello/, add: ['a', 'world'] }

  test('work fine and return segment', () => {
    const segment = { sub: 'x_x', aud: 'hello', add: 'world' }

    expect(() => {
      const res = verify.verifySegment('payload', segment, definitions)
      expect(res).toBe(segment)
    }).not.toThrowError()
  })

  test('throw an error when one prop is not valid', () => {
    expect(() => {
      const segment = { sub: 'x_x', aud: 'hello', add: 'INVALID' }
      return verify.verifySegment('payload', segment, definitions)
    }).toThrowError('add')
  })
})

describe('verifyByDefinition()', () => {
  test('work fine and return true for string', () => {
    expect(verify.verifyByDefinition('^_^', '^_^')).toBe(true)
  })

  test('work fine and return false for string', () => {
    expect(verify.verifyByDefinition('^_^', '^^')).toBe(false)
  })

  test('work fine and return true for regex', () => {
    expect(verify.verifyByDefinition(/^\^_\^/, '^_^')).toBe(true)
  })

  test('work fine and return false for regex', () => {
    expect(verify.verifyByDefinition(/^\^_\^/, '^^')).toBe(false)
  })

  test('work fine and return true for array of string', () => {
    expect(verify.verifyByDefinition(['x', '^_^'], '^_^')).toBe(true)
  })

  test('work fine and return false for array of string', () => {
    expect(verify.verifyByDefinition(['x', '^_^'], '^^')).toBe(false)
  })

  test('work fine and return true for array of regex', () => {
    expect(verify.verifyByDefinition([/\d+/, /^\^_\^/], '^_^')).toBe(true)
  })

  test('work fine and return false for array of regex', () => {
    expect(verify.verifyByDefinition([/\d+/, /^\^_\^/], '^^')).toBe(false)
  })
})
