import * as d from '../declarations';
import { BUILD } from '@build-conditionals';
import { CMP_FLAGS } from '@utils';
import { cssVarShim, doc, styles, supportsConstructibleStylesheets, supportsShadowDom } from '@platform';
import { HYDRATE_ID, NODE_TYPE } from './runtime-constants';

declare global {
  export interface CSSStyleSheet {
    replaceSync(cssText: string): void;
    replace(cssText: string): Promise<CSSStyleSheet>;
  }
}

const rootAppliedStyles: d.RootAppliedStyleMap = /*@__PURE__*/new WeakMap();

export const registerStyle = (scopeId: string, cssText: string) => {
  let style = styles.get(scopeId);
  if (supportsConstructibleStylesheets) {
    style = (style || new CSSStyleSheet()) as CSSStyleSheet;
    style.replace(cssText);
  } else {
    style = cssText;
  }
  styles.set(scopeId, style);
};

export const addStyle = (styleContainerNode: any, tagName: string, mode: string, hostElm?: HTMLElement) => {
  let scopeId = getScopeId(tagName, mode);
  let style = styles.get(scopeId);

  // if an element is NOT connected then getRootNode() will return the wrong root node
  // so the fallback is to always use the document for the root node in those cases
  styleContainerNode = (styleContainerNode.nodeType === NODE_TYPE.DocumentFragment ? styleContainerNode : doc);

  if (BUILD.mode && !style) {
    scopeId = getScopeId(tagName);
    style = styles.get(scopeId);
  }

  if (style) {
    if (typeof style === 'string') {
      styleContainerNode = styleContainerNode.head || styleContainerNode;
      let appliedStyles = rootAppliedStyles.get(styleContainerNode);
      let styleElm;
      if (!appliedStyles) {
        rootAppliedStyles.set(styleContainerNode, appliedStyles = new Set());
      }
      if (!appliedStyles.has(scopeId)) {
        if (BUILD.hydrateClientSide && styleContainerNode.host && (styleElm = styleContainerNode.firstElementChild as any) && styleElm.tagName === 'STYLE') {
          // This is only happening on native shadow-dom, do not needs CSS var shim
          styleElm.innerHTML = style;

        } else {
          if (cssVarShim) {
            styleElm = cssVarShim.createHostStyle(hostElm, scopeId, style);
            scopeId = (styleElm as any)['s-sc'];
            // we don't want to add this styleID to the appliedStyles Set
            // since the cssVarShim might need to apply several different
            // stylesheets for the same component
            appliedStyles = null;

          } else {
            styleElm = doc.createElement('style');
            styleElm.innerHTML = style;
          }

          if (BUILD.hydrateServerSide || BUILD.hotModuleReplacement) {
            styleElm.setAttribute(HYDRATE_ID, scopeId);
          }

          styleContainerNode.appendChild(
            styleElm,
          );
        }

        if (appliedStyles) {
          appliedStyles.add(scopeId);
        }
      }

    } else if (BUILD.constructableCSS && !styleContainerNode.adoptedStyleSheets.includes(style)) {
      styleContainerNode.adoptedStyleSheets = [
        ...styleContainerNode.adoptedStyleSheets,
        style
      ];
    }
  }
  return scopeId;
};

export const attachStyles = (elm: d.HostElement, cmpMeta: d.ComponentRuntimeMeta, mode: string) => {

  const styleId = addStyle(
    (BUILD.shadowDom && elm.shadowRoot && supportsShadowDom)
      ? elm.shadowRoot
      : elm.getRootNode(), cmpMeta.$tagName$, mode, elm);

  if ((BUILD.shadowDom || BUILD.scoped) && cmpMeta.$flags$ & CMP_FLAGS.needsScopedEncapsulation) {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    // DOM WRITE!!
    elm['s-sc'] = styleId;
    elm.classList.add(styleId + '-h');

    if (BUILD.scoped && cmpMeta.$flags$ & CMP_FLAGS.scopedCssEncapsulation) {
      elm.classList.add(styleId + '-s');
    }
  }
};


export const getScopeId = (tagName: string, mode?: string) =>
  'sc-' + ((BUILD.mode && mode) ? tagName + '-' + mode : tagName);

export const convertScopedToShadow = (css: string) =>
  css.replace(/\/\*!@([^\/]+)\*\/[^\{]+\{/g, '$1{');
