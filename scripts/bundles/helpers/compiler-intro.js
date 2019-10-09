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
    gbl.Buffer = {
      __mocked: true
    };
  }
  const prcs = gbl.process = (gbl.process || {
    __mocked: true
  });
  if (!prcs.argv) {
    prcs.argv = ['/'];
  }
  if (!prcs.binding) {
    prcs.binding = () => ({ __mocked: true });
  }
  if (!prcs.cwd) {
    prcs.cwd = () => '/';
  }
  if (!prcs.env) {
    prcs.env = { __mocked: true };
  }
  if (!prcs.nextTick) {
    prcs.nextTick = (cb) => Promise.resolve().then(cb);
  }
  if (!prcs.platform) {
    prcs.platform = (typeof navigator !== 'undefined') ? 'browser' : 'unknown';
  }
  if (!prcs.version) {
    prcs.version = 'v0.0.0';
  }
  if (!gbl.__dirname) {
    gbl.__dirname = '/';
  }
  if (!gbl.__filename) {
    gbl.__filename = '/index.js';
  }

})(globalThis);