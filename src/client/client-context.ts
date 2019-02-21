import { getDoc, getWin } from './client-window';
import { readTask, tick, writeTask } from './client-task-queue';


const Context = {
  window: getWin(),
  document: getDoc(),
  isServer: false,
  enableListener: () => console.log('TODO'),
  queue: {
    write: writeTask,
    read: readTask,
    tick
  }
};

export const getContext = (context: string, _elm?: HTMLElement) =>
  (Context as any)[context];
