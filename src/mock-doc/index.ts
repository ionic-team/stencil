import { MockDocument } from './document';
import { MockWindow } from './window';


export { applyWindowToGlobal } from './global';

export function mockDocument(html?: string) {
  const mockDoc: any = new MockDocument(html);
  return mockDoc as Document;
}

export function mockWindow() {
  const mockWin: any = new MockWindow();
  return mockWin as Window;
}

export { MockComment } from './comment-node';
export { MockElement, MockNode } from './node';
export { MockCustomEvent } from './event';
export { MockDocument } from './document';
export { MockTextNode } from './text-node';
export { MockWindow } from './window';

export { parseHtmlToDocument, parseHtmlToFragment} from './parse-html';
export { serializeNodeToHtml } from './serialize-node';

export { NODE_TYPES } from './constants';
