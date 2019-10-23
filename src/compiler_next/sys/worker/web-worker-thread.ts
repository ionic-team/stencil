import { isString } from '@utils';
import { WorkerMsg, WorkerMsgHandler } from '../../../declarations';


export const createWebWorkerThread = (selfWorker: Worker, msgHandler: WorkerMsgHandler) => {

  const error = (stencilMsgId: number, err: any) => {
    const msg: WorkerMsg = {
      stencilId: stencilMsgId,
      rtnError: 'Error',
    };
    if (err) {
      if (isString(err)) {
        msg.rtnError += ': ' + err;
      } else {
        if (err.stack) {
          msg.rtnError += ': ' + err.stack;
        } else if (err.message) {
          msg.rtnError += ': ' + err.message;
        }
      }
    }
    selfWorker.postMessage(msg);
  };

  selfWorker.onmessage = async (ev) => {
    // message from the main thread
    const msgFromMain: WorkerMsg = ev.data;
    if (msgFromMain) {
      try {
        // run the handler to get the data
        const msgToMain = await msgHandler(msgFromMain);

        // send response data from the worker to the main thread
        selfWorker.postMessage(msgToMain);

      } catch (e) {
        // error occurred while running the task
        error(msgFromMain.stencilId, e);
      }
    }
  };

  selfWorker.onerror = (e) => {
    // uncaught error occurred on the worker thread
    error(-1, e);
  };
};
