
// rollup has troubles figuring out the exports
// even with a namedExports option in the commonjs plugin
// idk, this should fix it :)
var core = require('resolve/lib/core');
exports = module.exports = require('resolve/lib/async');
exports.core = core;
exports.isCore = function (x) { return core[x] };
exports.sync = require('resolve/lib/sync');