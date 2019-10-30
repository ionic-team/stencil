import * as d from '../../../declarations';
import { version } from '../../../version';
import { getCompilerExecutingPath } from '../stencil-sys';
import { TASK_CANCELED_MSG, isString } from '@utils';


export const createWebWorkerMainController = (maxConcurrentWorkers: number, events: d.BuildEvents): d.WorkerMainController => {
  let msgIds = 0;
  let isDestroyed = false;
  const tasks = new Map<number, d.CompilerWorkerTask>();
  const workers: WorkerChild[] = [];
  const totalCpus = navigator.hardwareConcurrency || 1;
  const totalWorkers = Math.max(Math.min(maxConcurrentWorkers, totalCpus), 2) - 1;

  const onMessage = (ev: MessageEvent) => {
    const msgFromWorker: d.MsgFromWorker = ev.data;
    if (msgFromWorker && !isDestroyed) {
      if (isString(msgFromWorker.rtnEventName)) {
        events.emit(msgFromWorker.rtnEventName as any, msgFromWorker.rtnEventData);
      } else {
        const task = tasks.get(msgFromWorker.stencilId);
        if (task) {
          tasks.delete(msgFromWorker.stencilId);
          if (msgFromWorker.rtnError) {
            task.reject(msgFromWorker.rtnError);
          } else {
            task.resolve(msgFromWorker.rtnValue);
          }
        } else if (msgFromWorker.rtnError) {
          console.error(msgFromWorker.rtnError);
        }
      }
    }
  };

  const onError = (e: ErrorEvent) => console.error(e);

  const createWebWorkerMain = () => {
    const executingPath = getCompilerExecutingPath();
    const pathname = `./stencil.js?stencil-worker=${executingPath.includes('localhost') ? '' : version}`;
    const workerUrl = new URL(pathname, executingPath);
    const worker = new Worker(workerUrl, { name: `stencil@${version}` });
    worker.onerror = onError;
    worker.onmessage = onMessage;
    workers.push({
      worker,
      totalMsgs: 0,
    });
  };

  const send = (...args: any[]) => new Promise<any>((resolve, reject) => {
    if (isDestroyed) {
      reject(TASK_CANCELED_MSG);
      return;
    }

    const msg: d.MsgToWorker = {
      stencilId: msgIds++,
      args,
    };

    tasks.set(msg.stencilId, {
      resolve,
      reject,
    });

    if (workers.length === 0) {
      // always need at least one already fired up
      createWebWorkerMain();
    }

    let theChoosenOne: WorkerChild = null;
    for (const worker of workers) {
      if (theChoosenOne == null || worker.totalMsgs < theChoosenOne.totalMsgs) {
        theChoosenOne = worker;
      }
    }
    theChoosenOne.worker.postMessage(msg);
    theChoosenOne.totalMsgs++;

    if (workers.length < totalWorkers) {
      // warmup more we'll probably need soon
      createWebWorkerMain();
    }
  });

  const destroy = () => {
    isDestroyed = true;
    tasks.forEach(t => t.reject(TASK_CANCELED_MSG));
    tasks.clear();
    workers.forEach(w => w.worker.terminate());
    workers.length = 0;
  };

  return {
    send,
    destroy,
  };
};


interface WorkerChild {
  worker: Worker;
  totalMsgs: number;
}
