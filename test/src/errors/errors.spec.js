const ExpiredSignatureError = require('../../../src/errors/ExpiredSignatureError.js')
const ImmatureSignatureError = require('../../../src/errors/ImmatureSignatureError.js')
const InvalidAlgorithmError = require('../../../src/errors/InvalidAlgorithmError.js')
const InvalidAudienceError = require('../../../src/errors/InvalidAudienceError.js')
const InvalidHeaderError = require('../../../src/errors/InvalidHeaderError.js')
const InvalidIssuedAtError = require('../../../src/errors/InvalidIssuedAtError.js')
const InvalidIssuerError = require('../../../src/errors/InvalidIssuerError.js')
const InvalidPayloadError = require('../../../src/errors/InvalidPayloadError.js')
const InvalidSubjectError = require('../../../src/errors/InvalidSubjectError.js')
const InvalidTypeError = require('../../../src/errors/InvalidTypeError.js')
const InvalidTokenIDError = require('../../../src/errors/InvalidTokenIDError.js')

describe('root', () => {
  test('claim header and payload error work fine', () => {
    const errors = {
      ExpiredSignatureError,
      ImmatureSignatureError,
      InvalidAlgorithmError,
      InvalidAudienceError,
      InvalidHeaderError,
      InvalidIssuedAtError,
      InvalidIssuerError,
      InvalidPayloadError,
      InvalidSubjectError,
      InvalidTypeError,
      InvalidTokenIDError
    }

    const entries = Object.entries(errors)

    entries.forEach(([key, Err]) => {
      const err = new Err(key, 'current', 'expected')
      const obj = err.asPlain()
      expect(obj).toHaveProperty('name', key)
      expect(obj).toHaveProperty('current', 'current')
      expect(obj).toHaveProperty('expected', 'expected')
    })
  })
})
