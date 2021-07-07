import type * as d from '../../declarations';
import { TASK_CANCELED_MSG } from '@utils';

export const createDenoWorkerMainController = (
  sys: d.CompilerSystem,
  maxConcurrentWorkers: number,
): d.WorkerMainController => {
  let msgIds = 0;
  let isDestroyed = false;
  let isQueued = false;
  let workerIds = 0;
  const tasks = new Map<number, d.CompilerWorkerTask>();
  const queuedSendMsgs: d.MsgToWorker[] = [];
  const workers: WorkerChild[] = [];
  const maxWorkers = Math.max(Math.min(maxConcurrentWorkers, sys.hardwareConcurrency), 2) - 1;

  const times = new Map();

  const onMsgsFromWorker = (worker: WorkerChild, ev: MessageEvent) => {
    if (!isDestroyed) {
      const msgsFromWorker: d.MsgFromWorker[] = ev.data;
      if (Array.isArray(msgsFromWorker)) {
        for (const msgFromWorker of msgsFromWorker) {
          if (msgFromWorker) {
            const task = tasks.get(msgFromWorker.stencilId);
            if (task) {
              tasks.delete(msgFromWorker.stencilId);
              if (msgFromWorker.stencilRtnError) {
                task.reject(msgFromWorker.stencilRtnError);
              } else {
                task.resolve(msgFromWorker.stencilRtnValue);
              }

              worker.activeTasks--;
              if (worker.activeTasks < 0 || worker.activeTasks > 50) {
                worker.activeTasks = 0;
              }
            } else if (msgFromWorker.stencilRtnError) {
              console.error(msgFromWorker.stencilRtnError);
            }
          }
        }
      }
    }
  };

  const onWorkerError = (e: ErrorEvent) => console.error(e);

  const createWorkerMain = () => {
    const workerUrl = new URL('./worker.js', import.meta.url).href;

    const workerOpts: any = {
      name: `stencil.worker.${workerIds++}`,
      type: `module`,
      // https://github.com/denoland/deno/pull/4784/files#diff-dd54e4bec687ba9ed5ee965039de9fbbR1083
      deno: true,
    };

    const worker = new Worker(workerUrl, workerOpts);

    const workerChild: WorkerChild = {
      worker,
      activeTasks: 0,
      sendQueue: [],
    };
    worker.onerror = onWorkerError;
    worker.onmessage = ev => onMsgsFromWorker(workerChild, ev);

    return workerChild;
  };

  const sendMsgsToWorkers = (w: WorkerChild) => {
    if (w.sendQueue.length > 0) {
      w.worker.postMessage(w.sendQueue);
      w.sendQueue.length = 0;
    }
  };

  const queueMsgToWorker = (msg: d.MsgToWorker) => {
    let theChosenOne: WorkerChild;

    if (workers.length > 0) {
      theChosenOne = workers[0];

      if (maxWorkers > 1) {
        for (const worker of workers) {
          if (worker.activeTasks < theChosenOne.activeTasks) {
            theChosenOne = worker;
          }
        }

        if (theChosenOne.activeTasks > 0 && workers.length < maxWorkers) {
          theChosenOne = createWorkerMain();
          workers.push(theChosenOne);
        }
      }
    } else {
      theChosenOne = createWorkerMain();
      workers.push(theChosenOne);
    }

    theChosenOne.activeTasks++;
    theChosenOne.sendQueue.push(msg);
  };

  const flushSendQueue = () => {
    isQueued = false;
    queuedSendMsgs.forEach(queueMsgToWorker);
    queuedSendMsgs.length = 0;
    workers.forEach(sendMsgsToWorkers);
  };

  const send = (...args: any[]) =>
    new Promise<any>((resolve, reject) => {
      if (isDestroyed) {
        reject(TASK_CANCELED_MSG);
      } else {
        const msg: d.MsgToWorker = {
          stencilId: msgIds++,
          args,
        };
        queuedSendMsgs.push(msg);
        times.set(msg.stencilId, Date.now());

        tasks.set(msg.stencilId, {
          resolve,
          reject,
        });

        if (!isQueued) {
          isQueued = true;
          queueMicrotask(flushSendQueue);
        }
      }
    });

  const destroy = () => {
    isDestroyed = true;
    tasks.forEach(t => t.reject(TASK_CANCELED_MSG));
    tasks.clear();
    workers.forEach(w => w.worker.terminate());
    workers.length = 0;
  };

  const handler = (name: string) => {
    return function (...args: any[]) {
      return send(name, ...args);
    };
  };

  return {
    send,
    destroy,
    handler,
    maxWorkers,
  };
};

interface WorkerChild {
  worker: Worker;
  activeTasks: number;
  sendQueue: d.MsgToWorker[];
}
