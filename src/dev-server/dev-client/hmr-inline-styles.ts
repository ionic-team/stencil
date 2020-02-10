import  * as d from '../../declarations';


export function hmrInlineStyles(elm: Element, versionId: string, stylesUpdated: d.HmrStyleUpdate[]) {
  if (elm.nodeName.toLowerCase() === 'style') {
    stylesUpdated.forEach(styleUpdated => {
      hmrStyleElement(elm, versionId, styleUpdated);
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


function hmrStyleElement(elm: Element, versionId: string, stylesUpdated: d.HmrStyleUpdate) {
  if (!elm.getAttribute) {
    return;
  }

  const styleId = elm.getAttribute('sty-id');
  if (styleId !== stylesUpdated.styleId || !stylesUpdated.styleText) {
    return;
  }

  // if we made it this far then it's a match!
  // update the new style text
  elm.innerHTML = stylesUpdated.styleText.replace(/\\n/g, '\n');
  elm.setAttribute('data-hmr', versionId);
}
