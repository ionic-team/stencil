import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { CMP_FLAG } from '@utils';
import { getDoc, rootAppliedStyles, styles } from '@platform';
import { supportsShadowDom } from '@platform';


export const attachStyles = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta, mode: string, styleId?: string, styleElm?: HTMLStyleElement, styleContainerNode?: HTMLElement, appliedStyles?: d.AppliedStyleMap, dataStyles?: NodeListOf<Element>) => {

  if (BUILD.mode && mode) {
    styleId = cmpMeta.t + '-' + mode;
  } else {
    styleId = cmpMeta.t;
  }

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

  if ((BUILD.shadowDom && !supportsShadowDom && cmpMeta.f & CMP_FLAG.shadowDomEncapsulation) || (BUILD.scoped && cmpMeta.f & CMP_FLAG.scopedCssEncapsulation)) {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    // DOM WRITE!!
    styleId = elm['s-sc'] = ('sc-' + styleId);

    elm.classList.add(getElementScopeId(styleId, true));

    if (cmpMeta.f & CMP_FLAG.scopedCssEncapsulation) {
      elm.classList.add(getElementScopeId(styleId, false));
    }
  }
};


export const getElementScopeId = (scopeId: string, isHostElement: boolean) =>
  scopeId + (isHostElement ? '-h' : '-s');
