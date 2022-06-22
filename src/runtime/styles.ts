import type * as d from '../declarations';
import { BUILD } from '@app-data';
import { CMP_FLAGS } from '@utils';
import { doc, plt, styles, supportsConstructibleStylesheets, supportsShadow } from '@platform';
import { HYDRATED_STYLE_ID, NODE_TYPE } from './runtime-constants';
import { createTime } from './profile';

const rootAppliedStyles: d.RootAppliedStyleMap = /*@__PURE__*/ new WeakMap();

export const registerStyle = (scopeId: string, cssText: string, allowCS: boolean) => {
  let style = styles.get(scopeId);
  if (supportsConstructibleStylesheets && allowCS) {
    style = (style || new CSSStyleSheet()) as CSSStyleSheet;
    style.replace(cssText);
  } else {
    style = cssText;
  }
  styles.set(scopeId, style);
};

export const addStyle = (
  styleContainerNode: any,
  cmpMeta: d.ComponentRuntimeMeta,
  mode?: string,
  hostElm?: HTMLElement
) => {
  let scopeId = getScopeId(cmpMeta, mode);
  const style = styles.get(scopeId);

  if (!BUILD.attachStyles) {
    return scopeId;
  }
  // if an element is NOT connected then getRootNode() will return the wrong root node
  // so the fallback is to always use the document for the root node in those cases
  styleContainerNode = styleContainerNode.nodeType === NODE_TYPE.DocumentFragment ? styleContainerNode : doc;

  if (style) {
    if (typeof style === 'string') {
      styleContainerNode = styleContainerNode.head || styleContainerNode;
      let appliedStyles = rootAppliedStyles.get(styleContainerNode);
      let styleElm;
      if (!appliedStyles) {
        rootAppliedStyles.set(styleContainerNode, (appliedStyles = new Set()));
      }
      if (!appliedStyles.has(scopeId)) {
        if (
          BUILD.hydrateClientSide &&
          styleContainerNode.host &&
          (styleElm = styleContainerNode.querySelector(`[${HYDRATED_STYLE_ID}="${scopeId}"]`))
        ) {
          // This is only happening on native shadow-dom, do not needs CSS var shim
          styleElm.innerHTML = style;
        } else {
          if (BUILD.cssVarShim && plt.$cssShim$) {
            styleElm = plt.$cssShim$.createHostStyle(
              hostElm,
              scopeId,
              style,
              !!(cmpMeta.$flags$ & CMP_FLAGS.needsScopedEncapsulation)
            );
            const newScopeId = (styleElm as any)['s-sc'];
            if (newScopeId) {
              scopeId = newScopeId;

              // we don't want to add this styleID to the appliedStyles Set
              // since the cssVarShim might need to apply several different
              // stylesheets for the same component
              appliedStyles = null;
            }
          } else {
            styleElm = doc.createElement('style');
            styleElm.innerHTML = style;
          }

          if (BUILD.hydrateServerSide || BUILD.hotModuleReplacement) {
            styleElm.setAttribute(HYDRATED_STYLE_ID, scopeId);
          }

          styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
        }

        if (appliedStyles) {
          appliedStyles.add(scopeId);
        }
      }
    } else if (BUILD.constructableCSS && !styleContainerNode.adoptedStyleSheets.includes(style)) {
      styleContainerNode.adoptedStyleSheets = [...styleContainerNode.adoptedStyleSheets, style];
    }
  }
  return scopeId;
};

export const attachStyles = (hostRef: d.HostRef) => {
  const cmpMeta = hostRef.$cmpMeta$;
  const elm = hostRef.$hostElement$;
  const flags = cmpMeta.$flags$;
  const endAttachStyles = createTime('attachStyles', cmpMeta.$tagName$);
  const scopeId = addStyle(
    BUILD.shadowDom && supportsShadow && elm.shadowRoot ? elm.shadowRoot : elm.getRootNode(),
    cmpMeta,
    hostRef.$modeName$,
    elm
  );

  if ((BUILD.shadowDom || BUILD.scoped) && BUILD.cssAnnotations && flags & CMP_FLAGS.needsScopedEncapsulation) {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    // DOM WRITE!!
    elm['s-sc'] = scopeId;
    elm.classList.add(scopeId + '-h');

    if (BUILD.scoped && flags & CMP_FLAGS.scopedCssEncapsulation) {
      elm.classList.add(scopeId + '-s');
    }
  }
  endAttachStyles();
};

export const getScopeId = (cmp: d.ComponentRuntimeMeta, mode?: string) =>
  'sc-' + (BUILD.mode && mode && cmp.$flags$ & CMP_FLAGS.hasMode ? cmp.$tagName$ + '-' + mode : cmp.$tagName$);

export const convertScopedToShadow = (css: string) => css.replace(/\/\*!@([^\/]+)\*\/[^\{]+\{/g, '$1{');

declare global {
  export interface CSSStyleSheet {
    replaceSync(cssText: string): void;
    replace(cssText: string): Promise<CSSStyleSheet>;
  }
}
