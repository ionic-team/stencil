import * as d from '../declarations';
import { getComponent, getHostRef } from '@platform';
import { hydrateComponent } from './hydrate-component';
import { insertVdomAnnotations, postUpdateComponent } from '@runtime';


export function initConnect(win: Window, doc: Document, opts: d.HydrateDocumentOptions, results: d.HydrateResults, resolve: Function) {
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

    const orgDocumentCreateElement = doc.createElement;
    doc.createElement = function patchedCreateElement(tagName: string) {
      const elm = orgDocumentCreateElement.call(doc, tagName);
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

    const body = doc.body;
    patchChild(body);

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

    initConnectElement(body);

    Promise.all(waitPromises)
      .then(() => {
        waitPromises.length = 0;
        connectedElements.clear();
        if (opts.clientHydrateAnnotations) {
          insertVdomAnnotations(doc);
        }
        resolve();
      })
      .catch(e => {
        waitPromises.length = 0;
        connectedElements.clear();
        win.console.error(e);
        resolve();
      });

  } catch (e) {
    win.console.error(e);
    resolve();
  }
}


function connectElements(win: Window, opts: d.HydrateDocumentOptions, results: d.HydrateResults, elm: HTMLElement, connectedElements: Set<any>, waitPromises: Promise<any>[]) {
  if (elm != null && elm.nodeType === 1 && results.hydratedCount < opts.maxHydrateCount) {

    const tagName = elm.nodeName.toLowerCase();

    if (!NO_HYDRATE_TAGS.has(tagName) && !elm.hasAttribute('no-prerender')) {
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
}


const NO_HYDRATE_TAGS = new Set([
  'code',
  'iframe',
  'input',
  'object',
  'output',
  'noscript',
  'pre',
  'select',
  'style',
  'template',
  'textarea'
]);
