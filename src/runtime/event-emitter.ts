import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { EVENT_FLAGS } from '@utils';
import { getElement, getWin } from '@platform';


export const createEvent = (ref: d.RuntimeRef, name: string, flags: number) => {
  const elm = getElement(ref);
  return {
    emit: (detail: any) => elm.dispatchEvent(
      new (BUILD.hydrateServerSide ? (getWin(elm) as any).CustomEvent : CustomEvent)(name, {
        bubbles: !!(flags & EVENT_FLAGS.Bubbles),
        composed: !!(flags & EVENT_FLAGS.Composed),
        cancelable: !!(flags & EVENT_FLAGS.Cancellable),
        detail
      })
    )
  };
};
