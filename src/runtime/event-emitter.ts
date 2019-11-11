import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { EVENT_FLAGS } from '@utils';
import { getElement, win } from '@platform';
import { STENCIL_DEV_MODE } from './profile';


export const createEvent = (ref: d.RuntimeRef, name: string, flags: number) => {
  const elm = getElement(ref) as HTMLElement;
  return {
    emit: (detail: any) => {
      if (BUILD.isDev && !elm.isConnected) {
        console.warn(...STENCIL_DEV_MODE,
          `The "${name}" event was emitted, but the dispatcher node is not longer connected to the dom.`);
      }
      return elm.dispatchEvent(
        new (BUILD.hydrateServerSide ? (win as any).CustomEvent : CustomEvent)(name, {
          bubbles: !!(flags & EVENT_FLAGS.Bubbles),
          composed: !!(flags & EVENT_FLAGS.Composed),
          cancelable: !!(flags & EVENT_FLAGS.Cancellable),
          detail
        })
      );
    }
  };
};
