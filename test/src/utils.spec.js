const utils = require('../../src/utils.js')

describe('checkKey()', () => {
  test('work fine with string', () => {
    const callback = () => utils.checkKey('secret')
    expect(callback).not.toThrowError()
    expect(callback()).toEqual('secret')
  })

  test('work fine with buffer', () => {
    const callback = () => utils.checkKey(Buffer.from('secret'))
    expect(callback).not.toThrowError()
    expect(callback()).toEqual(Buffer.from('secret'))
  })

  test('fail with others types than string or buffer', () => {
    expect(() => utils.checkKey()).toThrowError()
    expect(() => utils.checkKey(NaN)).toThrowError()
    expect(() => utils.checkKey(null)).toThrowError()
    expect(() => utils.checkKey(['test'])).toThrowError()
  })
})

describe('mergeTruthy()', () => {
  test('work fine an return valid object', () => {
    const ref = {}
    const src = { a: false, b: null, c: 'str', d: {} }
    const merge = utils.mergeTruthy(ref, src, ['a', 'b', 'c', 'd'])
    expect(merge).toBe(ref)
    expect(merge).toHaveProperty('c', 'str')
    expect(merge).toHaveProperty('d', {})
  })
})

describe('base64ToObject()', () => {
  test('work fine and return object', () => {
    expect(() => {
      const object = { isValid: true }
      const base64 = Buffer.from(JSON.stringify(object)).toString('base64')
      const parsed = utils.base64ToObject(base64)
      expect(parsed).toEqual(object)
    }).not.toThrowError()
  })

  test('throw error with invalid base64', () => {
    const base64 = Buffer.from('{{Test').toString('base64')
    expect(() => utils.base64ToObject(base64))
      .toThrowError()
  })
})

describe('objectToBase64Url()', () => {
  test('work fine and return object', () => {
    expect(() => {
      const base64 = 'eyJpc1ZhbGlkIjp0cnVlfQ'
      const object = { isValid: true }
      const parsed = utils.objectToBase64Url(object)
      expect(parsed).toEqual(base64)
    }).not.toThrowError()
  })
})

describe('urlEncode()', () => {
  test('work fine and return valid encoded string', () => {
    expect(utils.urlEncode('Hel/lo+Worlds====')).toBe('Hel_lo-Worlds')
    expect(utils.urlEncode('Hel+/lo+Worlds')).toBe('Hel-_lo-Worlds')
    expect(utils.urlEncode('+Hel///lo+++Worlds=')).toBe('-Hel___lo---Worlds')
  })
})

describe('isPlainObject()', () => {
  test('work fine and return positive response', () => {
    expect(utils.isPlainObject({})).toBe(true)
  })

  test('work fine and return negative response', () => {
    expect(utils.isPlainObject()).toBe(false)
    expect(utils.isPlainObject([])).toBe(false)
    expect(utils.isPlainObject(null)).toBe(false)
  })
})
