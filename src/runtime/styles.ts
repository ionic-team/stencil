import * as d from '@declarations';
import { BUILD } from '@build-conditionals';
import { getDoc, rootAppliedStyles, styles } from '@platform';


export const attachStyles = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta, mode: string, styleId?: string, styleElm?: HTMLStyleElement, styleContainerNode?: HTMLElement, appliedStyles?: d.AppliedStyleMap, dataStyles?: NodeListOf<Element>) => {

  styleId = BUILD.mode ? cmpMeta.cmpTag + '#' + mode : cmpMeta.cmpTag;

  if (styles.has(styleId)) {
    if (BUILD.shadowDom && elm.shadowRoot) {
      // we already know we're in a shadow dom
      // so shadow root is the container for these styles
      styleContainerNode = elm.shadowRoot as any;

    } else {
      // climb up the dom and see if we're in a shadow dom
      styleContainerNode = (elm as any).getRootNode();
      styleContainerNode = (styleContainerNode as any).host || (styleContainerNode as any).head;
    }

    appliedStyles = rootAppliedStyles.get(styleContainerNode);
    if (!appliedStyles) {
      rootAppliedStyles.set(styleContainerNode, appliedStyles = new Set());
    }

    if (!appliedStyles.has(styleId)) {
      dataStyles = styleContainerNode.querySelectorAll('[data-styles],[charset]');

      styleElm = getDoc(elm).createElement('style');
      styleElm.innerHTML = styles.get(styleId);

      styleContainerNode.insertBefore(
        styleElm,
        (dataStyles.length && dataStyles[dataStyles.length - 1].nextSibling) || styleContainerNode.firstChild
      );

      appliedStyles.add(styleId);
    }
  }
};


export const getElementScopeId = (scopeId: string, isHostElement: boolean) => {
  return scopeId + (isHostElement ? '-h' : '-s');
};
