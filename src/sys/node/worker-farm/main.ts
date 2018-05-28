import * as d from '../../../declarations';
import { CallItem, MessageData, Worker, WorkerOptions } from './interface';
import { cpus } from 'os';
import { fork } from 'child_process';


export class WorkerFarm {
  options: WorkerOptions;
  modulePath: string;
  workers: Worker[];
  callQueue: CallItem[];
  isExisting: boolean;
  workerIds: number;
  logger: d.Logger;

  constructor(modulePath: string, options: WorkerOptions = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.modulePath = modulePath;
    this.logger = {
      error: function() {
        console.error.apply(console, arguments);
      }
    } as any;

    // init values
    this.workers = [];
    this.callQueue = [];
    this.isExisting = false;
    this.workerIds = 0;
  }

  run(methodName: string, args?: any[]) {
    if (this.isExisting) {
      return Promise.reject(`process exited`);
    }

    return new Promise<any>((resolve, reject) => {
      const call: CallItem = {
        methodName: methodName,
        args: args,
        resolve: resolve,
        reject: reject
      };

      this.callQueue.push(call);
      this.processQueue();
    });
  }

  startWorker() {
    const workerId = this.workerIds++;
    const worker = this.createWorker(workerId);

    worker.calls = [];
    worker.callsAssigned = 0;

    this.workers.push(worker);
    return worker;
  }

  createWorker(workerId: number) {
    const options = Object.assign({
      env: process.env,
      cwd: process.cwd()
    }, this.options.forkOptions);

    const childProcess = fork(this.modulePath, process.argv, options);

    const worker: Worker = {
      workerId: workerId,
      callIds: 0,
      send: (msg: MessageData) => childProcess.send(msg),
      kill: () => childProcess.kill('SIGKILL')
    };

    childProcess.on('message', this.receiveFromWorker.bind(this));

    childProcess.once('exit', code => {
      this.onWorkerExit(workerId, code);
    });

    childProcess.on('error', () => {/**/});

    return worker;
  }

  onWorkerExit(workerId: number, exitCode: number) {
    const worker = this.workers.find(w => w.workerId === workerId);
    if (!worker) {
      return;
    }

    worker.exitCode = exitCode;

    setTimeout(() => {
      const worker = this.workers.find(w => w.workerId === workerId);
      if (worker) {
        worker.calls.forEach(call => {
          this.receiveFromWorker({
            callId: call.callId,
            workerId: workerId,
            error: {
              message: `Worker exited. Canceled "${call.methodName}" call.`
            }
          });
        });
      }

      this.stopWorker(worker);
    }, 10);
  }

  stopWorker(worker: Worker) {
    if (worker && !worker.isExisting) {
      worker.isExisting = true;

      worker.send({
        exitProcess: true
      });

      const tmr = setTimeout(() => {
        if (worker.exitCode == null) {
          worker.kill();
        }
      }, this.options.forcedKillTime);

      tmr.unref && tmr.unref();

      const index = this.workers.indexOf(worker);
      if (index > -1) {
        this.workers.splice(index, 1);
      }
    }
  }

  receiveFromWorker(msg: MessageData) {
    // called from a worker process, the data contains information needed to
    // look up the worker and the original call so we can invoke the callback
    const worker = this.workers.find(w => w.workerId === msg.workerId);
    if (!worker) {
      this.logger.error(`Worker Farm: Received message for unknown worker(${msg.workerId})`);
      return;
    }

    const call = worker.calls.find(w => w.callId === msg.callId);
    if (!call) {
      this.logger.error(`Worker Farm: Received message for unknown callId (${msg.callId}) for worker(${worker.workerId})`);
      return;
    }

    const index = worker.calls.indexOf(call);
    if (index > -1) {
      worker.calls.splice(index, 1);
    }

    if (call.timer) {
      clearTimeout(call.timer);
    }

    process.nextTick(() => {
      if (msg.error) {
        call.reject(msg.error.message);
      } else {
        call.resolve(msg.returnedValue);
      }
    });

    // allow any outstanding calls to be processed
    this.processQueue();
  }

  workerTimeout(workerId: number) {
    const worker = this.workers.find(w => w.workerId === workerId);
    if (!worker) {
      return;
    }

    worker.calls.forEach(call => {
      this.receiveFromWorker({
        callId: call.callId,
        workerId: workerId,
        error: {
          message: `worker call timed out!`
        }
      });
    });

    this.stopWorker(worker);
  }

  processQueue() {
    while (this.callQueue.length) {
      const worker = this.nextAvailableWorker();
      if (worker) {
        this.send(worker, this.callQueue.shift());

      } else {
        // no worker available ATM
        break;
      }
    }
  }

  nextAvailableWorker() {
    if (this.workers.length < this.options.maxConcurrentWorkers) {
      // still haven't reached our potential number of concurrent workers
      return this.startWorker();
    }

    const available = this.workers.filter(w => w.calls.length < this.options.maxConcurrentCallsPerWorker);
    if (available.length === 0) {
      // we're pretty tasked at the moment, please come back later
      return null;
    }

    const sorted = available.sort((a, b) => {
      // worker with the fewest active calls first
      if (a.calls.length < b.calls.length) return -1;
      if (a.calls.length > b.calls.length) return 1;

      // worker with the fewest calls that have been assigned next
      if (a.callsAssigned < b.callsAssigned) return -1;
      if (a.callsAssigned > b.callsAssigned) return 1;

      return 0;
    });

    return sorted[0];
  }

  send(worker: Worker, call: CallItem) {
    if (!worker || !call) {
      return;
    }

    call.callId = worker.callIds++;

    worker.calls.push(call);
    worker.callsAssigned++;

    worker.send({
      workerId: worker.workerId,
      callId: call.callId,
      methodName: call.methodName,
      args: call.args
    });

    call.args = null;

    if (this.options.maxCallTime !== Infinity) {
      call.timer = setTimeout(this.workerTimeout.bind(this, worker.workerId), this.options.maxCallTime);
    }
  }

  destroy() {
    if (!this.isExisting) {
      this.isExisting = true;

      for (let i = this.workers.length - 1; i >= 0; i--) {
        this.stopWorker(this.workers[i]);
      }
    }
  }

}


const DEFAULT_OPTIONS: WorkerOptions = {
  forkOptions: {},
  maxConcurrentWorkers: (cpus() || { length: 1 }).length,
  maxConcurrentCallsPerWorker: 5,
  maxCallTime: 90000,
  forcedKillTime: 100
};
