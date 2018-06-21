
const sysWorker = require('../../../../dist/transpiled-sys-node/sys/node/node-sys-worker');

exports.createRunner = sysWorker.createRunner;
exports.attachMessageHandler = sysWorker.attachMessageHandler;

if (process.argv.indexOf('--start-worker') > -1) {
  // --start-worker cmd line arg used to start the worker
  // and attached a message handler to the process
  const runner = sysWorker.createRunner();
  sysWorker.attachMessageHandler(process, runner);
}
