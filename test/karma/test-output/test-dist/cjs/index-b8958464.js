'use strict';

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

const NAMESPACE = 'testapp';

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */
let scopeId;
let contentRef;
let hostTagName;
let useNativeShadowDom = false;
let checkSlotFallbackVisibility = false;
let checkSlotRelocate = false;
let isSvgMode = false;
let queuePending = false;
const Build = {
    isDev: false,
    isBrowser: true,
    isServer: false,
    isTesting: false,
};
const createTime = (fnName, tagName = '') => {
    {
        return () => {
            return;
        };
    }
};
const uniqueTime = (key, measureText) => {
    {
        return () => {
            return;
        };
    }
};
const ORG_LOCATION_ID = 'o';
const HYDRATED_CSS = '{visibility:hidden}.hydrated{visibility:inherit}';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
/**
 * Default style mode id
 */
/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
const EMPTY_OBJ = {};
/**
 * Namespaces
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const HTML_NS = 'http://www.w3.org/1999/xhtml';
const isDef = (v) => v != null;
const isComplexType = (o) => {
    // https://jsperf.com/typeof-fn-object/5
    o = typeof o;
    return o === 'object' || o === 'function';
};
/**
 * Helper method for querying a `meta` tag that contains a nonce value
 * out of a DOM's head.
 *
 * @param doc The DOM containing the `head` to query against
 * @returns The content of the meta tag representing the nonce value, or `undefined` if no tag
 * exists or the tag has no content.
 */
function queryNonceMetaTagContent(doc) {
    var _a, _b, _c;
    return (_c = (_b = (_a = doc.head) === null || _a === void 0 ? void 0 : _a.querySelector('meta[name="csp-nonce"]')) === null || _b === void 0 ? void 0 : _b.getAttribute('content')) !== null && _c !== void 0 ? _c : undefined;
}
/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
const h = (nodeName, vnodeData, ...children) => {
    let child = null;
    let key = null;
    let slotName = null;
    let simple = false;
    let lastSimple = false;
    const vNodeChildren = [];
    const walk = (c) => {
        for (let i = 0; i < c.length; i++) {
            child = c[i];
            if (Array.isArray(child)) {
                walk(child);
            }
            else if (child != null && typeof child !== 'boolean') {
                if ((simple = typeof nodeName !== 'function' && !isComplexType(child))) {
                    child = String(child);
                }
                if (simple && lastSimple) {
                    // If the previous child was simple (string), we merge both
                    vNodeChildren[vNodeChildren.length - 1].$text$ += child;
                }
                else {
                    // Append a new vNode, if it's text, we create a text vNode
                    vNodeChildren.push(simple ? newVNode(null, child) : child);
                }
                lastSimple = simple;
            }
        }
    };
    walk(children);
    if (vnodeData) {
        // normalize class / classname attributes
        if (vnodeData.key) {
            key = vnodeData.key;
        }
        if (vnodeData.name) {
            slotName = vnodeData.name;
        }
        {
            const classData = vnodeData.className || vnodeData.class;
            if (classData) {
                vnodeData.class =
                    typeof classData !== 'object'
                        ? classData
                        : Object.keys(classData)
                            .filter((k) => classData[k])
                            .join(' ');
            }
        }
    }
    if (typeof nodeName === 'function') {
        // nodeName is a functional component
        return nodeName(vnodeData === null ? {} : vnodeData, vNodeChildren, vdomFnUtils);
    }
    const vnode = newVNode(nodeName, null);
    vnode.$attrs$ = vnodeData;
    if (vNodeChildren.length > 0) {
        vnode.$children$ = vNodeChildren;
    }
    {
        vnode.$key$ = key;
    }
    {
        vnode.$name$ = slotName;
    }
    return vnode;
};
const newVNode = (tag, text) => {
    const vnode = {
        $flags$: 0,
        $tag$: tag,
        $text$: text,
        $elm$: null,
        $children$: null,
    };
    {
        vnode.$attrs$ = null;
    }
    {
        vnode.$key$ = null;
    }
    {
        vnode.$name$ = null;
    }
    return vnode;
};
const Host = {};
const isHost = (node) => node && node.$tag$ === Host;
/**
 * Implementation of {@link d.FunctionalUtilities} for Stencil's VDom.
 *
 * Note that these functions convert from {@link d.VNode} to
 * {@link d.ChildNode} to give functional component developers a friendly
 * interface.
 */
const vdomFnUtils = {
    forEach: (children, cb) => children.map(convertToPublic).forEach(cb),
    map: (children, cb) => children.map(convertToPublic).map(cb).map(convertToPrivate),
};
const convertToPublic = (node) => ({
    vattrs: node.$attrs$,
    vchildren: node.$children$,
    vkey: node.$key$,
    vname: node.$name$,
    vtag: node.$tag$,
    vtext: node.$text$,
});
const convertToPrivate = (node) => {
    if (typeof node.vtag === 'function') {
        const vnodeData = Object.assign({}, node.vattrs);
        if (node.vkey) {
            vnodeData.key = node.vkey;
        }
        if (node.vname) {
            vnodeData.name = node.vname;
        }
        return h(node.vtag, vnodeData, ...(node.vchildren || []));
    }
    const vnode = newVNode(node.vtag, node.vtext);
    vnode.$attrs$ = node.vattrs;
    vnode.$children$ = node.vchildren;
    vnode.$key$ = node.vkey;
    vnode.$name$ = node.vname;
    return vnode;
};
/**
 * Show or hide a slot nodes children
 * @param slotNode a slot node, the 'children' of which should be shown or hidden
 * @param hide whether to hide the slot node 'children'
 * @returns
 */
const renderSlotFallbackContent = (slotNode, hide) => {
    // if this slot doesn't have fallback content, return
    if (!slotNode['s-hsf'] || !slotNode.parentNode)
        return;
    // in non-shadow component, slot nodes are just empty text nodes or comment nodes
    // the 'children' nodes are therefore placed next to it.
    // let's loop through those now
    let childNodes = (slotNode.parentNode.__childNodes ||
        slotNode.parentNode.childNodes);
    let childNode;
    const childNodesLen = childNodes.length;
    let i = 0;
    for (i; i < childNodesLen; i++) {
        childNode = childNodes[i];
        if (childNode['s-sr'] && hide && childNode['s-psn'] === slotNode['s-sn']) {
            // if this child node is a nested slot
            // drill into it's children to hide them in-turn
            renderSlotFallbackContent(childNode, true);
            continue;
        }
        // this child node doesn't relate to this slot?
        if (childNode['s-sn'] !== slotNode['s-sn'])
            continue;
        if (childNode.nodeType === 1 /* NODE_TYPE.ElementNode */ && childNode['s-sf']) {
            // we found an fallback element. Hide or show
            childNode.hidden = hide;
            childNode.style.display = hide ? 'none' : '';
        }
        else if (!!childNode['s-sfc']) {
            // this child has fallback text. Add or remove it
            if (hide) {
                childNode['s-sfc'] = childNode.textContent || undefined;
                childNode.textContent = '';
            }
            else if (!childNode.textContent || childNode.textContent.trim() === '') {
                childNode.textContent = childNode['s-sfc'];
            }
        }
    }
};
/**
 * Function applied to non-shadow component nodes to mimic native shadowDom behaviour:
 * - When slotted node/s are not present, show `<slot>` node children
 * - When slotted node/s *are* present, hide `<slot>` node children
 * @param node an entry whose children to iterate over
 */
const updateFallbackSlotVisibility = (node) => {
    if (!node)
        return;
    const childNodes = node.__childNodes || node.childNodes;
    let slotNode;
    let i;
    let ilen;
    let j;
    let slotNameAttr;
    let nodeType;
    for (i = 0, ilen = childNodes.length; i < ilen; i++) {
        // slot reference node?
        if (childNodes[i]['s-sr']) {
            // this component uses slots and we're on a slot node
            // let's find all it's slotted children or lack thereof
            // and show or hide fallback nodes (`<slot />` children)
            // get the slot name for this slot reference node
            slotNameAttr = childNodes[i]['s-sn'];
            slotNode = childNodes[i];
            // by default always show a fallback slot node
            // then hide it if there are other slotted nodes in the light dom
            renderSlotFallbackContent(slotNode, false);
            // because we found a slot fallback node let's loop over all
            // the children again to
            for (j = 0; j < ilen; j++) {
                nodeType = childNodes[j].nodeType;
                // ignore slot fallback nodes
                if (childNodes[j]['s-sf'])
                    continue;
                // is sibling node is from a different component OR is a named fallback slot node?
                if (childNodes[j]['s-hn'] !== slotNode['s-hn'] || slotNameAttr !== '') {
                    // you can't slot a textNode in a named slot
                    if (nodeType === 1 /* NODE_TYPE.ElementNode */ && slotNameAttr === childNodes[j]['s-sn']) {
                        // we found a slotted element!
                        // let's hide all the fallback nodes
                        renderSlotFallbackContent(slotNode, true);
                        // patches this node's removal methods
                        // so if it gets removed in the future
                        // re-asses the fallback node status
                        patchRemove(childNodes[j]);
                        break;
                    }
                }
                else if (childNodes[j]['s-sn'] === slotNameAttr) {
                    // this is a default fallback slot node
                    // any element or text node (with content)
                    // should hide the default fallback slot node
                    if (nodeType === 1 /* NODE_TYPE.ElementNode */ ||
                        (nodeType === 3 /* NODE_TYPE.TextNode */ &&
                            childNodes[j] &&
                            childNodes[j].textContent &&
                            childNodes[j].textContent.trim() !== '')) {
                        // we found a slotted something
                        // let's hide all the fallback nodes
                        renderSlotFallbackContent(slotNode, true);
                        // patches this node's removal methods
                        // so if it gets removed in the future
                        // re-asses the fallback node status
                        patchRemove(childNodes[j]);
                        break;
                    }
                }
            }
        }
        // keep drilling down
        updateFallbackSlotVisibility(childNodes[i]);
    }
};
const patchPseudoShadowDom = (HostElementPrototype, DescriptorPrototype) => {
    patchChildNodes(HostElementPrototype, DescriptorPrototype);
    patchInsertBefore(HostElementPrototype);
    patchAppendChild(HostElementPrototype);
    patchAppend(HostElementPrototype);
    patchPrepend(HostElementPrototype);
    patchInsertAdjacentHTML(HostElementPrototype);
    patchInsertAdjacentText(HostElementPrototype);
    patchInsertAdjacentElement(HostElementPrototype);
    patchReplaceChildren(HostElementPrototype);
    patchInnerHTML(HostElementPrototype, DescriptorPrototype);
    patchInnerText(HostElementPrototype, DescriptorPrototype);
    patchTextContent(HostElementPrototype, DescriptorPrototype);
};
////// non-shadow host component patches
/**
 * Patch `cloneNode()` for non-shadow components ()
 * @param HostElementPrototype the host prototype to polyfill
 */
const patchCloneNode = (HostElementPrototype) => {
    HostElementPrototype.__cloneNode = HostElementPrototype.cloneNode;
    HostElementPrototype.cloneNode = function (deep) {
        const srcNode = this;
        const clonedNode = HostElementPrototype.__cloneNode.call(srcNode, false);
        if (deep) {
            let i = 0;
            let slotted, nonStencilNode;
            const stencilPrivates = [
                's-id',
                's-cr',
                's-lr',
                's-rc',
                's-sc',
                's-p',
                's-cn',
                's-sr',
                's-sn',
                's-hn',
                's-ol',
                's-nr',
                's-si',
                's-sf',
                's-sfc',
                's-hsf',
            ];
            for (; i < srcNode.__childNodes.length; i++) {
                slotted = srcNode.__childNodes[i]['s-nr'];
                nonStencilNode = stencilPrivates.every((privateField) => !srcNode.__childNodes[i][privateField]);
                if (slotted) {
                    clonedNode.__appendChild(slotted.cloneNode(true));
                }
                if (nonStencilNode) {
                    clonedNode.__appendChild(srcNode.__childNodes[i].cloneNode(true));
                }
            }
        }
        return clonedNode;
    };
};
/**
 * Patches children accessors of a non-shadow component.
 * (`childNodes`, `children`, `firstChild`, `lastChild` and `childElementCount`)
 * @param HostElementPrototype
 */
