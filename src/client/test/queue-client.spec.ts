import * as d from '../../declarations';
import { createQueueClient } from '../queue-client';


describe('queue-client', () => {

  let App: d.AppGlobal;
  let win: Window;

  beforeEach(() => {
    App = mockApp();
    win = mockWindow();
  });

  it('should run all dom writes', done => {
    const q = createQueueClient(App, win);

    const results: number[] = [];

    q.write(() => results.push(1));
    q.write(() => results.push(2));
    q.write(() => results.push(3));
    q.write(() => {
      expect(results).toEqual([1, 2, 3]);
      done();
    });
  });

  it('should run all dom reads', done => {
    const q = createQueueClient(App, win);

    const results: number[] = [];

    q.read(() => results.push(1));
    q.read(() => results.push(2));
    q.read(() => results.push(3));
    q.read(() => {
      expect(results).toEqual([1, 2, 3]);
      done();
    });
  });

  it('should resolve all high priorities', done => {
    const q = createQueueClient(App, win);

    const results: number[] = [];

    q.tick(() => results.push(1));
    q.tick(() => results.push(2));
    q.tick(() => results.push(3));
    q.tick(() => {
      expect(results).toEqual([1, 2, 3]);
      done();
    });
  });

  it('should resolve in order', done => {
    const q = createQueueClient(App, win);

    const results: number[] = [];
    q.tick(() => results.push(1));
    q.write(() => results.push(2));
    q.read(() => results.push(3));
    q.read(() => results.push(4));
    q.tick(() => results.push(5));
    q.write(() => results.push(6));

    q.tick(() => results.push(7));
    q.tick(() => results.push(8));
    q.tick(() => results.push(9));
    q.write(() => {
      expect(results).toEqual([1, 5, 7, 8, 9, 3, 4, 2, 6]);
      done();
    });
  });

  function mockApp() {
    return {
      raf: (cb) => {
        process.nextTick(cb);
      }
    } as d.AppGlobal;
  }

  function mockWindow() {
    return {
      performance: {
        now: () => Date.now()
      }
    } as any;
  }

});
