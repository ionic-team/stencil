import * as d from '../../../declarations';
import { version } from '../../../version';
import { getCompilerExecutingPath } from '../stencil-sys';
import { TASK_CANCELED_MSG, isString } from '@utils';


export const createWebWorkerMainController = (maxConcurrentWorkers: number, events: d.BuildEvents): d.WorkerMainController => {
  let msgIds = 0;
  let isDestroyed = false;
  const tasks = new Map<number, d.CompilerWorkerTask>();
  const workers: WorkerChild[] = [];
  const hardwareConcurrency = navigator.hardwareConcurrency || 1;
  const totalWorkers = Math.max(Math.min(maxConcurrentWorkers, hardwareConcurrency), 2) - 1;

  const onMessage = (worker: WorkerChild, ev: MessageEvent) => {
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

          worker.activeTasks--;
          if (worker.activeTasks < 0 || worker.activeTasks > 50) {
            worker.activeTasks = 0;
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
    const workerChild: WorkerChild = {
      worker,
      activeTasks: 0,
    };
    worker.onerror = onError;
    worker.onmessage = (ev) => {
      onMessage(workerChild, ev);
    };
    workers.push(workerChild);

    return workerChild;
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

    let theChoosenOne = workers.find(w => w.activeTasks === 0);
    if (!theChoosenOne) {
      if (workers.length < totalWorkers) {
        // all workers seem to be busy, but not
        // more workers could be created yet
        theChoosenOne = createWebWorkerMain();

      } else {
        // all the workers have been created
        // choose the one with the fewest active tasks
        for (const worker of workers) {
          if (theChoosenOne == null || worker.activeTasks < theChoosenOne.activeTasks) {
            theChoosenOne = worker;
          }
        }
      }
    }

    theChoosenOne.worker.postMessage(msg);

    theChoosenOne.activeTasks++;
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
  activeTasks: number;
}
