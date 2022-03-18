import type * as d from '../../declarations';
import { getTextDocs, toTitleCase } from '@utils';

/**
 * Generates the individual event types for all @Event() decorated events in a component.
 *
 * @param cmpEvents The metadata of all @Event() decorated events in a component.
 * @param cmpHtmlElementInterface The name of the generated HTMLElement interface for the component.
 * @returns
 */
export const generateEventTypes = (cmpEvents: d.ComponentCompilerEvent[], cmpHtmlElementInterface: string): d.TypeInfo => {
  return cmpEvents.map((cmpEvent) => {
    const name = `on${toTitleCase(cmpEvent.name)}`;
    const targetType = `{ target: ${cmpHtmlElementInterface} }`;
    const type = cmpEvent.complexType.original
      ? `(event: CustomEvent<${cmpEvent.complexType.original}> & ${targetType}) => void`
      : `CustomEvent & ${targetType}`;
    return {
      name,
      type,
      optional: false,
      required: false,
      internal: cmpEvent.internal,
      jsdoc: getTextDocs(cmpEvent.docs),
    };
  });
};
