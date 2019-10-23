import * as d from '../../../declarations';


export const createNodeWorkerThread = (prcs: NodeJS.Process, msgHandler: d.WorkerMsgHandler) => {

  const sendMessageToMain = (responseToMainMsg: d.WorkerMsg) => {
    prcs.send(responseToMainMsg, (err: NodeJS.ErrnoException) => {
      if (err && err.code === 'ERR_IPC_CHANNEL_CLOSED') {
        prcs.exit(0);
      }
    });
  };

  const errorHandler = (stencilMsgId: number, err: any) => {
    const errMsg: d.WorkerMsg = {
      stencilId: stencilMsgId,
      rtnValue: null,
      rtnError: null,
    };
    if (err) {
      errMsg.rtnError = 'Webworker Error';
      if (typeof err === 'string') {
        errMsg.rtnError += ': ' + err;
      } else {
        if (err.stack) {
          errMsg.rtnError += ': ' + err.stack;
        } else if (err.message) {
          errMsg.rtnError += ':' + err.message;
        }
      }
    }
    sendMessageToMain(errMsg);
  };

  prcs.on('message', async (msgFromMain: d.WorkerMsg) => {
    // message from the main thread
    if (msgFromMain && typeof msgFromMain.stencilId === 'number') {
      try {
        // run the handler to get the data
        const responseToMainMsg = await msgHandler(msgFromMain);

        // send response data from the worker to the main thread
        sendMessageToMain(responseToMainMsg);

      } catch (e) {
        // error occurred while running the task
        errorHandler(msgFromMain.stencilId, e);
      }
    }
  });

  prcs.on(`unhandledRejection`, (e: any) => {
    errorHandler(-1, e);
  });
};
