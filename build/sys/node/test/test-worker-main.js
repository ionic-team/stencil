import { NodeWorkerMain } from '../node-worker-main';
export class TestWorkerMain extends NodeWorkerMain {
    constructor(workerId) {
        super(workerId, null);
        this.fork();
    }
    fork() {
        this.childProcess = {};
    }
}
//# sourceMappingURL=test-worker-main.js.map