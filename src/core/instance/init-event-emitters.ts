import { ComponentConstructorEvent, ComponentInstance, EventEmitterData, PlatformApi } from '../../util/interfaces';


export function initEventEmitters(plt: PlatformApi, cmpEvents: ComponentConstructorEvent[], instance: ComponentInstance) {
  if (cmpEvents) {
    cmpEvents.forEach(eventMeta => {

      instance[eventMeta.method] = {
        emit: (data: any) => {
          plt.emitEvent(instance.__el, eventMeta.name, {
            bubbles: eventMeta.bubbles,
            composed: eventMeta.composed,
            cancelable: eventMeta.cancelable,
            detail: data
          } as EventEmitterData);
        }
      };

    });
  }
}
