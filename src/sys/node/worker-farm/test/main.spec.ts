import { WorkerFarm, nextAvailableWorker } from '../main';
import { MessageData, Worker, WorkerOptions } from '../interface';
import { TestWorkerFarm } from './test-worker-farm';


describe('WorkerFarm', () => {

  it('use single instance', async () => {
    const opts: WorkerOptions = {
      maxConcurrentWorkers: 0
    };
    const wf = new TestWorkerFarm(opts);
    expect(wf.workers).toHaveLength(0);
    expect(wf.singleThreadRunner).toBeDefined();
  });

  it('run returning value', async () => {
    const opts: WorkerOptions = {
      maxConcurrentWorkers: 2
    };
    const wf = new TestWorkerFarm(opts);

    const p0 = wf.run('runFn');
    const p1 = wf.run('runFn');
    const p2 = wf.run('runFn');
    const p3 = wf.run('runFn');

    expect(wf.workers).toHaveLength(2);

    const w0 = wf.workers[0];
    const w1 = wf.workers[1];

    setTimeout(() => {
      wf.receiveFromWorker({
        workerId: w0.workerId,
        callId: w0.calls[0].callId,
        value: 0
      });

      wf.receiveFromWorker({
        workerId: w1.workerId,
        callId: w1.calls[0].callId,
        value: 1
      });

      wf.receiveFromWorker({
        workerId: w0.workerId,
        callId: w0.calls[0].callId,
        value: 2
      });

      wf.receiveFromWorker({
        workerId: w1.workerId,
        callId: w1.calls[0].callId,
        value: 3
      });
    }, 10);

    const rtnVal0 = await p0;
    expect(rtnVal0).toBe(0);

    const rtnVal1 = await p1;
    expect(rtnVal1).toBe(1);

    const rtnVal2 = await p2;
    expect(rtnVal2).toBe(2);

    const rtnVal3 = await p3;
    expect(rtnVal3).toBe(3);

    expect(w0.calls).toHaveLength(0);
    expect(w1.calls).toHaveLength(0);

    expect(w0.totalCallsAssigned).toBe(2);
    expect(w1.totalCallsAssigned).toBe(2);
  });

  it('run returning value', async () => {
    const wf = new TestWorkerFarm();

    const p = wf.run('runFn');

    const worker = wf.workers[0];
    const call = worker.calls[0];

    wf.receiveFromWorker({
      workerId: worker.workerId,
      callId: call.callId,
      value: 88
    });

    const rtnVal = await p;
    expect(rtnVal).toBe(88);
  });

  it('run returning void', async () => {
    const wf = new TestWorkerFarm();

    expect(wf.workers).toHaveLength(4);

    const p = wf.run('runFn');

    expect(wf.workers).toHaveLength(4);

    const worker = wf.workers[0];
    expect(worker).toBeDefined();
    expect(worker.calls).toHaveLength(1);
    expect(worker.totalCallsAssigned).toBe(1);

    const call = worker.calls[0];
    expect(call.callId).toBe(0);

    wf.receiveFromWorker({
      workerId: worker.workerId,
      callId: call.callId
    });

    const rtnVal = await p;
    expect(rtnVal).toBeUndefined();

    expect(worker.calls).toHaveLength(0);

    expect(wf.workers).toHaveLength(4);
  });

});


describe('nextAvailableWorker', () => {
  let workers: Worker[];
  const maxConcurrentWorkers = 4;

  beforeAll(() => {
    workers = [];
    for (let i = 0; i < maxConcurrentWorkers; i++) {
      workers.push({
        workerId: i,
        calls: [],
        totalCallsAssigned: 0,
        callIds: 0
      });
    }
  });

  it('get worker with fewest total calls assigned when all the same number of calls', () => {
    workers[0].calls.length = 3;
    workers[0].totalCallsAssigned = 50;
    workers[1].calls.length = 3;
    workers[1].totalCallsAssigned = 40;

    // this one is tied for fewest active calls (3)
    // but has the fewest total calls assigned (30)
    workers[2].calls.length = 3;
    workers[2].totalCallsAssigned = 30;

    workers[3].calls.length = 5;
    workers[3].totalCallsAssigned = 20;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(2);
  });

  it('get first worker when all the same', () => {
    workers[0].calls.length = 1;
    workers[0].totalCallsAssigned = 1;
    workers[1].calls.length = 1;
    workers[1].totalCallsAssigned = 1;
    workers[2].calls.length = 1;
    workers[2].totalCallsAssigned = 1;
    workers[3].calls.length = 1;
    workers[3].totalCallsAssigned = 1;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(0);
  });

  it('forth call', () => {
    workers[0].calls.length = 1;
    workers[1].calls.length = 1;
    workers[2].calls.length = 1;
    workers[3].calls.length = 0;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(3);
  });

  it('third call', () => {
    workers[0].calls.length = 1;
    workers[1].calls.length = 1;
    workers[2].calls.length = 0;
    workers[3].calls.length = 0;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(2);
  });

  it('second call', () => {
    workers[0].calls.length = 1;
    workers[1].calls.length = 0;
    workers[2].calls.length = 0;
    workers[3].calls.length = 0;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(1);
  });

  it('first call', () => {
    workers[0].calls.length = 0;
    workers[1].calls.length = 0;
    workers[2].calls.length = 0;
    workers[3].calls.length = 0;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(0);
  });

  it('get the only available worker', () => {
    workers[0].calls.length = 4;
    workers[1].calls.length = 4;

    // this one has the fewest active calls
    workers[2].calls.length = 3;

    workers[3].calls.length = 4;
    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(2);
  });

  it('no available worker', () => {
    workers[0].calls.length = 5;
    workers[1].calls.length = 5;
    workers[2].calls.length = 5;
    workers[3].calls.length = 5;
    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w).toBe(null);
  });

});
