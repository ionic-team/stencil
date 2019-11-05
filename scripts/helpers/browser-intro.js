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
  gbl.Buffer.__browser = true;

  const process = gbl.process = (gbl.process || {});
  process.__browser = true;

  if (!process.argv) {
    process.argv = ['browser'];
  }
  if (!process.binding) {
    process.binding = () => ({ __browser: true });
  }
  if (!process.cwd) {
    process.cwd = () => '/';
  }
  if (!process.env) {
    process.env = () => ({ __browser: true });
  }
  if (!process.nextTick) {
    process.nextTick = (cb) => Promise.resolve().then(cb);
  }
  if (!process.platform) {
    process.platform = () => 'browser';
  }
  if (!process.version) {
    process.version = () => '0.0.0';
  }

  if (!gbl.__dirname) {
    gbl.__dirname = '/';
  }

  if (!gbl.__filename) {
    gbl.__filename = location.pathname;
    if (gbl.__filename === '/') {
      gbl.__filename = gbl.__dirname + 'index.js';
    }
  }

})(globalThis);
