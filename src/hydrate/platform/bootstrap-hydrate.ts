import * as d from '../../declarations';
import { doc, getComponent, getHostRef, plt, registerHost } from '@platform';
import { connectedCallback, insertVdomAnnotations } from '@runtime';
import { proxyHostElement } from './proxy-host-element';


export function bootstrapHydrate(win: Window, opts: d.HydrateDocumentOptions, done: (results: BootstrapHydrateResults) => void) {
  const results: BootstrapHydrateResults = {
    hydratedCount: 0,
    hydratedComponents: []
  };
  plt.$resourcesUrl$ = new URL(opts.resourcesUrl || './', doc.baseURI).href;


  try {
    const connectedElements = new Set<any>();
    const createdElements = new Set<HTMLElement>();

    const patchedConnectedCallback = function patchedConnectedCallback(this: d.HostElement) {
      return connectElement(this);
    };

    const patchElement = function(elm: d.HostElement) {
      const tagName = elm.nodeName.toLowerCase();
      if (elm.tagName.includes('-')) {
        const Cstr = getComponent(tagName);

        if (Cstr != null && Cstr.cmpMeta) {
          createdElements.add(elm);
          elm.connectedCallback = patchedConnectedCallback;

          registerHost(elm);
          proxyHostElement(elm, Cstr.cmpMeta);
        }
      }
    };

    const orgDocumentCreateElement = win.document.createElement;
    win.document.createElement = function patchedCreateElement(tagName: string) {
      const elm = orgDocumentCreateElement.call(win.document, tagName);
      patchElement(elm);
      return elm;
    };

    const orgDocumentCreateElementNS = win.document.createElementNS;
    win.document.createElementNS = function patchedCreateElement(namespaceURI: string, tagName: string) {
      const elm = orgDocumentCreateElementNS.call(win.document, namespaceURI, tagName);
      patchElement(elm);
      return elm;
    };

    const patchChild = (elm: any) => {
      if (elm != null && elm.nodeType === 1) {
        patchElement(elm);
        const children = elm.children;
        for (let i = 0, ii = children.length; i < ii; i++) {
          patchChild(children[i]);
        }
      }
    };

    const connectElement = (elm: HTMLElement) => {
      createdElements.delete(elm);
      if (elm != null && elm.nodeType === 1 && results.hydratedCount < opts.maxHydrateCount && shouldHydrate(elm)) {
        const tagName = elm.nodeName.toLowerCase();

        if (tagName.includes('-') && !connectedElements.has(elm)) {
          connectedElements.add(elm);
          return hydrateComponent(win, results, tagName, elm);
        }
      }
      return Promise.resolve();
    };

    const flush = () => {
      const toConnect = Array.from(createdElements).filter(elm => elm.parentElement);
      if (toConnect.length > 0) {
        return Promise.all(toConnect.map(elm => connectElement(elm)));
      }
      return undefined;
    };

    // Patch all existing nodes
    patchChild(win.document.body);

    // Wait
    const waitLoop = (): Promise<void> => {
      const waitForComponents = flush();
      if (waitForComponents === undefined) {
        return Promise.resolve();
      }
      return waitForComponents.then(() => waitLoop());
    };

    waitLoop()
      .then(() => {
        try {
          createdElements.clear();
          connectedElements.clear();
          if (opts.clientHydrateAnnotations) {
            insertVdomAnnotations(win.document);
          }
          win.document.createElement = orgDocumentCreateElement;
          win.document.createElementNS = orgDocumentCreateElementNS;
        } catch (e) {
          win.console.error(e);
        }

        done(results);
      })
      .catch(e => {
        try {
          win.console.error(e);
          connectedElements.clear();
          win.document.createElement = orgDocumentCreateElement;
          win.document.createElementNS = orgDocumentCreateElementNS;
        } catch (e) {}

        done(results);
      });

  } catch (e) {
    win.console.error(e);
    win = opts = null;
    done(results);
  }
}

export async function hydrateComponent(win: Window, results: BootstrapHydrateResults, tagName: string, elm: d.HostElement) {
  const Cstr = getComponent(tagName);

  if (Cstr != null) {
    const cmpMeta = Cstr.cmpMeta;

    if (cmpMeta != null) {
      try {
        connectedCallback(elm, cmpMeta);
        await elm.componentOnReady();

        results.hydratedCount++;

        const ref = getHostRef(elm);
        const modeName = !ref.$modeName$ ? '$' : ref.$modeName$;
        if (!results.hydratedComponents.some(c => c.tag === tagName && c.mode === modeName)) {
          results.hydratedComponents.push({
            tag: tagName,
            mode: modeName
          });
        }
      } catch (e) {
        win.console.error(e);
      }
    }
  }
}


function shouldHydrate(elm: Element): boolean {
  if (elm.nodeType === 9) {
    return true;
  }
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
  hydratedComponents: {
    tag: string,
    mode: string
  }[];
}
