import * as d from '../../declarations';
import { getTextDocs } from '@utils';

export const generatePropTypes = (cmpMeta: d.ComponentCompilerMeta): d.TypeInfo => {
  return [
    ...cmpMeta.properties.map(cmpProp => ({
      name: cmpProp.name,
      type: cmpProp.complexType.original,
      optional: cmpProp.optional,
      required: cmpProp.required,
      internal: cmpProp.internal,
      jsdoc: getTextDocs(cmpProp.docs),
    })),
    ...cmpMeta.virtualProperties.map(cmpProp => ({
      name: cmpProp.name,
      type: cmpProp.type,
      optional: true,
      required: false,
      jsdoc: cmpProp.docs,
      internal: false,
    })),
  ];
};
