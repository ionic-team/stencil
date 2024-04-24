import { BUILD } from '@app-data';
import { doc, plt, styles, supportsConstructableStylesheets, supportsShadow } from '@platform';
import { CMP_FLAGS, queryNonceMetaTagContent } from '@utils';

import type * as d from '../declarations';
import { createTime } from './profile';
import { HYDRATED_STYLE_ID, NODE_TYPE, SLOT_FB_CSS } from './runtime-constants';

const rootAppliedStyles: d.RootAppliedStyleMap = /*@__PURE__*/ new WeakMap();

/**
 * Register the styles for a component by creating a stylesheet and then
 * registering it under the component's scope ID in a `WeakMap` for later use.
 *
 * If constructable stylesheet are not supported or `allowCS` is set to
 * `false` then the styles will be registered as a string instead.
 *
 * @param scopeId the scope ID for the component of interest
 * @param cssText styles for the component of interest
 * @param allowCS whether or not to use a constructable stylesheet
 */
export const registerStyle = (scopeId: string, cssText: string, allowCS: boolean) => {
  let style = styles.get(scopeId);
  if (supportsConstructableStylesheets && allowCS) {
    style = (style || new CSSStyleSheet()) as CSSStyleSheet;
    if (typeof style === 'string') {
      style = cssText;
    } else {
      style.replaceSync(cssText);
    }
  } else {
    style = cssText;
  }
  styles.set(scopeId, style);
};

/**
 * Attach the styles for a given component to the DOM
 *
 * If the element uses shadow or is already attached to the DOM then we can
 * create a stylesheet inside of its associated document fragment, otherwise
 * we'll stick the stylesheet into the document head.
 *
 * @param styleContainerNode the node within which a style element for the
 * component of interest should be added
 * @param cmpMeta runtime metadata for the component of interest
 * @param mode an optional current mode
 * @returns the scope ID for the component of interest
 */
export const addStyle = (styleContainerNode: any, cmpMeta: d.ComponentRuntimeMeta, mode?: string) => {
  const scopeId = getScopeId(cmpMeta, mode);
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
          styleElm = doc.createElement('style');
          styleElm.innerHTML = style;

          // Apply CSP nonce to the style tag if it exists
          const nonce = plt.$nonce$ ?? queryNonceMetaTagContent(doc);
          if (nonce != null) {
            styleElm.setAttribute('nonce', nonce);
          }

          if (BUILD.hydrateServerSide || BUILD.hotModuleReplacement) {
            styleElm.setAttribute(HYDRATED_STYLE_ID, scopeId);
          }

          styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
        }

        // Add styles for `slot-fb` elements if we're using slots outside the Shadow DOM
        if (cmpMeta.$flags$ & CMP_FLAGS.hasSlotRelocation) {
          styleElm.innerHTML += SLOT_FB_CSS;
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

/**
 * Add styles for a given component to the DOM, optionally handling 'scoped'
 * encapsulation by adding an appropriate class name to the host element.
 *
 * @param hostRef the host reference for the component of interest
 */
export const attachStyles = (hostRef: d.HostRef) => {
  const cmpMeta = hostRef.$cmpMeta$;
  const elm = hostRef.$hostElement$;
  const flags = cmpMeta.$flags$;
  const endAttachStyles = createTime('attachStyles', cmpMeta.$tagName$);
  const scopeId = addStyle(
    BUILD.shadowDom && supportsShadow && elm.shadowRoot ? elm.shadowRoot : elm.getRootNode(),
    cmpMeta,
    hostRef.$modeName$,
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

/**
 * Get the scope ID for a given component
 *
 * @param cmp runtime metadata for the component of interest
 * @param mode the current mode (optional)
 * @returns a scope ID for the component of interest
 */
export const getScopeId = (cmp: d.ComponentRuntimeMeta, mode?: string) =>
  'sc-' + (BUILD.mode && mode && cmp.$flags$ & CMP_FLAGS.hasMode ? cmp.$tagName$ + '-' + mode : cmp.$tagName$);

/**
 * Convert a 'scoped' CSS string to one appropriate for use in the shadow DOM.
 *
 * Given a 'scoped' CSS string that looks like this:
 *
 * ```
 * /*!@div*\/div.class-name { display: flex };
 * ```
 *
 * Convert it to a 'shadow' appropriate string, like so:
 *
 * ```
 *  /*!@div*\/div.class-name { display: flex }
 *      ─┬─                  ────────┬────────
 *       │                           │
 *       │         ┌─────────────────┘
 *       ▼         ▼
 *      div{ display: flex }
 * ```
 *
 * Note that forward-slashes in the above are escaped so they don't end the
 * comment.
 *
 * @param css a CSS string to convert
 * @returns the converted string
 */
export const convertScopedToShadow = (css: string) => css.replace(/\/\*!@([^\/]+)\*\/[^\{]+\{/g, '$1{');

declare global {
  export interface CSSStyleSheet {
    replaceSync(cssText: string): void;
    replace(cssText: string): Promise<CSSStyleSheet>;
  }
}
