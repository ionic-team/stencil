import { MockElement, MockNode } from './node';
import { NODE_TYPES } from './constants';


export class MockCustomElementRegistry implements CustomElementRegistry {
  private _registry = new Map<string, { cstr: any, options: any }>();
  private _whenDefinedResolves = new Map<string, Function>();

  constructor(private win: Window) {}

  define(tagName: string, cstr: any, options?: any) {
    if (tagName.toLowerCase() !== tagName) {
      throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': "${tagName}" is not a valid custom element name`);
    }

    this._registry.set(tagName, { cstr, options });

    const whenDefinedResolve = this._whenDefinedResolves.get(tagName);
    if (whenDefinedResolve != null) {
      whenDefinedResolve();
      this._whenDefinedResolves.delete(tagName);
    }

    if (this.win.document != null) {
      const hosts = this.win.document.querySelectorAll(tagName);
      hosts.forEach(host => {
        if (!upgradedElements.has(host)) {
          tempDisableCallbacks.add(this.win.document);

          const upgradedCmp = creatCustomElement(this, this.win.document, tagName) as MockNode;

          for (let i = 0; i < host.childNodes.length; i++) {
            const childNode = host.childNodes[i];
            childNode.remove();
            upgradedCmp.appendChild(childNode as any);
          }

          tempDisableCallbacks.delete(this.win.document);

          if (proxyElements.has(host)) {
            proxyElements.set(host, upgradedCmp);
          }
        }

        fireConnectedCallback(host);
      });
    }
  }

  get(tagName: string) {
    const def = this._registry.get(tagName.toLowerCase());
    if (def != null) {
      return def.cstr;
    }
    return undefined;
  }

  upgrade(_rootNode: any) {
    //
  }

  whenDefined(tagName: string) {
    tagName = tagName.toLowerCase();

    if (this._registry.has(tagName)) {
      return Promise.resolve();
    }

    return new Promise<void>(resolve => {
      this._whenDefinedResolves.set(tagName, resolve);
    });
  }

  $reset() {
    this._registry.clear();
    this._whenDefinedResolves.clear();
  }

}

export function creatCustomElement(customElements: MockCustomElementRegistry, ownerDocument: any, tagName: string) {
  const Cstr = customElements.get(tagName);

  if (Cstr != null) {
    const cmp = new Cstr(ownerDocument);
    cmp.nodeName = tagName.toUpperCase();
    upgradedElements.add(cmp);
    return cmp;
  }

  const host = new Proxy({}, {
    get(obj: any, prop: string) {
      const instance = proxyElements.get(host);
      if (instance != null) {
        return instance[prop];
      }
      return obj[prop];
    },
    set(obj: any, prop: string, val: any) {
      const instance = proxyElements.get(host);
      if (instance != null) {
        instance[prop] = val;
      } else {
        obj[prop] = val;
      }
      return true;
    }
  });

  const instance = new MockElement(ownerDocument, tagName);

  proxyElements.set(host, instance);

  return host;
}

const proxyElements = new WeakMap();

const upgradedElements = new WeakSet();


export function connectNode(ownerDocument: any, node: MockNode) {
  node.ownerDocument = ownerDocument;

  if (node.nodeType === NODE_TYPES.ELEMENT_NODE) {
    if (node.nodeName.includes('-') && typeof (node as any).connectedCallback === 'function') {
      if (node.isConnected) {
        fireConnectedCallback(node);
      }
    }
    node.childNodes.forEach(childNode => {
      connectNode(ownerDocument, childNode);
    });

  } else {
    node.childNodes.forEach(childNode => {
      childNode.ownerDocument = ownerDocument;
    });
  }
}

function fireConnectedCallback(node: any) {
  if (typeof (node as any).connectedCallback === 'function') {
    if (!tempDisableCallbacks.has(node.ownerDocument)) {
      try {
        node.connectedCallback();
      } catch (e) {
        console.error(e);
      }
    }
  }
}


export function disconnectNode(node: MockNode) {
  if (node.nodeType === NODE_TYPES.ELEMENT_NODE) {
    if (node.nodeName.includes('-') && typeof (node as any).disconnectedCallback === 'function') {
      if (!tempDisableCallbacks.has(node.ownerDocument)) {
        try {
          (node as any).disconnectedCallback();
        } catch (e) {
          console.error(e);
        }
      }
    }
    node.childNodes.forEach(disconnectNode);
  }
}

export function attributeChanged(node: MockNode, attrName: string, oldValue: string, newValue: string) {
  if (node.nodeName.includes('-') && typeof (node as any).attributeChangedCallback === 'function') {
    attrName = attrName.toLowerCase();

    const observedAttributes = (node as any).constructor.observedAttributes as string[];
    if (Array.isArray(observedAttributes) && observedAttributes.some(obs => obs.toLowerCase() === attrName)) {
      try {
        (node as any).attributeChangedCallback(attrName, oldValue, newValue);
      } catch (e) {
        console.error(e);
      }
    }
  }
}

const tempDisableCallbacks = new Set();
