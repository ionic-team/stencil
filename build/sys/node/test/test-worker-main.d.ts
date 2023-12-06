import { NodeWorkerMain } from '../node-worker-main';
export declare class TestWorkerMain extends NodeWorkerMain {
    constructor(workerId: number);
    fork(): void;
}
