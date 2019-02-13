import * as d from '@declarations';
import { captializeFirstLetter, isDocsPublic } from '@utils';


export function generateEventTypes(cmpEvents: d.ComponentCompilerEvent[]): d.TypeInfo {
  return cmpEvents.map(cmpEvent => {
    const name = `on${captializeFirstLetter(cmpEvent.name)}`;
    const type = (cmpEvent.complexType.original) ? `CustomEvent<${cmpEvent.complexType.original}>` : `CustomEvent`;
    return {
      name,
      type,
      optional: false,
      required: false,
      public: isDocsPublic(cmpEvent.docs),
      jsdoc: (cmpEvent.docs != null && typeof cmpEvent.docs.text === 'string') ? cmpEvent.docs.text : undefined
    };
  });
}
