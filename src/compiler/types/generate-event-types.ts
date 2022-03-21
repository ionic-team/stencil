import type * as d from '../../declarations';
import { getTextDocs, toTitleCase } from '@utils';
import { COMPONENT_EVENTS_NAMESPACE } from './types-utils';

/**
 * Generates the individual event types for all @Event() decorated events in a component.
 *
 * @param cmpEvents The metadata of all @Event() decorated events in a component.
 * @param cmpClassName The pascal case name of the component class.
 * @returns
 */
export const generateEventTypes = (cmpEvents: d.ComponentCompilerEvent[], cmpClassName: string): d.TypeInfo => {
  return cmpEvents.map((cmpEvent) => {
    const name = `on${toTitleCase(cmpEvent.name)}`;
    const cmpEventDetailInterface = `${COMPONENT_EVENTS_NAMESPACE}.${cmpClassName}CustomEvent`;
    const type = cmpEvent.complexType.original
      ? `(event: ${cmpEventDetailInterface}<${cmpEvent.complexType.original}>) => void`
      : cmpEventDetailInterface;
    const typeInfo: d.TypeInfo[0] = {
      name,
      type,
      optional: false,
      required: false,
      internal: cmpEvent.internal,
      jsdoc: getTextDocs(cmpEvent.docs),
    };
    return typeInfo;
  });
};
