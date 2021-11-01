module.exports = {
  parser: '@babel/eslint-parser',
  env: {
      node: true,
      commonjs: true,
      "jest/globals": true,
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: ['babel', 'jest'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:jest/recommended'],
  ignorePatterns: ['bin/', 'node_modules/', 'insomnia/'],
  rules: {
    'jest/no-test-callback': 0,
  },
}
