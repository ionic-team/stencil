

export default {
  format: 'es',
  entry: 'scripts/build/index.js',
  dest: 'dist/es2015/index.js',
  outro: 'var Vue;\n' +
         'Vue = Vue$2;'
};

