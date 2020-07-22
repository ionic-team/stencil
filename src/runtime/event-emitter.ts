import * as d from '../declarations';
import { BUILD } from '@app-data';
import { consoleDevWarn, plt } from '@platform';
import { EVENT_FLAGS } from '@utils';
import { getElement } from './element';

export const createEvent = (ref: d.RuntimeRef, name: string, flags: number) => {
  const elm = getElement(ref) as HTMLElement;
  return {
    emit: (detail: any) => {
      if (BUILD.isDev && !elm.isConnected) {
        consoleDevWarn(`The "${name}" event was emitted, but the dispatcher node is no longer connected to the dom.`);
      }
      return emitEvent(elm, name, {
        bubbles: !!(flags & EVENT_FLAGS.Bubbles),
        composed: !!(flags & EVENT_FLAGS.Composed),
        cancelable: !!(flags & EVENT_FLAGS.Cancellable),
        detail,
      });
    },
  };
};

export const emitEvent = (elm: EventTarget, name: string, opts?: CustomEventInit) => {
  const ev = plt.ce(name, opts);
  elm.dispatchEvent(ev);
  return ev;
};
