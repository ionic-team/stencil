import * as d from '../../../../declarations';
import { WorkerFarm } from '../main';
import * as path from 'path';


export class TestWorkerFarm extends WorkerFarm {
  constructor(options: d.WorkerOptions = {}) {
    if (typeof options.maxConcurrentWorkers !== 'number') {
      options.maxConcurrentWorkers = 4;
    }

    const modulePath = path.join(__dirname, '..', '..', '..', '..', '..', 'dist', 'sys', 'node', 'sys-worker.js');
    super(modulePath, options);
  }

  createWorker(workerId: number) {
    const worker: d.WorkerProcess = {
      workerId: workerId,
      taskIds: 0,
      send: (msg: d.WorkerMessageData) => {/**/},
      kill: () => {/**/},
    };
    return worker;
  }
}
