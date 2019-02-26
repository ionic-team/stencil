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

export const getContext = (_elm: HTMLElement, context: string) =>
  (Context as any)[context];
