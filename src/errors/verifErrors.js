const InvalidAlgorithmError = require('./InvalidAlgorithmError.js')
const InvalidTypeError = require('./InvalidTypeError.js')
const InvalidIssuedAtError = require('./InvalidIssuedAtError.js')
const ExpiredSignatureError = require('./ExpiredSignatureError.js')
const ImmatureSignatureError = require('./ImmatureSignatureError.js')
const InvalidIssuerError = require('./InvalidIssuerError.js')
const InvalidAudienceError = require('./InvalidAudienceError.js')
const InvalidSubjectError = require('./InvalidSubjectError.js')
const InvalidTokenIDError = require('./InvalidTokenIDError.js')
const InvalidHeaderError = require('./InvalidHeaderError.js')
const InvalidPayloadError = require('./InvalidPayloadError.js')

module.exports = {
  alg: InvalidAlgorithmError,
  typ: InvalidTypeError,
  iat: InvalidIssuedAtError,
  exp: ExpiredSignatureError,
  nbf: ImmatureSignatureError,
  iss: InvalidIssuerError,
  aud: InvalidAudienceError,
  sub: InvalidSubjectError,
  jti: InvalidTokenIDError,
  header: InvalidHeaderError,
  payload: InvalidPayloadError
}
