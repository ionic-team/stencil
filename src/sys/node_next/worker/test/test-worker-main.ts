import { NodeWorkerMain } from '../worker-main';
import { buildEvents } from '../../../../compiler/events';


export class TestWorkerMain extends NodeWorkerMain {

  constructor(workerId: number) {
    super(workerId, buildEvents(), null);
    this.fork();
  }

  fork() {
    this.childProcess = {} as any;
  }

}
