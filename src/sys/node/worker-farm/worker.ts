import { MessageData, Runner } from './interface';


export function attachMessageHandler(process: NodeJS.Process, runner: Runner) {

  function handleMessageFromMain(receivedFromMain: MessageData) {
    if (receivedFromMain.exitProcess) {
      // main thread said to have this worker exit
      process.exit(0);
    }

    // build a message to send back to main
    const sendToMain: MessageData = {
      workerId: receivedFromMain.workerId,
      taskId: receivedFromMain.taskId
    };

    // call the method on the loaded module
    // using the received task data
    try {
      const rtn = runner(receivedFromMain.methodName, receivedFromMain.args);

      // clear out the args since we no longer need the data
      receivedFromMain.args = null;

      rtn.then((value: any) => {
        sendToMain.value = value;
        process.send(sendToMain);

      }).catch((err: any) => {
        // returned a rejected promise
        sendToMain.error = {
          message: err
        };
        process.send(sendToMain);
      });

    } catch (e) {
      // method call had an error
      if (typeof e === 'string') {
        sendToMain.error = {
          message: e
        };

      } else if (e) {
        sendToMain.error = {
          type: e.type,
          message: e.message,
          stack: e.stack
        };

      } else {
        sendToMain.error = {
          message: 'worker error'
        };
      }

      process.send(sendToMain);
    }
  }

  // handle receiving a message from main
  process.on('message', handleMessageFromMain);
}
