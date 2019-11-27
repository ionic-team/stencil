import { BuildEvents, MsgFromWorker, MsgToWorker, WorkerMsgHandler } from '../../../declarations';
import { isNumber, isString } from '@utils';


export const initWebWorkerThread = (selfWorker: Worker, msgHandler: WorkerMsgHandler, events: BuildEvents) => {
  let isQueued = false;

  const tick = Promise.resolve();

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

  const msgsFromWorkerQueue: MsgFromWorker[] = [];

  const drainMsgQueueFromWorker = () => {
    isQueued = false;
    selfWorker.postMessage(msgsFromWorkerQueue);
    msgsFromWorkerQueue.length = 0;
  };

  const onMessageToWorker = async (msgToWorker: MsgToWorker) => {
    if (msgToWorker && isNumber(msgToWorker.stencilId)) {
      try {
        // run the handler to get the data
        const msgFromWorker: MsgFromWorker = {
          stencilId: msgToWorker.stencilId,
          rtnValue: await msgHandler(msgToWorker),
          rtnError: null,
        };

        msgsFromWorkerQueue.push(msgFromWorker);

        if (!isQueued) {
          isQueued = true;
          tick.then(drainMsgQueueFromWorker);
        }

      } catch (e) {
        // error occurred while running the task
        error(msgToWorker.stencilId, e);
      }
    }
  };

  selfWorker.onmessage = (ev) => {
    // message from the main thread
    const msgsToWorker: MsgToWorker[] = ev.data;
    if (Array.isArray(msgsToWorker)) {
      msgsToWorker.forEach(onMessageToWorker);
    }
  };

  selfWorker.onerror = (e) => {
    // uncaught error occurred on the worker thread
    error(-1, e);
  };

  events.on((eventName, data) => {
    const eventFromWorker: MsgFromWorker = {
      rtnEventName: eventName,
      rtnEventData: data,
      rtnValue: null,
      rtnError: null,
    };

    msgsFromWorkerQueue.push(eventFromWorker);

    if (!isQueued) {
      isQueued = true;
      tick.then(drainMsgQueueFromWorker);
    }
  });
};
