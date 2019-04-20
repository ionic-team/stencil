import { doc, win } from './client-window';
import { readTask, tick, writeTask } from './client-task-queue';
import { getAssetPath } from '@runtime';


export const getContext = (_elm: HTMLElement, context: string) => {
  switch (context) {
    case 'window': return win;
    case 'document': return doc;
    case 'isServer': return false;
    case 'resourcesUrl': return getAssetPath('.');
    case 'queue': return {
      write: writeTask,
      read: readTask,
      tick
    };
  }
  return undefined;
};
