import { HotModuleReplacement } from '../../declarations';
import { hmrComponents } from './hmr-components';
import { hmrExternalStyles } from './hmr-external-styles';
import { hmrImages } from './hmr-images';
import { hmrInlineStyles } from './hmr-inline-styles';
import { setHmrAttr } from './hmr-util';

export const hmrWindow = (data: { window: Window; hmr: any }) => {
  const results = {
    updatedComponents: [] as string[],
    updatedExternalStyles: [] as string[],
    updatedInlineStyles: [] as string[],
    updatedImages: [] as string[],
    versionId: '',
  };

  try {
    if (
      !data ||
      !data.window ||
      !data.window.document.documentElement ||
      !data.hmr ||
      typeof data.hmr.versionId !== 'string'
    ) {
      return results;
    }

    const win = data.window;
    const doc = win.document;
    const hmr: HotModuleReplacement = data.hmr;
    const documentElement = doc.documentElement;
    const versionId = hmr.versionId;
    results.versionId = versionId;

    if (hmr.componentsUpdated) {
      results.updatedComponents = hmrComponents(documentElement, versionId, hmr.componentsUpdated);
    }

    if (hmr.inlineStylesUpdated) {
      results.updatedInlineStyles = hmrInlineStyles(documentElement, versionId, hmr.inlineStylesUpdated);
    }

    if (hmr.externalStylesUpdated) {
      results.updatedExternalStyles = hmrExternalStyles(documentElement, versionId, hmr.externalStylesUpdated);
    }

    if (hmr.imagesUpdated) {
      results.updatedImages = hmrImages(win, doc, versionId, hmr.imagesUpdated);
    }

    setHmrAttr(documentElement, versionId);
  } catch (e) {
    console.error(e);
  }

  return results;
};
