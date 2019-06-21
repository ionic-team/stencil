import * as d from '../../../declarations';
import { EventEmitter } from 'events';
import { TASK_CANCELED_MSG } from '@utils';
import { WorkerMain } from './worker-main';


export class WorkerManager extends EventEmitter {
  workerIds = 0;
  taskIds = 0;
  isEnding = false;
  mainThreadRunner: d.WorkerRunner;
  taskQueue: d.WorkerTask[] = [];
  workers: WorkerMain[] = [];
  useForkedWorkers = false;


  constructor(public modulePath: string, public options: d.WorkerOptions) {
    super();

    this.useForkedWorkers = (this.options.maxConcurrentWorkers > 1);

    if (this.useForkedWorkers) {
      this.startWorkers();
    }
  }

  onError(err: NodeJS.ErrnoException, workerId: number) {
    if (err.code === 'ERR_IPC_CHANNEL_CLOSED') {
      return this.stopWorker(workerId);
    }
    if (this.options.logger && err.code !== 'EPIPE') {
      this.options.logger.error(err);
    }
  }

  onExit(workerId: number) {
    setTimeout(() => {
      let doQueue = false;
      const worker = this.workers.find(w => w.id === workerId);

      if (worker && worker.tasks.length > 0) {
        for (const task of worker.tasks) {
          task.retries++;
          this.taskQueue.unshift(task);
          doQueue = true;
        }
        worker.tasks.length = 0;
      }

      this.stopWorker(workerId);

      if (doQueue) {
        this.processTaskQueue();
      }
    }, 10);
  }

  startWorkers() {
    while (this.workers.length < this.options.maxConcurrentWorkers) {
      this.startWorker();
    }
  }

  startWorker() {
    const workerId = this.workerIds++;
    const worker = new WorkerMain(workerId, this.modulePath);

    worker.on('response', this.processTaskQueue.bind(this));

    worker.once('exit', () => {
      this.onExit(workerId);
    });

    worker.on('error', err => {
      this.onError(err, workerId);
    });

    this.workers.push(worker);
  }

  stopWorker(workerId: number) {
    const worker = this.workers.find(w => w.id === workerId);
    if (worker) {
      if (!worker.successfulMessage) {
        // never successfully sent a message
        // so something must be wrong, let's just
        // use the main thread runner from now on
        this.useForkedWorkers = false;
      }

      worker.stop();

      const index = this.workers.indexOf(worker);
      if (index > -1) {
        this.workers.splice(index, 1);
      }
    }
  }

  processTaskQueue() {
    if (this.isEnding || this.taskQueue.length === 0) {
      return;
    }

    this.startWorkers();

    while (this.taskQueue.length > 0) {
      const nextTask = this.taskQueue[0];
      const worker = getWorker(nextTask, this.workers, this.options.maxConcurrentTasksPerWorker);
      if (!worker) {
        break;
      }
      worker.run(this.taskQueue.shift());
    }
  }

  run(method: string, args?: any[], opts: d.WorkerRunnerOptions = {}) {
    if (this.isEnding) {
      return Promise.reject(TASK_CANCELED_MSG);
    }

    if (this.useForkedWorkers) {
      return new Promise<any>((resolve, reject) => {
        const task: d.WorkerTask = {
          taskId: this.taskIds++,
          method: method,
          args: args,
          retries: 0,
          resolve: resolve,
          reject: reject,
          isLongRunningTask: !!opts.isLongRunningTask,
          workerKey: opts.workerKey
        };
        this.taskQueue.push(task);

        this.processTaskQueue();
      });
    }

    if (!this.mainThreadRunner) {
      const workerModule = require(this.modulePath);
      this.mainThreadRunner = new workerModule.createRunner();
    }

    return this.mainThreadRunner(method, args);
  }

  cancelTasks() {
    for (const worker of this.workers) {
      for (const task of worker.tasks) {
        task.reject(TASK_CANCELED_MSG);
      }
      worker.tasks.length = 0;
    }
    this.taskQueue.length = 0;
    this.taskIds = 0;
  }

  destroy() {
    if (!this.isEnding) {
      this.isEnding = true;

      for (const task of this.taskQueue) {
        task.reject(TASK_CANCELED_MSG);
      }

      this.taskQueue.length = 0;

      const workerIds = this.workers.map(w => w.id);
      for (const workerId of workerIds) {
        this.stopWorker(workerId);
      }
    }
  }

}


function getWorker(task: d.WorkerTask, workers: WorkerMain[], maxConcurrentTasksPerWorker: number) {
  if (task.workerKey) {
    return getWorkerFromKey(workers, maxConcurrentTasksPerWorker, task.workerKey);
  }

  return getNextWorker(workers, maxConcurrentTasksPerWorker);
}


export function getWorkerFromKey(workers: WorkerMain[], maxConcurrentTasksPerWorker: number, workerKey: string) {
  let workerFromKey = workers.find(w => w.workerKeys.includes(workerKey));
  if (workerFromKey) {
    return workerFromKey;
  }

  workerFromKey = getNextWorker(workers, maxConcurrentTasksPerWorker);
  if (!workerFromKey) {
    workerFromKey = workers.find(w => w.workerKeys.length === 0);
    if (!workerFromKey) {
      workerFromKey = workers[0];
    }
  }

  workerFromKey.workerKeys.push(workerKey);

  return workerFromKey;
}


export function getNextWorker(workers: WorkerMain[], maxConcurrentTasksPerWorker: number) {
  const availableWorkers = workers.filter(w => {
    if (w.stopped) {
      // nope, don't use this worker if it's exiting
      return false;
    }

    if (w.tasks.length >= maxConcurrentTasksPerWorker) {
      // do not use this worker if it's at its max
      return false;
    }

    // see if any of the worker's tasks has a long running task
    if (w.tasks.some(t => t.isLongRunningTask)) {
      // one of the tasks for this worker is a long running task
      // so leave this worker alone and let it focus
      // basically so the many little tasks don't have to wait up on the long task
      // (validatingType locks up the thread, so don't use that thread for the time being!)
      return false;
    }

    // this is an available worker up for the job, bring it!
    return true;
  });

  if (availableWorkers.length === 0) {
    // all workers are pretty tasked at the moment
    // Please come back again. Thank you for your business.
    return null;
  }

  const sorted = availableWorkers.sort((a, b) => {
    // worker with the fewest active tasks first
    if (a.tasks.length < b.tasks.length) return -1;
    if (a.tasks.length > b.tasks.length) return 1;

    // all workers have the same number of active tasks, so next sort
    // by worker with the fewest total tasks that have been assigned
    if (a.totalTasksAssigned < b.totalTasksAssigned) return -1;
    if (a.totalTasksAssigned > b.totalTasksAssigned) return 1;

    return 0;
  });

  return sorted[0];
}
