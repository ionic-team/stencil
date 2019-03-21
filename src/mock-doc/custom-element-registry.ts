import { MockElement, MockNode } from './node';
import { NODE_TYPES } from './constants';


const registryMap = new WeakMap<MockCustomElementRegistry, Map<string, { cstr: any, options: any }>>();
const whenDefinedResolvesMap = new WeakMap<MockCustomElementRegistry, Map<string, Function[]>>();


export class MockCustomElementRegistry implements CustomElementRegistry {
  constructor(private win: Window) {}

  define(tagName: string, cstr: any, options?: any) {
    if (tagName.toLowerCase() !== tagName) {
      throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': "${tagName}" is not a valid custom element name`);
    }

    let registry = registryMap.get(this);
    if (registry == null) {
      registry = new Map();
      registryMap.set(this, registry);
    }
    registry.set(tagName, { cstr, options });

    const whenDefinedResolves = whenDefinedResolvesMap.get(this);
    if (whenDefinedResolves != null) {
      const whenDefinedResolveFns = whenDefinedResolves.get(tagName);
      if (whenDefinedResolveFns != null) {
        whenDefinedResolveFns.forEach(whenDefinedResolveFn => {
          whenDefinedResolveFn();
        });
        whenDefinedResolveFns.length = 0;
        whenDefinedResolves.delete(tagName);
      }
    }

    if (this.win.document != null) {
      const hosts = this.win.document.querySelectorAll(tagName);
      hosts.forEach(host => {
        if (upgradedElements.has(host) === false) {
          tempDisableCallbacks.add(this.win.document);

          const upgradedCmp = creatCustomElement(this, this.win.document, tagName) as MockNode;

          for (let i = 0; i < host.childNodes.length; i++) {
            const childNode = host.childNodes[i];
            childNode.remove();
            upgradedCmp.appendChild(childNode as any);
          }

          tempDisableCallbacks.delete(this.win.document);

          if (proxyElements.has(host) === true) {
            proxyElements.set(host, upgradedCmp);
          }
        }

        fireConnectedCallback(host);
      });
    }
  }

  get(tagName: string) {
    const registry = registryMap.get(this);
    if (registry != null) {
      const def = registry.get(tagName.toLowerCase());
      if (def != null) {
        return def.cstr;
      }
    }
    return undefined;
  }

  upgrade(_rootNode: any) {
    //
  }

  whenDefined(tagName: string) {
    tagName = tagName.toLowerCase();

    const registry = registryMap.get(this);
    if (registry != null && registry.has(tagName) === true) {
      return Promise.resolve();
    }

    return new Promise<void>(resolve => {
      let whenDefinedResolves = whenDefinedResolvesMap.get(this);
      if (whenDefinedResolves == null) {
        whenDefinedResolves = new Map();
        whenDefinedResolvesMap.set(this, whenDefinedResolves);
      }

      let whenDefinedResolveFns = whenDefinedResolves.get(tagName);
      if (whenDefinedResolveFns == null) {
        whenDefinedResolveFns = [];
        whenDefinedResolves.set(tagName, whenDefinedResolveFns);
      }

      whenDefinedResolveFns.push(resolve);
    });
  }
}


export function resetCustomElementRegistry(customElements: CustomElementRegistry) {
  if (customElements != null) {
    const registry = registryMap.get(customElements as any);
    if (registry != null) {
      registry.clear();
    }

    const whenDefinedResolves = whenDefinedResolvesMap.get(customElements as any);
    if (whenDefinedResolves != null) {
      whenDefinedResolves.clear();
    }
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
    has(obj: any, prop: string) {
      if (prop in obj) {
        return true;
      }
      if (prop in instance) {
        return true;
      }
      return false;
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
    if (node.nodeName.includes('-') === true) {
      if (typeof (node as any).connectedCallback === 'function' && node.isConnected) {
        fireConnectedCallback(node);
      }

      const shadowRoot = ((node as any) as Element).shadowRoot;
      if (shadowRoot != null) {
        shadowRoot.childNodes.forEach(childNode => {
          connectNode(ownerDocument, childNode as any);
        });
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
    if (tempDisableCallbacks.has(node.ownerDocument) === false) {
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
    if (node.nodeName.includes('-') === true && typeof (node as any).disconnectedCallback === 'function') {
      if (tempDisableCallbacks.has(node.ownerDocument) === false) {
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
  attrName = attrName.toLowerCase();

  const observedAttributes = (node as any).constructor.observedAttributes as string[];
  if (Array.isArray(observedAttributes) === true && observedAttributes.some(obs => obs.toLowerCase() === attrName) === true) {
    try {
      (node as any).attributeChangedCallback(attrName, oldValue, newValue);
    } catch (e) {
      console.error(e);
    }
  }
}

export function checkAttributeChanged(node: MockNode) {
  return (node.nodeName.includes('-') === true && typeof (node as any).attributeChangedCallback === 'function');
}

const tempDisableCallbacks = new Set();
