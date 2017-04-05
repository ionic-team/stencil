
export default {
  entry: 'dist/transpiled-compiler/index.js',
  format: 'cjs',
  dest: 'dist/ionic-compiler/index.js',
  external: [
    'crypto',
    'fs',
    'path',
    'typescript',
    'util'
  ]
};