const patchChildNodes = (HostElementPrototype, DescriptorPrototype) => {
    if (!globalThis.Node)
        return;
    class FakeNodeList extends Array {
        item(n) {
            return this[n];
        }
    }
    let childNodesDesc = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'childNodes');
    if (!childNodesDesc) {
        childNodesDesc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Node.prototype), 'childNodes');
    }
    if (childNodesDesc)
        Object.defineProperty(HostElementPrototype, '__childNodes', childNodesDesc);
    let childrenDesc = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'children');
    // MockNode won't have these
    if (childrenDesc)
        Object.defineProperty(HostElementPrototype, '__children', childrenDesc);
    const childElementCountDesc = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'childElementCount');
    if (childElementCountDesc)
        Object.defineProperty(HostElementPrototype, '__childElementCount', childElementCountDesc);
    Object.defineProperty(HostElementPrototype, 'children', {
        get() {
            return this.childNodes
                .map((n) => {
                if (n.nodeType === 1 /* NODE_TYPE.ElementNode */)
                    return n;
                else
                    return null;
            })
                .filter((n) => !!n);
        },
    });
    Object.defineProperty(HostElementPrototype, 'firstChild', {
        get() {
            return this.childNodes[0];
        },
    });
    Object.defineProperty(HostElementPrototype, 'lastChild', {
        get() {
            return this.childNodes[this.childNodes.length - 1];
        },
    });
    Object.defineProperty(HostElementPrototype, 'childElementCount', {
        get() {
            return HostElementPrototype.children.length;
        },
    });
    if (!childNodesDesc)
        return;
    Object.defineProperty(HostElementPrototype, 'childNodes', {
        get() {
            const childNodes = this.__childNodes;
            const result = new FakeNodeList();
            for (let i = 0; i < childNodes.length; i++) {
                const slottedNode = childNodes[i]['s-nr'];
                if (slottedNode &&
                    (slottedNode.nodeType !== 8 /* NODE_TYPE.CommentNode */ || slottedNode.nodeValue.indexOf(ORG_LOCATION_ID + '.') !== 0)) {
                    result.push(slottedNode);
                }
            }
            return result;
        },
    });
};
/**
 * Patches the inner html accessors of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInnerHTML = (HostElementPrototype, DescriptorPrototype) => {
    if (!globalThis.Element)
        return;
    let descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'innerHTML');
    // on IE it's on HTMLElement.prototype
    if (!descriptor)
        descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML');
    // MockNode won't have these
    if (descriptor)
        Object.defineProperty(HostElementPrototype, '__innerHTML', descriptor);
    Object.defineProperty(HostElementPrototype, 'innerHTML', {
        get: function () {
            let html = '';
            this.childNodes.forEach((node) => (html += node.outerHTML || node.textContent));
            return html;
        },
        set: function (value) {
            this.childNodes.forEach((node) => {
                if (node['s-ol']) {
                    try {
                        node['s-ol'].remove();
                    }
                    catch (e) { }
                }
                node.remove();
            });
            this.insertAdjacentHTML('beforeend', value);
        },
    });
};
/**
 * Patches the inner text accessors of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInnerText = (HostElementPrototype, DescriptorPrototype) => {
    if (!globalThis.Element)
        return;
    let descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'innerText');
    // on IE it's on HTMLElement.prototype
    if (!descriptor)
        descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');
    // MockNode won't have these
    if (descriptor)
        Object.defineProperty(HostElementPrototype, '__innerText', descriptor);
    Object.defineProperty(HostElementPrototype, 'innerText', {
        get: function () {
            let text = '';
            this.childNodes.forEach((node) => {
                if (node.innerText)
                    text += node.innerText;
                else if (node.textContent)
                    text += node.textContent.trimEnd();
            });
            return text;
        },
        set: function (value) {
            this.childNodes.forEach((node) => {
                if (node['s-ol'])
                    node['s-ol'].remove();
                node.remove();
            });
            this.insertAdjacentHTML('beforeend', value);
        },
    });
};
/**
 * Patches the text content accessors of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchTextContent = (HostElementPrototype, DescriptorPrototype) => {
    if (!globalThis.Node)
        return;
    const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'textContent');
    // MockNode won't have these
    if (descriptor)
        Object.defineProperty(HostElementPrototype, '__textContent', descriptor);
    Object.defineProperty(HostElementPrototype, 'textContent', {
        get: function () {
            let text = '';
            this.childNodes.forEach((node) => (text += node.textContent || ''));
            return text;
        },
        set: function (value) {
            this.childNodes.forEach((node) => {
                if (node['s-ol'])
                    node['s-ol'].remove();
                node.remove();
            });
            this.insertAdjacentHTML('beforeend', value);
        },
    });
};
/**
 * Patches the `insertBefore` of a non-shadow component.
 * The problem solved being that the 'current' node to insert before may not be in the root of our component.
 * This tries to find where the 'current' node lives within the component and insert the new node before it
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertBefore = (HostElementPrototype) => {
    if (HostElementPrototype.__insertBefore)
        return;
    HostElementPrototype.__insertBefore = HostElementPrototype.insertBefore;
    HostElementPrototype.insertBefore = function (newChild, curChild) {
        const slotName = (newChild['s-sn'] = getSlotName(newChild));
        const slotNode = getHostSlotNode(this.__childNodes, slotName);
        if (slotNode) {
            let found = false;
            this.childNodes.forEach((childNode) => {
                // we found the node in our list of other 'lightDOM' / slotted nodes
                if (childNode === curChild || curChild === null) {
                    found = true;
                    addSlotRelocateNode(newChild, slotNode);
                    if (curChild === null) {
                        this.__append(newChild);
                        return;
                    }
                    if (slotName === curChild['s-sn']) {
                        // current child ('slot before' node) is 'in' the same slot
                        const insertBefore = curChild.parentNode.__insertBefore || curChild.parentNode.insertBefore;
                        insertBefore.call(curChild.parentNode, newChild, curChild);
                        patchRemove(newChild);
                    }
                    else {
                        // current child is not in the same slot as 'slot before' node
                        // so just toss the node in wherever
                        this.__append(newChild);
                    }
                    return;
                }
            });
            if (found) {
                return newChild;
            }
        }
        return this.__insertBefore(newChild, curChild);
    };
};
/**
 * Patches the `appendChild` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchAppendChild = (HostElementPrototype) => {
    if (HostElementPrototype.__appendChild)
        return;
    HostElementPrototype.__appendChild = HostElementPrototype.appendChild;
    HostElementPrototype.appendChild = function (newChild) {
        const slotName = (newChild['s-sn'] = getSlotName(newChild));
        const slotNode = getHostSlotNode(this.__childNodes || this.childNodes, slotName);
        if (slotNode) {
            addSlotRelocateNode(newChild, slotNode);
            const slotChildNodes = getHostSlotChildNodes(slotNode);
            const appendAfter = slotChildNodes[slotChildNodes.length - 1];
            if (appendAfter.parentNode) {
                const parent = appendAfter.parentNode;
                parent.__insertBefore
                    ? parent.__insertBefore(newChild, appendAfter.nextSibling)
                    : parent.insertBefore(newChild, appendAfter.nextSibling);
                patchRemove(newChild);
            }
            if (slotNode['s-hsf']) {
                updateFallbackSlotVisibility(slotNode.parentNode);
            }
            return newChild;
        }
        if (newChild.nodeType === 1 /* NODE_TYPE.ElementNode */ && !!newChild.getAttribute('slot') && this.__childNodes)
            newChild.hidden = true;
        return this.__appendChild(newChild);
    };
};
/**
 * Patches the `prepend` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchPrepend = (HostElementPrototype) => {
    if (HostElementPrototype.__prepend)
        return;
    HostElementPrototype.__prepend = HostElementPrototype.prepend;
    HostElementPrototype.prepend = function (...newChildren) {
        newChildren.forEach((newChild) => {
            if (typeof newChild === 'string') {
                newChild = this.ownerDocument.createTextNode(newChild);
            }
            const slotName = (newChild['s-sn'] = getSlotName(newChild));
            const slotNode = getHostSlotNode(this.__childNodes, slotName);
            if (slotNode) {
                addSlotRelocateNode(newChild, slotNode);
                const slotChildNodes = getHostSlotChildNodes(slotNode);
                const appendAfter = slotChildNodes[0];
                if (appendAfter.parentNode) {
                    appendAfter.parentNode.insertBefore(newChild, appendAfter.nextSibling);
                    patchRemove(newChild);
                }
                if (slotNode['s-hsf']) {
                    updateFallbackSlotVisibility(slotNode.parentNode);
                }
                return;
            }
            if (newChild.nodeType === 1 /* NODE_TYPE.ElementNode */ && !!newChild.getAttribute('slot') && this.__childNodes)
                newChild.hidden = true;
            return this.__prepend(newChild);
        });
    };
};
/**
 * Patches the `append` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchAppend = (HostElementPrototype) => {
    if (HostElementPrototype.__append)
        return;
    HostElementPrototype.__append = HostElementPrototype.append;
    HostElementPrototype.append = function (...newChildren) {
        newChildren.forEach((newChild) => {
            if (typeof newChild === 'string') {
                newChild = this.ownerDocument.createTextNode(newChild);
            }
            this.appendChild(newChild);
        });
    };
};
/**
 * Patches the `replaceChildren` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchReplaceChildren = (HostElementPrototype) => {
    if (HostElementPrototype.__replaceChildren)
        return;
    HostElementPrototype.__replaceChildren = HostElementPrototype.replaceChildren;
    HostElementPrototype.replaceChildren = function (...newChildren) {
        const slotNode = getHostSlotNode(this.__childNodes, '');
        if (slotNode) {
            const slotChildNodes = getHostSlotChildNodes(slotNode);
            slotChildNodes.forEach((node) => {
                if (!node['s-sr']) {
                    node.remove();
                }
            });
            this.append(...newChildren);
        }
    };
};
/**
 * Patches the `insertAdjacentHTML` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertAdjacentHTML = (HostElementPrototype) => {
    if (HostElementPrototype.__insertAdjacentHTML)
        return;
    HostElementPrototype.__insertAdjacentHTML = HostElementPrototype.insertAdjacentHTML;
    HostElementPrototype.insertAdjacentHTML = function (position, text) {
        if (position !== 'afterbegin' && position !== 'beforeend') {
            return this.__insertAdjacentHTML(position, text);
        }
        const container = this.ownerDocument.createElement('_');
        let node;
        container.innerHTML = text;
        if (position === 'afterbegin') {
            while ((node = container.firstChild)) {
                this.prepend(node);
            }
        }
        else if (position === 'beforeend') {
            while ((node = container.firstChild)) {
                this.append(node);
            }
        }
    };
};
/**
 * Patches the `insertAdjacentText` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertAdjacentText = (HostElementPrototype) => {
    if (HostElementPrototype.__insertAdjacentText)
        return;
    HostElementPrototype.__insertAdjacentText = HostElementPrototype.insertAdjacentText;
    HostElementPrototype.insertAdjacentText = function (position, text) {
        this.insertAdjacentHTML(position, text);
    };
};
/**
 * Patches the `insertAdjacentElement` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertAdjacentElement = (HostElementPrototype) => {
    if (HostElementPrototype.__insertAdjacentElement)
        return;
    HostElementPrototype.__insertAdjacentElement = HostElementPrototype.insertAdjacentElement;
    HostElementPrototype.insertAdjacentElement = function (position, element) {
        if (position !== 'afterbegin' && position !== 'beforeend') {
            return this.__insertAdjacentElement(position, element);
        }
        if (position === 'afterbegin') {
            this.prepend(element);
        }
        else if (position === 'beforeend') {
            this.append(element);
        }
    };
};
/**
 * Patches the `remove` method of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
const patchRemove = (NodePrototype) => {
    if (!NodePrototype || NodePrototype.__remove)
        return;
    NodePrototype.__remove = NodePrototype.remove || true;
    patchRemoveChild(NodePrototype.parentNode);
    NodePrototype.remove = function () {
        if (this.parentNode) {
            return this.parentNode.removeChild(this);
        }
        return this.__remove();
    };
};
/**
 * Patches the `removeChild` method of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
const patchRemoveChild = (ElementPrototype) => {
    if (!ElementPrototype || ElementPrototype.__removeChild)
        return;
    ElementPrototype.__removeChild = ElementPrototype.removeChild;
    ElementPrototype.removeChild = function (toRemove) {
        if (toRemove && typeof toRemove['s-sn'] !== 'undefined') {
            const slotNode = getHostSlotNode(this.__childNodes || this.childNodes, toRemove['s-sn']);
            toRemove.parentElement.__removeChild(toRemove);
            if (slotNode && slotNode['s-hsf']) {
                updateFallbackSlotVisibility(slotNode.parentElement);
            }
            return;
        }
        return this.__removeChild(toRemove);
    };
};
////// Utils
/**
 * Creates an empty text node to act as a forwarding address to a slotted node:
 * 1) When non-shadow components re-render, they need a place to temporarily put 'lightDOM' elements.
 * 2) Patched dom methods and accessors use this node to calculate what 'lightDOM' nodes are in the host.
 * @param newChild - A node that's going to be added to the component
 * @param slotNode - The slot node that the node will be added to
 */
