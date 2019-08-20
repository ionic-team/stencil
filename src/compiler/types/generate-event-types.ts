import * as d from '../../declarations';
import { getTextDocs, isDocsPublic, toTitleCase } from '@utils';


export function generateEventTypes(cmpEvents: d.ComponentCompilerEvent[]): d.TypeInfo {
  return cmpEvents.map(cmpEvent => {
    const name = `on${toTitleCase(cmpEvent.name)}`;
    const type = (cmpEvent.complexType.original) ? `(event: CustomEvent<${cmpEvent.complexType.original}>) => void` : `CustomEvent`;
    return {
      name,
      type,
      optional: false,
      required: false,
      public: isDocsPublic(cmpEvent.docs),
      jsdoc: getTextDocs(cmpEvent.docs),
    };
  });
}
