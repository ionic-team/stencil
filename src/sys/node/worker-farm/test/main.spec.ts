import { WorkerFarm } from '../main';
import { MessageData, Worker, WorkerOptions } from '../interface';
import { TestWorkerFarm } from './test-worker-farm';


describe('WorkerFarm', () => {

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
        returnedValue: 0
      });

      wf.receiveFromWorker({
        workerId: w1.workerId,
        callId: w1.calls[0].callId,
        returnedValue: 1
      });

      wf.receiveFromWorker({
        workerId: w0.workerId,
        callId: w0.calls[0].callId,
        returnedValue: 2
      });

      wf.receiveFromWorker({
        workerId: w1.workerId,
        callId: w1.calls[0].callId,
        returnedValue: 3
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

    expect(w0.callsAssigned).toBe(2);
    expect(w1.callsAssigned).toBe(2);
  });

  it('run returning value', async () => {
    const wf = new TestWorkerFarm();

    const p = wf.run('runFn');

    const worker = wf.workers[0];
    const call = worker.calls[0];

    wf.receiveFromWorker({
      workerId: worker.workerId,
      callId: call.callId,
      returnedValue: 88
    });

    const rtnVal = await p;
    expect(rtnVal).toBe(88);
  });

  it('run returning void', async () => {
    const wf = new TestWorkerFarm();

    expect(wf.workers).toHaveLength(0);

    const p = wf.run('runFn');

    expect(wf.workers).toHaveLength(1);

    const worker = wf.workers[0];
    expect(worker).toBeDefined();
    expect(worker.calls).toHaveLength(1);
    expect(worker.callsAssigned).toBe(1);

    const call = worker.calls[0];
    expect(call.callId).toBe(0);

    wf.receiveFromWorker({
      workerId: worker.workerId,
      callId: call.callId
    });

    const rtnVal = await p;
    expect(rtnVal).toBeUndefined();

    expect(worker.calls).toHaveLength(0);

    expect(wf.workers).toHaveLength(1);
  });

});


describe('nextAvailableWorker', () => {

  it('do not get worker if none available', () => {
    const opts: WorkerOptions = {
      maxConcurrentWorkers: 2
    };
    const wf = new TestWorkerFarm(opts);
    wf.nextAvailableWorker();
    wf.nextAvailableWorker();
    expect(wf.workers).toHaveLength(2);

    wf.workers[0].calls.length = 5;
    wf.workers[1].calls.length = 5;

    const w = wf.nextAvailableWorker();
    expect(wf.workers).toHaveLength(2);
    expect(w).toBe(null);
  });

  it('get worker with the fewest calls assigned', () => {
    const opts: WorkerOptions = {
      maxConcurrentWorkers: 2
    };
    const wf = new TestWorkerFarm(opts);
    wf.nextAvailableWorker();
    wf.nextAvailableWorker();
    expect(wf.workers).toHaveLength(2);

    wf.workers[0].calls.length = 3;
    wf.workers[1].calls.length = 3;

    wf.workers[0].callsAssigned = 88;
    wf.workers[1].callsAssigned = 5;

    const w = wf.nextAvailableWorker();
    expect(wf.workers).toHaveLength(2);

    expect(w.workerId).toBe(1);
    expect(w.callsAssigned).toBe(5);
    expect(w.calls).toHaveLength(3);
  });

  it('get worker with the fewest active calls assigned', () => {
    const opts: WorkerOptions = {
      maxConcurrentWorkers: 2
    };
    const wf = new TestWorkerFarm(opts);
    wf.nextAvailableWorker();
    wf.nextAvailableWorker();
    expect(wf.workers).toHaveLength(2);

    wf.workers[0].calls.length = 4;
    wf.workers[1].calls.length = 2;

    wf.workers[0].callsAssigned = 88;
    wf.workers[1].callsAssigned = 88;

    const w = wf.nextAvailableWorker();
    expect(wf.workers).toHaveLength(2);

    expect(w.workerId).toBe(1);
    expect(w.calls).toHaveLength(2);
  });

  it('start new workers', () => {
    const opts: WorkerOptions = {
      maxConcurrentWorkers: 2
    };
    const wf = new TestWorkerFarm(opts);

    expect(wf.workers).toHaveLength(0);

    let w = wf.nextAvailableWorker();
    expect(wf.workers).toHaveLength(1);
    expect(w.workerId).toBe(0);

    w = wf.nextAvailableWorker();
    expect(wf.workers).toHaveLength(2);
    expect(w.workerId).toBe(1);
  });

});
