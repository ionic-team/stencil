// for local npm link development
// @stencil/core/compiler

var compiler = require('./dist/compiler/index');

exports.build = compiler.build;
exports.isConfigValid = compiler.isConfigValid;
exports.docs = compiler.docs;
