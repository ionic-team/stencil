import * as d from '@declarations';
import { isDocsPublic } from '@utils';


export function generatePropTypes(cmpMeta: d.ComponentCompilerMeta): d.TypeInfo {
  return [
    ...cmpMeta.properties.map(cmpProp => ({
      name: cmpProp.name,
      type: cmpProp.type,
      optional: cmpProp.optional,
      required: cmpProp.required,
      public: isDocsPublic(cmpProp.docs),
      jsdoc: (cmpProp.docs != null && typeof cmpProp.docs.text === 'string') ? cmpProp.docs.text : undefined,
    })),
    ...cmpMeta.virtualProperties.map(cmpProp => ({
      name: cmpProp.name,
      type: cmpProp.type,
      optional: true,
      required: false,
      jsdoc: cmpProp.docs,
      public: true
    }))
  ];
}
