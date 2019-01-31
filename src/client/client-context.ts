import { readTask, tick, writeTask } from './client-task-queue';
import { doc, win } from './client-window';

const Context = {
  window: win,
  document: doc,
  isServer: false,
  enableListener: () => console.log('TODO'),
  queue: {
    write: writeTask,
    read: readTask,
    tick
  }
};

export const getContext = (context: string) =>
  (Context as any)[context];
