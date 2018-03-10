import { JSDoc } from '../../../declarations';


export function getMemberDocumentation(jsDoc: JSDoc) {
  if (jsDoc && jsDoc.documentation) {
    return jsDoc.documentation.trim();
  }
  return '';
}
