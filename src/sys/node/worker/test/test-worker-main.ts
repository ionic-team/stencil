import { WorkerMain } from '../worker-main';


export class TestWorkerMain extends WorkerMain {

  constructor(private _pid: number) {
    super(null);
    this.fork();
  }

  get pid() {
    return this._pid;
  }

  fork() {
    this.childProcess = {} as any;
  }

}
