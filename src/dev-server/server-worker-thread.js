const { initServerProcess } = require('./server-process.js');
const receiveMessageFromMain = initServerProcess(msg => {
  process.send(msg);
});
process.on('message', receiveMessageFromMain);
process.on('unhandledRejection', e => {
  process.send({
    error: { message: 'unhandledRejection: ' + e, stack: typeof e.stack === 'string' ? e.stack : null },
  });
});
