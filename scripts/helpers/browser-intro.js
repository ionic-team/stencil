var Buffer = {};

var process = {
  argv: ['browser'],
  binding: function() {
    return {};
  },
  cwd: function() {
    return '/';
  },
  env: {},
  nextTick: function(cb) {
    Promise.resolve().then(cb);
  },
  platform: 'browser',
  version: '0.0.0'
};

var __dirname = '/';
var __filename = 'index.js';
