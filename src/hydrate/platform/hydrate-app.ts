import * as d from '../../declarations';
import { connectedCallback, insertVdomAnnotations } from '@runtime';
import { doc, getComponent, getHostRef, plt, registerHost } from '@platform';
import { proxyHostElement } from './proxy-host-element';


export function hydrateApp(
  win: Window,
  opts: d.HydrateFactoryOptions,
  results: d.HydrateResults,
  afterHydrate: (win: Window, opts: d.HydrateFactoryOptions, results: d.HydrateResults, resolve: (results: d.HydrateResults) => void) => void,
  resolve: (results: d.HydrateResults) => void
) {
  const connectedElements = new Set<any>();
  const createdElements = new Set<HTMLElement>();
  const orgDocumentCreateElement = win.document.createElement;
  const orgDocumentCreateElementNS = win.document.createElementNS;
  const resolved = Promise.resolve();

  let tmrId: any;

  function hydratedComplete() {
    global.clearTimeout(tmrId);
    createdElements.clear();
    connectedElements.clear();

    try {
      if (opts.clientHydrateAnnotations) {
        insertVdomAnnotations(win.document);
      }
      win.document.createElement = orgDocumentCreateElement;
      win.document.createElementNS = orgDocumentCreateElementNS;

    } catch (e) {
      renderCatchError(opts, results, e);
    }

    afterHydrate(win, opts, results, resolve);
  }

  function hydratedError(err: any) {
    renderCatchError(opts, results, err);
    hydratedComplete();
  }

  function timeoutExceeded() {
    hydratedError(`Hydrate exceeded timeout`);
  }

  try {

    function patchedConnectedCallback(this: d.HostElement) {
      return connectElement(this);
    }

    function patchElement(elm: d.HostElement) {
      if (isValidComponent(elm, opts)) {
        // this element is a valid component

        const hostRef = getHostRef(elm);
        if (!hostRef) {
          // we haven't register this component's host element yet

          // get the component's constructor
          const Cstr = getComponent(elm.nodeName.toLowerCase());

          if (Cstr != null && Cstr.cmpMeta != null) {
            // we found valid component metadata
            createdElements.add(elm);
            elm.connectedCallback = patchedConnectedCallback;

            // register the host element
            registerHost(elm);

            // proxy the host element with the component's metadata
            proxyHostElement(elm, Cstr.cmpMeta);
          }
        }
      }
    }

    function patchChild(elm: any) {
      if (elm != null && elm.nodeType === 1) {
        patchElement(elm);
        const children = elm.children;
        for (let i = 0, ii = children.length; i < ii; i++) {
          patchChild(children[i]);
        }
      }
    }

    function connectElement(elm: HTMLElement) {
      createdElements.delete(elm);

      if (isValidComponent(elm, opts) && results.hydratedCount < opts.maxHydrateCount) {
        // this is a valid component to hydrate
        // and we haven't hit our max hydrated count yet

        if (!connectedElements.has(elm) && shouldHydrate(elm)) {
          // we haven't connected this component yet
          // and all of its ancestor elements are valid too

          // add it to our Set so we know it's already being connected
          connectedElements.add(elm);
          return hydrateComponent(win, results, elm.nodeName, elm);
        }
      }

      return resolved;
    }

    function waitLoop(): Promise<void> {
      const toConnect = Array.from(createdElements).filter(elm => elm.parentElement);
      if (toConnect.length > 0) {
        return Promise.all(toConnect.map(connectElement))
          .then(waitLoop);
      }
      return resolved;
    }

    win.document.createElement = function patchedCreateElement(tagName: string) {
      const elm = orgDocumentCreateElement.call(win.document, tagName);
      patchElement(elm);
      return elm;
    };

    win.document.createElementNS = function patchedCreateElement(namespaceURI: string, tagName: string) {
      const elm = orgDocumentCreateElementNS.call(win.document, namespaceURI, tagName);
      patchElement(elm);
      return elm;
    };

    // ensure we use nodejs's native setTimeout, not the mocked one
    tmrId = global.setTimeout(timeoutExceeded, opts.timeout);

    plt.$resourcesUrl$ = new URL(opts.resourcesUrl || './', doc.baseURI).href;

    patchChild(win.document.body);

    waitLoop()
      .then(hydratedComplete)
      .catch(hydratedError);

  } catch (e) {
    hydratedError(e);
  }
}


async function hydrateComponent(win: Window, results: d.HydrateResults, tagName: string, elm: d.HostElement) {
  tagName = tagName.toLowerCase();
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
        if (!results.components.some(c => c.tag === tagName && c.mode === modeName)) {
          results.components.push({
            tag: tagName,
            mode: modeName,
            count: 0,
            depth: -1,
          });
        }
      } catch (e) {
        win.console.error(e);
      }
    }
  }
}

function isValidComponent(elm: Element, opts: d.HydrateFactoryOptions) {
  if (elm != null && elm.nodeType === 1) {
    // playing it safe and not using elm.tagName or elm.localName on purpose
    const tagName = elm.nodeName;
    if (typeof tagName === 'string' && tagName.includes('-')) {
      if (opts.excludeComponents.includes(tagName.toLowerCase())) {
        // this tagName we DO NOT want to hydrate
        return false;
      }
      // all good, this is a valid component
      return true;
    }
  }
  return false;
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


function renderCatchError(opts: d.HydrateFactoryOptions, results: d.HydrateResults, err: any) {
  const diagnostic: d.Diagnostic = {
    level: 'error',
    type: 'build',
    header: 'Hydrate Error',
    messageText: '',
    relFilePath: null,
    absFilePath: null,
    lines: []
  };

  if (opts.url) {
    try {
      const u = new URL(opts.url);
      if (u.pathname !== '/') {
        diagnostic.header += ': ' + u.pathname;
      }
    } catch (e) {}
  }

  if (err != null) {
    if (err.stack != null) {
      diagnostic.messageText = err.stack.toString();
    } else if (err.message != null) {
      diagnostic.messageText = err.message.toString();
    } else {
      diagnostic.messageText = err.toString();
    }
  }

  results.diagnostics.push(diagnostic);
}
