import { MockDocument } from './mock-doc/document';
import * as parser from './mock-doc/parse-html';


let sharedDocument: MockDocument;

export function parseHtml(html: string) {
  if (!sharedDocument) {
    sharedDocument = new MockDocument();
  }

  return parser.parse(sharedDocument, html);
}


export function parseFragment(html: string) {
  if (!sharedDocument) {
    sharedDocument = new MockDocument();
  }

  return parser.parseFragment(sharedDocument, html);
}
