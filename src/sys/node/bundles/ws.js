var WebSocket = require('ws');

exports.Server = WebSocket.Server;
exports.on = WebSocket.on;
exports.close = WebSocket.close;
exports.ping = WebSocket.ping;
