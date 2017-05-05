import { addEventListener, enableListener } from './events';
import { ConfigApi, CustomEventOptions, DomControllerApi, Ionic } from '../util/interfaces';
import { themeVNodeData } from './host';


export function initInjectedIonic(win: any, eventNameFn: {(eventName: string): string}, ConfigCtrl: ConfigApi, DomCtrl: DomControllerApi): Ionic {

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


  return {
    theme: themeVNodeData,

    emit: function(instance: any, eventName: string, data: CustomEventOptions = {}) {
      if (data.composed === undefined) {
        // https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom#events
        data.composed = true;
      }
      if (eventNameFn) {
        eventName = eventNameFn(eventName);
      }
      instance && instance.$el && instance.$el.dispatchEvent(
        new win.CustomEvent(eventName, data)
      );
    },

    listener: {
      enable: enableListener,
      add: addEventListener
    },

    controllers: {},

    dom: DomCtrl,

    config: ConfigCtrl
  };

}
