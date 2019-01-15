import { MockWindow } from './window';


export { MockComment } from './comment-node';
export { MockElement, MockNode } from './node';
export { MockCustomEvent } from './event';
export { MockDocument } from './document';
export { MockTextNode } from './text-node';
export { MockWindow } from './window';
export { NODE_TYPES } from './constants';
export { parseHtmlToDocument, parseHtmlToFragment} from './parse-html';
export { serializeNodeToHtml } from './serialize-node';
export { setupGlobal, teardownGlobal } from './global';


export function mockDocument(html: string = null) {
  const win = new MockWindow(html);
  return win.document as Document;
}

export function mockWindow(html: string = null) {
  const win = new MockWindow(html);
  return (win as any) as Window;
}
