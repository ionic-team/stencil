import { isNumber, isString } from '@utils';

import { MsgFromWorker, MsgToWorker, WorkerMsgHandler } from '../../../declarations';

export const initWebWorkerThread = (msgHandler: WorkerMsgHandler) => {
  let isQueued = false;

  const tick = Promise.resolve();

  const msgsFromWorkerQueue: MsgFromWorker[] = [];

  const drainMsgQueueFromWorkerToMain = () => {
    isQueued = false;
    (self as any).postMessage(msgsFromWorkerQueue);
    msgsFromWorkerQueue.length = 0;
  };

  const queueMsgFromWorkerToMain = (msgFromWorkerToMain: MsgFromWorker) => {
    msgsFromWorkerQueue.push(msgFromWorkerToMain);
    if (!isQueued) {
      isQueued = true;
      tick.then(drainMsgQueueFromWorkerToMain);
    }
  };

  const error = (stencilMsgId: number, err: any) => {
    const errMsgFromWorkerToMain: MsgFromWorker = {
      stencilId: stencilMsgId,
      stencilRtnValue: null,
      stencilRtnError: 'Error',
    };
    if (isString(err)) {
      errMsgFromWorkerToMain.stencilRtnError += ': ' + err;
    } else if (err) {
      if (err.stack) {
        errMsgFromWorkerToMain.stencilRtnError += ': ' + err.stack;
      } else if (err.message) {
        errMsgFromWorkerToMain.stencilRtnError += ': ' + err.message;
      }
    }
    queueMsgFromWorkerToMain(errMsgFromWorkerToMain);
  };

  const receiveMsgFromMainToWorker = async (msgToWorker: MsgToWorker) => {
    if (msgToWorker && isNumber(msgToWorker.stencilId)) {
      try {
        // run the handler to get the data
        const msgFromWorkerToMain: MsgFromWorker = {
          stencilId: msgToWorker.stencilId,
          stencilRtnValue: await msgHandler(msgToWorker),
          stencilRtnError: null,
        };
        queueMsgFromWorkerToMain(msgFromWorkerToMain);
      } catch (e) {
        // error occurred while running the task
        error(msgToWorker.stencilId, e);
      }
    }
  };

  self.onmessage = (ev: MessageEvent) => {
    // message from the main thread
    const msgsFromMainToWorker: MsgToWorker[] = ev.data;
    if (Array.isArray(msgsFromMainToWorker)) {
      for (const msgFromMainToWorker of msgsFromMainToWorker) {
        receiveMsgFromMainToWorker(msgFromMainToWorker);
      }
    }
  };

  self.onerror = (e) => {
    // uncaught error occurred on the worker thread
    error(-1, e);
  };
};
