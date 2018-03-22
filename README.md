# jwt-function

**jwt-function** is simplest way to generate and verify JsonWebToken. 

*This worker only support HS256 on algorithm.*

## Install
```npm install jwt-function --save```

## Import 
```javascript 
const jwt = require('jwt-function')
```
___
### generate (secret, options = {})
*The generate function is used to generate a fresh json web token.*

- `secret (string)` - The secret key used to get hash.
- `options (string)` - The json web token payload.
  - `iss (string)` - The token origin.
  - `exp (integer)` - The token date expiration in ms. 

Parameter `options` can take as many personals properties as you want, example with user information :

```javascript
const options = {
  iss: 'http://localhost:8080',
  exp: 7 * 24 * 60 * 60 * 1000,
  user_id: 'ui01a',
  user_username: 'JohnDoe'
}
```

#### Response
If `generate` function is going well, it returns a json web token, else throw an error.

___
### verify (secret, token)
*The verify function is used to check a validity of a json web token.*

- `token (string)` - The json web token.
- `secret (string)` - The secret key used to get hash.

#### Response
If `verify` function return a valid or an invalid response object.

___ 
## Examples

```javascript
const jwt = require('jwt-function')

const secret = 'secret'

// To generate synchronous
const token = jwt.generate(secret, { iss: 'http://127.0.0.1:8080' })
console.log(token)

// To verify synchronous
const check = jwt.verify(secret, token)
console.log(check)
```

___

## Dependencies :
[CryptoJS](https://github.com/brix/crypto-js) - JavaScript library of crypto standards. (Used to get sign hash in HmacSHA256)
