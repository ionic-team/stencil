const path = require('path');
const transpile = require('./transpile');

const success = transpile(path.join('..', 'src', 'build-conditionals', 'tsconfig.json'));

if (!success) {
  process.exit(1);
}
