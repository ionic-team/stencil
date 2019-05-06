import * as d from '../../declarations';
import { getComponent, getHostRef } from '@platform';
import { hydrateComponent } from './hydrate-component';
import { insertVdomAnnotations, postUpdateComponent } from '@runtime';


export function bootstrapHydrate(win: Window, opts: d.HydrateDocumentOptions, done: (results: BootstrapHydrateResults) => void) {
  const results: BootstrapHydrateResults = {
    hydratedCount: 0,
    hydratedTags: []
  };

  try {
    const connectedElements = new Set<any>();
    const waitPromises: Promise<any>[] = [];

    const patchedConnectedCallback = function patchedConnectedCallback(this: d.HostElement) {
      connectElements(win, opts, results, this, connectedElements, waitPromises);
    };

    const patchedComponentInit = function patchedComponentInit(this: d.HostElement) {
      const hostRef = getHostRef(this);
      if (hostRef != null) {
        postUpdateComponent(this, hostRef);
      }
    };

    const patchComponent = function(elm: d.HostElement) {
      const tagName = elm.nodeName.toLowerCase();
      if (elm.tagName.includes('-')) {
        const Cstr = getComponent(tagName);

        if (Cstr != null) {
          if (typeof elm.connectedCallback !== 'function') {
            elm.connectedCallback = patchedConnectedCallback;
          }

          if (typeof elm['s-init'] !== 'function') {
            elm['s-rc'] = [];
            elm['s-init'] = patchedComponentInit;
          }
        }
      }
    };

    let orgDocumentCreateElement = win.document.createElement;
    win.document.createElement = function patchedCreateElement(tagName: string) {
      const elm = orgDocumentCreateElement.call(win.document, tagName);
      patchComponent(elm);
      return elm;
    };

    const patchChild = (elm: any) => {
      if (elm != null && elm.nodeType === 1) {
        patchComponent(elm);

        const children = elm.children;
        for (let i = 0, ii = children.length; i < ii; i++) {
          patchChild(children[i]);
        }
      }
    };

    patchChild(win.document.body);

    const initConnectElement = (elm: d.HostElement) => {
      if (elm != null && elm.nodeType === 1) {
        if (typeof elm.connectedCallback === 'function') {
          elm.connectedCallback();
        }
        const children = elm.children;
        for (let i = 0, ii = children.length; i < ii; i++) {
          initConnectElement(children[i] as any);
        }
      }
    };

    initConnectElement(win.document.body);

    Promise.all(waitPromises)
      .then(() => {
        try {
          waitPromises.length = 0;
          connectedElements.clear();
          if (opts.clientHydrateAnnotations) {
            insertVdomAnnotations(win.document);
          }
          win.document.createElement = orgDocumentCreateElement;
          win = opts = orgDocumentCreateElement = null;
        } catch (e) {
          win.console.error(e);
        }

        done(results);
      })
      .catch(e => {
        try {
          win.console.error(e);
          waitPromises.length = 0;
          connectedElements.clear();
          win.document.createElement = orgDocumentCreateElement;
          win = opts = orgDocumentCreateElement = null;
        } catch (e) {}

        done(results);
      });

  } catch (e) {
    win.console.error(e);
    win = opts = null;
    done(results);
  }
}


function connectElements(win: Window, opts: d.HydrateDocumentOptions, results: BootstrapHydrateResults, elm: HTMLElement, connectedElements: Set<any>, waitPromises: Promise<any>[]) {
  if (elm != null && elm.nodeType === 1 && results.hydratedCount < opts.maxHydrateCount && shouldHydrate(elm)) {
    const tagName = elm.nodeName.toLowerCase();

    if (tagName.includes('-') && !connectedElements.has(elm)) {
      connectedElements.add(elm);
      hydrateComponent(win, results, tagName, elm, waitPromises);
    }

    const children = elm.children;
    if (children != null) {
      for (let i = 0, ii = children.length; i < ii; i++) {
        connectElements(win, opts, results, children[i] as any, connectedElements, waitPromises);
      }
    }
  }
}


function shouldHydrate(elm: Element): boolean {
  if (NO_HYDRATE_TAGS.has(elm.nodeName)) {
    return false;
  }
  if (elm.hasAttribute('no-prerender')) {
    return false;
  }
  const parentNode = elm.parentNode;
  if (parentNode == null) {
    return true;
  }

  return shouldHydrate(parentNode as Element);
}

const NO_HYDRATE_TAGS = new Set([
  'CODE',
  'HEAD',
  'IFRAME',
  'INPUT',
  'OBJECT',
  'OUTPUT',
  'NOSCRIPT',
  'PRE',
  'SCRIPT',
  'SELECT',
  'STYLE',
  'TEMPLATE',
  'TEXTAREA'
]);


export interface BootstrapHydrateResults {
  hydratedCount: number;
  hydratedTags: string[];
}
