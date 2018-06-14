import * as d from '../../../../declarations';
import { WorkerFarm, nextAvailableWorker } from '../main';
import { TestWorkerFarm } from './test-worker-farm';


describe('WorkerFarm', () => {

  it('use single instance', async () => {
    const opts: d.WorkerOptions = {
      maxConcurrentWorkers: 0
    };
    const wf = new TestWorkerFarm(opts);
    expect(wf.workers).toHaveLength(0);
    expect(wf.singleThreadRunner).toBeDefined();
  });

  it('run returning value', async () => {
    const opts: d.WorkerOptions = {
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
      wf.receiveMessageFromWorker({
        workerId: w0.workerId,
        taskId: w0.tasks[0].taskId,
        value: 0
      });

      wf.receiveMessageFromWorker({
        workerId: w1.workerId,
        taskId: w1.tasks[0].taskId,
        value: 1
      });

      wf.receiveMessageFromWorker({
        workerId: w0.workerId,
        taskId: w0.tasks[0].taskId,
        value: 2
      });

      wf.receiveMessageFromWorker({
        workerId: w1.workerId,
        taskId: w1.tasks[0].taskId,
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

    expect(w0.tasks).toHaveLength(0);
    expect(w1.tasks).toHaveLength(0);

    expect(w0.totalTasksAssigned).toBe(2);
    expect(w1.totalTasksAssigned).toBe(2);
  });

  it('run returning value', async () => {
    const wf = new TestWorkerFarm();

    const p = wf.run('runFn');

    const worker = wf.workers[0];
    const task = worker.tasks[0];

    wf.receiveMessageFromWorker({
      workerId: worker.workerId,
      taskId: task.taskId,
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
    expect(worker.tasks).toHaveLength(1);
    expect(worker.totalTasksAssigned).toBe(1);

    const task = worker.tasks[0];
    expect(task.taskId).toBe(0);

    wf.receiveMessageFromWorker({
      workerId: worker.workerId,
      taskId: task.taskId
    });

    const rtnVal = await p;
    expect(rtnVal).toBeUndefined();

    expect(worker.tasks).toHaveLength(0);

    expect(wf.workers).toHaveLength(4);
  });

});


describe('nextAvailableWorker', () => {
  let workers: d.WorkerProcess[];
  const maxConcurrentWorkers = 4;

  beforeAll(() => {
    workers = [];
    for (let i = 0; i < maxConcurrentWorkers; i++) {
      workers.push({
        workerId: i,
        tasks: [],
        totalTasksAssigned: 0,
        taskIds: 0
      });
    }
  });

  it('get worker with fewest total tasks assigned when all the same number of tasks', () => {
    workers[0].tasks.length = 3;
    workers[0].totalTasksAssigned = 50;
    workers[1].tasks.length = 3;
    workers[1].totalTasksAssigned = 40;

    // this one is tied for fewest active tasks (3)
    // but has the fewest total tasks assigned (30)
    workers[2].tasks.length = 3;
    workers[2].totalTasksAssigned = 30;

    workers[3].tasks.length = 5;
    workers[3].totalTasksAssigned = 20;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(2);
  });

  it('get first worker when all the same', () => {
    workers[0].tasks.length = 1;
    workers[0].totalTasksAssigned = 1;
    workers[1].tasks.length = 1;
    workers[1].totalTasksAssigned = 1;
    workers[2].tasks.length = 1;
    workers[2].totalTasksAssigned = 1;
    workers[3].tasks.length = 1;
    workers[3].totalTasksAssigned = 1;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(0);
  });

  it('do not use a worker that has a long running task', () => {
    workers[0].tasks.length = 4;
    workers[1].tasks.length = 4;
    workers[2].tasks = [{ isLongRunningTask: true } ] as any;
    workers[3].tasks.length = 3;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(3);
  });

  it('forth task', () => {
    workers[0].tasks.length = 1;
    workers[1].tasks.length = 1;
    workers[2].tasks.length = 1;
    workers[3].tasks.length = 0;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(3);
  });

  it('third task', () => {
    workers[0].tasks.length = 1;
    workers[1].tasks.length = 1;
    workers[2].tasks.length = 0;
    workers[3].tasks.length = 0;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(2);
  });

  it('second task', () => {
    workers[0].tasks.length = 1;
    workers[1].tasks.length = 0;
    workers[2].tasks.length = 0;
    workers[3].tasks.length = 0;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(1);
  });

  it('first task', () => {
    workers[0].tasks.length = 0;
    workers[1].tasks.length = 0;
    workers[2].tasks.length = 0;
    workers[3].tasks.length = 0;

    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(0);
  });

  it('get the only available worker', () => {
    workers[0].tasks.length = 4;
    workers[1].tasks.length = 4;

    // this one has the fewest active tasks
    workers[2].tasks.length = 3;

    workers[3].tasks.length = 4;
    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(2);
  });

  it('get the only available worker', () => {
    workers[0].tasks.length = 4;
    workers[1].tasks.length = 4;

    // this one has the fewest active tasks
    workers[2].tasks.length = 3;

    workers[3].tasks.length = 4;
    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w.workerId).toBe(2);
  });

  it('no available worker', () => {
    workers[0].tasks.length = 5;
    workers[1].tasks.length = 5;
    workers[2].tasks.length = 5;
    workers[3].tasks.length = 5;
    const w = nextAvailableWorker(workers, maxConcurrentWorkers);
    expect(w).toBe(null);
  });

});
