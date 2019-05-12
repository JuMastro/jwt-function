module.exports = {
  root: true,
  extends: 'standard',
  plugins: [
    'standard',
    'promise'
  ],
  env: {
    node: true,
    jest: true
  },
  rules: {
    'no-unused-vars': [
      'error', {
        vars: 'all',
        args: 'all',
        argsIgnorePattern: '^_$',
        varsIgnorePattern: '^_$',
        ignoreRestSiblings: true
      }
    ]
  }
}
