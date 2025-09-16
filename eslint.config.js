export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      semi: 'error',
      quotes: 'off',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      eqeqeq: 'warn',
      'no-var': 'error',
      'prefer-const': 'warn',
      'comma-dangle': ['warn', 'only-multiline'],
    },
  },
];
