// for local npm link development
// @stencil/core/server

var server = require('./dist/server/index');

exports.loadConfig = server.loadConfig;
exports.ssrMiddleware = server.ssrMiddleware;
exports.ssrPathRegex = server.ssrPathRegex;
exports.createRenderer = server.createRenderer;
