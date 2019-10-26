import * as d from '../../../declarations';


export const initNodeWorkerThread = (prcs: NodeJS.Process, msgHandler: d.WorkerMsgHandler, events: d.BuildEvents) => {

  const sendMessageBackToMain = (msgFromWorker: d.MsgFromWorker) => {
    prcs.send(msgFromWorker, (err: NodeJS.ErrnoException) => {
      if (err && err.code === 'ERR_IPC_CHANNEL_CLOSED') {
        prcs.exit(0);
      }
    });
  };

  const errorHandler = (stencilMsgId: number, err: any) => {
    const errMsgBackToMain: d.MsgFromWorker = {
      stencilId: stencilMsgId,
      rtnValue: null,
      rtnError: 'Error',
    };
    if (typeof err === 'string') {
      errMsgBackToMain.rtnError += ': ' + err;
    } else if (err) {
      if (err.stack) {
        errMsgBackToMain.rtnError += ': ' + err.stack;
      } else if (err.message) {
        errMsgBackToMain.rtnError += ':' + err.message;
      }
    }
    sendMessageBackToMain(errMsgBackToMain);
  };

  prcs.on('message', async (msgToWorker: d.MsgToWorker) => {
    // message from the main thread
    if (msgToWorker && typeof msgToWorker.stencilId === 'number') {
      try {
        // run the handler to get the data
        const msgFromWorker: d.MsgFromWorker = {
          stencilId: msgToWorker.stencilId,
          rtnValue: await msgHandler(msgToWorker),
          rtnError: null,
        };

        // send response data from the worker to the main thread
        sendMessageBackToMain(msgFromWorker);

      } catch (e) {
        // error occurred while running the task
        errorHandler(msgToWorker.stencilId, e);
      }
    }
  });

  if (events) {
    events.on((eventName, data) => {
      sendMessageBackToMain({
        rtnEventName: eventName,
        rtnEventData: data,
        rtnValue: null,
        rtnError: null,
      });
    });
  }

  prcs.on(`unhandledRejection`, (e: any) => {
    errorHandler(-1, e);
  });
};
