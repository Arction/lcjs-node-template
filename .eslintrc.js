module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint'],
  extends: [
      'airbnb-typescript/base',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
      'plugin:import/typescript',
  ],
  rules: {
      'linebreak-style': 0,
      'import/prefer-default-export': 0,
  },
  settings: {
      'import/resolver': {
          node: {
              extensions: ['.ts'],
              moduleDirectory: ['../node_modules', '.'],
          },
      },
  },
}
