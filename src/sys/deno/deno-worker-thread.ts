import type { MsgFromWorker, MsgToWorker, WorkerMsgHandler } from '../../declarations';

export const initDenoWorkerThread = (glbl: any, msgHandler: WorkerMsgHandler) => {
  let isQueued = false;

  const msgsFromWorkerQueue: MsgFromWorker[] = [];

  const drainMsgQueueFromWorkerToMain = () => {
    isQueued = false;
    glbl.postMessage(msgsFromWorkerQueue);
    msgsFromWorkerQueue.length = 0;
  };

  const queueMsgFromWorkerToMain = (msgFromWorkerToMain: MsgFromWorker) => {
    msgsFromWorkerQueue.push(msgFromWorkerToMain);
    if (!isQueued) {
      isQueued = true;
      queueMicrotask(drainMsgQueueFromWorkerToMain);
    }
  };

  const error = (stencilMsgId: number, err: any) => {
    const errMsgFromWorkerToMain: MsgFromWorker = {
      stencilId: stencilMsgId,
      stencilRtnValue: null,
      stencilRtnError: 'Error',
    };
    if (typeof err === 'string') {
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
    if (msgToWorker && typeof msgToWorker.stencilId === 'number') {
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

  glbl.onmessage = (ev: MessageEvent) => {
    // message from the main thread
    const msgsFromMainToWorker: MsgToWorker[] = ev.data;
    if (Array.isArray(msgsFromMainToWorker)) {
      for (const msgFromMainToWorker of msgsFromMainToWorker) {
        receiveMsgFromMainToWorker(msgFromMainToWorker);
      }
    }
  };

  glbl.onerror = (e: any) => {
    // uncaught error occurred on the worker thread
    error(-1, e);
  };
};