const addSlotRelocateNode = (newChild, slotNode, order) => {
    if (newChild['s-ol'] && newChild['s-ol'].isConnected)
        return;
    const slottedNodeLocation = document.createTextNode('');
    slottedNodeLocation['s-nr'] = newChild;
    if (slotNode['s-cr'] && slotNode['s-cr'].parentNode) {
        const parent = slotNode['s-cr'].parentNode;
        const appendChild = parent.__appendChild || parent.appendChild;
        if (typeof order !== 'undefined') {
            slottedNodeLocation['s-oo'] = order;
            const childNodes = (parent.__childNodes || parent.childNodes);
            const slotRelocateNodes = [slottedNodeLocation];
            childNodes.forEach((n) => {
                if (n['s-nr'])
                    slotRelocateNodes.push(n);
            });
            slotRelocateNodes.sort((a, b) => {
                if (!a['s-oo'] || a['s-oo'] < b['s-oo'])
                    return -1;
                else if (!b['s-oo'] || b['s-oo'] < a['s-oo'])
                    return 1;
                return 0;
            });
            slotRelocateNodes.forEach((n) => appendChild.call(slotNode['s-cr'].parentNode, n));
        }
        else {
            appendChild.call(slotNode['s-cr'].parentNode, slottedNodeLocation);
        }
    }
    newChild['s-ol'] = slottedNodeLocation;
};
/**
 * Find the slot name of a given node
 * @param node
 * @returns the node's slot name
 */
const getSlotName = (node) => node['s-sn'] ||
    (node.nodeType === 1 /* NODE_TYPE.ElementNode */ && node.getAttribute('slot')) ||
    node.slot ||
    '';
/**
 * Recursively searches a series of child nodes for a slot with the provided name.
 * @param childNodes the nodes to search for a slot with a specific name.
 * @param slotName the name of the slot to match on.
 * @returns a reference to the slot node that matches the provided name, `null` otherwise
 */
const getHostSlotNode = (childNodes, slotName) => {
    let i = 0;
    let childNode;
    if (!childNodes)
        return null;
    for (; i < childNodes.length; i++) {
        childNode = childNodes[i];
        if (childNode['s-sr'] && childNode['s-sn'] === slotName) {
            return childNode;
        }
        childNode = getHostSlotNode(childNode.childNodes, slotName);
        if (childNode) {
            return childNode;
        }
    }
    return null;
};
/**
 * Get all nodes currently assigned to any given slot node
 * @param slotNode - the slot node to check
 * @returns - all child node 'within' the checked slot node
 */
const getHostSlotChildNodes = (slotNode) => {
    const childNodes = [slotNode];
    const slotName = slotNode['s-sn'] || '';
    while ((slotNode = slotNode.nextSibling) && slotNode['s-sn'] === slotName) {
        childNodes.push(slotNode);
    }
    return childNodes;
};
// Private
const computeMode = (elm) => modeResolutionChain.map((h) => h(elm)).find((m) => !!m);
// Public
const setMode = (handler) => modeResolutionChain.push(handler);
const getMode = (ref) => getHostRef(ref).$modeName$;
/**
 * Parse a new property value for a given property type.
 *
 * While the prop value can reasonably be expected to be of `any` type as far as TypeScript's type checker is concerned,
 * it is not safe to assume that the string returned by evaluating `typeof propValue` matches:
 *   1. `any`, the type given to `propValue` in the function signature
 *   2. the type stored from `propType`.
 *
 * This function provides the capability to parse/coerce a property's value to potentially any other JavaScript type.
 *
 * Property values represented in TSX preserve their type information. In the example below, the number 0 is passed to
 * a component. This `propValue` will preserve its type information (`typeof propValue === 'number'`). Note that is
 * based on the type of the value being passed in, not the type declared of the class member decorated with `@Prop`.
 * ```tsx
 * <my-cmp prop-val={0}></my-cmp>
 * ```
 *
 * HTML prop values on the other hand, will always a string
 *
 * @param propValue the new value to coerce to some type
 * @param propType the type of the prop, expressed as a binary number
 * @returns the parsed/coerced value
 */
const parsePropertyValue = (propValue, propType) => {
    // ensure this value is of the correct prop type
    if (propValue != null && !isComplexType(propValue)) {
        if (propType & 4 /* MEMBER_FLAGS.Boolean */) {
            // per the HTML spec, any string value means it is a boolean true value
            // but we'll cheat here and say that the string "false" is the boolean false
            return propValue === 'false' ? false : propValue === '' || !!propValue;
        }
        if (propType & 2 /* MEMBER_FLAGS.Number */) {
            // force it to be a number
            return parseFloat(propValue);
        }
        if (propType & 1 /* MEMBER_FLAGS.String */) {
            // could have been passed as a number or boolean
            // but we still want it as a string
            return String(propValue);
        }
        // redundant return here for better minification
        return propValue;
    }
    // not sure exactly what type we want
    // so no need to change to a different type
    return propValue;
};
const getElement = (ref) => (getHostRef(ref).$hostElement$ );
const createEvent = (ref, name, flags) => {
    const elm = getElement(ref);
    return {
        emit: (detail) => {
            return emitEvent(elm, name, {
                bubbles: !!(flags & 4 /* EVENT_FLAGS.Bubbles */),
                composed: !!(flags & 2 /* EVENT_FLAGS.Composed */),
                cancelable: !!(flags & 1 /* EVENT_FLAGS.Cancellable */),
                detail,
            });
        },
    };
};
/**
 * Helper function to create & dispatch a custom Event on a provided target
 * @param elm the target of the Event
 * @param name the name to give the custom Event
 * @param opts options for configuring a custom Event
 * @returns the custom Event
 */
const emitEvent = (elm, name, opts) => {
    const ev = plt.ce(name, opts);
    elm.dispatchEvent(ev);
    return ev;
};
const rootAppliedStyles = /*@__PURE__*/ new WeakMap();
const registerStyle = (scopeId, cssText, allowCS) => {
    let style = styles.get(scopeId);
    if (supportsConstructableStylesheets && allowCS) {
        style = (style || new CSSStyleSheet());
        if (typeof style === 'string') {
            style = cssText;
        }
        else {
            style.replaceSync(cssText);
        }
    }
    else {
        style = cssText;
    }
    styles.set(scopeId, style);
};
const addStyle = (styleContainerNode, cmpMeta, mode, hostElm) => {
    var _a;
    let scopeId = getScopeId(cmpMeta, mode);
    const style = styles.get(scopeId);
    // if an element is NOT connected then getRootNode() will return the wrong root node
    // so the fallback is to always use the document for the root node in those cases
    styleContainerNode = styleContainerNode.nodeType === 11 /* NODE_TYPE.DocumentFragment */ ? styleContainerNode : doc;
    if (style) {
        if (typeof style === 'string') {
            styleContainerNode = styleContainerNode.head || styleContainerNode;
            let appliedStyles = rootAppliedStyles.get(styleContainerNode);
            let styleElm;
            if (!appliedStyles) {
                rootAppliedStyles.set(styleContainerNode, (appliedStyles = new Set()));
            }
            if (!appliedStyles.has(scopeId)) {
                {
                    if (plt.$cssShim$) {
                        styleElm = plt.$cssShim$.createHostStyle(hostElm, scopeId, style, !!(cmpMeta.$flags$ & 10 /* CMP_FLAGS.needsScopedEncapsulation */));
                        const newScopeId = styleElm['s-sc'];
                        if (newScopeId) {
                            scopeId = newScopeId;
                            // we don't want to add this styleID to the appliedStyles Set
                            // since the cssVarShim might need to apply several different
                            // stylesheets for the same component
                            appliedStyles = null;
                        }
                    }
                    else {
                        styleElm = doc.createElement('style');
                        styleElm.innerHTML = style;
                    }
                    // Apply CSP nonce to the style tag if it exists
                    const nonce = (_a = plt.$nonce$) !== null && _a !== void 0 ? _a : queryNonceMetaTagContent(doc);
                    if (nonce != null) {
                        styleElm.setAttribute('nonce', nonce);
                    }
                    styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
                }
                if (appliedStyles) {
                    appliedStyles.add(scopeId);
                }
            }
        }
        else if (!styleContainerNode.adoptedStyleSheets.includes(style)) {
            styleContainerNode.adoptedStyleSheets = [...styleContainerNode.adoptedStyleSheets, style];
        }
    }
    return scopeId;
};
const attachStyles = (hostRef) => {
    const cmpMeta = hostRef.$cmpMeta$;
    const elm = hostRef.$hostElement$;
    const flags = cmpMeta.$flags$;
    const endAttachStyles = createTime('attachStyles', cmpMeta.$tagName$);
    const scopeId = addStyle(supportsShadow && elm.shadowRoot ? elm.shadowRoot : elm.getRootNode(), cmpMeta, hostRef.$modeName$, elm);
    if (flags & 10 /* CMP_FLAGS.needsScopedEncapsulation */) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        // DOM WRITE!!
        elm['s-sc'] = scopeId;
        elm.classList.add(scopeId + '-h');
        if (flags & 2 /* CMP_FLAGS.scopedCssEncapsulation */) {
            elm.classList.add(scopeId + '-s');
        }
    }
    endAttachStyles();
};
const getScopeId = (cmp, mode) => 'sc-' + (mode && cmp.$flags$ & 32 /* CMP_FLAGS.hasMode */ ? cmp.$tagName$ + '-' + mode : cmp.$tagName$);
/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
const setAccessor = (elm, memberName, oldValue, newValue, isSvg, flags) => {
    if (oldValue !== newValue) {
        let isProp = isMemberInElement(elm, memberName);
        let ln = memberName.toLowerCase();
        if (memberName === 'class') {
            const classList = elm.classList;
            const oldClasses = parseClassList(oldValue);
            const newClasses = parseClassList(newValue);
            // for `scoped: true` components, new nodes after initial hydration
            // from SSR don't have the slotted class added. Let's add that now
            if (elm['s-si'] && newClasses.indexOf(elm['s-si']) < 0) {
                newClasses.push(elm['s-si']);
            }
            classList.remove(...oldClasses.filter((c) => c && !newClasses.includes(c)));
            classList.add(...newClasses.filter((c) => c && !oldClasses.includes(c)));
        }
        else if (memberName === 'style') {
            // update style attribute, css properties and values
            {
                for (const prop in oldValue) {
                    if (!newValue || newValue[prop] == null) {
                        if (prop.includes('-')) {
                            elm.style.removeProperty(prop);
                        }
                        else {
                            elm.style[prop] = '';
                        }
                    }
                }
            }
            for (const prop in newValue) {
                if (!oldValue || newValue[prop] !== oldValue[prop]) {
                    if (prop.includes('-')) {
                        elm.style.setProperty(prop, newValue[prop]);
                    }
                    else {
                        elm.style[prop] = newValue[prop];
                    }
                }
            }
        }
        else if (memberName === 'key')
            ;
        else if (memberName === 'ref') {
            // minifier will clean this up
            if (newValue) {
                newValue(elm);
            }
        }
        else if ((!isProp ) &&
            memberName[0] === 'o' &&
            memberName[1] === 'n') {
            // Event Handlers
            // so if the member name starts with "on" and the 3rd characters is
            // a capital letter, and it's not already a member on the element,
            // then we're assuming it's an event listener
            if (memberName[2] === '-') {
                // on- prefixed events
                // allows to be explicit about the dom event to listen without any magic
                // under the hood:
                // <my-cmp on-click> // listens for "click"
                // <my-cmp on-Click> // listens for "Click"
                // <my-cmp on-ionChange> // listens for "ionChange"
                // <my-cmp on-EVENTS> // listens for "EVENTS"
                memberName = memberName.slice(3);
            }
            else if (isMemberInElement(win, ln)) {
                // standard event
                // the JSX attribute could have been "onMouseOver" and the
                // member name "onmouseover" is on the window's prototype
                // so let's add the listener "mouseover", which is all lowercased
                memberName = ln.slice(2);
            }
            else {
                // custom event
                // the JSX attribute could have been "onMyCustomEvent"
                // so let's trim off the "on" prefix and lowercase the first character
                // and add the listener "myCustomEvent"
                // except for the first character, we keep the event name case
                memberName = ln[2] + memberName.slice(3);
            }
            if (oldValue) {
                plt.rel(elm, memberName, oldValue, false);
            }
            if (newValue) {
                plt.ael(elm, memberName, newValue, false);
            }
        }
        else {
            // Set property if it exists and it's not a SVG
            const isComplex = isComplexType(newValue);
            if ((isProp || (isComplex && newValue !== null)) && !isSvg) {
                try {
                    if (!elm.tagName.includes('-')) {
                        const n = newValue == null ? '' : newValue;
                        // Workaround for Safari, moving the <input> caret when re-assigning the same valued
                        if (memberName === 'list') {
                            isProp = false;
                        }
                        else if (oldValue == null || elm[memberName] != n) {
                            elm[memberName] = n;
                        }
                    }
                    else {
                        elm[memberName] = newValue;
                    }
                }
                catch (e) { }
            }
            /**
             * Need to manually update attribute if:
             * - memberName is not an attribute
             * - if we are rendering the host element in order to reflect attribute
             * - if it's a SVG, since properties might not work in <svg>
             * - if the newValue is null/undefined or 'false'.
             */
            let xlink = false;
            {
                if (ln !== (ln = ln.replace(/^xlink\:?/, ''))) {
                    memberName = ln;
                    xlink = true;
                }
            }
            if (newValue == null || newValue === false) {
                if (newValue !== false || elm.getAttribute(memberName) === '') {
                    if (xlink) {
                        elm.removeAttributeNS(XLINK_NS, memberName);
                    }
                    else {
                        elm.removeAttribute(memberName);
                    }
                }
            }
            else if ((!isProp || flags & 4 /* VNODE_FLAGS.isHost */ || isSvg) && !isComplex) {
                newValue = newValue === true ? '' : newValue;
                if (xlink) {
                    elm.setAttributeNS(XLINK_NS, memberName, newValue);
                }
                else {
                    elm.setAttribute(memberName, newValue);
                }
            }
        }
    }
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => (!value ? [] : value.split(parseClassListRegex));
const updateElement = (oldVnode, newVnode, isSvgMode, memberName) => {
    // if the element passed in is a shadow root, which is a document fragment
    // then we want to be adding attrs/props to the shadow root's "host" element
    // if it's not a shadow root, then we add attrs/props to the same element
    const elm = newVnode.$elm$.nodeType === 11 /* NODE_TYPE.DocumentFragment */ && newVnode.$elm$.host
        ? newVnode.$elm$.host
        : newVnode.$elm$;
    const oldVnodeAttrs = (oldVnode && oldVnode.$attrs$) || EMPTY_OBJ;
    const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;
    {
        // remove attributes no longer present on the vnode by setting them to undefined
        for (memberName in oldVnodeAttrs) {
            if (!(memberName in newVnodeAttrs)) {
                setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.$flags$);
            }
        }
    }
    // add new & update changed attributes
    for (memberName in newVnodeAttrs) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.$flags$);
    }
};
/**
 * Create a DOM Node corresponding to one of the children of a given VNode.
 *
 * @param oldParentVNode the parent VNode from the previous render
 * @param newParentVNode the parent VNode from the current render
 * @param childIndex the index of the VNode, in the _new_ parent node's
 * children, for which we will create a new DOM node
 * @param parentElm the parent DOM node which our new node will be a child of
 * @returns the newly created node
 */
