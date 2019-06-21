import * as d from '../../declarations';
import { logBuild } from './logger';


export function hmrComponents(elm: Element, versionId: string, hmrTagNames: string[]) {
  const updatedTags: string[] = [];

  hmrTagNames.forEach(hmrTagName => {
    hmrComponent(updatedTags, elm, versionId, hmrTagName);
  });

  if (updatedTags.length > 0) {
    logBuild(`Updated component${updatedTags.length > 1 ? 's' : ''}: ${updatedTags.sort().join(', ')}`);
  }
}


function hmrComponent(updatedTags: string[], elm: Element, versionId: string, hmrTagName: string) {
  // drill down through every node in the page
  // to include shadow roots and look for this
  // component tag to run hmr() on
  if (elm.nodeName.toLowerCase() === hmrTagName && (elm as d.HostElement)['s-hmr']) {
    (elm as d.HostElement)['s-hmr'](versionId);
    elm.setAttribute('data-hmr', versionId);

    if (updatedTags.indexOf(hmrTagName) === -1) {
      updatedTags.push(hmrTagName);
    }
  }

  if (elm.shadowRoot && elm.shadowRoot.nodeType === 11 && elm.shadowRoot !== (elm as any)) {
    hmrComponent(updatedTags, elm.shadowRoot as any, versionId, hmrTagName);
  }

  if (elm.children) {
    for (let i = 0; i < elm.children.length; i++) {
      hmrComponent(updatedTags, elm.children[i], versionId, hmrTagName);
    }
  }
}
