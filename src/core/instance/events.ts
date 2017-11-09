import { ComponentInstance, EventEmitterData, EventMeta, PlatformApi } from '../../util/interfaces';


export function initEventEmitters(plt: PlatformApi, componentEvents: EventMeta[], instance: ComponentInstance) {
  if (componentEvents) {
    componentEvents.forEach(eventMeta => {

      instance[eventMeta.eventMethodName] = {
        emit: (data: any) => {
          const eventData: EventEmitterData = {
            bubbles: eventMeta.eventBubbles,
            composed: eventMeta.eventComposed,
            cancelable: eventMeta.eventCancelable,
            detail: data
          };
          plt.emitEvent(instance.__el, eventMeta.eventName, eventData);
        }
      };

    });
  }
}
