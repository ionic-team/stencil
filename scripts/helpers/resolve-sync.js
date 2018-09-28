
// rollup has troubles figuring out the "sync" export
// even with a namedExports option in the commonjs plugin
// idk, this should fix it :)
exports.sync = require('resolve/lib/sync');
