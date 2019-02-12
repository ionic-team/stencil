import * as d from '@declarations';
import { isDocsPublic } from '@utils';


export function generateMethodTypes(cmpMethods: d.ComponentCompilerMethod[]) {
  const interfaceData: d.TypeInfo = {};

  cmpMethods.forEach(cmpMethod => {

    interfaceData[cmpMethod.name] = {
      type: cmpMethod.complexType.signature,
      optional: false,
      required: false,
      public: isDocsPublic(cmpMethod.docs)
    };

    if (cmpMethod.docs != null && typeof cmpMethod.docs.text === 'string') {
      interfaceData[cmpMethod.name].jsdoc = cmpMethod.docs.text;
    }

  });

  return interfaceData;
}
