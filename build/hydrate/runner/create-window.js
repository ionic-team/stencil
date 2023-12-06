import { cloneWindow, MockWindow } from '@stencil/core/mock-doc';
const templateWindows = new Map();
export function createWindowFromHtml(templateHtml, uniqueId) {
    let templateWindow = templateWindows.get(uniqueId);
    if (templateWindow == null) {
        templateWindow = new MockWindow(templateHtml);
        templateWindows.set(uniqueId, templateWindow);
    }
    const win = cloneWindow(templateWindow);
    return win;
}
//# sourceMappingURL=create-window.js.map