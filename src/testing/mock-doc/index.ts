import { MockDocument } from './document';
import { MockWindow } from './window';


export { applyWindowToGlobal } from './global';

export function mockDocument(html?: string) {
  return new MockDocument(html);
}

export function mockWindow() {
  return new MockWindow();
}
