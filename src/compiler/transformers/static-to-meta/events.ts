import * as d from '../../../declarations';
import { getStaticValue, isInternal } from '../transform-utils';
import ts from 'typescript';

export const parseStaticEvents = (staticMembers: ts.ClassElement[]): d.ComponentCompilerEvent[] => {
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
      composed: parsedEvent.composed,
      docs: parsedEvent.docs,
      complexType: parsedEvent.complexType,
      internal: isInternal(parsedEvent.docs),
    };
  });
};
