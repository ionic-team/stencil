var stencil = (function(exports) {
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

  (gbl => {
    if (!gbl.Buffer) {
      gbl.Buffer = {};
    }

    const process = gbl.process = (gbl.process || {});

    if (!process.argv) {
      process.argv = [''];
    }
    if (!process.binding) {
      process.binding = () => ({});
    }
    if (!process.cwd) {
      process.cwd = () => '/';
    }
    if (!process.env) {
      process.env = () => ({ __mocked: true });
    }
    if (!process.nextTick) {
      process.nextTick = (cb) => Promise.resolve().then(cb);
    }
    if (!process.platform) {
      process.platform = () => 'mocked';
    }
    if (!process.version) {
      process.version = () => '0.0.0';
    }

    if (!gbl.__dirname) {
      gbl.__dirname = '/';
    }

    if (!gbl.__filename) {
      gbl.__filename = '/index.js';
    }

  })(globalThis);