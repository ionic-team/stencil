import { addEventListener, enableListener } from './events';
import { CustomEventOptions, Ionic, IonicGlobal, ListenOptions, ModalControllerInternalApi, QueueApi } from '../util/interfaces';
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

  const modalCtrl: ModalControllerInternalApi = (<Ionic>IonicGlb).modal = {
    // stub function to startup the modal viewport if it hasn't been
    // loaded already. This will queue up all the create calls, and when
    // the modal viewport loads it'll then create the modal(s). This stub
    // function  will get replaced by the real "create" fn once loaded.
    create: function(tag: string, data?: any, opts?: any) {
      return new Promise<any>(resolve => {
        // generate a _create array if one wasn't already created
        // once the viewport loads, it'll loop through this array
        (modalCtrl._create = modalCtrl._create || []).push(
          tag/*0*/, data/*1*/, opts/*2*/, resolve/*3:create.resolve*/
        );

        // add the viewport if one wasn't already added (one could be loading still)
        if (!doc.querySelector('ion-modal-portal')) {
          doc.body.appendChild(doc.createElement('ion-modal-portal'));
        }
      });
    }
  };

  return (<Ionic>IonicGlb);
}
