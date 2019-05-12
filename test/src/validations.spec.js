const validations = require('../../src/validations.js')
const schemas = validations.schemas
const validate = validations.validate
const checks = validations.checks

function getValidSignPayload () {
  const now = new Date().getTime()
  return {
    alg: 'HS256',
    typ: 'JWT',
    iat: now,
    exp: now + 120000 * 24,
    nbf: now + 60000 * 24,
    iss: 'iss.example.com',
    aud: 'iss.example.com',
    sub: 'sub.auth-session',
    jti: 'token-id',
    header: {}
  }
}

describe('builded schemas structure', () => {
  test('schemas store must has good structure', () => {
    Object.entries(schemas).forEach(([_, schemaDef]) => {
      Object.entries(schemaDef).forEach(([key, isValid]) => {
        expect(typeof key).toBe('string')
        expect(typeof isValid).toBe('function')
        // Use a value that was never accepted.
        expect(() => isValid(Symbol('test')))
          .toThrowError(key)
      })
    })
  })
})

describe('validate()', () => {
  test('work fine with valids payloads', () => {
    expect(() => validate(schemas.sign, getValidSignPayload()))
      .not
      .toThrowError()
  })

  test('work fine with valids payloads & null or false', () => {
    expect(() => validate(schemas.sign, { ...getValidSignPayload(), nbf: false, exp: null }))
      .not
      .toThrowError()
  })

  test('throw with not allowed property (example)', () => {
    expect(() => validate(schemas.sign, { ...getValidSignPayload(), example: 'INVALID_PROP' }))
      .toThrowError('example')
  })

  test('throw with invalids payloads (alg)', () => {
    expect(() => validate(schemas.sign, { ...getValidSignPayload(), alg: 'INVALID_ALG' }))
      .toThrowError('alg')
  })
})

describe('Test checks', () => {
  describe('isString()', () => {
    test('done', () => {
      expect(checks.isString('')).toBe(true)
      expect(checks.isString('str')).toBe(true)
    })

    test('fail', () => {
      expect(checks.isString(['a'])).toBe(false)
      expect(checks.isString(null)).toBe(false)
    })
  })

  describe('isCompleteString()', () => {
    test('done', () => {
      expect(checks.isCompleteString('str')).toBe(true)
    })

    test('fail', () => {
      expect(checks.isCompleteString('  ')).toBe(false)
      expect(checks.isCompleteString(['a'])).toBe(false)
    })
  })

  describe('isValidAlgorithm()', () => {
    const { ALGORITHMS } = require('../../src/constants')

    test('done', () => {
      ALGORITHMS.forEach((alg) => {
        expect(checks.isValidAlgorithm(alg)).toBe(true)
      })
    })

    test('fail', () => {
      expect(checks.isValidAlgorithm()).toBe(false)
      expect(checks.isValidAlgorithm('')).toBe(false)
      expect(checks.isValidAlgorithm('EC256')).toBe(false)
    })
  })

  describe('isValidTimestamp()', () => {
    test('done', () => {
      expect(checks.isValidTimestamp(1)).toBe(true)
      expect(checks.isValidTimestamp(100000)).toBe(true)
    })

    test('fail', () => {
      expect(checks.isValidTimestamp(0)).toBe(false)
      expect(checks.isValidTimestamp(null)).toBe(false)
      expect(checks.isValidTimestamp('100000')).toBe(false)
    })
  })

  describe('isValidTimestampOrTrue()', () => {
    test('done', () => {
      expect(checks.isValidTimestampOrTrue(1)).toBe(true)
      expect(checks.isValidTimestampOrTrue(100000)).toBe(true)
      expect(checks.isValidTimestampOrTrue(true)).toBe(true)
    })

    test('fail', () => {
      expect(checks.isValidTimestampOrTrue(0)).toBe(false)
      expect(checks.isValidTimestampOrTrue(null)).toBe(false)
      expect(checks.isValidTimestampOrTrue(false)).toBe(false)
      expect(checks.isValidTimestampOrTrue('100000')).toBe(false)
    })
  })

  describe('isValidJwtHeader()', () => {
    test('done', () => {
      expect(checks.isValidJwtHeader({})).toBe(true)
      expect(checks.isValidJwtHeader({ add: true })).toBe(true)
    })

    test('fail', () => {
      expect(checks.isValidJwtHeader(null)).toBe(false)
      expect(checks.isValidJwtHeader({ alg: 'x' })).toBe(false)
      expect(checks.isValidJwtHeader({ typ: 'x' })).toBe(false)
      expect(checks.isValidJwtHeader('str')).toBe(false)
    })
  })
})
