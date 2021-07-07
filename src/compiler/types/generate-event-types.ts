import type * as d from '../../declarations';
import { getTextDocs, toTitleCase } from '@utils';

export const generateEventTypes = (cmpEvents: d.ComponentCompilerEvent[]): d.TypeInfo => {
  return cmpEvents.map(cmpEvent => {
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
