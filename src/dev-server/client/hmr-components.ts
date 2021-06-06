import { HostElement } from '../../declarations';
import { setHmrAttr, hasShadowRoot } from './hmr-util';

export const hmrComponents = (elm: Element, versionId: string, hmrTagNames: string[]) => {
  const updatedTags: string[] = [];

  hmrTagNames.forEach(hmrTagName => {
    hmrComponent(updatedTags, elm, versionId, hmrTagName);
  });

  return updatedTags.sort();
};

const hmrComponent = (updatedTags: string[], elm: Element, versionId: string, cmpTagName: string) => {
  // drill down through every node in the page
  // to include shadow roots and look for this
  // component tag to run hmr() on
  if (elm.nodeName.toLowerCase() === cmpTagName && typeof (elm as HostElement)['s-hmr'] === 'function') {
    (elm as HostElement)['s-hmr'](versionId);
    setHmrAttr(elm, versionId);

    if (updatedTags.indexOf(cmpTagName) === -1) {
      updatedTags.push(cmpTagName);
    }
  }

  if (hasShadowRoot(elm)) {
    hmrComponent(updatedTags, elm.shadowRoot as any, versionId, cmpTagName);
  }

  if (elm.children) {
    for (let i = 0; i < elm.children.length; i++) {
      hmrComponent(updatedTags, elm.children[i], versionId, cmpTagName);
    }
  }
};
