const { deep: js } = require('./deep-cjs.cjs');

// Must use import to load ES Modules, unless we patch in a require() method
// (require ESM file not supported by node)
// const { deep: ts } = require('./deep-ts');
const ts = 'Cannot require(ESM file) from CJS file';

module.exports = function () { return [js, ts]; }
