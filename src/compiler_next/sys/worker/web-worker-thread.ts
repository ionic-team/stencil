import { isNumber, isString } from '@utils';
import { MsgFromWorker, MsgToWorker, WorkerMsgHandler } from '../../../declarations';


export const initWebWorkerThread = (selfWorker: Worker, msgHandler: WorkerMsgHandler) => {

  const error = (stencilMsgId: number, err: any) => {
    const errMsgBackToMain: MsgFromWorker = {
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
        errMsgBackToMain.rtnError += ': ' + err.message;
      }
    }
    selfWorker.postMessage(errMsgBackToMain);
  };

  selfWorker.onmessage = async (ev) => {
    // message from the main thread
    const msgToWorker: MsgToWorker = ev.data;
    if (msgToWorker && isNumber(msgToWorker.stencilId)) {
      try {
        // run the handler to get the data
        const msgFromWorker: MsgFromWorker = {
          stencilId: msgToWorker.stencilId,
          rtnValue: await msgHandler(msgToWorker),
          rtnError: null,
        };

        // send response data from the worker to the main thread
        selfWorker.postMessage(msgFromWorker);

      } catch (e) {
        // error occurred while running the task
        error(msgToWorker.stencilId, e);
      }
    }
  };

  selfWorker.onerror = (e) => {
    // uncaught error occurred on the worker thread
    error(-1, e);
  };
};
