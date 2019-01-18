import  * as d from '@declarations';


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

  const styleTag = elm.getAttribute('data-style-tag');
  if (styleTag !== stylesUpdated.styleTag || !stylesUpdated.styleText) {
    return;
  }

  const elmStyleMode = elm.getAttribute('data-style-mode');
  const elmIsScoped = elm.hasAttribute('data-style-scoped');

  if (stylesUpdated.styleMode && elmStyleMode !== stylesUpdated.styleMode) {
    // this updating style has a style mode
    // but this element does not have the same style mode
    return;
  }

  if (stylesUpdated.isScoped !== elmIsScoped) {
    // the style scope and the element scope are not the same
    return;
  }

  // if we made it this far then it's a match!
  // update the new style text
  elm.innerHTML = stylesUpdated.styleText.replace(/\\n/g, '\n');
  elm.setAttribute('data-hmr', versionId);
}
