import * as d from '../../declarations';
import { getTextDocs, isDocsPublic } from '@utils';


export function generateMethodTypes(cmpMethods: d.ComponentCompilerMethod[]): d.TypeInfo {
  return cmpMethods.map(cmpMethod => ({
    name: cmpMethod.name,
    type: cmpMethod.complexType.signature,
    optional: false,
    required: false,
    public: isDocsPublic(cmpMethod.docs),
    jsdoc: getTextDocs(cmpMethod.docs),
  }));
}
