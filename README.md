# jwt-function
Simple way to sign, verify & decode JWT

## Algorithms

| HMAC-SHA |
| ----- |
| HS256 |
| HS384 |
| HS512 |

## Examples

```javascript
const jwtfn = require('jwt-function')

// Sign a token
const token = jwtfn.sign({ user: 'Bob' }, 'secret')

// Verify a token
jwtfn.verify(token, 'secret')

// Decode a token
jwtfn.decode(token)
```

## API

### sign(body, key, options)
Sync sign a JsonWebToken based on a payload and options object.

  - **`body`** An `object` that represent the payload of the JWT, but it should not contains the specific JWT properties, it must be used from object options (required).
  - **`key`** A secret or private key as string or Buffer to sign the JWT. It depend on the selected algorithm (required).
  - **`options`** A sign options object. It used to define specifics properties to the JWT (default = object).
    - **`alg`** The name/tag of the used algorithm to sign the JWT. It's must be an implemented algorithm `(default: 'HS256') (required)`.
    - **`typ`** The JWT type, must type string `(default: 'JWT') (required)`.
    - **`iat`** The issued at date, must be timestamp or true `(default: true)`.
    - **`exp`** The expiration date, must be timestamp `(default: null)`.
    - **`nbf`** The date from which the JWT is valid, must be timestamp `(default: null)`.
    - **`iss`** The issuer, must be type string `(default: null)`.
    - **`aud`** The audience, must be type string `(default: null)`.
    - **`sub`** The subject, must be type string `(default: null)`.
    - **`jti`** The JsonWebToken ID, must be type string `(default: null)`.
    - **`header`** The object with properties to add to the JWT header `(default: null)`.

##### Examples
```javascript
// Limit the token validity to 1 day.
const expiration = new Date().getTime() + (24 * 60 * 60)
await jwtfn.sign({ ... }, 'secret', { exp: expiration })

// Add header properties.
const addedProps = { add1: 'add1', add2: 'add2' }
await jwtfn.sign({ ... }, 'secret', { header: addedProps })
```

The function return a `jwt: string`.

### verify(token, key, options)
Sync verify a JsonWebToken.

  - **`token`** A JsonWebToken as string format to verify `(required)`.
  - **`key`** A secret or private key as string or Buffer to sign the JWT. It depend on the selected algorithm (required).
  - **`options`** A verify options object, it primary used to define token verification.
    - **`alg`** A string or an array of string to match with token algorithm `(default: 'HS256') (required)`.
    - **`typ`** A string to or an array of strings to compare with `typ` header argument `(default: null)`.
    - **`iat`** A timestamp to check if the token has been signed after this timestamp `(default: null)`.
    - **`exp`** A boolean to define the check state of the expiration date, in case it's true the field is required to be valid, an error will be thrown if the field does not exist on the token. If the field is equal to null then the verification will be checked only if the field exists on the token. Else the token is equal false, the verification will not be done.`(default: null)`.
    - **`nbf`** A boolean to define the check state of the date from which the JWT is valid, in case it's true the field is required to be valid, an error will be thrown if the field does not exist on the token. If the field is equal to null then the verification will be checked only if the field exists on the token. Else the token is equal false, the verification will not be done.`(default: null)`.
    - **`iss`** A issuer verification, it can be string or regex, or an array of them `(default: null)`.
    - **`aud`** A audience verification, it can be string or regex, or an array of them `(default: null)`.
    - **`sub`** A subject verification, it can be string or regex, or an array of them `(default: null)`.
    - **`header`** An object used as list of checks to do in header part, it can provide string or regex, or an array of them `(default: null)`.
    - **`payload`** An object used as list of checks to do in payload part, it can provide string or regex, or an array of them `(default: null)`.
    - **`decode`** A boolean option to change the function return to get the decoded JWT `(default: null)`.

The function return a `true|object`.

##### Examples
```javascript
// Check the token is not expired and is yet mature.
jwtfn.verify(token, 'secret', { exp: true, nbf: true })

// Check the token header (same for payload).
jwtfn.verify(token, 'secret', {
  header: {
    add1: 'add1', // Should be equal
    add2: [/remove/, '/add/'] // Should has one or more matches
  }
})
```

### decode(token, options)
Sync decode a JsonWebToken.

  - **`token`** A JsonWebToken as string format to decode `(required)`.
  - **`options`** A decode options object.
    - **`base64`** The state to return a response with base64 parts `(default: false)`.

The function return a `decoded: object`.

##### Examples
```javascript
// Get base64 parts.
jwtfn.decode(token, { base64: true })
```
Return an object like:
```
{
  header: {...},
  payload: {...},
  base64: {
    header: '...',
    payload: '...',
    signature: '...'
  }
}
```

### Errors

  - **`InvalidTokenError`** Root error
  - **`InvalidSignatureError`** When the signature not match with the JWT.
  - **`InvalidAlgorithmError`** When the algorithm is not allowed on the options.
  - **`InvalidTypeError`** When the JWT type is not validated by the options..
  - **`InvalidIssuedAtError`** When the token iat timestamp is lower than the options.
  - **`ExpiredSignatureError`** When the token exp timestamp is lower than now.
  - **`ImmatureSignatureError`** When the token nbf timestamp is greater than now.
  - **`InvalidIssuerError`** When then issuer is not validated by options.
  - **`InvalidAudienceError`** When the audience is not validated by options.
  - **`InvalidSubjectError`** When the subject is not validated by options.
  - **`InvalidTokenIDError`** When the tokenID is not validated by options.
  - **`InvalidHeaderError`** When any defined verification options header is not valid.
  - **`InvalidPayloadError`** When any defined verification options payload is not valid.
