import * as d from '@declarations';
import { isDocsPublic } from '@utils';


export function generatePropTypes(cmpProps: d.ComponentCompilerProperty[]) {
  const interfaceData: d.TypeInfo = {};

  cmpProps.forEach(cmpProp => {

    interfaceData[cmpProp.name] = {
      type: cmpProp.type,
      optional: cmpProp.optional,
      required: cmpProp.required,
      public: isDocsPublic(cmpProp.docs)
    };

    if (cmpProp.docs != null && typeof cmpProp.docs.text === 'string') {
      interfaceData[cmpProp.name].jsdoc = cmpProp.docs.text;
    }

  });

  return interfaceData;
}
