import { WorkerMain } from '../worker-main';


export class TestWorkerMain extends WorkerMain {

  constructor(private workerId: number) {
    super(workerId, null);
    this.fork();
  }

  fork() {
    this.childProcess = {} as any;
  }

}
