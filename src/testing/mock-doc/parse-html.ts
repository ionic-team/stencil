import { MockDocument } from './document';
import { MockDocumentFragment } from './document-fragment';
import { treeAdapter } from './parse-tree-adpater';
import * as parse5 from 'parse5';


export function parse(html: string) {
  const doc = parse5.parse(html.trim(), { treeAdapter: treeAdapter }) as MockDocument;
  doc.documentElement = doc.firstElementChild;
  doc.head = doc.documentElement.firstElementChild;
  doc.body = doc.head.nextElementSibling;
  return doc;
}


export function parseFragment(html: string) {
  const frag = parse5.parseFragment(html.trim(), { treeAdapter: treeAdapter }) as MockDocumentFragment;
  return frag;
}
