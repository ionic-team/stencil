import * as d from '../declarations';


export function initEventEmitters(plt: d.PlatformApi, meta: d.InternalMeta, cmpEvents: d.ComponentConstructorEvent[], instance: d.ComponentInstance) {
  if (cmpEvents) {
    const elm = meta.element;
    cmpEvents.forEach(eventMeta => {

      instance[eventMeta.method] = {
        emit: (data: any) => {
          plt.emitEvent(elm, eventMeta.name, {
            bubbles: eventMeta.bubbles,
            composed: eventMeta.composed,
            cancelable: eventMeta.cancelable,
            detail: data
          });
        }
      };
    });
  }
}
