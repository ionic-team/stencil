import * as d from '../../../declarations';
import * as cp from 'child_process';
import { EventEmitter } from 'events';
import { TASK_CANCELED_MSG } from '@utils';


export class NodeWorkerMain extends EventEmitter {
  childProcess: cp.ChildProcess;
  tasks = new Map<number, d.CompilerWorkerTask>();
  exitCode: number = null;
  processQueue = true;
  sendQueue: d.WorkerMsg[] = [];
  stopped = false;
  successfulMessage = false;
  totalTasksAssigned = 0;
  workerKeys: string[] = [];

  constructor(public id: number, workerModule: string) {
    super();
    this.fork(workerModule);
  }

  fork(workerModule: string) {
    const filteredArgs = process.execArgv.filter(
      v => !/^--(debug|inspect)/.test(v)
    );

    const options: cp.ForkOptions = {
      execArgv: filteredArgs,
      env: process.env,
      cwd: process.cwd()
    };

    const args = [
      `--worker-controller=${workerModule}`
    ];

    this.childProcess = cp.fork(workerModule, args, options);

    this.childProcess.on('message', this.receiveFromWorker.bind(this));

    this.childProcess.once('exit', code => {
      this.exitCode = code;
      this.emit('exit', code);
    });

    this.childProcess.on('error', err => {
      this.emit('error', err);
    });
  }

  run(task: d.CompilerWorkerTask) {
    this.totalTasksAssigned++;
    this.tasks.set(task.stencilId, task);

    this.sendToWorker({
      stencilId: task.stencilId,
      inputArgs: task.inputArgs
    });
  }

  sendToWorker(msg: d.WorkerMsg) {
    if (!this.processQueue) {
      this.sendQueue.push(msg);
      return;
    }

    const success = this.childProcess.send(msg, error => {
      if (error && error instanceof Error) {
        return;
      }

      this.processQueue = true;

      if (this.sendQueue.length > 0) {
        const queueCopy = this.sendQueue.slice();
        this.sendQueue = [];
        queueCopy.forEach(d => this.sendToWorker(d));
      }
    });

    if (!success || /^win/.test(process.platform)) {
      this.processQueue = false;
    }
  }

  receiveFromWorker(responseFromWorker: d.WorkerMsg) {
    this.successfulMessage = true;

    if (this.stopped) {
      return;
    }

    const task = this.tasks.get(responseFromWorker.stencilId);
    if (!task) {
      if (responseFromWorker.rtnError != null) {
        this.emit('error', responseFromWorker.rtnError);
      }
      return;
    }

    if (responseFromWorker.rtnError != null) {
      task.reject(responseFromWorker.rtnError);
    } else {
      task.resolve(responseFromWorker.rtnValue);
    }

    this.tasks.delete(responseFromWorker.stencilId);

    this.emit('response', responseFromWorker);
  }

  stop() {
    this.stopped = true;

    this.tasks.forEach(t => t.reject(TASK_CANCELED_MSG));
    this.tasks.clear();

    if (this.successfulMessage) {
      // we know we've had a successful startup
      // so let's close it down all nice like
      this.childProcess.send({
        exit: true
      });

      setTimeout(() => {
        if (this.exitCode === null) {
          // fallback if we weren't able to gracefully exit
          this.childProcess.kill('SIGKILL');
        }
      }, 100);

    } else {
      // never had a successful message
      // so something may be hosed up
      // let's just kill it now
      this.childProcess.kill('SIGKILL');
    }
  }
}
