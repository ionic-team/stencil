import { addEventListener, enableListener } from './events';
import { CustomEventOptions, Ionic, IonicGlobal, ModalControllerInternalApi, ModalViewControllerApi } from '../util/interfaces';
import { themeVNodeData } from './host';


export function initInjectedIonic(IonicGlb: IonicGlobal, win: any, doc: HTMLDocument): Ionic {

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
    enable: enableListener,
    add: addEventListener
  };

  const modalCtrl: ModalControllerInternalApi = (<Ionic>IonicGlb).modal = {
    create: function(tag: string, data?: any, opts?: any) {
      if (!doc.querySelector('ion-modal-viewport')) {
        const elm = doc.createElement('ion-modal-viewport');
        doc.body.appendChild(elm);
      }

      const queue = [tag/*0*/, data/*1*/, opts/*2*/, 0/*3:modalView*/, 0/*4:shouldPresent*/, 0/*5:shouldDismiss*/, 0/*6:resolve*/, 0/*7:reject*/];

      queue[3] = <ModalViewControllerApi>{
        dismiss: () => {
          queue[5] = 1;
          return Promise.resolve();
        },
        present: () => {
          queue[4] = 1;
          return promise;
        }
      };

      var promise = new Promise<void>((res, rej) => {
        queue[6] = res;
        queue[7] = rej;
      });

      (modalCtrl._create = modalCtrl._create || []).push(queue);

      return queue[3];
    }
  };

  return (<Ionic>IonicGlb);
}
