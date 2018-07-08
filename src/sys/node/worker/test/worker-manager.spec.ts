import * as d from '../../../../declarations';
import { getNextWorker } from '..';
import { TestWorkerMain } from './test-worker-main';


describe('getNextWorker', () => {
  let workers: TestWorkerMain[];
  const maxConcurrentWorkers = 4;

  beforeAll(() => {
    workers = [];
    for (let i = 0; i < maxConcurrentWorkers; i++) {
      const worker = new TestWorkerMain(i);
      workers.push(worker);
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

    const w = getNextWorker(workers, maxConcurrentWorkers);
    expect(w.pid).toBe(2);
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

    const w = getNextWorker(workers, maxConcurrentWorkers);
    expect(w.pid).toBe(0);
  });

  it('do not use a worker that has a long running task', () => {
    workers[0].tasks.length = 4;
    workers[1].tasks.length = 4;
    workers[2].tasks = [
      { isLongRunningTask: true } as any
    ];
    workers[3].tasks.length = 3;

    const w = getNextWorker(workers, maxConcurrentWorkers);
    expect(w.pid).toBe(3);
  });

  it('forth task', () => {
    workers[0].tasks.length = 1;
    workers[1].tasks.length = 1;
    workers[2].tasks.length = 1;
    workers[3].tasks.length = 0;

    const w = getNextWorker(workers, maxConcurrentWorkers);
    expect(w.pid).toBe(3);
  });

  it('third task', () => {
    workers[0].tasks.length = 1;
    workers[1].tasks.length = 1;
    workers[2].tasks.length = 0;
    workers[3].tasks.length = 0;

    const w = getNextWorker(workers, maxConcurrentWorkers);
    expect(w.pid).toBe(2);
  });

  it('second task', () => {
    workers[0].tasks.length = 1;
    workers[1].tasks.length = 0;
    workers[2].tasks.length = 0;
    workers[3].tasks.length = 0;

    const w = getNextWorker(workers, maxConcurrentWorkers);
    expect(w.pid).toBe(1);
  });

  it('first task', () => {
    workers[0].tasks.length = 0;
    workers[1].tasks.length = 0;
    workers[2].tasks.length = 0;
    workers[3].tasks.length = 0;

    const w = getNextWorker(workers, maxConcurrentWorkers);
    expect(w.pid).toBe(0);
  });

  it('get the only available worker', () => {
    workers[0].tasks.length = 4;
    workers[1].tasks.length = 4;

    // this one has the fewest active tasks
    workers[2].tasks.length = 3;

    workers[3].tasks.length = 4;
    const w = getNextWorker(workers, maxConcurrentWorkers);
    expect(w.pid).toBe(2);
  });

  it('no available worker', () => {
    workers[0].tasks.length = 5;
    workers[1].tasks.length = 5;
    workers[2].tasks.length = 5;
    workers[3].tasks.length = 5;
    const w = getNextWorker(workers, maxConcurrentWorkers);
    expect(w).toBe(null);
  });

});
