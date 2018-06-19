import * as d from '../../../declarations';


export function attachMessageHandler(process: NodeJS.Process, runner: d.WorkerRunner) {

  function handleMessageFromMain(receivedFromMain: d.WorkerMessageData) {
    if (receivedFromMain.exitProcess) {
      // main thread said to have this worker exit
      process.exit(0);
    }

    // build a message to send back to main
    const sendToMain: d.WorkerMessageData = {
      workerId: receivedFromMain.workerId,
      taskId: receivedFromMain.taskId
    };

    // call the method on the loaded module
    // using the received task data
    try {
      const rtn = runner(receivedFromMain.methodName, receivedFromMain.args);

      rtn.then((value: any) => {
        sendToMain.value = value;
        process.send(sendToMain);

      }).catch((err: any) => {
        // returned a rejected promise
        addErrorToMsg(sendToMain, err);
        process.send(sendToMain);
      });

    } catch (e) {
      // method call had an error
      addErrorToMsg(sendToMain, e);
      process.send(sendToMain);
    }
  }

  // handle receiving a message from main
  process.on('message', handleMessageFromMain);
}


function addErrorToMsg(msg: d.WorkerMessageData, e: any) {
  // parse the error into an object that can go between processes
  msg.error = {
    message: 'worker error'
  };

  if (typeof e === 'string') {
    msg.error.message = e;

  } else if (e) {
    if (e.message) {
      msg.error.message = e.message + '';
    }
    if (e.stack) {
      msg.error.stack = e.stack + '';
    }
    if (e.type) {
      msg.error.type = e.type + '';
    }
  }
}
