import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { CMP_FLAG } from '@utils';
import { doc, styles, supportsConstructibleStylesheets, supportsShadowDom } from '@platform';
import { HYDRATE_ID } from './runtime-constants';

declare global {
  export interface CSSStyleSheet {
    replaceSync(cssText: string): void;
    replace(cssText: string): Promise<CSSStyleSheet>;
  }
}

const rootAppliedStyles: d.RootAppliedStyleMap = /*@__PURE__*/new WeakMap();

export const registerStyle = (styleId: string, cssText: string) => {
  let style = styles.get(styleId);
  if (supportsConstructibleStylesheets) {
    style = (style || new CSSStyleSheet()) as CSSStyleSheet;
    style.replace(cssText);
  } else {
    style = cssText;
  }
  styles.set(styleId, style);
};

export const addStyle = (styleContainerNode: any, tagName: string, mode: string, ) => {
  let styleId = getScopeId(tagName, mode);
  let style = styles.get(styleId);

  if (BUILD.mode && !style) {
    styleId = getScopeId(tagName);
    style = styles.get(styleId);
  }

  if (style) {
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

          styleElm = doc.createElement('style');
          styleElm.innerHTML = style;

          if (BUILD.hydrateServerSide) {
            styleElm.setAttribute(HYDRATE_ID, styleId);
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
  }
  return styleId;
};

export const attachStyles = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta, mode: string) => {
  const styleId = addStyle((BUILD.shadowDom && elm.shadowRoot)
    ? elm.shadowRoot
    : (elm as any).getRootNode(), cmpMeta.$tagName$, mode);

  if ((BUILD.shadowDom && !supportsShadowDom && cmpMeta.$flags$ & CMP_FLAG.shadowDomEncapsulation) || (BUILD.scoped && cmpMeta.$flags$ & CMP_FLAG.scopedCssEncapsulation)) {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    // DOM WRITE!!
    elm['s-sc'] = styleId;
    elm.classList.add(styleId + '-h');

    if (cmpMeta.$flags$ & CMP_FLAG.scopedCssEncapsulation) {
      elm.classList.add(styleId + '-s');
    }
  }
};


export const getScopeId = (tagName: string, mode?: string) =>
  'sc-' + ((BUILD.mode && mode) ? tagName + '-' + mode : tagName);

export const getElementScopeId = (scopeId: string, isHostElement: boolean) =>
  scopeId + (isHostElement ? '-h' : '-s');


export const convertScopedToShadow = (css: string) =>
  css.replace(/\/\*!@([^\/]+)\*\/[^\{]+\{/g, '$1{');
