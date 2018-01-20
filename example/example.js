'use strict'

const jwt = require('../lib/index')

const secret = 'secretKey'

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
    if (builder.msg) { console.log(`\n${builder.msg}\n`) }
    return { status: 'error' }
  }

  console.log(`\nThe token is now generated :\n${builder.token}\n`)
  return builder
}

const verify = (token) => {
  const validity = jwt.verify(token, secret)

  if (validity.status && validity.status === 'error') {
    if (validity.msg) { console.log(`\n${validity.msg}\n`) }
    return { status: 'error' }
  }

  console.log('\nYour jwt is valid!\n')
  return { status: 'success' }
}

const token = generate()
if (token.status === 'success') { verify(token.token) }
