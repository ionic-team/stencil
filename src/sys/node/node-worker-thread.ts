import type * as d from '../../declarations';

export const initNodeWorkerThread = (prcs: NodeJS.Process, msgHandler: d.WorkerMsgHandler) => {
  const sendHandle = (err: NodeJS.ErrnoException) => {
    if (err && err.code === 'ERR_IPC_CHANNEL_CLOSED') {
      prcs.exit(0);
    }
  };

  const errorHandler = (stencilMsgId: number, err: any) => {
    const errMsgBackToMain: d.MsgFromWorker = {
      stencilId: stencilMsgId,
      stencilRtnValue: null,
      stencilRtnError: 'Error',
    };
    if (typeof err === 'string') {
      errMsgBackToMain.stencilRtnError += ': ' + err;
    } else if (err) {
      if (err.stack) {
        errMsgBackToMain.stencilRtnError += ': ' + err.stack;
      } else if (err.message) {
        errMsgBackToMain.stencilRtnError += ':' + err.message;
      }
    }
    prcs.send(errMsgBackToMain, sendHandle);
  };

  prcs.on('message', async (msgToWorker: d.MsgToWorker) => {
    // message from the main thread
    if (msgToWorker && typeof msgToWorker.stencilId === 'number') {
      try {
        // run the handler to get the data
        const msgFromWorker: d.MsgFromWorker = {
          stencilId: msgToWorker.stencilId,
          stencilRtnValue: await msgHandler(msgToWorker),
          stencilRtnError: null,
        };

        // send response data from the worker to the main thread
        prcs.send(msgFromWorker, sendHandle);
      } catch (e) {
        // error occurred while running the task
        errorHandler(msgToWorker.stencilId, e);
      }
    }
  });

  prcs.on(`unhandledRejection`, (e: any) => {
    errorHandler(-1, e);
  });
};
