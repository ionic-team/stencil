import { BUILD, NAMESPACE } from '@app-data';
import { consoleDevInfo, doc, H, plt, promiseResolve, win } from '@platform';

import type * as d from '../declarations';

export const patchBrowser = (): Promise<d.CustomElementsDefineOptions> => {
  // NOTE!! This fn cannot use async/await!
  if (BUILD.isDev && !BUILD.isTesting) {
    consoleDevInfo('Running in development mode.');
  }

  // TODO(STENCIL-659): Remove code implementing the CSS variable shim
  if (BUILD.cssVarShim) {
    // shim css vars
    // TODO(STENCIL-659): Remove code implementing the CSS variable shim
    plt.$cssShim$ = (win as any).__cssshim;
  }

  if (BUILD.cloneNodeFix) {
    // opted-in to polyfill cloneNode() for slot polyfilled components
    patchCloneNodeFix((H as any).prototype);
  }

  if (BUILD.profile && !performance.mark) {
    // not all browsers support performance.mark/measure (Safari 10)
    // because the mark/measure APIs are designed to write entries to a buffer in the browser that does not exist,
    // simply stub the implementations out.
    // TODO(STENCIL-323): Remove this patch when support for older browsers is removed (breaking)
    // @ts-ignore
    performance.mark = performance.measure = () => {
      /*noop*/
    };
    performance.getEntriesByName = () => [];
  }

  // @ts-ignore
  const scriptElm =
    // TODO(STENCIL-663): Remove code related to deprecated `safari10` field.
    BUILD.scriptDataOpts || BUILD.safari10
      ? Array.from(doc.querySelectorAll('script')).find(
          (s) =>
            new RegExp(`\/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) ||
            s.getAttribute('data-stencil-namespace') === NAMESPACE
        )
      : null;
  const importMeta = import.meta.url;
  const opts = BUILD.scriptDataOpts ? ((scriptElm as any) || {})['data-opts'] || {} : {};

  // TODO(STENCIL-663): Remove code related to deprecated `safari10` field.
  if (BUILD.safari10 && 'onbeforeload' in scriptElm && !history.scrollRestoration /* IS_ESM_BUILD */) {
    // Safari < v11 support: This IF is true if it's Safari below v11.
    // This fn cannot use async/await since Safari didn't support it until v11,
    // however, Safari 10 did support modules. Safari 10 also didn't support "nomodule",
    // so both the ESM file and nomodule file would get downloaded. Only Safari
    // has 'onbeforeload' in the script, and "history.scrollRestoration" was added
    // to Safari in v11. Return a noop then() so the async/await ESM code doesn't continue.
    // IS_ESM_BUILD is replaced at build time so this check doesn't happen in systemjs builds.
    return {
      then() {
        /* promise noop */
      },
    } as any;
  }

  // TODO(STENCIL-663): Remove code related to deprecated `safari10` field.
  if (!BUILD.safari10 && importMeta !== '') {
    opts.resourcesUrl = new URL('.', importMeta).href;
    // TODO(STENCIL-663): Remove code related to deprecated `safari10` field.
  } else if (BUILD.safari10) {
    opts.resourcesUrl = new URL(
      '.',
      new URL(scriptElm.getAttribute('data-resources-url') || scriptElm.src, win.location.href)
    ).href;
  }
  return promiseResolve(opts);
};

const patchCloneNodeFix = (HTMLElementPrototype: any) => {
  const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;

  HTMLElementPrototype.cloneNode = function (this: Node, deep: boolean) {
    if (this.nodeName === 'TEMPLATE') {
      return nativeCloneNodeFn.call(this, deep);
    }
    const clonedNode = nativeCloneNodeFn.call(this, false);
    const srcChildNodes = this.childNodes;
    if (deep) {
      for (let i = 0; i < srcChildNodes.length; i++) {
        // Node.ATTRIBUTE_NODE === 2, and checking because IE11
        if (srcChildNodes[i].nodeType !== 2) {
          clonedNode.appendChild(srcChildNodes[i].cloneNode(true));
        }
      }
    }
    return clonedNode;
  };
};
