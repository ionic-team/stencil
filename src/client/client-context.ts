import { getDocument, getWindow } from './client-window';
import { readTask, tick, writeTask } from './client-task-queue';
import { getAssetPath } from '@runtime';


const Context = {
  window: /*@__PURE__*/getWindow(),
  document: /*@__PURE__*/getDocument(),
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
