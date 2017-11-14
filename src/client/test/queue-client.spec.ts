import { createQueueClient } from '../queue-client';
import { PRIORITY } from '../../util/constants';

describe('createQueueClient', () => {
  it('should dispatch tasks according to priority', () => {
    const api = createQueueClient(raf, now);
    expect(api.flush).toBeUndefined();
    expect(rafCb).toBeNull();

    const stack: string[] = [];
    api.add(() => stack.push('High 1'), PRIORITY.High);
    expect(rafCb).not.toBeNull();
    api.add(() => stack.push('1'));
    api.add(() => stack.push('Low'), PRIORITY.Low);
    api.add(() => stack.push('3'));
    api.add(() => stack.push('4'), PRIORITY.Medium);
    api.add(() => stack.push('5'), PRIORITY.Medium);
    api.add(() => stack.push('High 2'), PRIORITY.High);
    expect(stack).toHaveLength(0);

    rafCb(); // simulate RAF

    expect(stack).toEqual(['High 1', 'High 2', '1', '3', '4', '5', 'Low']);
  });

  it('should dispatch tasks even if some crashes', () => {
    const api = createQueueClient(raf, now);

    const stack: string[] = [];
    api.add(() => stack.push('1'));
    api.add(() => { throw 'error'; });
    api.add(() => stack.push('3'));
    rafCb(); // simulate RAF

    expect(stack).toEqual(['1', '3']);
  });

  it('should dispatch properly when a task schedules more tasks', () => {
    const api = createQueueClient(raf, now);

    const stack: string[] = [];
    api.add(() => stack.push('1'));
    api.add(() => {
      stack.push('2');
      api.add(() => stack.push('1-2'));
      api.add(() => stack.push('High 2'), PRIORITY.High);
      api.add(() => stack.push('3-2'));
    });
    api.add(() => stack.push('High 1'), PRIORITY.High);

    rafCb(); // simulate RAF

    expect(stack).toEqual(['High 1', '1', '2']);
  });


  let rafCb;
  const now = () => 1;
  const raf = (cb: any) => rafCb = cb;
  beforeEach(() => {
    rafCb = null;
  });
});
