import * as d from '@declarations';
import { captializeFirstLetter, isDocsPublic } from '@utils';


export function generateEventTypes(cmpEvents: d.ComponentCompilerEvent[]) {
  const interfaceData: d.TypeInfo = {};

  cmpEvents.forEach(cmpEvent => {

    const memberName = `on${captializeFirstLetter(cmpEvent.name)}`;

    const eventType = 'any /**TODO**/'; // (cmpEvent.eventType) ? `CustomEvent<${cmpEvent.eventType.text}>` : `CustomEvent`;

    interfaceData[memberName] = {
      type: `(event: ${eventType}) => void`, // TODO this is not good enough
      optional: false,
      required: false,
      public: isDocsPublic(cmpEvent.docs)
    };

    if (cmpEvent.docs != null && typeof cmpEvent.docs.text === 'string') {
      interfaceData[memberName].jsdoc = cmpEvent.docs.text;
    }

  });

  return interfaceData;
}
