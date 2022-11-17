module.exports = {
  root: true,
  extends: [
    '@loopback/eslint-config',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.d.ts', '*.js'],
      rules: {
        '@typescript-eslint/no-shadow': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-shadow': 'off',
        'no-undef': 'off',
        semi: 'off',
        eqeqeq: 'off',
        'no-debugger': 'off',
        '@typescript-eslint/naming-convention': 'off',
      },
    },
  ],
}
