const { schemas, validate, checks } = require('../../src/validations.js')

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

  describe('isBoolean()', () => {
    test('done', () => {
      expect(checks.isBoolean(true)).toBe(true)
      expect(checks.isBoolean(false)).toBe(true)
    })

    test('fail', () => {
      expect(checks.isBoolean()).toBe(false)
      expect(checks.isBoolean(null)).toBe(false)
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

  describe('isValidStringRange()', () => {
    test('done', () => {
      expect(checks.isValidStringRange('')).toBe(true)
      expect(checks.isValidStringRange('str')).toBe(true)
      expect(checks.isValidStringRange(['a', 'b'])).toBe(true)
    })

    test('fail', () => {
      expect(checks.isValidStringRange([])).toBe(false)
      expect(checks.isValidStringRange(120)).toBe(false)
      expect(checks.isValidStringRange(/regex/)).toBe(false)
      expect(checks.isValidStringRange([/regex/])).toBe(false)
    })
  })

  describe('isValidCompleteStringRange()', () => {
    test('done', () => {
      expect(checks.isValidCompleteStringRange('str')).toBe(true)
      expect(checks.isValidCompleteStringRange(['a', 'b'])).toBe(true)
    })

    test('fail', () => {
      expect(checks.isValidCompleteStringRange('')).toBe(false)
      expect(checks.isValidCompleteStringRange([/regex/, /regex/])).toBe(false)
    })
  })

  describe('isValidAlgorithmRange()', () => {
    test('done', () => {
      expect(checks.isValidAlgorithmRange('HS256')).toBe(true)
      expect(checks.isValidAlgorithmRange(['HS256', 'HS384'])).toBe(true)
    })

    test('fail', () => {
      expect(checks.isValidAlgorithmRange(/HS256/)).toBe(false)
      expect(checks.isValidAlgorithmRange([/HS256/, /HS384/])).toBe(false)
    })
  })

  describe('isValidMultiRange()', () => {
    test('done with string', () => {
      expect(checks.isValidMultiRange('HS256')).toBe(true)
    })

    test('done with regex', () => {
      expect(checks.isValidMultiRange(/HS/)).toBe(true)
    })

    test('done with string[]', () => {
      expect(checks.isValidMultiRange(['HS256'])).toBe(true)
    })

    test('done with string', () => {
      expect(checks.isValidMultiRange([/HS\d{3}/, /PS\d{3}/])).toBe(true)
    })

    test('fail', () => {
      expect(checks.isValidMultiRange()).toBe(false)
      expect(checks.isValidMultiRange({ x: 'test' })).toBe(false)
      expect(checks.isValidMultiRange(null)).toBe(false)
      expect(checks.isValidMultiRange(10)).toBe(false)
    })
  })

  describe('isValidMultiRangeObj()', () => {
    test('done with string', () => {
      expect(checks.isValidMultiRangeObj({
        a: 'str',
        b: ['a', 'b'],
        c: /ex/,
        d: [/a/, /b/]
      })).toBe(true)
    })

    test('fail', () => {
      expect(checks.isValidMultiRangeObj()).toBe(false)
      expect(checks.isValidMultiRangeObj({ a: 42 })).toBe(false)
      expect(checks.isValidMultiRangeObj({ a: { a: 42 } })).toBe(false)
    })
  })
})
