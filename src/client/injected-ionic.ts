import { emitEvent, enableListener } from './events'
import { Ionic } from '../util/interfaces';
import { themeVNodeData } from './host';


export function initInjectedIonic(doc: HTMLDocument): Ionic {

  return {
    theme: themeVNodeData,

    emit: function(instance: any, eventName: string, data?: any) {
      emitEvent(doc, instance, eventName, data);
    },

    listener: {
      enable: enableListener
    },

    controllers: {}
  };

}
