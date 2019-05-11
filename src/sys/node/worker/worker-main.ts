import * as d from '../../../declarations';
import * as cp from 'child_process';
import { EventEmitter } from 'events';
import { TASK_CANCELED_MSG } from '@utils';


export class WorkerMain extends EventEmitter {
  childProcess: cp.ChildProcess;
  tasks: d.WorkerTask[] = [];
  exitCode: number = null;
  processQueue = true;
  sendQueue: d.WorkerMessage[] = [];
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

    const args = ['--start-worker'];

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

  run(task: d.WorkerTask) {
    this.totalTasksAssigned++;
    this.tasks.push(task);

    this.sendToWorker({
      taskId: task.taskId,
      method: task.method,
      args: task.args
    });
  }

  sendToWorker(msg: d.WorkerMessage) {
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

  receiveFromWorker(responseFromWorker: d.WorkerMessage) {
    this.successfulMessage = true;

    if (this.stopped) {
      return;
    }

    const task = this.tasks.find(t => t.taskId === responseFromWorker.taskId);
    if (!task) {
      if (responseFromWorker.error != null) {
        this.emit('error', responseFromWorker.error);
      }
      return;
    }

    if (responseFromWorker.error != null) {
      task.reject(responseFromWorker.error);
    } else {
      task.resolve(responseFromWorker.value);
    }

    const index = this.tasks.indexOf(task);
    if (index > -1) {
      this.tasks.splice(index, 1);
    }

    this.emit('response', responseFromWorker);
  }

  stop() {
    this.stopped = true;

    for (const task of this.tasks) {
      task.reject(TASK_CANCELED_MSG);
    }
    this.tasks.length = 0;

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
