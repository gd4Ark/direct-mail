module.exports = {
  extends: ['eslint-config-fa'],
  plugins: ['jest'],
  globals: {},
  env: {
    'jest/globals': true
  },
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error'
  }
}
