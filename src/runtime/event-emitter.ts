import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { consoleDevWarn, getElement, win } from '@platform';
import { EVENT_FLAGS } from '@utils';


export const createEvent = (ref: d.RuntimeRef, name: string, flags: number) => {
  const elm = getElement(ref) as HTMLElement;
  return {
    emit: (detail: any) => {
      if (BUILD.isDev && !elm.isConnected) {
        consoleDevWarn(`The "${name}" event was emitted, but the dispatcher node is no longer connected to the dom.`);
      }
      const ev = new (BUILD.hydrateServerSide ? (win as any).CustomEvent : CustomEvent)(name, {
        bubbles: !!(flags & EVENT_FLAGS.Bubbles),
        composed: !!(flags & EVENT_FLAGS.Composed),
        cancelable: !!(flags & EVENT_FLAGS.Cancellable),
        detail
      });
      elm.dispatchEvent(ev);
      return ev;
    }
  };
};
