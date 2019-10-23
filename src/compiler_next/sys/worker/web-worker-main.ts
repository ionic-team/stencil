import * as d from '../../../declarations';
import { version } from '../../../version';
import { getCompilerExecutingPath } from '../stencil-sys';
import { TASK_CANCELED_MSG } from '@utils';


export const createWebWorkerMainController = (maxConcurrentWorkers: number): d.WorkerMainController => {
  let msgIds = 0;
  let isDestroyed = false;
  const tasks = new Map<number, d.CompilerWorkerTask>();
  const workers: WorkerChild[] = [];
  const cpus = navigator.hardwareConcurrency || 1;
  const totalWorkers = Math.max(Math.min(maxConcurrentWorkers, cpus), 1);

  const onMessage = (ev: MessageEvent) => {
    const msg: d.WorkerMsg = ev.data;
    if (msg != null && !isDestroyed) {
      const task = tasks.get(msg.stencilId);
      if (task) {
        tasks.delete(msg.stencilId);
        if (msg.rtnError) {
          task.reject(msg.rtnError);
        } else {
          task.resolve(msg.rtnValue);
        }
      } else if (msg.rtnError) {
        console.error(msg.rtnError);
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

    const msg: d.WorkerMsg = {
      stencilId: msgIds++,
      inputArgs: args,
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
