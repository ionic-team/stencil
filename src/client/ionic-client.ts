import { addEventListener, enableListener } from './events';
import { CustomEventOptions, Ionic, IonicGlobal, OverlayApi, ListenOptions, QueueApi } from '../util/interfaces';
import { themeVNodeData } from './host';


export function initInjectedIonic(IonicGlb: IonicGlobal, win: any, doc: HTMLDocument, queue: QueueApi): Ionic {

  if (typeof win.CustomEvent !== 'function') {
    // CustomEvent polyfill
    function CustomEvent(event: any, params: any) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype = win.Event.prototype;
    win.CustomEvent = CustomEvent;
  }

  (<Ionic>IonicGlb).controllers = {};

  (<Ionic>IonicGlb).config = IonicGlb.ConfigCtrl;

  (<Ionic>IonicGlb).dom = IonicGlb.DomCtrl;

  (<Ionic>IonicGlb).theme = themeVNodeData;

  (<Ionic>IonicGlb).emit = (instance: any, eventName: string, data: CustomEventOptions = {}) => {
    if (data.bubbles === undefined) {
      data.bubbles = true;
    }
    if (data.composed === undefined) {
      // https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom#events
      data.composed = true;
    }
    if (IonicGlb.eventNameFn) {
      eventName = IonicGlb.eventNameFn(eventName);
    }
    instance && instance.$el && instance.$el.dispatchEvent(
      new win.CustomEvent(eventName, data)
    );
  };

  (<Ionic>IonicGlb).listener = {
    enable: function(instance: any, eventName: string, shouldEnable: boolean, attachTo?: string) {
      enableListener(queue, instance, eventName, shouldEnable, attachTo);
    },
    add: function (elm: HTMLElement|HTMLDocument|Window, eventName: string, cb: (ev?: any) => void, opts?: ListenOptions) {
      return addEventListener(queue, elm, eventName, cb, opts);
    }
  };

  const overlayQueue: {[ctrlName: string]: any[]} = {};

  (<Ionic>IonicGlb).overlay = (ctrlName: string, opts: any) => {
    return new Promise<any>((resolve: Function) => {
      const overlayCtrl: OverlayApi = (<Ionic>IonicGlb).controllers[ctrlName];
      if (overlayCtrl) {
        // we've already loaded this overlay controller
        // let's pass the options to the controller's load method
        // and let the controller's load resolve, which then
        // will resolve the user's promise
        overlayCtrl.load(opts).then(<any>resolve);

      } else {
        // oh noz! we haven't already loaded this overlay yet!
        const overlayCtrlQueue = overlayQueue[ctrlName];
        if (overlayCtrlQueue) {
          // cool we've already "started" to load it, but
          // it hasn't finished loading yet, so lets add
          // this one also to the queue
          overlayCtrlQueue.push(opts, resolve);

        } else {
          // looks like we haven't even started the request yet
          // let add the component to the DOM and create a queue
          const ctrlTag = `ion-${ctrlName}-controller`;
          if (!doc.querySelector(ctrlTag)) {
            doc.body.appendChild(doc.createElement(ctrlTag));
          }
          overlayQueue[ctrlName] = [opts, resolve];
        }
      }
    });
  };

  IonicGlb.loadController = (ctrlName: string, ctrl: OverlayApi) => {
    (<Ionic>IonicGlb).controllers[ctrlName] = ctrl;

    const pendingOverlayLoads = overlayQueue[ctrlName];
    if (pendingOverlayLoads) {
      for (var i = 0; i < pendingOverlayLoads.length; i += 2) {
        ctrl.load(pendingOverlayLoads[i]).then(pendingOverlayLoads[i + 1]);
      }
      delete overlayQueue[ctrlName];
    }
  };

  return (<Ionic>IonicGlb);
}
