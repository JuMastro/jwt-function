# jwt-function

**jwt-function** is simplest way to generate and verify JsonWebToken. 

Algorithm : **HmacSHA256**

## Install
Install:  
```npm install jwt-function --save```

Import:  
```const jwt = require('jwt-function')``` 
___

### generate (user, secret, options = {})

- `user [required]` : an object representing the user
  - `id [required]`: the user id
- `secret [required]` : a string secret key used to get hash
- `options [required]` : an object contain token payload options
  - `iss [required]` : token origin
  - `exp [optional]` : expiration token date in ms

`options` can take as many personals parameters as you want, example :

```javascript
const options = {
  iss: 'http://localhost:8080',
  exp: 7 * 24 * 60 * 60 * 1000,
  /** personals props */
  personalProp1: 'example1',
  personalProp2: 'example2'
}
```

if `generate` function is a success it return an object like :

```javascript
{ status: 'success', token: '*The string JWT*' }
```

### verify (token, secret)

- `token [required]` : a string token to check
- `secret [required]` : a string secret key used to get hash

if `verify` function is a success it return an object like :

```javascript
{ status: 'success', isValidToken: true }
```

___

## Errors

if an error was detected while `generate` or `verify` the function return an error object like : 
```javascript
{ status: 'error', msg: '*The string error message*' }
```

___ 

## Examples

```javascript
const jwt = require('jwt-function')

const secret = 'secretKey'

/*******************************
 *********** generate **********
 *******************************/
const generate = () => {
  const user = { id: 'e546dsf4z45641d231sd', username: 'testUsername' }

  const builder = jwt.generate(user, secret, {
    iss: 'http://localhost:8080',
    exp: 7 * 24 * 60 * 60 * 1000,
    /** personals props */
    personalProp1: 'example1',
    personalProp2: 'example2'
  })

  if (builder.status && builder.status === 'error') {
    if (builder.msg) { console.log(`${builder.msg}`) }
    return { status: 'error' }
  }

  console.log(`The token is now generated : ${builder.token}`)
  return builder
}

/*******************************
 ************ verify ***********
 *******************************/
const verify = (token) => {
  const validity = jwt.verify(token, secret)

  if (validity.status && validity.status === 'error') {
    if (validity.msg) { console.log(`${validity.msg}`) }
    return { status: 'error' }
  }

  console.log('Your jwt is valid!')
  return { status: 'success' }
}

const token = generate()
if (token.status === 'success') { verify(token.token) }
```

___

## Dependencies :
[CryptoJS](https://github.com/brix/crypto-js) - JavaScript library of crypto standards. (Used to get sign hash in HmacSHA256)
