import { WorkerFarm } from '../main';
import { MessageData, Worker, WorkerOptions } from '../interface';
import * as path from 'path';


export class TestWorkerFarm extends WorkerFarm {
  constructor(options: WorkerOptions = {}) {
    if (typeof options.maxConcurrentWorkers !== 'number') {
      options.maxConcurrentWorkers = 4;
    }

    const modulePath = path.join(__dirname, '..', '..', '..', '..', '..', 'dist', 'sys', 'node', 'sys-worker.js');
    super(modulePath, options);
  }

  createWorker(workerId: number) {
    const worker: Worker = {
      workerId: workerId,
      taskIds: 0,
      send: (msg: MessageData) => {/**/},
      kill: () => {/**/},
    };
    return worker;
  }
}
