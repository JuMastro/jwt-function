'use strict'

const jwt = require('../lib/index')

const secret = 'secretKey'

const user = { id: 'e546dsf4z45641d231sd', username: 'testUsername' }

const generate = () => {
  const builder = jwt.generate(user, secret, {
    iss: 'http://localhost:8080',
    exp: 7 * 24 * 60 * 60 * 1000,
    /** optionals prop */
    optionalProp1: 'example1',
    optionalProp2: 'example2'
  })

  if (builder.status && builder.status === 'error') {
    console.error(`\n${builder.msg}\n`)
    return { isValid: false }
  }

  console.log(`\nThe token is now generated :\n${builder.token}\n`)

  return builder
}

const verify = () => {
  const validity = jwt.verify(token.token, secret)

  if (validity.status && validity.status === 'error') {
    console.log(`\n${validity.msg}\n`)
    return { isValid: false }
  }

  console.log('\nYour jwt is valid!\n')
  return { isValid: true }
}

const token = generate()
const check = verify()
