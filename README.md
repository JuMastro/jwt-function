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
await jwtfn.sign({ user: 'Bob' }, 'secret')
await jwtfn.sign({ user: 'Bob' }, 'secret', { iat: false }) // Disable iat (default true).

// Decode a token
await jwtfn.decode(token, 'secret')
await jwtfn.decode(token, 'secret', { base64: true }) // Get base64 parts
```

## API

### sign(body, key, options)
Asynchronously sign a JsonWebToken based on a payload and options object.

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

The function return a `Promise<jwt: string>`.

### decode(token, options)
Asynchronously decode a JsonWebToken.

  - **`token`** A JsonWebToken as string format to decode `(required)`.
  - **`options`** A decode options object.
    - **`base64`** The state to return a response with base64 parts `(default: false)`.

##### Examples
```javascript
// Get base64 parts.
await jwtfn.decode(token, 'secret', { base64: true })
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
