module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    // including prettier here ensures that we don't set any rules which will conflict
    // with Prettier's formatting. Keep it last in the list so that nothing else messes
    // with it!
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {
      "argsIgnorePattern": "^_",
      // TODO(STENCIL-452): Investigate using eslint-plugin-react to remove the need for varsIgnorePattern
      "varsIgnorePattern": "^(h|Fragment)$" 
    }],
    'prefer-const': 'error'
  },
};
