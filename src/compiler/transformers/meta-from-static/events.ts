import * as d from '../../../declarations';
import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticEvents(staticMembers: ts.ClassElement[], cmpMeta: d.ComponentCompilerMeta) {
  const parsedEvents: d.ComponentCompilerEvent[] = getStaticValue(staticMembers, 'events');
  if (!parsedEvents || parsedEvents.length === 0) {
    return;
  }

  parsedEvents.forEach(parsedEvent => {
    const p: d.ComponentConstructorEvent = {
      name: parsedEvent.name,
      method: parsedEvent.method,
      bubbles: parsedEvent.bubbles,
      cancelable: parsedEvent.cancelable,
      composed: parsedEvent.composed
    };
    cmpMeta.events.push(p);
  });
}

