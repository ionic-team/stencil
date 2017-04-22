import { emitEvent, enableListener } from './events'
import { Ionic, IonicGlobal } from '../util/interfaces';
import { themeVNodeData } from './host';


export function initInjectedIonic(doc: HTMLDocument, ionic: IonicGlobal): Ionic {

  return {
    theme: themeVNodeData,

    emit: function(instance: any, eventName: string, data?: any) {
      emitEvent(doc, ionic.eventNamePrefix, instance, eventName, data);
    },

    listener: {
      enable: enableListener
    },

    controllers: {}
  };

}
