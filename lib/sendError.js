'use strict'

/**
 * return an error object
 * @param {string} msg 
 */
function error (msg) {
  return { status: 'error', msg: msg }
}

module.exports = error
