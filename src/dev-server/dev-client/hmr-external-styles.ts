import { updateHmrHref } from './hmr-util';


export function hmrExternalStyles(elm: Element, versionId: string, cssFileNames: string[]) {
  if (elm.nodeName.toLowerCase() === 'link') {
    cssFileNames.forEach(cssFileName => {
      hmrStylesheetLink(elm as HTMLLinkElement, versionId, cssFileName);
    });
  }

  if (elm.nodeName.toLowerCase() === 'template' && (elm as HTMLTemplateElement).content) {
    hmrExternalStyles((elm as HTMLTemplateElement).content as any, versionId, cssFileNames);
  }

  if (elm.shadowRoot) {
    hmrExternalStyles(elm.shadowRoot as any, versionId, cssFileNames);
  }

  if (elm.children) {
    for (let i = 0; i < elm.children.length; i++) {
      hmrExternalStyles(elm.children[i], versionId, cssFileNames);
    }
  }
}


export function hmrStylesheetLink(styleSheetElm: HTMLLinkElement, versionId: string, cssFileName: string) {
  if (!styleSheetElm.href || !styleSheetElm.rel || styleSheetElm.rel.toLowerCase() !== 'stylesheet') {
    return;
  }

  styleSheetElm.href = updateHmrHref(versionId, cssFileName, styleSheetElm.href);
  styleSheetElm.setAttribute('data-hmr', versionId);
}
