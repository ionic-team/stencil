import { MockHTMLElement } from './node';
export class MockCustomElementRegistry {
    constructor(win) {
        this.win = win;
    }
    define(tagName, cstr, options) {
        if (tagName.toLowerCase() !== tagName) {
            throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': "${tagName}" is not a valid custom element name`);
        }
        if (this.__registry == null) {
            this.__registry = new Map();
        }
        this.__registry.set(tagName, { cstr, options });
        if (this.__whenDefined != null) {
            const whenDefinedResolveFns = this.__whenDefined.get(tagName);
            if (whenDefinedResolveFns != null) {
                whenDefinedResolveFns.forEach((whenDefinedResolveFn) => {
                    whenDefinedResolveFn();
                });
                whenDefinedResolveFns.length = 0;
                this.__whenDefined.delete(tagName);
            }
        }
        const doc = this.win.document;
        if (doc != null) {
            const hosts = doc.querySelectorAll(tagName);
            hosts.forEach((host) => {
                if (upgradedElements.has(host) === false) {
                    tempDisableCallbacks.add(doc);
                    const upgradedCmp = createCustomElement(this, doc, tagName);
                    for (let i = 0; i < host.childNodes.length; i++) {
                        const childNode = host.childNodes[i];
                        childNode.remove();
                        upgradedCmp.appendChild(childNode);
                    }
                    tempDisableCallbacks.delete(doc);
                    if (proxyElements.has(host)) {
                        proxyElements.set(host, upgradedCmp);
                    }
                }
                fireConnectedCallback(host);
            });
        }
    }
    get(tagName) {
        if (this.__registry != null) {
            const def = this.__registry.get(tagName.toLowerCase());
            if (def != null) {
                return def.cstr;
            }
        }
        return undefined;
    }
    upgrade(_rootNode) {
        //
    }
    clear() {
        if (this.__registry != null) {
            this.__registry.clear();
        }
        if (this.__whenDefined != null) {
            this.__whenDefined.clear();
        }
    }
    whenDefined(tagName) {
        tagName = tagName.toLowerCase();
        if (this.__registry != null && this.__registry.has(tagName) === true) {
            return Promise.resolve(this.__registry.get(tagName).cstr);
        }
        return new Promise((resolve) => {
            if (this.__whenDefined == null) {
                this.__whenDefined = new Map();
            }
            let whenDefinedResolveFns = this.__whenDefined.get(tagName);
            if (whenDefinedResolveFns == null) {
                whenDefinedResolveFns = [];
                this.__whenDefined.set(tagName, whenDefinedResolveFns);
            }
            whenDefinedResolveFns.push(resolve);
        });
    }
}
export function createCustomElement(customElements, ownerDocument, tagName) {
    const Cstr = customElements.get(tagName);
    if (Cstr != null) {
        const cmp = new Cstr(ownerDocument);
        cmp.nodeName = tagName.toUpperCase();
        upgradedElements.add(cmp);
        return cmp;
    }
    const host = new Proxy({}, {
        get(obj, prop) {
            const elm = proxyElements.get(host);
            if (elm != null) {
                return elm[prop];
            }
            return obj[prop];
        },
        set(obj, prop, val) {
            const elm = proxyElements.get(host);
            if (elm != null) {
                elm[prop] = val;
            }
            else {
                obj[prop] = val;
            }
            return true;
        },
        has(obj, prop) {
            const elm = proxyElements.get(host);
            if (prop in elm) {
                return true;
            }
            if (prop in obj) {
                return true;
            }
            return false;
        },
    });
    const elm = new MockHTMLElement(ownerDocument, tagName);
    proxyElements.set(host, elm);
    return host;
}
const proxyElements = new WeakMap();
const upgradedElements = new WeakSet();
export function connectNode(ownerDocument, node) {
    node.ownerDocument = ownerDocument;
    if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
        if (ownerDocument != null && node.nodeName.includes('-')) {
            const win = ownerDocument.defaultView;
            if (win != null && typeof node.connectedCallback === 'function' && node.isConnected) {
                fireConnectedCallback(node);
            }
            const shadowRoot = node.shadowRoot;
            if (shadowRoot != null) {
                shadowRoot.childNodes.forEach((childNode) => {
                    connectNode(ownerDocument, childNode);
                });
            }
        }
        node.childNodes.forEach((childNode) => {
            connectNode(ownerDocument, childNode);
        });
    }
    else {
        node.childNodes.forEach((childNode) => {
            childNode.ownerDocument = ownerDocument;
        });
    }
}
function fireConnectedCallback(node) {
    if (typeof node.connectedCallback === 'function') {
        if (tempDisableCallbacks.has(node.ownerDocument) === false) {
            try {
                node.connectedCallback();
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}
export function disconnectNode(node) {
    if (node.nodeType === 1 /* NODE_TYPES.ELEMENT_NODE */) {
        if (node.nodeName.includes('-') === true && typeof node.disconnectedCallback === 'function') {
            if (tempDisableCallbacks.has(node.ownerDocument) === false) {
                try {
                    node.disconnectedCallback();
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        node.childNodes.forEach(disconnectNode);
    }
}
export function attributeChanged(node, attrName, oldValue, newValue) {
    attrName = attrName.toLowerCase();
    const observedAttributes = node.constructor.observedAttributes;
    if (Array.isArray(observedAttributes) === true &&
        observedAttributes.some((obs) => obs.toLowerCase() === attrName) === true) {
        try {
            node.attributeChangedCallback(attrName, oldValue, newValue);
        }
        catch (e) {
            console.error(e);
        }
    }
}
export function checkAttributeChanged(node) {
    return node.nodeName.includes('-') === true && typeof node.attributeChangedCallback === 'function';
}
const tempDisableCallbacks = new Set();
//# sourceMappingURL=custom-element-registry.js.map