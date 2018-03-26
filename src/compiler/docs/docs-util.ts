import * as d from '../../declarations';


export function getMemberDocumentation(jsDoc: d.JSDoc) {
  if (jsDoc && jsDoc.documentation) {
    return jsDoc.documentation.trim();
  }
  return '';
}
