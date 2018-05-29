import { MessageData, Runner } from './interface';


export function attachMessageHandler(process: NodeJS.Process, runner: Runner) {

  function handleMessage(receivedMsg: MessageData) {
    if (receivedMsg.exitProcess) {
      // main thread said to have this worker exit
      process.exit(0);
    }

    // build a message to send back to main
    const responseMsg: MessageData = {
      workerId: receivedMsg.workerId,
      callId: receivedMsg.callId
    };

    // call the method on the loaded module
    try {
      const rtn = runner(receivedMsg.methodName, receivedMsg.args);
      rtn.then((value: any) => {
        responseMsg.value = value;
        process.send(responseMsg);

      }).catch((err: any) => {
        // returned a rejected promise
        responseMsg.error = {
          message: err
        };
        process.send(responseMsg);
      });

    } catch (e) {
      // method call had an error
      if (typeof e === 'string') {
        responseMsg.error = {
          message: e
        };

      } else if (e) {
        responseMsg.error = {
          type: e.type,
          message: e.message,
          stack: e.stack
        };

      } else {
        responseMsg.error = {
          message: 'worker error'
        };
      }

      process.send(responseMsg);
    }
  }

  // handle receiving a message from main
  process.on('message', handleMessage);
}
