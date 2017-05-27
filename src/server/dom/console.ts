
// the VM context we created doesn't come with the
// console, so we need to provide our own which
// just calls the console we do have access to

export class Console {

  constructor(private printUserLogs: boolean) {}

  assert() {
    if (this.printUserLogs) console.assert.apply(console, arguments);
  }

  dir() {
    if (this.printUserLogs) console.dir.apply(console, arguments);
  }

  error() {
    if (this.printUserLogs) console.error.apply(console, arguments);
  }

  info() {
    if (this.printUserLogs) console.info.apply(console, arguments);
  }

  log() {
    if (this.printUserLogs) console.log.apply(console, arguments);
  }

  time() {
    if (this.printUserLogs) console.time.apply(console, arguments);
  }

  timeEnd() {
    if (this.printUserLogs) console.timeEnd.apply(console, arguments);
  }

  trace() {
    if (this.printUserLogs) console.trace.apply(console, arguments);
  }

  warn() {
    console.warn.apply(console, arguments);
  }
}
