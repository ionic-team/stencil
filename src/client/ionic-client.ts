import { addEventListener, enableListener } from '../renderer/events';
import { CustomEventOptions, Ionic, IonicGlobal, ListenOptions, IonicControllerApi, QueueApi } from '../util/interfaces';
import { themeVNodeData } from '../renderer/host';


export function initInjectedIonic(IonicGbl: IonicGlobal, win: any, doc: HTMLDocument, queue: QueueApi): Ionic {

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

  // properties that can stay hidden from public use
  const controllers: any = IonicGbl.controllers = {};

  (<Ionic>IonicGbl).isClient = true;
  (<Ionic>IonicGbl).isServer = false;

  // properties to be exposed to public
  // in actuality it's the exact same object
  IonicGbl.config = IonicGbl.ConfigCtrl;

  (<Ionic>IonicGbl).dom = IonicGbl.DomCtrl;

  (<Ionic>IonicGbl).theme = themeVNodeData;

  (<Ionic>IonicGbl).emit = (instance: any, eventName: string, data: CustomEventOptions = {}) => {
    if (data.bubbles === undefined) {
      data.bubbles = true;
    }
    if (data.composed === undefined) {
      // https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom#events
      data.composed = true;
    }
    if (IonicGbl.eventNameFn) {
      eventName = IonicGbl.eventNameFn(eventName);
    }
    instance && instance.$el && instance.$el.dispatchEvent(
      new win.CustomEvent(eventName, data)
    );
  };

  (<Ionic>IonicGbl).listener = {
    enable: function(instance: any, eventName: string, shouldEnable: boolean, attachTo?: string) {
      enableListener(queue, instance, eventName, shouldEnable, attachTo);
    },
    add: function (elm: HTMLElement|HTMLDocument|Window, eventName: string, cb: (ev?: any) => any, opts?: ListenOptions) {
      return addEventListener(queue, elm, eventName, cb, opts);
    }
  };

  // used to store the queued controller promises to
  // be resolved when the controller finishes loading
  const queuedCtrlResolves: {[ctrlName: string]: any[]} = {};

  (<Ionic>IonicGbl).controller = (ctrlName: string, opts?: any) => {
    // loading a controller is always async so return a promise
    return new Promise<any>((resolve: Function) => {
      // see if we already have the controller loaded
      const ctrl: IonicControllerApi = controllers[ctrlName];
      if (ctrl) {
        // we've already loaded this controller
        resolveController(ctrl, resolve, opts);

      } else {
        // oh noz! we haven't already loaded this controller yet!
        const ctrlResolveQueue = queuedCtrlResolves[ctrlName];
        if (ctrlResolveQueue) {
          // cool we've already "started" to load the controller
          // but it hasn't finished loading yet, so let's add
          // this one also to the queue of to-be resolved promises
          ctrlResolveQueue.push(resolve, opts);

        } else {
          // looks like we haven't even started the request
          // yet lets add the component to the DOM and create
          // a queue for this controller
          queuedCtrlResolves[ctrlName] = [resolve, opts];
          doc.body.appendChild(doc.createElement(`ion-${ctrlName}-controller`));
        }
      }
    });
  };

  IonicGbl.loadController = (ctrlName: string, ctrl: IonicControllerApi) => {
    // this method is called when the singleton
    // instance of our controller initially loads

    // add this controller instance to our map of controller singletons
    controllers[ctrlName] = ctrl;

    // check for to-be resolved controller promises
    const pendingCtrlResolves = queuedCtrlResolves[ctrlName];
    if (pendingCtrlResolves) {
      for (var i = 0; i < pendingCtrlResolves.length; i += 2) {
        // first arg is the original promise's resolve
        // which still needs to be resolved
        // second arg was the originally passed in options
        resolveController(ctrl, pendingCtrlResolves[i], pendingCtrlResolves[i + 1]);
      }

      // all good, go ahead and remove from the queue
      delete queuedCtrlResolves[ctrlName];
    }
  };

  function resolveController(ctrl: IonicControllerApi, resolve: Function, opts: any) {
    if (opts) {
      // if the call had options passed in then
      // it should run the controller's load() method
      // and let the controller's load() do the resolve
      // which then will resolve the user's promise
      ctrl.load(opts).then(<any>resolve);

    } else {
      // no options passed in, so resolve with
      // the actual controller instance
      resolve(ctrl);
    }
  }

  return (<Ionic>IonicGbl);
}
