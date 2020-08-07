import type * as d from '../../declarations';
import { getTextDocs } from '@utils';

export const generateMethodTypes = (cmpMethods: d.ComponentCompilerMethod[]): d.TypeInfo => {
  return cmpMethods.map(cmpMethod => ({
    name: cmpMethod.name,
    type: cmpMethod.complexType.signature,
    optional: false,
    required: false,
    internal: cmpMethod.internal,
    jsdoc: getTextDocs(cmpMethod.docs),
  }));
};