const createElm = (oldParentVNode, newParentVNode, childIndex, parentElm) => {
    // tslint:disable-next-line: prefer-const
    const newVNode = newParentVNode.$children$[childIndex];
    let i = 0;
    let elm;
    let childNode;
    let oldVNode;
    if (!useNativeShadowDom) {
        // remember for later we need to check to relocate nodes
        checkSlotRelocate = true;
        if (newVNode.$tag$ === 'slot') {
            if (scopeId) {
                // scoped css needs to add its scoped id to the parent element
                parentElm.classList.add(scopeId + '-s');
            }
            newVNode.$flags$ |= newVNode.$children$
                ? // slot element has fallback content
                    2 /* VNODE_FLAGS.isSlotFallback */
                : // slot element does not have fallback content
                    1 /* VNODE_FLAGS.isSlotReference */;
        }
    }
    if (newVNode.$text$ !== null) {
        // create text node
        elm = newVNode.$elm$ = doc.createTextNode(newVNode.$text$);
    }
    else if (newVNode.$flags$ & (1 /* VNODE_FLAGS.isSlotReference */ | 2 /* VNODE_FLAGS.isSlotFallback */)) {
        // create a slot reference node
        elm = newVNode.$elm$ =
            slotReferenceDebugNode(newVNode) ;
    }
    else {
        if (!isSvgMode) {
            isSvgMode = newVNode.$tag$ === 'svg';
        }
        // create element
        elm = newVNode.$elm$ = (doc.createElementNS(isSvgMode ? SVG_NS : HTML_NS, newVNode.$tag$)
            );
        if (isSvgMode && newVNode.$tag$ === 'foreignObject') {
            isSvgMode = false;
        }
        // add css classes, attrs, props, listeners, etc.
        {
            updateElement(null, newVNode, isSvgMode);
        }
        if (isDef(scopeId) && elm['s-si'] !== scopeId) {
            // if there is a scopeId and this is the initial render
            // then let's add the scopeId as a css class
            elm.classList.add((elm['s-si'] = scopeId));
        }
        if (newVNode.$children$) {
            for (i = 0; i < newVNode.$children$.length; ++i) {
                // create the node
                childNode = createElm(oldParentVNode, newVNode, i, elm);
                // return node could have been null
                if (childNode) {
                    // append our new node
                    elm.__appendChild ? elm.__appendChild(childNode) : elm.appendChild(childNode);
                }
            }
        }
        {
            if (newVNode.$tag$ === 'svg') {
                // Only reset the SVG context when we're exiting <svg> element
                isSvgMode = false;
            }
            else if (elm.tagName === 'foreignObject') {
                // Reenter SVG context when we're exiting <foreignObject> element
                isSvgMode = true;
            }
        }
    }
    {
        elm['s-hn'] = hostTagName;
        if (newVNode.$flags$ & (2 /* VNODE_FLAGS.isSlotFallback */ | 1 /* VNODE_FLAGS.isSlotReference */)) {
            // this is a slot reference node
            elm['s-sr'] = true;
            // remember the content reference comment
            elm['s-cr'] = contentRef;
            // remember the slot name, or empty string for default slot
            elm['s-sn'] = newVNode.$name$ || '';
            // if this slot is nested within another parent slot, add that slot's name.
            // (used in 'renderSlotFallbackContent')
            if (newParentVNode.$name$) {
                elm['s-psn'] = newParentVNode.$name$;
            }
            if (newVNode.$flags$ & 2 /* VNODE_FLAGS.isSlotFallback */) {
                if (newVNode.$children$) {
                    // this slot has fallback nodes
                    for (i = 0; i < newVNode.$children$.length; ++i) {
                        // create the node
                        let containerElm = elm.nodeType === 1 /* NODE_TYPE.ElementNode */ ? elm : parentElm;
                        while (containerElm.nodeType !== 1 /* NODE_TYPE.ElementNode */) {
                            containerElm = containerElm.parentNode;
                        }
                        childNode = createElm(oldParentVNode, newVNode, i, containerElm);
                        // add new node meta.
                        // slot has fallback and childnode is slot fallback
                        childNode['s-sf'] = elm['s-hsf'] = true;
                        if (typeof childNode['s-sn'] === 'undefined') {
                            childNode['s-sn'] = newVNode.$name$ || '';
                        }
                        if (childNode.nodeType === 3 /* NODE_TYPE.TextNode */) {
                            childNode['s-sfc'] = childNode.textContent;
                        }
                        // make sure a node was created
                        // and we don't have a node already present
                        // (if a node is already attached, we'll just patch it)
                        if (childNode && (!oldParentVNode || !oldParentVNode.$children$)) {
                            // append our new node
                            containerElm.appendChild(childNode);
                        }
                    }
                }
                if (oldParentVNode && oldParentVNode.$children$)
                    patch(oldParentVNode, newVNode);
            }
            // check if we've got an old vnode for this slot
            oldVNode = oldParentVNode && oldParentVNode.$children$ && oldParentVNode.$children$[childIndex];
            if (oldVNode && oldVNode.$tag$ === newVNode.$tag$ && oldParentVNode.$elm$) {
                // we've got an old slot vnode and the wrapper is being replaced
                // so let's move the old slot content back to it's original location
                putBackInOriginalLocation(oldParentVNode.$elm$, false);
            }
        }
    }
    return elm;
};
const putBackInOriginalLocation = (parentElm, recursive) => {
    plt.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
    const oldSlotChildNodes = parentElm.__childNodes || parentElm.childNodes;
    for (let i = oldSlotChildNodes.length - 1; i >= 0; i--) {
        const childNode = oldSlotChildNodes[i];
        if (childNode['s-hn'] !== hostTagName && childNode['s-ol']) {
            // // this child node in the old element is from another component
            // // remove this node from the old slot's parent
            // childNode.remove();
            // and relocate it back to it's original location
            parentReferenceNode(childNode).insertBefore(childNode, referenceNode(childNode));
            // remove the old original location comment entirely
            // later on the patch function will know what to do
            // and move this to the correct spot in need be
            childNode['s-ol'].remove();
            childNode['s-ol'] = undefined;
            checkSlotRelocate = true;
        }
        if (recursive) {
            putBackInOriginalLocation(childNode, recursive);
        }
    }
    plt.$flags$ &= ~1 /* PLATFORM_FLAGS.isTmpDisconnected */;
};
const addVnodes = (parentElm, before, parentVNode, vnodes, startIdx, endIdx) => {
    let containerElm = ((parentElm['s-cr'] && parentElm['s-cr'].parentNode) || parentElm);
    let childNode;
    if (containerElm.shadowRoot && containerElm.tagName === hostTagName) {
        containerElm = containerElm.shadowRoot;
    }
    for (; startIdx <= endIdx; ++startIdx) {
        if (vnodes[startIdx]) {
            childNode = createElm(null, parentVNode, startIdx, parentElm);
            if (childNode) {
                vnodes[startIdx].$elm$ = childNode;
                containerElm.insertBefore(childNode, referenceNode(before) );
            }
        }
    }
};
const saveSlottedNodes = (elm) => {
    // by removing the hostname reference
    // any current slotted elements will be 'reset' and re-slotted
    const childNodes = elm.__childNodes || elm.childNodes;
    let childNode;
    let i;
    let ilen;
    for (i = 0, ilen = childNodes.length; i < ilen; i++) {
        childNode = childNodes[i];
        if (childNode['s-ol']) {
            if (childNode['s-hn'])
                childNode['s-hn'] = undefined;
        }
        else {
            saveSlottedNodes(childNode);
        }
    }
};
const removeVnodes = (vnodes, startIdx, endIdx, vnode, elm) => {
    for (; startIdx <= endIdx; ++startIdx) {
        if ((vnode = vnodes[startIdx])) {
            elm = vnode.$elm$;
            callNodeRefs(vnode);
            {
                // we're removing this element
                // so it's possible we need to show slot fallback content now
                checkSlotFallbackVisibility = true;
                saveSlottedNodes(elm);
                if (elm['s-ol']) {
                    // remove the original location comment
                    elm['s-ol'].remove();
                }
                else {
                    // it's possible that child nodes of the node
                    // that's being removed are slot nodes
                    putBackInOriginalLocation(elm, true);
                }
            }
            // remove the vnode's element from the dom
            elm.remove();
        }
    }
};
/**
 * Reconcile the children of a new VNode with the children of an old VNode by
 * traversing the two collections of children, identifying nodes that are
 * conserved or changed, calling out to `patch` to make any necessary
 * updates to the DOM, and rearranging DOM nodes as needed.
 *
 * The algorithm for reconciling children works by analyzing two 'windows' onto
 * the two arrays of children (`oldCh` and `newCh`). We keep track of the
 * 'windows' by storing start and end indices and references to the
 * corresponding array entries. Initially the two 'windows' are basically equal
 * to the entire array, but we progressively narrow the windows until there are
 * no children left to update by doing the following:
 *
 * 1. Skip any `null` entries at the beginning or end of the two arrays, so
 *    that if we have an initial array like the following we'll end up dealing
 *    only with a window bounded by the highlighted elements:
 *
 *    [null, null, VNode1 , ... , VNode2, null, null]
 *                 ^^^^^^         ^^^^^^
 *
 * 2. Check to see if the elements at the head and tail positions are equal
 *    across the windows. This will basically detect elements which haven't
 *    been added, removed, or changed position, i.e. if you had the following
 *    VNode elements (represented as HTML):
 *
 *    oldVNode: `<div><p><span>HEY</span></p></div>`
 *    newVNode: `<div><p><span>THERE</span></p></div>`
 *
 *    Then when comparing the children of the `<div>` tag we check the equality
 *    of the VNodes corresponding to the `<p>` tags and, since they are the
 *    same tag in the same position, we'd be able to avoid completely
 *    re-rendering the subtree under them with a new DOM element and would just
 *    call out to `patch` to handle reconciling their children and so on.
 *
 * 3. Check, for both windows, to see if the element at the beginning of the
 *    window corresponds to the element at the end of the other window. This is
 *    a heuristic which will let us identify _some_ situations in which
 *    elements have changed position, for instance it _should_ detect that the
 *    children nodes themselves have not changed but merely moved in the
 *    following example:
 *
 *    oldVNode: `<div><element-one /><element-two /></div>`
 *    newVNode: `<div><element-two /><element-one /></div>`
 *
 *    If we find cases like this then we also need to move the concrete DOM
 *    elements corresponding to the moved children to write the re-order to the
 *    DOM.
 *
 * 4. Finally, if VNodes have the `key` attribute set on them we check for any
 *    nodes in the old children which have the same key as the first element in
 *    our window on the new children. If we find such a node we handle calling
 *    out to `patch`, moving relevant DOM nodes, and so on, in accordance with
 *    what we find.
 *
 * Finally, once we've narrowed our 'windows' to the point that either of them
 * collapse (i.e. they have length 0) we then handle any remaining VNode
 * insertion or deletion that needs to happen to get a DOM state that correctly
 * reflects the new child VNodes. If, for instance, after our window on the old
 * children has collapsed we still have more nodes on the new children that
 * we haven't dealt with yet then we need to add them, or if the new children
 * collapse but we still have unhandled _old_ children then we need to make
 * sure the corresponding DOM nodes are removed.
 *
 * @param parentElm the node into which the parent VNode is rendered
 * @param oldCh the old children of the parent node
 * @param newVNode the new VNode which will replace the parent
 * @param newCh the new children of the parent node
 */
