import { NodeWorkerMain } from '../worker-main';


export class TestWorkerMain extends NodeWorkerMain {

  constructor(workerId: number) {
    super('TestWorker', workerId, null);
    this.fork();
  }

  fork() {
    this.childProcess = {} as any;
  }

}
