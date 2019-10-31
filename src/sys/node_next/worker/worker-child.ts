import * as d from '../../../declarations';
import { isNumber, isString } from '@utils';


export const initNodeWorkerThread = (prcs: NodeJS.Process, msgHandler: d.WorkerMsgHandler, events: d.BuildEvents) => {

  const sendHandle = (err: NodeJS.ErrnoException) => {
    if (err && err.code === 'ERR_IPC_CHANNEL_CLOSED') {
      prcs.exit(0);
    }
  };

  const errorHandler = (stencilMsgId: number, err: any) => {
    const errMsgBackToMain: d.MsgFromWorker = {
      stencilId: stencilMsgId,
      rtnValue: null,
      rtnError: 'Error',
    };
    if (isString(err)) {
      errMsgBackToMain.rtnError += ': ' + err;
    } else if (err) {
      if (err.stack) {
        errMsgBackToMain.rtnError += ': ' + err.stack;
      } else if (err.message) {
        errMsgBackToMain.rtnError += ':' + err.message;
      }
    }
    prcs.send(errMsgBackToMain, sendHandle);
  };

  prcs.on('message', async (msgToWorker: d.MsgToWorker) => {
    // message from the main thread
    if (msgToWorker && isNumber(msgToWorker.stencilId)) {
      try {
        // run the handler to get the data
        const msgFromWorker: d.MsgFromWorker = {
          stencilId: msgToWorker.stencilId,
          rtnValue: await msgHandler(msgToWorker),
          rtnError: null,
        };

        // send response data from the worker to the main thread
        prcs.send(msgFromWorker, sendHandle);

      } catch (e) {
        // error occurred while running the task
        errorHandler(msgToWorker.stencilId, e);
      }
    }
  });

  if (events) {
    events.on((eventName, data) => {
      prcs.send({
        rtnEventName: eventName,
        rtnEventData: data,
        rtnValue: null,
        rtnError: null,
      }, sendHandle);
    });
  }

  prcs.on(`unhandledRejection`, (e: any) => {
    errorHandler(-1, e);
  });
};
