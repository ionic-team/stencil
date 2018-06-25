import  * as d from '../../declarations';


export function hmrInlineStyles(elm: Element, versionId: string, stylesUpdated: d.HmrStyleUpdate[]) {
  if (elm.nodeName.toLowerCase() === 'style') {
    stylesUpdated.forEach(styleUpdated => {
      hmrStyleElement(elm, versionId, styleUpdated.styleId, styleUpdated.styleText);
    });
  }

  if (elm.nodeName.toLowerCase() === 'template' && (elm as HTMLTemplateElement).content) {
    hmrInlineStyles((elm as HTMLTemplateElement).content as any, versionId, stylesUpdated);
  }

  if (elm.shadowRoot) {
    hmrInlineStyles(elm.shadowRoot as any, versionId, stylesUpdated);
  }

  if (elm.children) {
    for (let i = 0; i < elm.children.length; i++) {
      hmrInlineStyles(elm.children[i], versionId, stylesUpdated);
    }
  }
}


function hmrStyleElement(elm: Element, versionId: string, styleId: string, styleText: string) {
  if (elm.getAttribute && elm.getAttribute('data-style-id') === styleId) {
    elm.innerHTML = styleText;
    elm.setAttribute('data-hmr', versionId);
  }
}
