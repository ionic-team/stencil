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
