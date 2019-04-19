import { doc, win } from './client-window';
import { readTask, tick, writeTask } from './client-task-queue';
import { getAssetPath } from '@runtime';


const Context = {
  window: /*@__PURE__*/win,
  document: /*@__PURE__*/doc,
  resourcesUrl: /*@__PURE__*/getAssetPath('.'),
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
