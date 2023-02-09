import { cloneWindow, MockWindow } from '@stencil/core/mock-doc';

const templateWindows = new Map<string, MockWindow>();

export function createWindowFromHtml(templateHtml: string, uniqueId: string) {
  let templateWindow = templateWindows.get(uniqueId);
  if (templateWindow == null) {
    templateWindow = new MockWindow(templateHtml);
    templateWindows.set(uniqueId, templateWindow);
  }

  const win = cloneWindow(templateWindow as any);
  return win;
}
