(function(exports) {
'use strict';

if (typeof globalThis === 'undefined') {
  if (typeof self !== 'undefined') {
    self.globalThis = self;
  } else if (typeof window !== 'undefined') {
    window.globalThis = window;
  } else if (typeof global !== 'undefined') {
    global.globalThis = global;
  }
}

const Buffer = globalThis.Buffer || {};
const process = globalThis.process || {};
if (!process.argv) {
  process.argv = [''];
}
let __cwd = '/';
if (!process.cwd) {
  process.cwd = () => __cwd;
}
if (!process.chdir) {
  process.chdir = (v) => __cwd = v;
}
if (!process.nextTick) {
  const resolved = Promise.resolve();
  process.nextTick = (cb) => resolved.then(cb);
}
if (!process.platform) {
  process.platform = 'stencil';
}
if (!process.version) {
  process.version = 'v14.0.0';
}
process.browser = !!globalThis.location;
