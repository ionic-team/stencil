import * as d from '@declarations';
import { getStaticValue } from '../transform-utils';
import ts from 'typescript';


export function parseStaticEvents(staticMembers: ts.ClassElement[]): d.ComponentConstructorEvent[] {
  const parsedEvents: d.ComponentCompilerEvent[] = getStaticValue(staticMembers, 'events');
  if (!parsedEvents || parsedEvents.length === 0) {
    return [];
  }

  return parsedEvents.map(parsedEvent => {
    return {
      name: parsedEvent.name,
      method: parsedEvent.method,
      bubbles: parsedEvent.bubbles,
      cancelable: parsedEvent.cancelable,
      composed: parsedEvent.composed
    };
  });
}

