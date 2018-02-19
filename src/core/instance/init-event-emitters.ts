import { ComponentConstructorEvent, ComponentInstance, EventEmitterData, PlatformApi } from '../../declarations';


export function initEventEmitters(plt: PlatformApi, cmpEvents: ComponentConstructorEvent[], instance: ComponentInstance) {
  if (cmpEvents) {
    const elm = plt.hostElementMap.get(instance);
    cmpEvents.forEach(eventMeta => {

      instance[eventMeta.method] = {
        emit: (data: any) => {
          plt.emitEvent(elm, eventMeta.name, {
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
