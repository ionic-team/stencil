// for local npm link development
// @stencil/core/testing

var testing = require('./dist/testing/index');

exports.h = testing.h;
exports.render = testing.render;
exports.flush = testing.flush;
exports.transpile = testing.transpile;
