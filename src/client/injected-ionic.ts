import { ConfigApi, CustomEventOptions, DomControllerApi, Ionic } from '../util/interfaces';
import { enableListener } from './events';
import { themeVNodeData } from './host';


export function initInjectedIonic(win: any, eventNamePrefix: string, ConfigCtrl: ConfigApi, DomCtrl: DomControllerApi): Ionic {

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
      instance && instance.$el && instance.$el.dispatchEvent(
        new win.CustomEvent((eventNamePrefix || '') + eventName, data)
      );
    },

    listener: {
      enable: enableListener
    },

    controllers: {},

    dom: DomCtrl,

    config: ConfigCtrl
  };

}
