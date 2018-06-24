import * as d from '../../declarations';


export function hmrComponents(elm: Element, versionId: string, hmrTagNames: string[]) {
  hmrTagNames.forEach(hmrTagName => {
    hmrComponent(elm, versionId, hmrTagName);
  });
}


function hmrComponent(elm: Element, versionId: string, hmrTagName: string) {
  // drill down through every node in the page
  // to include shadow roots and look for this
  // component tag to run hmr() on
  if (elm.nodeName.toLowerCase() === hmrTagName) {
    (elm as d.HostElement)['s-hmr'] && (elm as d.HostElement)['s-hmr'](versionId);
  }

  if (elm.shadowRoot) {
    hmrComponent(elm.shadowRoot as any, versionId, hmrTagName);
  }

  if (elm.children) {
    for (let i = 0; i < elm.children.length; i++) {
      hmrComponent(elm.children[i], versionId, hmrTagName);
    }
  }
}
