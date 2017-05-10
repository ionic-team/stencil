import * as interfaces from '../util/interfaces';

declare const Ionic: interfaces.Ionic;


export function transitionEnd(elm: HTMLElement, callback: {(ev?: TransitionEvent): void}) {
  let unRegTrans: Function;
  let unRegWKTrans: Function;
  let opts = { passive: true };

  function unregister() {
    unRegWKTrans && unRegWKTrans();
    unRegWKTrans && unRegTrans();
  }

  function onTransitionEnd(ev: TransitionEvent) {
    if (elm === ev.target) {
      unregister();
      callback(ev);
    }
  }

  if (elm) {
    unRegWKTrans = Ionic.listener.add(elm, 'webkitTransitionEnd', onTransitionEnd, opts);
    unRegTrans = Ionic.listener.add(elm, 'transitionend', onTransitionEnd, opts);
  }

  return unregister;
}
