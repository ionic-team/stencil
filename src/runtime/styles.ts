import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { CMP_FLAG } from '@utils';
import { getDoc, styles } from '@platform';
import { supportsShadowDom } from '@platform';


const supportsConstructibleStylesheets = !BUILD.hydrateServerSide && !!(document as any).adoptedStyleSheets;

export const rootAppliedStyles: d.RootAppliedStyleMap = BUILD.style ? new WeakMap() : undefined;

export const registerStyle = (styleId: string, cssText: string) => {
  let style = styles.get(styleId);
  if (supportsConstructibleStylesheets) {
    style = style || new CSSStyleSheet();
    (style as any).replaceSync(cssText);
  } else {
    style = cssText;
  }
  styles.set(styleId, style);
  return style;
};

export const addStyle = (styleContainerNode: any, styleId: string) => {
  const style = styles.get(styleId);
  if (!style) {
    return;
  }
  if (typeof style === 'string') {
    styleContainerNode = styleContainerNode.head ? styleContainerNode.head : styleContainerNode;
    let appliedStyles = rootAppliedStyles.get(styleContainerNode);
    if (!appliedStyles) {
      rootAppliedStyles.set(styleContainerNode, appliedStyles = new Set());
    }

    if (!appliedStyles.has(styleId)) {
      let styleElm;
      if (BUILD.hydrateClientSide && styleContainerNode.host && (styleElm = styleContainerNode.firstElementChild as any) && styleElm.tagName === 'STYLE') {
        styleElm.innerHTML = style;

      } else {
        const dataStyles = styleContainerNode.querySelectorAll('[data-styles],[charset]');

        styleElm = getDoc(styleContainerNode).createElement('style');
        styleElm.innerHTML = style;

        if (BUILD.hydrateServerSide) {
          styleElm.setAttribute('h-id', styleId);
        }

        styleContainerNode.insertBefore(
          styleElm,
          (dataStyles.length && dataStyles[dataStyles.length - 1].nextSibling) || styleContainerNode.firstChild
        );
      }

      appliedStyles.add(styleId);
    }
  } else if (!styleContainerNode.adoptedStyleSheets.includes(style)) {
    styleContainerNode.adoptedStyleSheets = [
      ...styleContainerNode.adoptedStyleSheets,
      style
    ];
  }
};

export const attachStyles = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta, mode: string) => {
  const styleId = getScopeId(cmpMeta.t, mode);
  addStyle((BUILD.shadowDom && elm.shadowRoot)
    ? elm.shadowRoot
    : (elm as any).getRootNode(), styleId);

  if ((BUILD.shadowDom && !supportsShadowDom && cmpMeta.f & CMP_FLAG.shadowDomEncapsulation) || (BUILD.scoped && cmpMeta.f & CMP_FLAG.scopedCssEncapsulation)) {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    // DOM WRITE!!
    elm['s-sc'] = styleId;
    elm.classList.add(styleId + '-h');

    if (cmpMeta.f & CMP_FLAG.scopedCssEncapsulation) {
      elm.classList.add(styleId + '-s');
    }
  }
};


export const getScopeId = (tagName: string, mode: string) =>
  'sc-' + ((BUILD.mode && mode) ? tagName + '-' + mode : tagName);

export const getElementScopeId = (scopeId: string, isHostElement: boolean) =>
  scopeId + (isHostElement ? '-h' : '-s');


export const convertScopedToShadow = (css: string) =>
  css.replace(/\/\*!@([^\/]+)\*\/[^\{]+\{/g, '$1{');
