import { WorkerFarm } from '../main';
import { MessageData, Worker, WorkerOptions } from '../interface';


export class TestWorkerFarm extends WorkerFarm {
  constructor(options: WorkerOptions = {}) {
    super('', options);
  }

  createWorker(workerId: number) {
    const worker: Worker = {
      workerId: workerId,
      callIds: 0,
      send: (msg: MessageData) => {/**/},
      kill: () => {/**/},
    };
    return worker;
  }
}