const updateChildren = (parentElm, oldCh, newVNode, newCh) => {
    const fbSlots = [];
    const fbNodes = {};
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let idxInOld = 0;
    let i = 0;
    let j = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let node;
    let elmToMove;
    let fbParentNodes;
    let fbParentNodesIdx;
    let fbSlotsIdx;
    let fbNodesIdx;
    let fbChildNode;
    let fbSlot;
    let fbNode;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            // VNode might have been moved left
            oldStartVnode = oldCh[++oldStartIdx];
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            // if the start nodes are the same then we should patch the new VNode
            // onto the old one, and increment our `newStartIdx` and `oldStartIdx`
            // indices to reflect that. We don't need to move any DOM Nodes around
            // since things are matched up in order.
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            // likewise, if the end nodes are the same we patch new onto old and
            // decrement our end indices, and also likewise in this case we don't
            // need to move any DOM Nodes.
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            // case: "Vnode moved right"
            //
            // We've found that the last node in our window on the new children is
            // the same VNode as the _first_ node in our window on the old children
            // we're dealing with now. Visually, this is the layout of these two
            // nodes:
            //
            // newCh: [..., newStartVnode , ... , newEndVnode , ...]
            //                                    ^^^^^^^^^^^
            // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
            //              ^^^^^^^^^^^^^
            //
            // In this situation we need to patch `newEndVnode` onto `oldStartVnode`
            // and move the DOM element for `oldStartVnode`.
            if ((oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldStartVnode.$elm$.parentNode, false);
            }
            patch(oldStartVnode, newEndVnode);
            // We need to move the element for `oldStartVnode` into a position which
            // will be appropriate for `newEndVnode`. For this we can use
            // `.insertBefore` and `oldEndVnode.$elm$.nextSibling`. If there is a
            // sibling for `oldEndVnode.$elm$` then we want to move the DOM node for
            // `oldStartVnode` between `oldEndVnode` and it's sibling, like so:
            //
            // <old-start-node />
            // <some-intervening-node />
            // <old-end-node />
            // <!-- ->              <-- `oldStartVnode.$elm$` should be inserted here
            // <next-sibling />
            //
            // If instead `oldEndVnode.$elm$` has no sibling then we just want to put
            // the node for `oldStartVnode` at the end of the children of
            // `parentElm`. Luckily, `Node.nextSibling` will return `null` if there
            // aren't any siblings, and passing `null` to `Node.insertBefore` will
            // append it to the children of the parent element.
            parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            // case: "Vnode moved left"
            //
            // We've found that the first node in our window on the new children is
            // the same VNode as the _last_ node in our window on the old children.
            // Visually, this is the layout of these two nodes:
            //
            // newCh: [..., newStartVnode , ... , newEndVnode , ...]
            //              ^^^^^^^^^^^^^
            // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
            //                                    ^^^^^^^^^^^
            //
            // In this situation we need to patch `newStartVnode` onto `oldEndVnode`
            // (which will handle updating any changed attributes, reconciling their
            // children etc) but we also need to move the DOM node to which
            // `oldEndVnode` corresponds.
            if ((oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldEndVnode.$elm$.parentNode, false);
            }
            patch(oldEndVnode, newStartVnode);
            // We've already checked above if `oldStartVnode` and `newStartVnode` are
            // the same node, so since we're here we know that they are not. Thus we
            // can move the element for `oldEndVnode` _before_ the element for
            // `oldStartVnode`, leaving `oldStartVnode` to be reconciled in the
            // future.
            parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            // Here we do some checks to match up old and new nodes based on the
            // `$key$` attribute, which is set by putting a `key="my-key"` attribute
            // in the JSX for a DOM element in the implementation of a Stencil
            // component.
            //
            // First we check to see if there are any nodes in the array of old
            // children which have the same key as the first node in the new
            // children.
            idxInOld = -1;
            {
                for (i = oldStartIdx; i <= oldEndIdx; ++i) {
                    if (oldCh[i] && oldCh[i].$key$ !== null && oldCh[i].$key$ === newStartVnode.$key$) {
                        idxInOld = i;
                        break;
                    }
                }
            }
            if (idxInOld >= 0) {
                // We found a node in the old children which matches up with the first
                // node in the new children! So let's deal with that
                elmToMove = oldCh[idxInOld];
                if (elmToMove.$tag$ !== newStartVnode.$tag$) {
                    // the tag doesn't match so we'll need a new DOM element
                    node = createElm(oldCh && oldCh[newStartIdx], newVNode, idxInOld, parentElm);
                }
                else {
                    patch(elmToMove, newStartVnode);
                    // invalidate the matching old node so that we won't try to update it
                    // again later on
                    oldCh[idxInOld] = undefined;
                    node = elmToMove.$elm$;
                }
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                // We either didn't find an element in the old children that matches
                // the key of the first new child OR the build is not using `key`
                // attributes at all. In either case we need to create a new element
                // for the new node.
                node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx, parentElm);
                newStartVnode = newCh[++newStartIdx];
            }
            if (node) {
                // if we created a new node then handle inserting it to the DOM
                {
                    parentReferenceNode(oldStartVnode.$elm$).insertBefore(node, referenceNode(oldStartVnode.$elm$));
                }
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        // we have some more new nodes to add which don't match up with old nodes
        addVnodes(parentElm, newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$, newVNode, newCh, newStartIdx, newEndIdx);
    }
    else if (newStartIdx > newEndIdx) {
        // there are nodes in the `oldCh` array which no longer correspond to nodes
        // in the new array, so lets remove them (which entails cleaning up the
        // relevant DOM nodes)
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
    // reorder fallback slot nodes
    if (parentElm.parentNode && newVNode.$elm$['s-hsf']) {
        fbParentNodes = parentElm.parentNode.__childNodes || parentElm.parentNode.childNodes;
        fbParentNodesIdx = fbParentNodes.length - 1;
        for (i = 0; i <= fbParentNodesIdx; ++i) {
            fbChildNode = fbParentNodes[i];
            if (fbChildNode['s-hsf']) {
                fbSlots.push(fbChildNode);
                continue;
            }
            if (fbChildNode['s-sf']) {
                if (!fbNodes[fbChildNode['s-sn']])
                    fbNodes[fbChildNode['s-sn']] = [];
                fbNodes[fbChildNode['s-sn']].push(fbChildNode);
            }
        }
        fbSlotsIdx = fbSlots.length - 1;
        for (i = 0; i <= fbSlotsIdx; ++i) {
            fbSlot = fbSlots[i];
            if (typeof fbNodes[fbSlot['s-sn']] === 'undefined')
                continue;
            fbNodesIdx = fbNodes[fbSlot['s-sn']].length - 1;
            for (j = 0; j <= fbNodesIdx; ++j) {
                fbNode = fbNodes[fbSlot['s-sn']][j];
                fbSlot.parentNode.insertBefore(fbNode, fbSlot);
            }
        }
        checkSlotFallbackVisibility = true;
    }
};
/**
 * Compare two VNodes to determine if they are the same
 *
 * **NB**: This function is an equality _heuristic_ based on the available
 * information set on the two VNodes and can be misleading under certain
 * circumstances. In particular, if the two nodes do not have `key` attrs
 * (available under `$key$` on VNodes) then the function falls back on merely
 * checking that they have the same tag.
 *
 * So, in other words, if `key` attrs are not set on VNodes which may be
 * changing order within a `children` array or something along those lines then
 * we could obtain a false positive and then have to do needless re-rendering.
 *
 * @param leftVNode the first VNode to check
 * @param rightVNode the second VNode to check
 * @returns whether they're equal or not
 */
const isSameVnode = (leftVNode, rightVNode) => {
    // compare if two vnode to see if they're "technically" the same
    // need to have the same element tag, and same key to be the same
    if (leftVNode.$tag$ === rightVNode.$tag$) {
        if (leftVNode.$tag$ === 'slot') {
            return leftVNode.$name$ === rightVNode.$name$;
        }
        // this will be set if components in the build have `key` attrs set on them
        {
            return leftVNode.$key$ === rightVNode.$key$;
        }
    }
    return false;
};
const referenceNode = (node) => {
    // this node was relocated to a new location in the dom
    // because of some other component's slot
    // but we still have an html comment in place of where
    // it's original location was according to it's original vdom
    return (node && node['s-ol']) || node;
};
const parentReferenceNode = (node) => (node['s-ol'] ? node['s-ol'] : node).parentNode;
/**
 * Handle reconciling an outdated VNode with a new one which corresponds to
 * it. This function handles flushing updates to the DOM and reconciling the
 * children of the two nodes (if any).
 *
 * @param oldVNode an old VNode whose DOM element and children we want to update
 * @param newVNode a new VNode representing an updated version of the old one
 */
