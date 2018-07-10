import * as d from '../../../declarations';
import { EventEmitter } from 'events';
import { TASK_CANCELED_MSG } from '../../../compiler/util';
import { WorkerMain } from './worker-main';


export class WorkerManager extends EventEmitter {
  workerIds = 0;
  taskIds = 0;
  isEnding = false;
  modulePath: string;
  singleThreadRunner: d.WorkerRunner;
  taskQueue: d.WorkerTask[] = [];
  workers: WorkerMain[] = [];
  options: d.WorkerOptions;


  constructor(modulePath: string, options: d.WorkerOptions = {}) {
    super();

    this.options = {
      maxConcurrentWorkers: DEFAULT_MAX_WORKERS,
      maxConcurrentTasksPerWorker: DEFAULT_MAX_TASKS_PER_WORKER
    };

    if (typeof options.maxConcurrentWorkers === 'number') {
      this.options.maxConcurrentWorkers = options.maxConcurrentWorkers;
    }

    if (typeof options.maxConcurrentTasksPerWorker === 'number') {
      this.options.maxConcurrentTasksPerWorker = options.maxConcurrentTasksPerWorker;
    }

    this.modulePath = modulePath;

    if (this.options.maxConcurrentWorkers > 1) {
      this.startWorkers();

    } else {
      const workerModule = require(modulePath);
      this.singleThreadRunner = new workerModule.createRunner();
    }
  }

  onError(error: NodeJS.ErrnoException, workerId: number) {
    if (error.code === 'ERR_IPC_CHANNEL_CLOSED') {
      return this.stopWorker(workerId);
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

    if (this.singleThreadRunner) {
      return this.singleThreadRunner(method, args);
    }

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


const DEFAULT_MAX_WORKERS = 1;
const DEFAULT_MAX_TASKS_PER_WORKER = 2;
