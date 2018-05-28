import { MessageData } from './interface';


export function attachMessageHandler(process: NodeJS.Process, workerModule: any) {

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

    // get the method on the loaded module
    const workerFn = workerModule[receivedMsg.methodName];
    if (typeof workerFn !== 'function') {
      responseMsg.error = {
        message: `invalid method: ${receivedMsg.methodName}`
      };
      process.send(responseMsg);
      return;
    }

    // call the method on the loaded module
    try {
      const rtn = workerFn.apply(workerModule, receivedMsg.args);
      if (rtn == null || typeof rtn.then !== 'function') {
        // sync function returned void or a value that's not a promise
        responseMsg.returnedValue = rtn;
        process.send(responseMsg);

      } else {
        // async function returned a promise
        rtn.then((value: any) => {
          responseMsg.returnedValue = value;
          process.send(responseMsg);

        }).catch((err: any) => {
          // returned a rejected promise
          responseMsg.error = {
            message: err
          };
        });
      }

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