const patch = (oldVNode, newVNode) => {
    const elm = (newVNode.$elm$ = oldVNode.$elm$);
    const oldChildren = oldVNode.$children$;
    const newChildren = newVNode.$children$;
    const tag = newVNode.$tag$;
    const text = newVNode.$text$;
    let defaultHolder;
    if (text === null) {
        {
            // test if we're rendering an svg element, or still rendering nodes inside of one
            // only add this to the when the compiler sees we're using an svg somewhere
            isSvgMode = tag === 'svg' ? true : tag === 'foreignObject' ? false : isSvgMode;
        }
        {
            if (tag === 'slot')
                ;
            else {
                // either this is the first render of an element OR it's an update
                // AND we already know it's possible it could have changed
                // this updates the element's css classes, attrs, props, listeners, etc.
                updateElement(oldVNode, newVNode, isSvgMode);
            }
        }
        if (oldChildren !== null && newChildren !== null) {
            // looks like there's child vnodes for both the old and new vnodes
            // so we need to call `updateChildren` to reconcile them
            updateChildren(elm, oldChildren, newVNode, newChildren);
        }
        else if (newChildren !== null) {
            // no old child vnodes, but there are new child vnodes to add
            if (oldVNode.$text$ !== null) {
                // the old vnode was text, so be sure to clear it out
                elm.textContent = '';
            }
            // add the new vnode children
            addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);
        }
        else if (oldChildren !== null) {
            // no new child vnodes, but there are old child vnodes to remove
            removeVnodes(oldChildren, 0, oldChildren.length - 1);
        }
        if (isSvgMode && tag === 'svg') {
            isSvgMode = false;
        }
    }
    else if ((defaultHolder = elm['s-cr'])) {
        // this element has slotted content
        defaultHolder.parentNode.textContent = text;
    }
    else if (oldVNode.$text$ !== text) {
        // update the text content for the text only vnode
        // and also only if the text is different than before
        elm.textContent = text;
        if (elm['s-sf']) {
            elm['s-sfc'] = text;
        }
    }
};
const relocateNodes = [];
const relocateSlotContent = (elm) => {
    // tslint:disable-next-line: prefer-const
    let childNode;
    let node;
    let hostContentNodes;
    let slotNameAttr;
    let relocateNodeData;
    let j;
    let i = 0;
    const childNodes = (elm.__childNodes || elm.childNodes);
    const ilen = childNodes.length;
    for (; i < ilen; i++) {
        childNode = childNodes[i];
        if (childNode['s-sr'] && (node = childNode['s-cr']) && node.parentNode) {
            if (childNode['s-hsf']) {
                checkSlotFallbackVisibility = true;
            }
            // first got the content reference comment node
            // then we got it's parent, which is where all the host content is in now
            hostContentNodes = node.parentNode.__childNodes || node.parentNode.childNodes;
            slotNameAttr = childNode['s-sn'];
            for (j = hostContentNodes.length - 1; j >= 0; j--) {
                node = hostContentNodes[j];
                if (!node['s-cn'] && !node['s-nr'] && node['s-hn'] !== childNode['s-hn']) {
                    // let's do some relocating to its new home
                    // but never relocate a content reference node
                    // that is suppose to always represent the original content location
                    if (isNodeLocatedInSlot(node, slotNameAttr)) {
                        // it's possible we've already decided to relocate this node
                        relocateNodeData = relocateNodes.find((r) => r.$nodeToRelocate$ === node);
                        // made some changes to slots
                        // let's make sure we also double check
                        // fallbacks are correctly hidden or shown
                        checkSlotFallbackVisibility = true;
                        node['s-sn'] = node['s-sn'] || slotNameAttr;
                        if (relocateNodeData) {
                            // previously we never found a slot home for this node
                            // but turns out we did, so let's remember it now
                            relocateNodeData.$slotRefNode$ = childNode;
                        }
                        else {
                            // add to our list of nodes to relocate
                            relocateNodes.push({
                                $slotRefNode$: childNode,
                                $nodeToRelocate$: node,
                            });
                        }
                        if (node['s-sr']) {
                            relocateNodes.map((relocateNode) => {
                                if (isNodeLocatedInSlot(relocateNode.$nodeToRelocate$, node['s-sn'])) {
                                    relocateNodeData = relocateNodes.find((r) => r.$nodeToRelocate$ === node);
                                    if (relocateNodeData && !relocateNode.$slotRefNode$) {
                                        relocateNode.$slotRefNode$ = relocateNodeData.$slotRefNode$;
                                    }
                                }
                            });
                        }
                    }
                    else if (!relocateNodes.some((r) => r.$nodeToRelocate$ === node)) {
                        // so far this element does not have a slot home, not setting slotRefNode on purpose
                        // if we never find a home for this element then we'll need to hide it
                        relocateNodes.push({
                            $nodeToRelocate$: node,
                        });
                    }
                }
            }
        }
        if (childNode.nodeType === 1 /* NODE_TYPE.ElementNode */) {
            relocateSlotContent(childNode);
        }
    }
};
const isNodeLocatedInSlot = (nodeToRelocate, slotNameAttr) => {
    if (nodeToRelocate.nodeType === 1 /* NODE_TYPE.ElementNode */) {
        if (nodeToRelocate.getAttribute('slot') === null && slotNameAttr === '') {
            return true;
        }
        if (nodeToRelocate.getAttribute('slot') === slotNameAttr) {
            return true;
        }
        return false;
    }
    if (nodeToRelocate['s-sn'] === slotNameAttr) {
        return true;
    }
    return slotNameAttr === '';
};
const callNodeRefs = (vNode) => {
    {
        vNode.$attrs$ && vNode.$attrs$.ref && vNode.$attrs$.ref(null);
        vNode.$children$ && vNode.$children$.map(callNodeRefs);
    }
};
const renderVdom = (hostRef, renderFnResults) => {
    const hostElm = hostRef.$hostElement$;
    const cmpMeta = hostRef.$cmpMeta$;
    const oldVNode = hostRef.$vnode$ || newVNode(null, null);
    const rootVnode = isHost(renderFnResults) ? renderFnResults : h(null, null, renderFnResults);
    hostTagName = hostElm.tagName;
    if (cmpMeta.$attrsToReflect$) {
        rootVnode.$attrs$ = rootVnode.$attrs$ || {};
        cmpMeta.$attrsToReflect$.map(([propName, attribute]) => (rootVnode.$attrs$[attribute] = hostElm[propName]));
    }
    rootVnode.$tag$ = null;
    rootVnode.$flags$ |= 4 /* VNODE_FLAGS.isHost */;
    hostRef.$vnode$ = rootVnode;
    rootVnode.$elm$ = oldVNode.$elm$ = (hostElm.shadowRoot || hostElm );
    {
        scopeId = hostElm['s-sc'];
    }
    {
        contentRef = hostElm['s-cr'];
        useNativeShadowDom = supportsShadow && (cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) !== 0;
        // always reset
        checkSlotFallbackVisibility = false;
    }
    // synchronous patch
    patch(oldVNode, rootVnode);
    {
        // while we're moving nodes around existing nodes, temporarily disable
        // the disconnectCallback from working
        plt.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
        if (checkSlotRelocate) {
            relocateSlotContent(rootVnode.$elm$);
            let relocateData;
            let nodeToRelocate;
            let orgLocationNode;
            let parentNodeRef;
            let insertBeforeNode;
            let refNode;
            let ogInsertBeforeNode;
            let i = 0;
            for (; i < relocateNodes.length; i++) {
                relocateData = relocateNodes[i];
                nodeToRelocate = relocateData.$nodeToRelocate$;
                if (!nodeToRelocate['s-ol']) {
                    // add a reference node marking this node's original location
                    // keep a reference to this node for later lookups
                    orgLocationNode =
                        originalLocationDebugNode(nodeToRelocate)
                            ;
                    orgLocationNode['s-nr'] = nodeToRelocate;
                    nodeToRelocate.parentNode.insertBefore((nodeToRelocate['s-ol'] = orgLocationNode), nodeToRelocate);
                }
            }
            for (i = 0; i < relocateNodes.length; i++) {
                relocateData = relocateNodes[i];
                nodeToRelocate = relocateData.$nodeToRelocate$;
                if (relocateData.$slotRefNode$) {
                    // by default we're just going to insert it directly
                    // after the slot reference node
                    parentNodeRef = relocateData.$slotRefNode$.parentNode;
                    insertBeforeNode =
                        relocateData.$slotRefNode$.__nextSibling || relocateData.$slotRefNode$.nextSibling;
                    orgLocationNode = nodeToRelocate['s-ol'];
                    ogInsertBeforeNode = insertBeforeNode;
                    while ((orgLocationNode = (orgLocationNode.__previousSibling || orgLocationNode.previousSibling))) {
                        refNode = orgLocationNode['s-nr'];
                        if (refNode && refNode['s-sn'] === nodeToRelocate['s-sn'] && parentNodeRef === refNode.parentNode) {
                            refNode = refNode.__nextSibling || refNode.nextSibling;
                            if (!refNode || !refNode['s-nr']) {
                                insertBeforeNode = refNode;
                                break;
                            }
                        }
                    }
                    if ((!insertBeforeNode && parentNodeRef !== nodeToRelocate.parentNode) ||
                        (nodeToRelocate.__nextSibling || nodeToRelocate.nextSibling) !== insertBeforeNode) {
                        // we've checked that it's worth while to relocate
                        // since that the node to relocate
                        // has a different next sibling or parent relocated
                        if (nodeToRelocate !== insertBeforeNode) {
                            if (!nodeToRelocate['s-hn'] && nodeToRelocate['s-ol']) {
                                // probably a component in the index.html that doesn't have it's hostname set
                                nodeToRelocate['s-hn'] = nodeToRelocate['s-ol'].parentNode.nodeName;
                            }
                            // add it back to the dom but in its new home
                            parentNodeRef.insertBefore(nodeToRelocate, insertBeforeNode);
                            // the node may have been hidden from when it didn't have a home. Re-show.
                            nodeToRelocate.hidden = false;
                        }
                        else {
                            parentNodeRef.insertBefore(nodeToRelocate, ogInsertBeforeNode);
                        }
                    }
                }
                else {
                    // this node doesn't have a slot home to go to, so let's hide it
                    if (nodeToRelocate.nodeType === 1 /* NODE_TYPE.ElementNode */) {
                        nodeToRelocate.hidden = true;
                    }
                }
            }
        }
        if (checkSlotFallbackVisibility) {
            updateFallbackSlotVisibility(rootVnode.$elm$);
        }
        // done moving nodes around
        // allow the disconnect callback to work again
        plt.$flags$ &= ~1 /* PLATFORM_FLAGS.isTmpDisconnected */;
        // always reset
        relocateNodes.length = 0;
    }
    // Clear the content ref so we don't create a memory leak
    contentRef = undefined;
};
// slot comment debug nodes only created with the `--debug` flag
// otherwise these nodes are text nodes w/out content
const slotReferenceDebugNode = (slotVNode) => doc.createComment(`<slot${slotVNode.$name$ ? ' name="' + slotVNode.$name$ + '"' : ''}> (host=${hostTagName.toLowerCase()})`);
const originalLocationDebugNode = (nodeToRelocate) => doc.createComment(`org-location for ` +
    (nodeToRelocate.localName
        ? `<${nodeToRelocate.localName}> (host=${nodeToRelocate['s-hn']})`
        : `[${nodeToRelocate.textContent}]`));
const attachToAncestor = (hostRef, ancestorComponent) => {
    if (ancestorComponent && !hostRef.$onRenderResolve$ && ancestorComponent['s-p']) {
        ancestorComponent['s-p'].push(new Promise((r) => (hostRef.$onRenderResolve$ = r)));
    }
};
const scheduleUpdate = (hostRef, isInitialLoad) => {
    {
        hostRef.$flags$ |= 16 /* HOST_FLAGS.isQueuedForUpdate */;
    }
    if (hostRef.$flags$ & 4 /* HOST_FLAGS.isWaitingForChildren */) {
        hostRef.$flags$ |= 512 /* HOST_FLAGS.needsRerender */;
        return;
    }
    attachToAncestor(hostRef, hostRef.$ancestorComponent$);
    // there is no ancestor component or the ancestor component
    // has already fired off its lifecycle update then
    // fire off the initial update
    const dispatch = () => dispatchHooks(hostRef, isInitialLoad);
    return writeTask(dispatch) ;
};
const dispatchHooks = (hostRef, isInitialLoad) => {
    const elm = hostRef.$hostElement$;
    const endSchedule = createTime('scheduleUpdate', hostRef.$cmpMeta$.$tagName$);
    const instance = hostRef.$lazyInstance$ ;
    let promise;
    if (isInitialLoad) {
        {
            hostRef.$flags$ |= 256 /* HOST_FLAGS.isListenReady */;
            if (hostRef.$queuedListeners$) {
                hostRef.$queuedListeners$.map(([methodName, event]) => safeCall(instance, methodName, event, elm));
                hostRef.$queuedListeners$ = null;
            }
        }
        emitLifecycleEvent(elm, 'componentWillLoad');
        {
            promise = safeCall(instance, 'componentWillLoad', undefined, elm);
        }
    }
    else {
        emitLifecycleEvent(elm, 'componentWillUpdate');
        {
            promise = safeCall(instance, 'componentWillUpdate', undefined, elm);
        }
    }
    emitLifecycleEvent(elm, 'componentWillRender');
    endSchedule();
    return then(promise, () => updateComponent(hostRef, instance, isInitialLoad));
};
const updateComponent = async (hostRef, instance, isInitialLoad) => {
    // updateComponent
    const elm = hostRef.$hostElement$;
    const endUpdate = createTime('update', hostRef.$cmpMeta$.$tagName$);
    const rc = elm['s-rc'];
    if (isInitialLoad) {
        // DOM WRITE!
        attachStyles(hostRef);
    }
    const endRender = createTime('render', hostRef.$cmpMeta$.$tagName$);
    {
        callRender(hostRef, instance);
    }
    if (plt.$cssShim$) {
        plt.$cssShim$.updateHost(elm);
    }
    if (rc) {
        // ok, so turns out there are some child host elements
        // waiting on this parent element to load
        // let's fire off all update callbacks waiting
        rc.map((cb) => cb());
        elm['s-rc'] = undefined;
    }
    endRender();
    endUpdate();
    {
        const childrenPromises = elm['s-p'];
        const postUpdate = () => postUpdateComponent(hostRef);
        if (childrenPromises.length === 0) {
            postUpdate();
        }
        else {
            Promise.all(childrenPromises).then(postUpdate);
            hostRef.$flags$ |= 4 /* HOST_FLAGS.isWaitingForChildren */;
            childrenPromises.length = 0;
        }
    }
};
const callRender = (hostRef, instance, elm) => {
    try {
        instance = instance.render && instance.render();
        {
            hostRef.$flags$ &= ~16 /* HOST_FLAGS.isQueuedForUpdate */;
        }
        {
            hostRef.$flags$ |= 2 /* HOST_FLAGS.hasRendered */;
        }
        {
            {
                // looks like we've got child nodes to render into this host element
                // or we need to update the css class/attrs on the host element
                // DOM WRITE!
                {
                    renderVdom(hostRef, instance);
                }
            }
        }
    }
    catch (e) {
        consoleError(e, hostRef.$hostElement$);
    }
    return null;
};
const postUpdateComponent = (hostRef) => {
    const tagName = hostRef.$cmpMeta$.$tagName$;
    const elm = hostRef.$hostElement$;
    const endPostUpdate = createTime('postUpdate', tagName);
    const instance = hostRef.$lazyInstance$ ;
    const ancestorComponent = hostRef.$ancestorComponent$;
    emitLifecycleEvent(elm, 'componentDidRender');
    if (!(hostRef.$flags$ & 64 /* HOST_FLAGS.hasLoadedComponent */)) {
        hostRef.$flags$ |= 64 /* HOST_FLAGS.hasLoadedComponent */;
        {
            // DOM WRITE!
            addHydratedFlag(elm);
        }
        {
            safeCall(instance, 'componentDidLoad', undefined, elm);
        }
        emitLifecycleEvent(elm, 'componentDidLoad');
        endPostUpdate();
        {
            hostRef.$onReadyResolve$(elm);
            if (!ancestorComponent) {
                appDidLoad();
            }
        }
    }
    else {
        {
            safeCall(instance, 'componentDidUpdate', undefined, elm);
        }
        emitLifecycleEvent(elm, 'componentDidUpdate');
        endPostUpdate();
    }
    {
        hostRef.$onInstanceResolve$(elm);
    }
    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    {
        if (hostRef.$onRenderResolve$) {
            hostRef.$onRenderResolve$();
            hostRef.$onRenderResolve$ = undefined;
        }
        if (hostRef.$flags$ & 512 /* HOST_FLAGS.needsRerender */) {
            nextTick(() => scheduleUpdate(hostRef, false));
        }
        hostRef.$flags$ &= ~(4 /* HOST_FLAGS.isWaitingForChildren */ | 512 /* HOST_FLAGS.needsRerender */);
    }
    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)
};
const appDidLoad = (who) => {
    // on appload
    // we have finish the first big initial render
    {
        addHydratedFlag(doc.documentElement);
    }
    nextTick(() => emitEvent(win, 'appload', { detail: { namespace: NAMESPACE } }));
};
const safeCall = (instance, method, arg, elm) => {
    if (instance && instance[method]) {
        try {
            return instance[method](arg);
        }
        catch (e) {
            consoleError(e, elm);
        }
    }
    return undefined;
};
const then = (promise, thenFn) => {
    return promise && promise.then ? promise.then(thenFn) : thenFn();
};
const emitLifecycleEvent = (elm, lifecycleName) => {
    {
        emitEvent(elm, 'stencil_' + lifecycleName, {
            bubbles: true,
            composed: true,
            detail: {
                namespace: NAMESPACE,
            },
        });
    }
};
const addHydratedFlag = (elm) => elm.classList.add('hydrated')
    ;
const getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);
const setValue = (ref, propName, newVal, cmpMeta, fireWatchers = true) => {
    // check our new property value against our internal value
    const hostRef = getHostRef(ref);
    const oldVal = hostRef.$instanceValues$.get(propName);
    const flags = hostRef.$flags$;
    const instance = hostRef.$lazyInstance$ ;
    newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);
    // explicitly check for NaN on both sides, as `NaN === NaN` is always false
    const areBothNaN = Number.isNaN(oldVal) && Number.isNaN(newVal);
    const didValueChange = newVal !== oldVal && !areBothNaN;
    if ((!(flags & 8 /* HOST_FLAGS.isConstructingInstance */) || oldVal === undefined) && didValueChange) {
        // gadzooks! the property's value has changed!!
        // set our new value!
        hostRef.$instanceValues$.set(propName, newVal);
        if (instance) {
            if ((flags & (2 /* HOST_FLAGS.hasRendered */ | 16 /* HOST_FLAGS.isQueuedForUpdate */)) === 2 /* HOST_FLAGS.hasRendered */) {
                // looks like this value actually changed, so we've got work to do!
                // but only if we've already rendered, otherwise just chill out
                // queue that we need to do an update, but don't worry about queuing
                // up millions cuz this function ensures it only runs once
                scheduleUpdate(hostRef, false);
            }
        }
    }
};
/**
 * Attach a series of runtime constructs to a compiled Stencil component
 * constructor, including getters and setters for the `@Prop` and `@State`
 * decorators, callbacks for when attributes change, and so on.
 *
 * @param Cstr the constructor for a component that we need to process
 * @param cmpMeta metadata collected previously about the component
 * @param flags a number used to store a series of bit flags
 * @returns a reference to the same constructor passed in (but now mutated)
 */
const proxyComponent = (Cstr, cmpMeta, flags) => {
    if (cmpMeta.$members$) {
        // It's better to have a const than two Object.entries()
        const members = Object.entries(cmpMeta.$members$);
        const prototype = Cstr.prototype;
        members.map(([memberName, [memberFlags]]) => {
            if ((memberFlags & 31 /* MEMBER_FLAGS.Prop */ ||
                    ((flags & 2 /* PROXY_FLAGS.proxyState */) && memberFlags & 32 /* MEMBER_FLAGS.State */))) {
                if ((memberFlags & 2048 /* MEMBER_FLAGS.Getter */) === 0) {
                    // proxyComponent - prop
                    Object.defineProperty(prototype, memberName, {
                        get() {
                            // proxyComponent, get value
                            return getValue(this, memberName);
                        },
                        set(newValue) {
                            // proxyComponent, set value
                            setValue(this, memberName, newValue, cmpMeta);
                        },
                        configurable: true,
                        enumerable: true,
                    });
                }
                else if (flags & 1 /* PROXY_FLAGS.isElementConstructor */ && memberFlags & 2048 /* MEMBER_FLAGS.Getter */) {
                    {
                        // lazy maps the element get / set to the class get / set
                        // proxyComponent - lazy prop getter
                        Object.defineProperty(prototype, memberName, {
                            get() {
                                const ref = getHostRef(this);
                                const instance = ref ? ref.$lazyInstance$ : prototype;
                                if (!instance)
                                    return;
                                return instance[memberName];
                            },
                            configurable: true,
                            enumerable: true,
                        });
                    }
                }
                if (memberFlags & 4096 /* MEMBER_FLAGS.Setter */) {
                    // proxyComponent - lazy and non-lazy. Catches original set to fire updates (for @Watch)
                    const origSetter = Object.getOwnPropertyDescriptor(prototype, memberName).set;
                    Object.defineProperty(prototype, memberName, {
                        set(newValue) {
                            const ref = getHostRef(this);
                            // non-lazy setter - amends original set to fire update
                            if (origSetter) {
                                origSetter.apply(this, [newValue]);
                                setValue(this, memberName, ref.$hostElement$[memberName], cmpMeta);
                                return;
                            }
                            if (!ref)
                                return;
                            // lazy setter maps the element set to the class set
                            const setVal = (init = false) => {
                                ref.$lazyInstance$[memberName] = newValue;
                                setValue(this, memberName, ref.$lazyInstance$[memberName], cmpMeta, !init);
                            };
                            // If there's a value from an attribute, (before the class is defined), queue & set async
                            if (ref.$lazyInstance$) {
                                setVal();
                            }
                            else {
                                ref.$onInstancePromise$.then(() => setVal(true));
                            }
                        },
                    });
                }
            }
            else if (flags & 1 /* PROXY_FLAGS.isElementConstructor */ &&
                memberFlags & 64 /* MEMBER_FLAGS.Method */) {
                // proxyComponent - method
                Object.defineProperty(prototype, memberName, {
                    value(...args) {
                        const ref = getHostRef(this);
                        return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName](...args));
                    },
                });
            }
        });
        if ((flags & 1 /* PROXY_FLAGS.isElementConstructor */)) {
            const attrNameToPropName = new Map();
            prototype.attributeChangedCallback = function (attrName, _oldValue, newValue) {
                plt.jmp(() => {
                    const propName = attrNameToPropName.get(attrName);
                    //  In a web component lifecycle the attributeChangedCallback runs prior to connectedCallback
                    //  in the case where an attribute was set inline.
                    //  ```html
                    //    <my-component some-attribute="some-value"></my-component>
                    //  ```
                    //
                    //  There is an edge case where a developer sets the attribute inline on a custom element and then
                    //  programmatically changes it before it has been upgraded as shown below:
                    //
                    //  ```html
                    //    <!-- this component has _not_ been upgraded yet -->
                    //    <my-component id="test" some-attribute="some-value"></my-component>
                    //    <script>
                    //      // grab non-upgraded component
                    //      el = document.querySelector("#test");
                    //      el.someAttribute = "another-value";
                    //      // upgrade component
                    //      customElements.define('my-component', MyComponent);
                    //    </script>
                    //  ```
                    //  In this case if we do not unshadow here and use the value of the shadowing property, attributeChangedCallback
                    //  will be called with `newValue = "some-value"` and will set the shadowed property (this.someAttribute = "another-value")
                    //  to the value that was set inline i.e. "some-value" from above example. When
                    //  the connectedCallback attempts to unshadow it will use "some-value" as the initial value rather than "another-value"
                    //
                    //  The case where the attribute was NOT set inline but was not set programmatically shall be handled/unshadowed
                    //  by connectedCallback as this attributeChangedCallback will not fire.
                    //
                    //  https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
                    //
                    //  TODO(STENCIL-16) we should think about whether or not we actually want to be reflecting the attributes to
                    //  properties here given that this goes against best practices outlined here
                    //  https://developers.google.com/web/fundamentals/web-components/best-practices#avoid-reentrancy
                    if (this.hasOwnProperty(propName)) {
                        newValue = this[propName];
                        delete this[propName];
                    }
                    else if (prototype.hasOwnProperty(propName) &&
                        typeof this[propName] === 'number' &&
                        this[propName] == newValue) {
                        // if the propName exists on the prototype of `Cstr`, this update may be a result of Stencil using native
                        // APIs to reflect props as attributes. Calls to `setAttribute(someElement, propName)` will result in
                        // `propName` to be converted to a `DOMString`, which may not be what we want for other primitive props.
                        return;
                    }
                    const propDesc = Object.getOwnPropertyDescriptor(prototype, propName);
                    // test whether this property either has no 'getter' or if it does, has a 'setter'
                    // before attempting to write back to component props
                    if (!propDesc.get || !!propDesc.set) {
                        this[propName] = newValue === null && typeof this[propName] === 'boolean' ? false : newValue;
                    }
                });
            };
            // create an array of attributes to observe
            // and also create a map of html attribute name to js property name
            Cstr.observedAttributes = members
                .filter(([_, m]) => m[0] & 15 /* MEMBER_FLAGS.HasAttribute */) // filter to only keep props that should match attributes
                .map(([propName, m]) => {
                const attrName = m[1] || propName;
                attrNameToPropName.set(attrName, propName);
                if (m[0] & 512 /* MEMBER_FLAGS.ReflectAttr */) {
                    cmpMeta.$attrsToReflect$.push([propName, attrName]);
                }
                return attrName;
            });
        }
    }
    return Cstr;
};
const initializeComponent = async (elm, hostRef, cmpMeta, hmrVersionId, Cstr) => {
    // initializeComponent
    if ((hostRef.$flags$ & 32 /* HOST_FLAGS.hasInitializedComponent */) === 0) {
        {
            // we haven't initialized this element yet
            hostRef.$flags$ |= 32 /* HOST_FLAGS.hasInitializedComponent */;
            // lazy loaded components
            // request the component's implementation to be
            // wired up with the host element
            Cstr = loadModule(cmpMeta, hostRef);
            if (Cstr.then) {
                // Await creates a micro-task avoid if possible
                const endLoad = uniqueTime();
                Cstr = await Cstr;
                endLoad();
            }
            if (!Cstr) {
                throw new Error(`Constructor for "${cmpMeta.$tagName$}#${hostRef.$modeName$}" was not found`);
            }
            if (!Cstr.isProxied) {
                proxyComponent(Cstr, cmpMeta, 2 /* PROXY_FLAGS.proxyState */);
                Cstr.isProxied = true;
            }
            const endNewInstance = createTime('createInstance', cmpMeta.$tagName$);
            // ok, time to construct the instance
            // but let's keep track of when we start and stop
            // so that the getters/setters don't incorrectly step on data
            {
                hostRef.$flags$ |= 8 /* HOST_FLAGS.isConstructingInstance */;
            }
            // construct the lazy-loaded component implementation
            // passing the hostRef is very important during
            // construction in order to directly wire together the
            // host element and the lazy-loaded instance
            try {
                new Cstr(hostRef);
            }
            catch (e) {
                consoleError(e, elm);
            }
            {
                hostRef.$flags$ &= ~8 /* HOST_FLAGS.isConstructingInstance */;
            }
            endNewInstance();
        }
        if (Cstr.style) {
            // this component has styles but we haven't registered them yet
            let style = Cstr.style;
            if (typeof style !== 'string') {
                style = style[(hostRef.$modeName$ = computeMode(elm))];
            }
            const scopeId = getScopeId(cmpMeta, hostRef.$modeName$);
            if (!styles.has(scopeId)) {
                const endRegisterStyles = createTime('registerStyles', cmpMeta.$tagName$);
                if (cmpMeta.$flags$ & 8 /* CMP_FLAGS.needsShadowDomShim */) {
                    style = await Promise.resolve().then(function () { return require('./shadow-css-39883866.js'); }).then((m) => m.scopeCss(style, scopeId, false));
                }
                registerStyle(scopeId, style, !!(cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */));
                endRegisterStyles();
            }
        }
    }
    // we've successfully created a lazy instance
    const ancestorComponent = hostRef.$ancestorComponent$;
    const schedule = () => scheduleUpdate(hostRef, true);
    if (ancestorComponent && ancestorComponent['s-rc']) {
        // this is the initial load and this component it has an ancestor component
        // but the ancestor component has NOT fired its will update lifecycle yet
        // so let's just cool our jets and wait for the ancestor to continue first
        // this will get fired off when the ancestor component
        // finally gets around to rendering its lazy self
        // fire off the initial update
        ancestorComponent['s-rc'].push(schedule);
    }
    else {
        schedule();
    }
};
const connectedCallback = (elm) => {
    if ((plt.$flags$ & 1 /* PLATFORM_FLAGS.isTmpDisconnected */) === 0) {
        const hostRef = getHostRef(elm);
        const cmpMeta = hostRef.$cmpMeta$;
        const endConnected = createTime('connectedCallback', cmpMeta.$tagName$);
        if (!(hostRef.$flags$ & 1 /* HOST_FLAGS.hasConnected */)) {
            // first time this component has connected
            hostRef.$flags$ |= 1 /* HOST_FLAGS.hasConnected */;
            {
                // initUpdate
                // if the slot polyfill is required we'll need to put some nodes
                // in here to act as original content anchors as we move nodes around
                // host element has been connected to the DOM
                if ((cmpMeta.$flags$ & (4 /* CMP_FLAGS.hasSlotRelocation */ | 8 /* CMP_FLAGS.needsShadowDomShim */))) {
                    setContentReference(elm);
                }
            }
            {
                // find the first ancestor component (if there is one) and register
                // this component as one of the actively loading child components for its ancestor
                let ancestorComponent = elm;
                while ((ancestorComponent = ancestorComponent.parentNode || ancestorComponent.host)) {
                    // climb up the ancestors looking for the first
                    // component that hasn't finished its lifecycle update yet
                    if (ancestorComponent['s-p']) {
                        // we found this components first ancestor component
                        // keep a reference to this component's ancestor component
                        attachToAncestor(hostRef, (hostRef.$ancestorComponent$ = ancestorComponent));
                        break;
                    }
                }
            }
            // Lazy properties
            // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
            if (cmpMeta.$members$) {
                Object.entries(cmpMeta.$members$).map(([memberName, [memberFlags]]) => {
                    if (memberFlags & 31 /* MEMBER_FLAGS.Prop */ && elm.hasOwnProperty(memberName)) {
                        const value = elm[memberName];
                        delete elm[memberName];
                        elm[memberName] = value;
                    }
                });
            }
            {
                initializeComponent(elm, hostRef, cmpMeta);
            }
        }
        else if (hostRef) {
            // not the first time this has connected
            // reattach any event listeners to the host
            // since they would have been removed when disconnected
            addHostEventListeners(elm, hostRef, cmpMeta.$listeners$);
        }
        endConnected();
    }
};
const setContentReference = (elm) => {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    const contentRefElm = (elm['s-cr'] = doc.createComment(`content-ref (host=${elm.localName})` ));
    contentRefElm['s-cn'] = true;
    const firstChild = elm.__firstChild || elm.firstChild;
    if (!!firstChild) {
        elm.__insertBefore ? elm.__insertBefore(contentRefElm, firstChild) : elm.insertBefore(contentRefElm, firstChild);
    }
    else {
        elm.__appendChild ? elm.__appendChild(contentRefElm) : elm.appendChild(contentRefElm);
    }
};
const disconnectedCallback = (elm) => {
    if ((plt.$flags$ & 1 /* PLATFORM_FLAGS.isTmpDisconnected */) === 0) {
        const hostRef = getHostRef(elm);
        const instance = hostRef.$lazyInstance$ ;
        {
            if (hostRef.$rmListeners$) {
                hostRef.$rmListeners$.map((rmListener) => rmListener());
                hostRef.$rmListeners$ = undefined;
            }
        }
        // clear CSS var-shim tracking
        if (plt.$cssShim$) {
            plt.$cssShim$.removeHost(elm);
        }
        {
            safeCall(instance, 'disconnectedCallback', undefined, elm);
        }
    }
};
const bootstrapLazy = (lazyBundles, options = {}) => {
    var _a;
    const endBootstrap = createTime();
    const cmpTags = [];
    const exclude = options.exclude || [];
    const customElements = win.customElements;
    const head = doc.head;
    const metaCharset = /*@__PURE__*/ head.querySelector('meta[charset]');
    const visibilityStyle = /*@__PURE__*/ doc.createElement('style');
    const deferredConnectedCallbacks = [];
    let appLoadFallback;
    let isBootstrapping = true;
    Object.assign(plt, options);
    plt.$resourcesUrl$ = new URL(options.resourcesUrl || './', doc.baseURI).href;
    lazyBundles.map((lazyBundle) => {
        lazyBundle[1].map((compactMeta) => {
            const cmpMeta = {
                $flags$: compactMeta[0],
                $tagName$: compactMeta[1],
                $members$: compactMeta[2],
                $listeners$: compactMeta[3],
            };
            {
                cmpMeta.$members$ = compactMeta[2];
            }
            {
                cmpMeta.$listeners$ = compactMeta[3];
            }
            {
                cmpMeta.$attrsToReflect$ = [];
            }
            if (!supportsShadow && cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
                cmpMeta.$flags$ |= 8 /* CMP_FLAGS.needsShadowDomShim */;
            }
            const tagName = cmpMeta.$tagName$;
            const HostElement = class extends HTMLElement {
                // StencilLazyHost
                constructor(self) {
                    // @ts-ignore
                    super(self);
                    self = this;
                    registerHost(self, cmpMeta);
                    if (cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
                        // this component is using shadow dom
                        // and this browser supports shadow dom
                        // add the read-only property "shadowRoot" to the host element
                        // adding the shadow root build conditionals to minimize runtime
                        if (supportsShadow) {
                            {
                                self.attachShadow({
                                    mode: 'open',
                                    delegatesFocus: !!(cmpMeta.$flags$ & 16 /* CMP_FLAGS.shadowDelegatesFocus */),
                                });
                            }
                        }
                        else if (!('shadowRoot' in self)) {
                            self.shadowRoot = self;
                        }
                    }
                }
                connectedCallback() {
                    if (appLoadFallback) {
                        clearTimeout(appLoadFallback);
                        appLoadFallback = null;
                    }
                    if (isBootstrapping) {
                        // connectedCallback will be processed once all components have been registered
                        deferredConnectedCallbacks.push(this);
                    }
                    else {
                        plt.jmp(() => connectedCallback(this));
                    }
                }
                disconnectedCallback() {
                    plt.jmp(() => disconnectedCallback(this));
                }
                componentOnReady() {
                    return getHostRef(this).$onReadyPromise$;
                }
            };
            if ((cmpMeta.$flags$ & 4 /* CMP_FLAGS.hasSlotRelocation */ ||
                    cmpMeta.$flags$ & (8 /* CMP_FLAGS.needsShadowDomShim */))) {
                patchPseudoShadowDom(HostElement.prototype);
                {
                    patchCloneNode(HostElement.prototype);
                }
            }
            cmpMeta.$lazyBundleId$ = lazyBundle[0];
            if (!exclude.includes(tagName) && !customElements.get(tagName)) {
                cmpTags.push(tagName);
                customElements.define(tagName, proxyComponent(HostElement, cmpMeta, 1 /* PROXY_FLAGS.isElementConstructor */));
            }
        });
    });
    {
        visibilityStyle.innerHTML = cmpTags + HYDRATED_CSS;
        visibilityStyle.setAttribute('data-styles', '');
        // Apply CSP nonce to the style tag if it exists
        const nonce = (_a = plt.$nonce$) !== null && _a !== void 0 ? _a : queryNonceMetaTagContent(doc);
        if (nonce != null) {
            visibilityStyle.setAttribute('nonce', nonce);
        }
        head.insertBefore(visibilityStyle, metaCharset ? metaCharset.nextSibling : head.firstChild);
    }
    // Process deferred connectedCallbacks now all components have been registered
    isBootstrapping = false;
    if (deferredConnectedCallbacks.length) {
        deferredConnectedCallbacks.map((host) => host.connectedCallback());
    }
    else {
        {
            plt.jmp(() => (appLoadFallback = setTimeout(appDidLoad, 30)));
        }
    }
    // Fallback appLoad event
    endBootstrap();
};
const addHostEventListeners = (elm, hostRef, listeners, attachParentListeners) => {
    if (listeners) {
        listeners.map(([flags, name, method]) => {
            const target = getHostListenerTarget(elm, flags) ;
            const handler = hostListenerProxy(hostRef, method);
            const opts = hostListenerOpts(flags);
            plt.ael(target, name, handler, opts);
            (hostRef.$rmListeners$ = hostRef.$rmListeners$ || []).push(() => plt.rel(target, name, handler, opts));
        });
    }
};
const hostListenerProxy = (hostRef, methodName) => (ev) => {
    try {
        {
            if (hostRef.$flags$ & 256 /* HOST_FLAGS.isListenReady */) {
                // instance is ready, let's call it's member method for this event
                hostRef.$lazyInstance$[methodName](ev);
            }
            else {
                (hostRef.$queuedListeners$ = hostRef.$queuedListeners$ || []).push([methodName, ev]);
            }
        }
    }
    catch (e) {
        consoleError(e, hostRef.$hostElement$ || null);
    }
};
const getHostListenerTarget = (elm, flags) => {
    if (flags & 8 /* LISTENER_FLAGS.TargetWindow */)
        return win;
    return elm;
};
// prettier-ignore
const hostListenerOpts = (flags) => (flags & 2 /* LISTENER_FLAGS.Capture */) !== 0;
/**
 * Assigns the given value to the nonce property on the runtime platform object.
 * During runtime, this value is used to set the nonce attribute on all dynamically created script and style tags.
 * @param nonce The value to be assigned to the platform nonce property.
 * @returns void
 */
