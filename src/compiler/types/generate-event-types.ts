import type * as d from '../../declarations';
import { getTextDocs, toTitleCase } from '@utils';

/**
 * Generates the individual event types for all @Event() decorated events in a component
 * @param cmpMeta component runtime metadata for a single component
 * @returns the generated type metadata
 */
export const generateEventTypes = (cmpMeta: d.ComponentCompilerMeta): d.TypeInfo => {
  return cmpMeta.events.map((cmpEvent) => {
    const name = `on${toTitleCase(cmpEvent.name)}`;
    const type = cmpEvent.complexType.original
      ? `(event: CustomEvent<${cmpEvent.complexType.original}>) => void`
      : `CustomEvent`;
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
