/**
 * Check if secret or public/private key has valid type.
 * @param {any} key - The secret or private key.
 * @returns {string|Buffer}
 */
function checkKey (key) {
  if (typeof key !== 'string' && !Buffer.isBuffer(key)) {
    throw new TypeError('The "key" argument must be type string or a Buffer.')
  }

  return key
}

/**
 * Merge truthy properties from source to target.
 * @param {object} target - The object where merge properties.
 * @param {object} source - The object where get properties.
 * @param {Array} properties - The list of properties to merge.
 * @returns {object}
 */
function mergeTruthy (target, source, properties) {
  properties.forEach((property) => {
    if (source[property]) {
      Object.assign(target, {
        [property]: source[property]
      })
    }
  })

  return target
}

/**
 * Convert a base64 to an object.
 * @param {string} base64
 * @returns {object}
 */
function base64ToObject (base64) {
  try {
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf8'))
  } catch (err) {
    throw new Error('Provided base64 string is not parsable as object.')
  }
}

/**
 * Convert an object to a base64 string.
 * @param {object} obj
 * @returns {string}
 */
function objectToBase64Url (obj) {
  return urlEncode(Buffer.from(JSON.stringify(obj)).toString('base64'))
}

/**
 * Return a urlEncoded string.
 * @param {string} str
 * @returns {string}
 */
function urlEncode (str) {
  return str
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

/**
 * Check if the array is an array of any *type* (condition).
 * @param {Array<any>} array - The checked array.
 * @param {function} condition - The callback filter.
 * @returns {boolean}
 */
function isArrayOf (array, condition) {
  return Array.isArray(array) &&
    array.length > 0 &&
    array.length === array.filter(condition).length
}

/**
 * Check if obj is a plain object.
 * @param {object} obj
 * @returns {boolean}
 */
function isPlainObject (obj) {
  return (typeof obj === 'object' && obj !== null && !Array.isArray(obj))
}

module.exports = {
  checkKey,
  mergeTruthy,
  base64ToObject,
  objectToBase64Url,
  urlEncode,
  isArrayOf,
  isPlainObject
}