const setNonce = (nonce) => (plt.$nonce$ = nonce);
const hostRefs = /*@__PURE__*/ new WeakMap();
const getHostRef = (ref) => hostRefs.get(ref);
const registerInstance = (lazyInstance, hostRef) => hostRefs.set((hostRef.$lazyInstance$ = lazyInstance), hostRef);
const registerHost = (elm, cmpMeta) => {
    const hostRef = {
        $flags$: 0,
        $hostElement$: elm,
        $cmpMeta$: cmpMeta,
        $instanceValues$: new Map(),
    };
    {
        hostRef.$onInstancePromise$ = new Promise((r) => (hostRef.$onInstanceResolve$ = r));
    }
    {
        hostRef.$onReadyPromise$ = new Promise((r) => (hostRef.$onReadyResolve$ = r));
        elm['s-p'] = [];
        elm['s-rc'] = [];
    }
    addHostEventListeners(elm, hostRef, cmpMeta.$listeners$);
    return hostRefs.set(elm, hostRef);
};
const isMemberInElement = (elm, memberName) => memberName in elm;
const consoleError = (e, el) => (0, console.error)(e, el);
const cmpModules = /*@__PURE__*/ new Map();
const loadModule = (cmpMeta, hostRef, hmrVersionId) => {
    // loadModuleImport
    const exportName = cmpMeta.$tagName$.replace(/-/g, '_');
    const bundleId = cmpMeta.$lazyBundleId$;
    const module = cmpModules.get(bundleId) ;
    if (module) {
        return module[exportName];
    }
    /*!__STENCIL_STATIC_IMPORT_SWITCH__*/
    return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(
    /* @vite-ignore */
    /* webpackInclude: /\.entry\.js$/ */
    /* webpackExclude: /\.system\.entry\.js$/ */
    /* webpackMode: "lazy" */
    `./${bundleId}.entry.js${''}`)); }).then((importedModule) => {
        if (bundleId) {
            cmpModules.set(bundleId, importedModule);
        }
        return importedModule[exportName];
    }, (e) => {
        consoleError(e, hostRef.$hostElement$);
    });
};
const styles = /*@__PURE__*/ new Map();
const modeResolutionChain = [];
const win = typeof window !== 'undefined' ? window : {};
const CSS = win.CSS ;
const doc = win.document || { head: {} };
const H = (win.HTMLElement || class {
});
const plt = {
    $flags$: 0,
    $resourcesUrl$: '',
    jmp: (h) => h(),
    raf: (h) => requestAnimationFrame(h),
    ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
    rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
    ce: (eventName, opts) => new CustomEvent(eventName, opts),
};
const supportsShadow = /*@__PURE__*/ (() => (doc.head.attachShadow + '').indexOf('[native') > -1)()
    ;
const promiseResolve = (v) => Promise.resolve(v);
const supportsConstructableStylesheets = /*@__PURE__*/ (() => {
        try {
            new CSSStyleSheet();
            return typeof new CSSStyleSheet().replaceSync === 'function';
        }
        catch (e) { }
        return false;
    })()
    ;
const queueDomReads = [];
const queueDomWrites = [];
const queueTask = (queue, write) => (cb) => {
    queue.push(cb);
    if (!queuePending) {
        queuePending = true;
        if (write && plt.$flags$ & 4 /* PLATFORM_FLAGS.queueSync */) {
            nextTick(flush);
        }
        else {
            plt.raf(flush);
        }
    }
};
const consume = (queue) => {
    for (let i = 0; i < queue.length; i++) {
        try {
            queue[i](performance.now());
        }
        catch (e) {
            consoleError(e);
        }
    }
    queue.length = 0;
};
const flush = () => {
    // always force a bunch of medium callbacks to run, but still have
    // a throttle on how many can run in a certain time
    // DOM READS!!!
    consume(queueDomReads);
    // DOM WRITES!!!
    {
        consume(queueDomWrites);
        if ((queuePending = queueDomReads.length > 0)) {
            // still more to do yet, but we've run out of time
            // let's let this thing cool off and try again in the next tick
            plt.raf(flush);
        }
    }
};
const nextTick = (cb) => promiseResolve().then(cb);
const writeTask = /*@__PURE__*/ queueTask(queueDomWrites, true);

exports.Build = Build;
exports.CSS = CSS;
exports.H = H;
exports.Host = Host;
exports.NAMESPACE = NAMESPACE;
exports.bootstrapLazy = bootstrapLazy;
exports.createEvent = createEvent;
exports.doc = doc;
exports.getElement = getElement;
exports.getMode = getMode;
exports.h = h;
exports.plt = plt;
exports.promiseResolve = promiseResolve;
exports.registerInstance = registerInstance;
exports.setMode = setMode;
exports.setNonce = setNonce;
exports.win = win;
