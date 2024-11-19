const t = "testprerender";

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */ let e, n, o, i = !1, l = !1, s = !1, r = !1;

const c = "s-id", f = "sty-id", u = "c-id", d = "sf-id", a = {}, isComplexType = t => "object" === (
// https://jsperf.com/typeof-fn-object/5
t = typeof t) || "function" === t;

/**
 * Helper method for querying a `meta` tag that contains a nonce value
 * out of a DOM's head.
 *
 * @param doc The DOM containing the `head` to query against
 * @returns The content of the meta tag representing the nonce value, or `undefined` if no tag
 * exists or the tag has no content.
 */
function queryNonceMetaTagContent(t) {
  var e, n, o;
  return null !== (o = null === (n = null === (e = t.head) || void 0 === e ? void 0 : e.querySelector('meta[name="csp-nonce"]')) || void 0 === n ? void 0 : n.getAttribute("content")) && void 0 !== o ? o : void 0;
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
const h = (t, e, ...n) => {
  let o = null, i = null, l = !1, s = !1;
  const r = [], walk = e => {
    for (let n = 0; n < e.length; n++) o = e[n], Array.isArray(o) ? walk(o) : null != o && "boolean" != typeof o && ((l = "function" != typeof t && !isComplexType(o)) && (o += ""), 
    l && s ? 
    // If the previous child was simple (string), we merge both
    r[r.length - 1]._$$text$$_ += o : 
    // Append a new vNode, if it's text, we create a text vNode
    r.push(l ? newVNode(null, o) : o), s = l);
  };
  if (walk(n), e) {
    e.name && (i = e.name);
    {
      const t = e.className || e.class;
      t && (e.class = "object" != typeof t ? t : Object.keys(t).filter((e => t[e])).join(" "));
    }
  }
  const c = newVNode(t, null);
  return c._$$attrs$$_ = e, r.length > 0 && (c._$$children$$_ = r), c._$$name$$_ = i, 
  c;
}, newVNode = (t, e) => {
  const n = {
    _$$flags$$_: 0,
    _$$tag$$_: t,
    _$$text$$_: e,
    _$$elm$$_: null,
    _$$children$$_: null,
    _$$attrs$$_: null,
    _$$name$$_: null
  };
  return n;
}, $ = {}, renderSlotFallbackContent = (t, e) => {
  // if this slot doesn't have fallback content, return
  if (!t["s-hsf"] || !t.parentNode) return;
  // in non-shadow component, slot nodes are just empty text nodes or comment nodes
  // the 'children' nodes are therefore placed next to it.
  // let's loop through those now
    let n, o = t.parentNode.__childNodes || t.parentNode.childNodes;
  const i = o.length;
  let l = 0;
  for (;l < i; l++) n = o[l], n["s-sr"] && e && n["s-psn"] === t["s-sn"] ? 
  // if this child node is a nested slot
  // drill into it's children to hide them in-turn
  renderSlotFallbackContent(n, !0) : 
  // this child node doesn't relate to this slot?
  n["s-sn"] === t["s-sn"] && (1 /* NODE_TYPE.ElementNode */ === n.nodeType && n["s-sf"] ? (
  // we found an fallback element. Hide or show
  n.hidden = e, n.style.display = e ? "none" : "") : n["s-sfc"] && (
  // this child has fallback text. Add or remove it
  e ? (n["s-sfc"] = n.textContent || void 0, n.textContent = "") : n.textContent && "" !== n.textContent.trim() || (n.textContent = n["s-sfc"])));
}, updateFallbackSlotVisibility = t => {
  if (!t) return;
  const e = t.__childNodes || t.childNodes;
  let n, o, i, l, s, r;
  for (o = 0, i = e.length; o < i; o++) {
    // slot reference node?
    if (e[o]["s-sr"]) 
    // because we found a slot fallback node let's loop over all
    // the children again to
    for (
    // this component uses slots and we're on a slot node
    // let's find all it's slotted children or lack thereof
    // and show or hide fallback nodes (`<slot />` children)
    // get the slot name for this slot reference node
    s = e[o]["s-sn"], n = e[o], 
    // by default always show a fallback slot node
    // then hide it if there are other slotted nodes in the light dom
    renderSlotFallbackContent(n, !1), l = 0; l < i; l++) 
    // ignore slot fallback nodes
    if (r = e[l].nodeType, !e[l]["s-sf"]) 
    // is sibling node is from a different component OR is a named fallback slot node?
    if (e[l]["s-hn"] !== n["s-hn"] || "" !== s) {
      // you can't slot a textNode in a named slot
      if (1 /* NODE_TYPE.ElementNode */ === r && s === e[l]["s-sn"]) {
        // we found a slotted element!
        // let's hide all the fallback nodes
        renderSlotFallbackContent(n, !0), 
        // patches this node's removal methods
        // so if it gets removed in the future
        // re-asses the fallback node status
        patchRemove(e[l]);
        break;
      }
    } else if (e[l]["s-sn"] === s && (1 /* NODE_TYPE.ElementNode */ === r || 3 /* NODE_TYPE.TextNode */ === r && e[l] && e[l].textContent && "" !== e[l].textContent.trim())) {
      // we found a slotted something
      // let's hide all the fallback nodes
      renderSlotFallbackContent(n, !0), 
      // patches this node's removal methods
      // so if it gets removed in the future
      // re-asses the fallback node status
      patchRemove(e[l]);
      break;
    }
    // keep drilling down
        updateFallbackSlotVisibility(e[o]);
  }
}, patchChildNodes = (t, e) => {
  if (!globalThis.Node) return;
  class n extends Array {
    item(t) {
      return this[t];
    }
  }
  let o = Object.getOwnPropertyDescriptor(e || Node.prototype, "childNodes");
  o || (o = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Node.prototype), "childNodes")), 
  o && Object.defineProperty(t, "__childNodes", o);
  let i = Object.getOwnPropertyDescriptor(e || Element.prototype, "children");
  // MockNode won't have these
    i && Object.defineProperty(t, "__children", i);
  const l = Object.getOwnPropertyDescriptor(e || Element.prototype, "childElementCount");
  l && Object.defineProperty(t, "__childElementCount", l), Object.defineProperty(t, "children", {
    get() {
      return this.childNodes.map((t => 1 /* NODE_TYPE.ElementNode */ === t.nodeType ? t : null)).filter((t => !!t));
    }
  }), Object.defineProperty(t, "firstChild", {
    get() {
      return this.childNodes[0];
    }
  }), Object.defineProperty(t, "lastChild", {
    get() {
      return this.childNodes[this.childNodes.length - 1];
    }
  }), Object.defineProperty(t, "childElementCount", {
    get: () => t.children.length
  }), o && Object.defineProperty(t, "childNodes", {
    get() {
      const t = this.__childNodes, e = new n;
      for (let n = 0; n < t.length; n++) {
        const o = t[n]["s-nr"];
        !o || 8 /* NODE_TYPE.CommentNode */ === o.nodeType && 0 === o.nodeValue.indexOf("o.") || e.push(o);
      }
      return e;
    }
  });
}, patchInnerHTML = (t, e) => {
  if (!globalThis.Element) return;
  let n = Object.getOwnPropertyDescriptor(e || Element.prototype, "innerHTML");
  // on IE it's on HTMLElement.prototype
    n || (n = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML")), 
  // MockNode won't have these
  n && Object.defineProperty(t, "__innerHTML", n), Object.defineProperty(t, "innerHTML", {
    get: function() {
      let t = "";
      return this.childNodes.forEach((e => t += e.outerHTML || e.textContent)), t;
    },
    set: function(t) {
      this.childNodes.forEach((t => {
        if (t["s-ol"]) try {
          t["s-ol"].remove();
        } catch (t) {}
        t.remove();
      })), this.insertAdjacentHTML("beforeend", t);
    }
  });
}, patchInnerText = (t, e) => {
  if (!globalThis.Element) return;
  let n = Object.getOwnPropertyDescriptor(e || Element.prototype, "innerText");
  // on IE it's on HTMLElement.prototype
    n || (n = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerText")), 
  // MockNode won't have these
  n && Object.defineProperty(t, "__innerText", n), Object.defineProperty(t, "innerText", {
    get: function() {
      let t = "";
      return this.childNodes.forEach((e => {
        e.innerText ? t += e.innerText : e.textContent && (t += e.textContent.trimEnd());
      })), t;
    },
    set: function(t) {
      this.childNodes.forEach((t => {
        t["s-ol"] && t["s-ol"].remove(), t.remove();
      })), this.insertAdjacentHTML("beforeend", t);
    }
  });
}, patchTextContent = (t, e) => {
  if (!globalThis.Node) return;
  const n = Object.getOwnPropertyDescriptor(e || Node.prototype, "textContent");
  // MockNode won't have these
    n && Object.defineProperty(t, "__textContent", n), Object.defineProperty(t, "textContent", {
    get: function() {
      let t = "";
      return this.childNodes.forEach((e => t += e.textContent || "")), t;
    },
    set: function(t) {
      this.childNodes.forEach((t => {
        t["s-ol"] && t["s-ol"].remove(), t.remove();
      })), this.insertAdjacentHTML("beforeend", t);
    }
  });
}, patchInsertBefore = t => {
  t.__insertBefore || (t.__insertBefore = t.insertBefore, t.insertBefore = function(t, e) {
    const n = t["s-sn"] = getSlotName(t), o = getHostSlotNode(this.__childNodes, n);
    if (o) {
      let i = !1;
      if (this.childNodes.forEach((l => {
        // we found the node in our list of other 'lightDOM' / slotted nodes
        if (l !== e && null !== e) ; else {
          if (i = !0, addSlotRelocateNode(t, o), null === e) return void this.__append(t);
          if (n === e["s-sn"]) {
            (e.parentNode.__insertBefore || e.parentNode.insertBefore).call(e.parentNode, t, e), 
            patchRemove(t);
          } else 
          // current child is not in the same slot as 'slot before' node
          // so just toss the node in wherever
          this.__append(t);
        }
      })), i) return t;
    }
    return this.__insertBefore(t, e);
  });
}, patchAppendChild = t => {
  t.__appendChild || (t.__appendChild = t.appendChild, t.appendChild = function(t) {
    const e = t["s-sn"] = getSlotName(t), n = getHostSlotNode(this.__childNodes || this.childNodes, e);
    if (n) {
      addSlotRelocateNode(t, n);
      const e = getHostSlotChildNodes(n), o = e[e.length - 1];
      if (o.parentNode) {
        const e = o.parentNode;
        e.__insertBefore ? e.__insertBefore(t, o.nextSibling) : e.insertBefore(t, o.nextSibling), 
        patchRemove(t);
      }
      return n["s-hsf"] && updateFallbackSlotVisibility(n.parentNode), t;
    }
    return 1 /* NODE_TYPE.ElementNode */ === t.nodeType && t.getAttribute("slot") && this.__childNodes && (t.hidden = !0), 
    this.__appendChild(t);
  });
}, patchPrepend = t => {
  t.__prepend || (t.__prepend = t.prepend, t.prepend = function(...t) {
    t.forEach((t => {
      "string" == typeof t && (t = this.ownerDocument.createTextNode(t));
      const e = t["s-sn"] = getSlotName(t), n = getHostSlotNode(this.__childNodes, e);
      if (n) {
        addSlotRelocateNode(t, n);
        const e = getHostSlotChildNodes(n)[0];
        return e.parentNode && (e.parentNode.insertBefore(t, e.nextSibling), patchRemove(t)), 
        void (n["s-hsf"] && updateFallbackSlotVisibility(n.parentNode));
      }
      return 1 /* NODE_TYPE.ElementNode */ === t.nodeType && t.getAttribute("slot") && this.__childNodes && (t.hidden = !0), 
      this.__prepend(t);
    }));
  });
}, patchAppend = t => {
  t.__append || (t.__append = t.append, t.append = function(...t) {
    t.forEach((t => {
      "string" == typeof t && (t = this.ownerDocument.createTextNode(t)), this.appendChild(t);
    }));
  });
}, patchReplaceChildren = t => {
  t.__replaceChildren || (t.__replaceChildren = t.replaceChildren, t.replaceChildren = function(...t) {
    const e = getHostSlotNode(this.__childNodes, "");
    if (e) {
      getHostSlotChildNodes(e).forEach((t => {
        t["s-sr"] || t.remove();
      })), this.append(...t);
    }
  });
}, patchInsertAdjacentHTML = t => {
  t.__insertAdjacentHTML || (t.__insertAdjacentHTML = t.insertAdjacentHTML, t.insertAdjacentHTML = function(t, e) {
    if ("afterbegin" !== t && "beforeend" !== t) return this.__insertAdjacentHTML(t, e);
    const n = this.ownerDocument.createElement("_");
    let o;
    if (n.innerHTML = e, "afterbegin" === t) for (;o = n.firstChild; ) this.prepend(o); else if ("beforeend" === t) for (;o = n.firstChild; ) this.append(o);
  });
}, patchInsertAdjacentText = t => {
  t.__insertAdjacentText || (t.__insertAdjacentText = t.insertAdjacentText, t.insertAdjacentText = function(t, e) {
    this.insertAdjacentHTML(t, e);
  });
}, patchInsertAdjacentElement = t => {
  t.__insertAdjacentElement || (t.__insertAdjacentElement = t.insertAdjacentElement, 
  t.insertAdjacentElement = function(t, e) {
    if ("afterbegin" !== t && "beforeend" !== t) return this.__insertAdjacentElement(t, e);
    "afterbegin" === t ? this.prepend(e) : "beforeend" === t && this.append(e);
  });
}, patchNextPrev = t => {
  // Especially relevant when rendering components via SSR.
  // Frameworks will often try to reconcile their VDOM with the real DOM
  // by stepping through nodes with 'nextSibling' (and similar).
  // This works with a shadowDOM; the lightDOM matches the framework's VDOM.
  // This doesn't work without shadowDOM
  t && !t.__nextSibling && globalThis.Node && (patchNextSibling(t), patchPreviousSibling(t), 
  patchNextElementSibling(t), patchPreviousElementSibling(t));
}, patchNextSibling = (t, e) => {
  if (!t || t.__nextSibling) return;
  const n = Object.getOwnPropertyDescriptor(e || Node.prototype, "nextSibling");
  // MockNode might not have these
    n ? Object.defineProperty(t, "__nextSibling", n) : t.__nextSibling = t.nextSibling || !0, 
  Object.defineProperty(t, "nextSibling", {
    get: function() {
      var t;
      const e = null === (t = this["s-ol"]) || void 0 === t ? void 0 : t.parentNode.childNodes, n = null == e ? void 0 : e.indexOf(this);
      return e && n > -1 ? e[n + 1] : this.__nextSibling;
    }
  });
}, patchNextElementSibling = (t, e) => {
  if (!t || t.__nextElementSibling || !t.nextSiblingElement) return;
  const n = Object.getOwnPropertyDescriptor(e || Element.prototype, "nextElementSibling");
  // MockNode won't have these
    n ? Object.defineProperty(t, "__nextElementSibling", n) : t.__nextElementSibling = t.nextSiblingElement || !0, 
  Object.defineProperty(t, "nextElementSibling", {
    get: function() {
      var t;
      const e = null === (t = this["s-ol"]) || void 0 === t ? void 0 : t.parentNode.children, n = null == e ? void 0 : e.indexOf(this);
      return e && n > -1 ? e[n + 1] : this.__nextElementSibling;
    }
  });
}, patchPreviousSibling = (t, e) => {
  if (!t || t.__previousSibling) return;
  const n = Object.getOwnPropertyDescriptor(e || Node.prototype, "previousSibling");
  // MockNode won't have these
    n ? Object.defineProperty(t, "__previousSibling", n) : t.__previousSibling = t.previousSibling || !0, 
  Object.defineProperty(t, "previousSibling", {
    get: function() {
      var t;
      const e = null === (t = this["s-ol"]) || void 0 === t ? void 0 : t.parentNode.childNodes, n = null == e ? void 0 : e.indexOf(this);
      return e && n > -1 ? e[n - 1] : this.__previousSibling;
    }
  });
}, patchPreviousElementSibling = (t, e) => {
  if (!t || t.__previousElementSibling || !t.previousElementSibling) return;
  const n = Object.getOwnPropertyDescriptor(e || Element.prototype, "previousElementSibling");
  // MockNode won't have these
    n ? Object.defineProperty(t, "__previousElementSibling", n) : t.__previousElementSibling = t.previousSiblingElement || !0, 
  Object.defineProperty(t, "previousElementSibling", {
    get: function() {
      var t;
      const e = null === (t = this["s-ol"]) || void 0 === t ? void 0 : t.parentNode.children, n = null == e ? void 0 : e.indexOf(this);
      return e && n > -1 ? e[n - 1] : this.__previousElementSibling;
    }
  });
}, patchRemove = t => {
  t && !t.__remove && (t.__remove = t.remove || !0, patchRemoveChild(t.parentNode), 
  t.remove = function() {
    return this.parentNode ? this.parentNode.removeChild(this) : this.__remove();
  });
}, patchRemoveChild = t => {
  t && !t.__removeChild && (t.__removeChild = t.removeChild, t.removeChild = function(t) {
    if (t && void 0 !== t["s-sn"]) {
      const e = getHostSlotNode(this.__childNodes || this.childNodes, t["s-sn"]);
      return t.parentElement.__removeChild(t), void (e && e["s-hsf"] && updateFallbackSlotVisibility(e.parentElement));
    }
    return this.__removeChild(t);
  });
}, addSlotRelocateNode = (t, e, n) => {
  if (t["s-ol"] && t["s-ol"].isConnected) return;
  const o = document.createTextNode("");
  if (o["s-nr"] = t, e["s-cr"] && e["s-cr"].parentNode) {
    const t = e["s-cr"].parentNode, i = t.__appendChild || t.appendChild;
    if (void 0 !== n) {
      o["s-oo"] = n;
      const l = t.__childNodes || t.childNodes, s = [ o ];
      l.forEach((t => {
        t["s-nr"] && s.push(t);
      })), s.sort(((t, e) => !t["s-oo"] || t["s-oo"] < e["s-oo"] ? -1 : !e["s-oo"] || e["s-oo"] < t["s-oo"] ? 1 : 0)), 
      s.forEach((t => i.call(e["s-cr"].parentNode, t)));
    } else i.call(e["s-cr"].parentNode, o);
  }
  t["s-ol"] = o;
}, getSlotName = t => t["s-sn"] || 1 /* NODE_TYPE.ElementNode */ === t.nodeType && t.getAttribute("slot") || t.slot || ""
/**
 * Recursively searches a series of child nodes for a slot with the provided name.
 * @param childNodes the nodes to search for a slot with a specific name.
 * @param slotName the name of the slot to match on.
 * @returns a reference to the slot node that matches the provided name, `null` otherwise
 */ , getHostSlotNode = (t, e) => {
  let n, o = 0;
  if (!t) return null;
  for (;o < t.length; o++) {
    if (n = t[o], n["s-sr"] && n["s-sn"] === e) return n;
    if (n = getHostSlotNode(n.childNodes, e), n) return n;
  }
  return null;
}, getHostSlotChildNodes = t => {
  const e = [ t ], n = t["s-sn"] || "";
  for (;(t = t.nextSibling) && t["s-sn"] === n; ) e.push(t);
  return e;
}, clientHydrate = (t, e, n, o, i, l, s, r = []) => {
  let c, f, a, $;
  const b = i["s-sc"];
  if (1 /* NODE_TYPE.ElementNode */ === l.nodeType) {
    if (c = l.getAttribute(u), c && (
    // got the node data from the element's attribute
    // `${hostId}.${nodeId}.${depth}.${index}`
    f = c.split("."), f[0] === s || "0" === f[0])) {
      a = createSimpleVNode({
        _$$hostId$$_: f[0],
        _$$nodeId$$_: f[1],
        _$$depth$$_: f[2],
        _$$index$$_: f[3],
        _$$tag$$_: l.tagName.toLowerCase(),
        _$$elm$$_: l,
        // if we don't add the initial classes to the VNode,
        // the first vdom-render patch / reconciliation will fail;
        // any client side change before componentDidLoad will be ignored,
        // `setAccessor` will just take the element's initial classes
        _$$attrs$$_: {
          class: l.className
        }
      }), e.push(a), l.removeAttribute(u), 
      // this is a new child vnode
      // so ensure it's parent vnode has the vchildren array
      t._$$children$$_ || (t._$$children$$_ = []);
      // test if this element was 'slotted'
      // recreate node attributes
      const s = a._$$elm$$_.getAttribute("s-sn");
      "string" == typeof s && (a._$$elm$$_["s-sn"] = s, a._$$elm$$_.removeAttribute("s-sn"));
      // test if this node is the child (a slot fallback node) of a slot
            const r = a._$$elm$$_.getAttribute(d);
      if (r) {
        a._$$elm$$_.removeAttribute(d);
        // find the relevant slot node
        const t = n.find((t => t._$$elm$$_["s-sn"] === a._$$elm$$_["s-sn"] || t._$$name$$_ === a._$$elm$$_["s-sn"]));
        // add the relationship to the VDOM to stop re-renders
                t && (a._$$elm$$_["s-sf"] = !0, a._$$elm$$_["s-hn"] = i.tagName, t._$$children$$_ = t._$$children$$_ || [], 
        t._$$children$$_[a._$$index$$_] = a, 
        // if the slot is an actual `<slot>`
        // that's a newly created node (↓↓↓)
        // move this element there now
        1 /* NODE_TYPE.ElementNode */ === t._$$elm$$_.nodeType && t._$$elm$$_.appendChild(a._$$elm$$_));
      } else void 0 !== a._$$index$$_ && (
      // add our child vnode to a specific index of the vnode's children
      t._$$children$$_[a._$$index$$_] = a);
      // host is `scoped: true` - add that flag to child.
      // used in 'setAccessor' to make sure our scoped class is present
            b && (l["s-si"] = b), 
      // this is now the new parent vnode for all the next child checks
      t = a, o && "0" === a._$$depth$$_ && 
      // don't move slot fallback node into the root nodes array
      // they'll be moved into a new slot element ↓↓↓
      !r && (o[a._$$index$$_] = a._$$elm$$_);
    }
    // recursively drill down, end to start so we can
    // construct a VDOM and add meta to nodes
        const m = l.__childNodes || l.childNodes;
    for ($ = m.length - 1; $ >= 0; $--) clientHydrate(t, e, n, o, i, m[$], s, r);
    if (l.shadowRoot) 
    // keep drilling down through the shadow root nodes
    for ($ = l.shadowRoot.childNodes.length - 1; $ >= 0; $--) clientHydrate(t, e, n, o, i, l.shadowRoot.childNodes[$], s, r);
  } else if (8 /* NODE_TYPE.CommentNode */ === l.nodeType) {
    if (
    // `${COMMENT_TYPE}.${hostId}.${nodeId}.${depth}.${index}.${isSlotFallbackText}.${slotName}`
    f = l.nodeValue.split("."), f[1] === s || "0" === f[1]) if (
    // comment node for either the host id or a 0 host id
    c = f[0], a = createSimpleVNode({
      _$$hostId$$_: f[1],
      _$$nodeId$$_: f[2],
      _$$depth$$_: f[3],
      _$$index$$_: f[4] || "0",
      _$$elm$$_: l
    }), "t" === c) {
      let r = a._$$elm$$_ = l.nextSibling;
      if (a._$$elm$$_ && 3 /* NODE_TYPE.TextNode */ === a._$$elm$$_.nodeType) 
      // test to see if this is slot fallback text
      if (a._$$text$$_ = a._$$elm$$_.textContent, e.push(a), 
      // remove the text comment since it's no longer needed
      l.remove(), "1" === f[5]) {
        r["s-sf"] = !0, r["s-sn"] = f[6] || "", r["s-sfc"] = r.textContent, r["s-hn"] = i.tagName;
        // find the relevant slot node
        const t = n.find((t => t._$$elm$$_["s-sn"] === r["s-sn"] || t._$$name$$_ === r["s-sn"]));
        // add the relationship to the VDOM to stop re-renders
                t && (t._$$children$$_ = t._$$children$$_ || [], t._$$children$$_[a._$$index$$_] = a, 
        // if the slot is an actual `<slot>`
        // that's a newly created node (↓↓↓)
        // move this text node there now
        1 /* NODE_TYPE.ElementNode */ === t._$$elm$$_.nodeType && t._$$elm$$_.appendChild(r));
      } else 
      // check to make sure this node actually belongs to this host.
      // If it was slotted from another component, we don't want to add it
      // to this host's vdom; it can be removed on render reconciliation.
      // We want slotting logic to take care of it
      s === a._$$hostId$$_ && (t._$$children$$_ || (t._$$children$$_ = []), t._$$children$$_[a._$$index$$_] = a), 
      o && "0" === a._$$depth$$_ && (o[a._$$index$$_] = a._$$elm$$_);
    } else if ("c" === c) a._$$elm$$_ = l.nextSibling, a._$$elm$$_ && 8 /* NODE_TYPE.CommentNode */ === a._$$elm$$_.nodeType && (e.push(a), 
    // remove the comment comment since it's no longer needed
    l.remove()); else if (a._$$hostId$$_ === s) 
    // this comment node is specifically for this host id
    if ("s" === c) {
      // `${SLOT_NODE_ID}.${hostId}.${nodeId}.${depth}.${index}.${slotName}.${hasSlotFallback}.${slotFallbackText}`;
      a._$$tag$$_ = "slot", 
      // TODO: this is clunky.
      // Clear out parent VNode attrs so the initial element state is used as a reference.
      // The reason: this is a slot container element and requires special scope classes
      // This does mean any class changes client-side before 'componentDidLoad',
      // will not be respected.
      t._$$attrs$$_ = void 0;
      // add slot name
      const i = l["s-sn"] = a._$$name$$_ = f[5] || "";
      if (l["s-sr"] = !0, 
      // this slot node has fallback nodes?
      "1" === f[6] && (l["s-hsf"] = !0), "1" === f[7]) {
        // this slot has fallback text
        // it should be held in the previous comment node
        // (white-space depending)
        let t = l.previousSibling;
        for (;t && 8 /* NODE_TYPE.CommentNode */ !== t.nodeType; ) t = t.previousSibling;
        // this slot node has fallback text?
        // (if so, the previous node comment will have that text)
                l["s-sfc"] = t.nodeValue;
      }
      // find this slots' current host parent as dictated by the vdom tree.
      // this is important because where it is now in the constructed SSR markup
      // might be different to where to should be
            const s = (null == t ? void 0 : t._$$elm$$_) ? t._$$elm$$_["s-id"] || t._$$elm$$_.getAttribute("s-id") : "";
      if (o) {
        /* SHADOW */
        // browser supports shadowRoot and this is a shadow dom component
        // create an actual slot element
        const e = a._$$elm$$_ = S.createElement(a._$$tag$$_);
        a._$$name$$_ && 
        // add the slot name attribute
        a._$$elm$$_.setAttribute("name", i), s && s !== a._$$hostId$$_ ? 
        // shadow component's slot is placed inside a nested component's shadowDOM;
        // it doesn't belong to this host - it was forwarded by the SSR markup.
        // Insert it in the root of this host; it's lightDOM.
        // It doesn't really matter where in the host root; the component will take care of it.
        t._$$elm$$_.insertBefore(e, t._$$elm$$_.children[0]) : 
        // insert the new slot element before the slot comment
        l.parentNode.insertBefore(a._$$elm$$_, l), addSlottedNodes(r, f[2], i, l, a._$$hostId$$_), 
        // remove the slot comment since it's not needed for shadow
        l.remove(), "0" === a._$$depth$$_ && (o[a._$$index$$_] = a._$$elm$$_);
      } else {
        /* NON-SHADOW */
        const n = a._$$elm$$_, o = s && s !== a._$$hostId$$_ && t._$$elm$$_.shadowRoot;
        // test to see if this non-shadow component's mock 'slot' is placed
        // inside a nested component's shadowDOM. If so, it doesn't belong here;
        // it was forwarded by the SSR markup. So we'll insert it into the root of this host;
        // it's lightDOM with accompanying 'slotted' nodes
                // attempt to find any mock slotted nodes which we'll move later
        addSlottedNodes(r, f[2], i, l, o ? s : a._$$hostId$$_), o && 
        // move slot comment node (to after any other comment nodes)
        t._$$elm$$_.insertBefore(n, t._$$elm$$_.children[0]), e.push(a);
      }
      n.push(a), t._$$children$$_ || (t._$$children$$_ = []), t._$$children$$_[a._$$index$$_] = a;
    } else "r" === c && (
    // `${CONTENT_REF_ID}.${hostId}`;
    o ? 
    // remove the content ref comment since it's not needed for shadow
    l.remove() : (i["s-cr"] = l, l["s-cn"] = !0));
  } else if (t && "style" === t._$$tag$$_) {
    const e = newVNode(null, l.textContent);
    e._$$elm$$_ = l, e._$$index$$_ = "0", t._$$children$$_ = [ e ];
  }
  return t;
}, initializeDocumentHydrate = (t, e) => {
  if (1 /* NODE_TYPE.ElementNode */ === t.nodeType) {
    // add all the loaded component IDs in this document
    // they're required to find nodes later
    // when deciding where slotted nodes should live
    const n = t[c] || t.getAttribute(c);
    n && e.set(n, t);
    let o = 0;
    const i = t.__childNodes || t.childNodes;
    for (;o < i.length; o++) initializeDocumentHydrate(i[o], e);
    if (t.shadowRoot) for (o = 0; o < t.shadowRoot.childNodes.length; o++) initializeDocumentHydrate(t.shadowRoot.childNodes[o], e);
  } else if (8 /* NODE_TYPE.CommentNode */ === t.nodeType) {
    const n = t.nodeValue.split(".");
    "o" === n[0] && (e.set(n[1] + "." + n[2], t), 
    // useful to know if the original location is
    // the root light-dom of a shadow dom component
    t["s-en"] = n[3]);
  }
}, createSimpleVNode = t => Object.assign(Object.assign({}, {
  _$$flags$$_: 0,
  _$$hostId$$_: null,
  _$$nodeId$$_: null,
  _$$depth$$_: null,
  _$$index$$_: "0",
  _$$elm$$_: null,
  _$$attrs$$_: null,
  _$$children$$_: null,
  _$$key$$_: null,
  _$$name$$_: null,
  _$$tag$$_: null,
  _$$text$$_: null
}), t), addSlottedNodes = (t, e, n, o, i) => {
  let l = o.nextSibling;
  // looking for nodes that match this slot's name,
  // OR are text / comment nodes and the slot is a default slot (no name)
  // (text / comments cannot be direct descendants of named slots)
  // also ignore slot fallback nodes
  for (t[e] = t[e] || []; l && (l["s-sn"] === n || "" === n && !l["s-sn"] && (8 /* NODE_TYPE.CommentNode */ === l.nodeType && 1 !== l.nodeValue.indexOf(".") || 3 /* NODE_TYPE.TextNode */ === l.nodeType)) && !l["s-sf"]; ) l["s-sn"] = n, 
  t[e].push({
    slot: o,
    node: l,
    hostId: i
  }), l = l.nextSibling;
}, emitEvent = (t, e, n) => {
  const o = w.ce(e, n);
  return t.dispatchEvent(o), o;
}, b =  new WeakMap, registerStyle = (t, e, n) => {
  let o = j.get(t);
  T && n ? (o = o || new CSSStyleSheet, "string" == typeof o ? o = e : o.replaceSync(e)) : o = e, 
  j.set(t, o);
}, addStyle = (t, e, n, o) => {
  var i;
  let l = getScopeId(e);
  const s = j.get(l);
  // if an element is NOT connected then getRootNode() will return the wrong root node
  // so the fallback is to always use the document for the root node in those cases
    if (t = 11 /* NODE_TYPE.DocumentFragment */ === t.nodeType ? t : S, s) if ("string" == typeof s) {
    t = t.head || t;
    let e, n = b.get(t);
    if (n || b.set(t, n = new Set), !n.has(l)) {
      if (t.host && (e = t.querySelector(`[${f}="${l}"]`))) 
      // This is only happening on native shadow-dom, do not needs CSS var shim
      e.innerHTML = s; else {
        e = S.createElement("style"), e.innerHTML = s;
        // Apply CSP nonce to the style tag if it exists
        const n = null !== (i = w._$$nonce$$_) && void 0 !== i ? i : queryNonceMetaTagContent(S);
        null != n && e.setAttribute("nonce", n), t.insertBefore(e, t.querySelector("link"));
      }
      n && n.add(l);
    }
  } else t.adoptedStyleSheets.includes(s) || (t.adoptedStyleSheets = [ ...t.adoptedStyleSheets, s ]);
  return l;
}, getScopeId = (t, e) => "sc-" + t._$$tagName$$_, setAccessor = (t, e, n, o, i, l) => {
  if (n !== o) {
    let s = isMemberInElement(t, e);
    if (e.toLowerCase(), "class" === e) {
      const e = t.classList, i = parseClassList(n), l = parseClassList(o);
      // for `scoped: true` components, new nodes after initial hydration
      // from SSR don't have the slotted class added. Let's add that now
      t["s-si"] && l.indexOf(t["s-si"]) < 0 && l.push(t["s-si"]), e.remove(...i.filter((t => t && !l.includes(t)))), 
      e.add(...l.filter((t => t && !i.includes(t))));
    } else {
      // Set property if it exists and it's not a SVG
      const r = isComplexType(o);
      if ((s || r && null !== o) && !i) try {
        if (t.tagName.includes("-")) t[e] = o; else {
          const i = null == o ? "" : o;
          // Workaround for Safari, moving the <input> caret when re-assigning the same valued
                    "list" === e ? s = !1 : null != n && t[e] == i || (t[e] = i);
        }
      } catch (t) {}
      null == o || !1 === o ? !1 === o && "" !== t.getAttribute(e) || t.removeAttribute(e) : (!s || 4 /* VNODE_FLAGS.isHost */ & l || i) && !r && (o = !0 === o ? "" : o, 
      t.setAttribute(e, o));
    }
  }
}, m = /\s/, parseClassList = t => t ? t.split(m) : [], updateElement = (t, e, n, o) => {
  // if the element passed in is a shadow root, which is a document fragment
  // then we want to be adding attrs/props to the shadow root's "host" element
  // if it's not a shadow root, then we add attrs/props to the same element
  const i = 11 /* NODE_TYPE.DocumentFragment */ === e._$$elm$$_.nodeType && e._$$elm$$_.host ? e._$$elm$$_.host : e._$$elm$$_, l = t && t._$$attrs$$_ || a, s = e._$$attrs$$_ || a;
  // remove attributes no longer present on the vnode by setting them to undefined
  for (o in l) o in s || setAccessor(i, o, l[o], void 0, n, e._$$flags$$_);
  // add new & update changed attributes
  for (o in s) setAccessor(i, o, l[o], s[o], n, e._$$flags$$_);
}, createElm = (t, l, r, c) => {
  // tslint:disable-next-line: prefer-const
  const f = l._$$children$$_[r];
  let u, d, a, $ = 0;
  if (i || (
  // remember for later we need to check to relocate nodes
  s = !0, "slot" === f._$$tag$$_ && (e && 
  // scoped css needs to add its scoped id to the parent element
  c.classList.add(e + "-s"), f._$$flags$$_ |= f._$$children$$_ ? // slot element has fallback content
  2 /* VNODE_FLAGS.isSlotFallback */ : // slot element does not have fallback content
  1 /* VNODE_FLAGS.isSlotReference */)), null !== f._$$text$$_) 
  // create text node
  u = f._$$elm$$_ = S.createTextNode(f._$$text$$_); else if (3 /* VNODE_FLAGS.isSlotFallback */ & f._$$flags$$_) 
  // create a slot reference node
  u = f._$$elm$$_ = slotReferenceDebugNode(f); else if (
  // create element
  u = f._$$elm$$_ = S.createElement(f._$$tag$$_), updateElement(null, f, false), (t => null != t)(e) && u["s-si"] !== e && 
  // if there is a scopeId and this is the initial render
  // then let's add the scopeId as a css class
  u.classList.add(u["s-si"] = e), f._$$children$$_) for ($ = 0; $ < f._$$children$$_.length; ++$) 
  // create the node
  d = createElm(t, f, $, u), 
  // return node could have been null
  d && (
  // append our new node
  u.__appendChild ? u.__appendChild(d) : u.appendChild(d));
  if (u["s-hn"] = o, 3 /* VNODE_FLAGS.isSlotReference */ & f._$$flags$$_) {
    if (
    // this is a slot reference node
    u["s-sr"] = !0, 
    // remember the content reference comment
    u["s-cr"] = n, 
    // remember the slot name, or empty string for default slot
    u["s-sn"] = f._$$name$$_ || "", 
    // if this slot is nested within another parent slot, add that slot's name.
    // (used in 'renderSlotFallbackContent')
    l._$$name$$_ && (u["s-psn"] = l._$$name$$_), 2 /* VNODE_FLAGS.isSlotFallback */ & f._$$flags$$_) {
      if (f._$$children$$_) 
      // this slot has fallback nodes
      for ($ = 0; $ < f._$$children$$_.length; ++$) {
        // create the node
        let e = 1 /* NODE_TYPE.ElementNode */ === u.nodeType ? u : c;
        for (;1 /* NODE_TYPE.ElementNode */ !== e.nodeType; ) e = e.parentNode;
        d = createElm(t, f, $, e), 
        // add new node meta.
        // slot has fallback and childnode is slot fallback
        d["s-sf"] = u["s-hsf"] = !0, void 0 === d["s-sn"] && (d["s-sn"] = f._$$name$$_ || ""), 
        3 /* NODE_TYPE.TextNode */ === d.nodeType && (d["s-sfc"] = d.textContent), 
        // make sure a node was created
        // and we don't have a node already present
        // (if a node is already attached, we'll just patch it)
        !d || t && t._$$children$$_ || 
        // append our new node
        e.appendChild(d);
      }
      t && t._$$children$$_ && patch(t, f);
    }
    // check if we've got an old vnode for this slot
        a = t && t._$$children$$_ && t._$$children$$_[r], a && a._$$tag$$_ === f._$$tag$$_ && t._$$elm$$_ && 
    // we've got an old slot vnode and the wrapper is being replaced
    // so let's move the old slot content back to it's original location
    putBackInOriginalLocation(t._$$elm$$_, !1);
  }
  return u;
}, putBackInOriginalLocation = (t, e) => {
  w._$$flags$$_ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
  const n = t.__childNodes || t.childNodes;
  for (let t = n.length - 1; t >= 0; t--) {
    const i = n[t];
    i["s-hn"] !== o && i["s-ol"] && (
    // // this child node in the old element is from another component
    // // remove this node from the old slot's parent
    // childNode.remove();
    // and relocate it back to it's original location
    parentReferenceNode(i).insertBefore(i, referenceNode(i)), 
    // remove the old original location comment entirely
    // later on the patch function will know what to do
    // and move this to the correct spot in need be
    i["s-ol"].remove(), i["s-ol"] = void 0, s = !0), e && putBackInOriginalLocation(i, e);
  }
  w._$$flags$$_ &= -2 /* PLATFORM_FLAGS.isTmpDisconnected */;
}, addVnodes = (t, e, n, i, l, s) => {
  let r, c = t["s-cr"] && t["s-cr"].parentNode || t;
  for (c.shadowRoot && c.tagName === o && (c = c.shadowRoot); l <= s; ++l) i[l] && (r = createElm(null, n, l, t), 
  r && (i[l]._$$elm$$_ = r, c.insertBefore(r, referenceNode(e))));
}, saveSlottedNodes = t => {
  // by removing the hostname reference
  // any current slotted elements will be 'reset' and re-slotted
  const e = t.__childNodes || t.childNodes;
  let n, o, i;
  for (o = 0, i = e.length; o < i; o++) n = e[o], n["s-ol"] ? n["s-hn"] && (n["s-hn"] = void 0) : saveSlottedNodes(n);
}, removeVnodes = (t, e, n, o, i) => {
  for (;e <= n; ++e) (o = t[e]) && (i = o._$$elm$$_, 
  // we're removing this element
  // so it's possible we need to show slot fallback content now
  l = !0, saveSlottedNodes(i), i["s-ol"] ? 
  // remove the original location comment
  i["s-ol"].remove() : 
  // it's possible that child nodes of the node
  // that's being removed are slot nodes
  putBackInOriginalLocation(i, !0), 
  // remove the vnode's element from the dom
  i.remove());
}, isSameVnode = (t, e) => 
// compare if two vnode to see if they're "technically" the same
// need to have the same element tag, and same key to be the same
t._$$tag$$_ === e._$$tag$$_ && ("slot" !== t._$$tag$$_ || t._$$name$$_ === e._$$name$$_), referenceNode = t => t && t["s-ol"] || t, parentReferenceNode = t => (t["s-ol"] ? t["s-ol"] : t).parentNode
/**
 * Handle reconciling an outdated VNode with a new one which corresponds to
 * it. This function handles flushing updates to the DOM and reconciling the
 * children of the two nodes (if any).
 *
 * @param oldVNode an old VNode whose DOM element and children we want to update
 * @param newVNode a new VNode representing an updated version of the old one
 */ , patch = (t, e) => {
  const n = e._$$elm$$_ = t._$$elm$$_, o = t._$$children$$_, i = e._$$children$$_, s = e._$$tag$$_, r = e._$$text$$_;
  let c;
  null === r ? ("slot" === s || 
  // either this is the first render of an element OR it's an update
  // AND we already know it's possible it could have changed
  // this updates the element's css classes, attrs, props, listeners, etc.
  updateElement(t, e, false), null !== o && null !== i ? 
  // looks like there's child vnodes for both the old and new vnodes
  // so we need to call `updateChildren` to reconcile them
  ((t, e, n, o) => {
    const i = [], s = {};
    let r, c, f, u, d, a, $, b, m = 0, v = 0, g = 0, p = 0, j = e.length - 1, O = e[0], y = e[j], S = o.length - 1, w = o[0], T = o[S];
    for (;m <= j && v <= S; ) null == O ? 
    // VNode might have been moved left
    O = e[++m] : null == y ? y = e[--j] : null == w ? w = o[++v] : null == T ? T = o[--S] : isSameVnode(O, w) ? (
    // if the start nodes are the same then we should patch the new VNode
    // onto the old one, and increment our `newStartIdx` and `oldStartIdx`
    // indices to reflect that. We don't need to move any DOM Nodes around
    // since things are matched up in order.
    patch(O, w), O = e[++m], w = o[++v]) : isSameVnode(y, T) ? (
    // likewise, if the end nodes are the same we patch new onto old and
    // decrement our end indices, and also likewise in this case we don't
    // need to move any DOM Nodes.
    patch(y, T), y = e[--j], T = o[--S]) : isSameVnode(O, T) ? (
    // case: "Vnode moved right"
    // We've found that the last node in our window on the new children is
    // the same VNode as the _first_ node in our window on the old children
    // we're dealing with now. Visually, this is the layout of these two
    // nodes:
    // newCh: [..., newStartVnode , ... , newEndVnode , ...]
    //                                    ^^^^^^^^^^^
    // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
    //              ^^^^^^^^^^^^^
    // In this situation we need to patch `newEndVnode` onto `oldStartVnode`
    // and move the DOM element for `oldStartVnode`.
    "slot" !== O._$$tag$$_ && "slot" !== T._$$tag$$_ || putBackInOriginalLocation(O._$$elm$$_.parentNode, !1), 
    patch(O, T), 
    // We need to move the element for `oldStartVnode` into a position which
    // will be appropriate for `newEndVnode`. For this we can use
    // `.insertBefore` and `oldEndVnode.$elm$.nextSibling`. If there is a
    // sibling for `oldEndVnode.$elm$` then we want to move the DOM node for
    // `oldStartVnode` between `oldEndVnode` and it's sibling, like so:
    // <old-start-node />
    // <some-intervening-node />
    // <old-end-node />
    // <!-- ->              <-- `oldStartVnode.$elm$` should be inserted here
    // <next-sibling />
    // If instead `oldEndVnode.$elm$` has no sibling then we just want to put
    // the node for `oldStartVnode` at the end of the children of
    // `parentElm`. Luckily, `Node.nextSibling` will return `null` if there
    // aren't any siblings, and passing `null` to `Node.insertBefore` will
    // append it to the children of the parent element.
    t.insertBefore(O._$$elm$$_, y._$$elm$$_.nextSibling), O = e[++m], T = o[--S]) : isSameVnode(y, w) ? (
    // case: "Vnode moved left"
    // We've found that the first node in our window on the new children is
    // the same VNode as the _last_ node in our window on the old children.
    // Visually, this is the layout of these two nodes:
    // newCh: [..., newStartVnode , ... , newEndVnode , ...]
    //              ^^^^^^^^^^^^^
    // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
    //                                    ^^^^^^^^^^^
    // In this situation we need to patch `newStartVnode` onto `oldEndVnode`
    // (which will handle updating any changed attributes, reconciling their
    // children etc) but we also need to move the DOM node to which
    // `oldEndVnode` corresponds.
    "slot" !== O._$$tag$$_ && "slot" !== T._$$tag$$_ || putBackInOriginalLocation(y._$$elm$$_.parentNode, !1), 
    patch(y, w), 
    // We've already checked above if `oldStartVnode` and `newStartVnode` are
    // the same node, so since we're here we know that they are not. Thus we
    // can move the element for `oldEndVnode` _before_ the element for
    // `oldStartVnode`, leaving `oldStartVnode` to be reconciled in the
    // future.
    t.insertBefore(y._$$elm$$_, O._$$elm$$_), y = e[--j], w = o[++v]) : (
    // We either didn't find an element in the old children that matches
    // the key of the first new child OR the build is not using `key`
    // attributes at all. In either case we need to create a new element
    // for the new node.
    r = createElm(e && e[v], n, v, t), w = o[++v], r && parentReferenceNode(O._$$elm$$_).insertBefore(r, referenceNode(O._$$elm$$_)));
    // reorder fallback slot nodes
    if (m > j ? 
    // we have some more new nodes to add which don't match up with old nodes
    addVnodes(t, null == o[S + 1] ? null : o[S + 1]._$$elm$$_, n, o, v, S) : v > S && 
    // there are nodes in the `oldCh` array which no longer correspond to nodes
    // in the new array, so lets remove them (which entails cleaning up the
    // relevant DOM nodes)
    removeVnodes(e, m, j), t.parentNode && n._$$elm$$_["s-hsf"]) {
      for (c = t.parentNode.__childNodes || t.parentNode.childNodes, f = c.length - 1, 
      g = 0; g <= f; ++g) a = c[g], a["s-hsf"] ? i.push(a) : a["s-sf"] && (s[a["s-sn"]] || (s[a["s-sn"]] = []), 
      s[a["s-sn"]].push(a));
      for (u = i.length - 1, g = 0; g <= u; ++g) if ($ = i[g], void 0 !== s[$["s-sn"]]) for (d = s[$["s-sn"]].length - 1, 
      p = 0; p <= d; ++p) b = s[$["s-sn"]][p], $.parentNode.insertBefore(b, $);
      l = !0;
    }
  })(n, o, e, i) : null !== i ? (
  // no old child vnodes, but there are new child vnodes to add
  null !== t._$$text$$_ && (
  // the old vnode was text, so be sure to clear it out
  n.textContent = ""), 
  // add the new vnode children
  addVnodes(n, null, e, i, 0, i.length - 1)) : null !== o && 
  // no new child vnodes, but there are old child vnodes to remove
  removeVnodes(o, 0, o.length - 1)) : (c = n["s-cr"]) ? 
  // this element has slotted content
  c.parentNode.textContent = r : t._$$text$$_ !== r && (
  // update the text content for the text only vnode
  // and also only if the text is different than before
  n.textContent = r, n["s-sf"] && (n["s-sfc"] = r));
}, v = [], relocateSlotContent = t => {
  // tslint:disable-next-line: prefer-const
  let e, n, o, i, s, r, c = 0;
  const f = t.__childNodes || t.childNodes, u = f.length;
  for (;c < u; c++) {
    if (e = f[c], e["s-sr"] && (n = e["s-cr"]) && n.parentNode) for (e["s-hsf"] && (l = !0), 
    // first got the content reference comment node
    // then we got it's parent, which is where all the host content is in now
    o = n.parentNode.__childNodes || n.parentNode.childNodes, i = e["s-sn"], r = o.length - 1; r >= 0; r--) n = o[r], 
    n["s-cn"] || n["s-nr"] || n["s-hn"] === e["s-hn"] || (
    // let's do some relocating to its new home
    // but never relocate a content reference node
    // that is suppose to always represent the original content location
    isNodeLocatedInSlot(n, i) ? (
    // it's possible we've already decided to relocate this node
    s = v.find((t => t._$$nodeToRelocate$$_ === n)), 
    // made some changes to slots
    // let's make sure we also double check
    // fallbacks are correctly hidden or shown
    l = !0, n["s-sn"] = n["s-sn"] || i, s ? 
    // previously we never found a slot home for this node
    // but turns out we did, so let's remember it now
    s._$$slotRefNode$$_ = e : 
    // add to our list of nodes to relocate
    v.push({
      _$$slotRefNode$$_: e,
      _$$nodeToRelocate$$_: n
    }), n["s-sr"] && v.map((t => {
      isNodeLocatedInSlot(t._$$nodeToRelocate$$_, n["s-sn"]) && (s = v.find((t => t._$$nodeToRelocate$$_ === n)), 
      s && !t._$$slotRefNode$$_ && (t._$$slotRefNode$$_ = s._$$slotRefNode$$_));
    }))) : v.some((t => t._$$nodeToRelocate$$_ === n)) || 
    // so far this element does not have a slot home, not setting slotRefNode on purpose
    // if we never find a home for this element then we'll need to hide it
    v.push({
      _$$nodeToRelocate$$_: n
    }));
    1 /* NODE_TYPE.ElementNode */ === e.nodeType && relocateSlotContent(e);
  }
}, isNodeLocatedInSlot = (t, e) => 1 /* NODE_TYPE.ElementNode */ === t.nodeType ? null === t.getAttribute("slot") && "" === e || t.getAttribute("slot") === e : t["s-sn"] === e || "" === e, renderVdom = (t, r) => {
  const c = t._$$hostElement$$_, f = t._$$cmpMeta$$_, u = t._$$vnode$$_ || newVNode(null, null), d = (t => t && t._$$tag$$_ === $)
  /**
 * Show or hide a slot nodes children
 * @param slotNode a slot node, the 'children' of which should be shown or hidden
 * @param hide whether to hide the slot node 'children'
 * @returns
 */ (r) ? r : h(null, null, r);
  if (o = c.tagName, d._$$tag$$_ = null, d._$$flags$$_ |= 4 /* VNODE_FLAGS.isHost */ , 
  t._$$vnode$$_ = d, d._$$elm$$_ = u._$$elm$$_ = c.shadowRoot || c, e = c["s-sc"], 
  n = c["s-cr"], i = 0 != (1 /* CMP_FLAGS.shadowDomEncapsulation */ & f._$$flags$$_), 
  // always reset
  l = !1, 
  // synchronous patch
  patch(u, d), 
  // while we're moving nodes around existing nodes, temporarily disable
  // the disconnectCallback from working
  w._$$flags$$_ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */ , s) {
    let t, e, n, o, i, l, s;
    relocateSlotContent(d._$$elm$$_);
    let r = 0;
    for (;r < v.length; r++) t = v[r], e = t._$$nodeToRelocate$$_, e["s-ol"] || (
    // add a reference node marking this node's original location
    // keep a reference to this node for later lookups
    n = originalLocationDebugNode(e), n["s-nr"] = e, e.parentNode.insertBefore(e["s-ol"] = n, e));
    for (r = 0; r < v.length; r++) if (t = v[r], e = t._$$nodeToRelocate$$_, t._$$slotRefNode$$_) {
      for (
      // by default we're just going to insert it directly
      // after the slot reference node
      o = t._$$slotRefNode$$_.parentNode, i = t._$$slotRefNode$$_.__nextSibling || t._$$slotRefNode$$_.nextSibling, 
      n = e["s-ol"], s = i; n = n.__previousSibling || n.previousSibling; ) if (l = n["s-nr"], 
      l && l["s-sn"] === e["s-sn"] && o === l.parentNode && (l = l.__nextSibling || l.nextSibling, 
      !l || !l["s-nr"])) {
        i = l;
        break;
      }
      (!i && o !== e.parentNode || (e.__nextSibling || e.nextSibling) !== i) && (
      // we've checked that it's worth while to relocate
      // since that the node to relocate
      // has a different next sibling or parent relocated
      e !== i ? (!e["s-hn"] && e["s-ol"] && (
      // probably a component in the index.html that doesn't have it's hostname set
      e["s-hn"] = e["s-ol"].parentNode.nodeName), 
      // add it back to the dom but in its new home
      o.insertBefore(e, i), 
      // the node may have been hidden from when it didn't have a home. Re-show.
      e.hidden = !1) : o.insertBefore(e, s));
    } else 
    // this node doesn't have a slot home to go to, so let's hide it
    1 /* NODE_TYPE.ElementNode */ === e.nodeType && (e.hidden = !0);
  }
  l && updateFallbackSlotVisibility(d._$$elm$$_), 
  // done moving nodes around
  // allow the disconnect callback to work again
  w._$$flags$$_ &= -2 /* PLATFORM_FLAGS.isTmpDisconnected */ , 
  // always reset
  v.length = 0, 
  // Clear the content ref so we don't create a memory leak
  n = void 0;
}, slotReferenceDebugNode = t => S.createComment(`<slot${t._$$name$$_ ? ' name="' + t._$$name$$_ + '"' : ""}> (host=${o.toLowerCase()})`), originalLocationDebugNode = t => S.createComment("org-location for " + (t.localName ? `<${t.localName}> (host=${t["s-hn"]})` : `[${t.textContent}]`)), attachToAncestor = (t, e) => {
  e && !t._$$onRenderResolve$$_ && e["s-p"] && e["s-p"].push(new Promise((e => t._$$onRenderResolve$$_ = e)));
}, scheduleUpdate = (t, e) => {
  if (t._$$flags$$_ |= 16 /* HOST_FLAGS.isQueuedForUpdate */ , 4 /* HOST_FLAGS.isWaitingForChildren */ & t._$$flags$$_) return void (t._$$flags$$_ |= 512 /* HOST_FLAGS.needsRerender */);
  attachToAncestor(t, t._$$ancestorComponent$$_);
  return E((() => dispatchHooks(t, e)));
}, dispatchHooks = (t, e) => {
  const n = t._$$hostElement$$_, o = (t._$$cmpMeta$$_._$$tagName$$_, () => {}), i = t._$$lazyInstance$$_;
  let l;
  return e ? (emitLifecycleEvent(n, "componentWillLoad"), l = safeCall(i, "componentWillLoad", void 0, n)) : emitLifecycleEvent(n, "componentWillUpdate"), 
  emitLifecycleEvent(n, "componentWillRender"), o(), then(l, (() => updateComponent(t, i, e)));
}, updateComponent = async (t, e, n) => {
  // updateComponent
  const o = t._$$hostElement$$_, i = (t._$$cmpMeta$$_._$$tagName$$_, () => {}), l = o["s-rc"];
  n && 
  // DOM WRITE!
  (t => {
    const e = t._$$cmpMeta$$_, n = t._$$hostElement$$_, o = e._$$flags$$_, i = (e._$$tagName$$_, 
    () => {}), l = addStyle(n.shadowRoot ? n.shadowRoot : n.getRootNode(), e);
    10 /* CMP_FLAGS.needsScopedEncapsulation */ & o && (
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    // DOM WRITE!!
    n["s-sc"] = l, n.classList.add(l + "-h"), 2 /* CMP_FLAGS.scopedCssEncapsulation */ & o && n.classList.add(l + "-s")), 
    i();
  })(t);
  const s = (t._$$cmpMeta$$_._$$tagName$$_, () => {});
  callRender(t, e), l && (
  // ok, so turns out there are some child host elements
  // waiting on this parent element to load
  // let's fire off all update callbacks waiting
  l.map((t => t())), o["s-rc"] = void 0), s(), i();
  {
    const e = o["s-p"], postUpdate = () => postUpdateComponent(t);
    0 === e.length ? postUpdate() : (Promise.all(e).then(postUpdate), t._$$flags$$_ |= 4 /* HOST_FLAGS.isWaitingForChildren */ , 
    e.length = 0);
  }
}, callRender = (t, e, n) => {
  try {
    e = e.render(), t._$$flags$$_ &= -17 /* HOST_FLAGS.isQueuedForUpdate */ , t._$$flags$$_ |= 2 /* HOST_FLAGS.hasRendered */ , 
    renderVdom(t, e);
  } catch (e) {
    consoleError(e, t._$$hostElement$$_);
  }
  return null;
}, postUpdateComponent = t => {
  t._$$cmpMeta$$_._$$tagName$$_;
  const e = t._$$hostElement$$_, endPostUpdate = () => {}, n = t._$$lazyInstance$$_, o = t._$$ancestorComponent$$_;
  emitLifecycleEvent(e, "componentDidRender"), 64 /* HOST_FLAGS.hasLoadedComponent */ & t._$$flags$$_ ? (emitLifecycleEvent(e, "componentDidUpdate"), 
  endPostUpdate()) : (t._$$flags$$_ |= 64 /* HOST_FLAGS.hasLoadedComponent */ , 
  // DOM WRITE!
  addHydratedFlag(e), safeCall(n, "componentDidLoad", void 0, e), emitLifecycleEvent(e, "componentDidLoad"), 
  endPostUpdate(), t._$$onReadyResolve$$_(e), o || appDidLoad()), t._$$onRenderResolve$$_ && (t._$$onRenderResolve$$_(), 
  t._$$onRenderResolve$$_ = void 0), 512 /* HOST_FLAGS.needsRerender */ & t._$$flags$$_ && nextTick((() => scheduleUpdate(t, !1))), 
  t._$$flags$$_ &= -517 /* HOST_FLAGS.needsRerender */;
}
// ( •_•)
// ( •_•)>⌐■-■
// (⌐■_■)
, appDidLoad = e => {
  addHydratedFlag(S.documentElement), nextTick((() => emitEvent(y, "appload", {
    detail: {
      namespace: t
    }
  })));
}, safeCall = (t, e, n, o) => {
  if (t && t[e]) try {
    return t[e](n);
  } catch (t) {
    consoleError(t, o);
  }
}, then = (t, e) => t && t.then ? t.then(e) : e(), emitLifecycleEvent = (e, n) => {
  emitEvent(e, "stencil_" + n, {
    bubbles: !0,
    composed: !0,
    detail: {
      namespace: t
    }
  });
}, addHydratedFlag = t => t.classList.add("hydrated"), setValue = (t, e, n, o, i = !0) => {
  // check our new property value against our internal value
  const l = getHostRef(t), s = l._$$instanceValues$$_.get(e), r = l._$$flags$$_, c = l._$$lazyInstance$$_;
  n = ((t, e) => 
  // ensure this value is of the correct prop type
  null == t || isComplexType(t) ? t : 1 /* MEMBER_FLAGS.String */ & e ? t + "" : t)(n, o._$$members$$_[e][0]);
  8 /* HOST_FLAGS.isConstructingInstance */ & r && void 0 !== s || !(n !== s && !(Number.isNaN(s) && Number.isNaN(n))) || (
  // gadzooks! the property's value has changed!!
  // set our new value!
  l._$$instanceValues$$_.set(e, n), c && 2 /* HOST_FLAGS.hasRendered */ == (18 /* HOST_FLAGS.isQueuedForUpdate */ & r) && 
  // looks like this value actually changed, so we've got work to do!
  // but only if we've already rendered, otherwise just chill out
  // queue that we need to do an update, but don't worry about queuing
  // up millions cuz this function ensures it only runs once
  scheduleUpdate(l, !1));
}, proxyComponent = (t, e, n) => {
  if (e._$$members$$_) {
    // It's better to have a const than two Object.entries()
    const o = Object.entries(e._$$members$$_), i = t.prototype;
    if (o.map((([t, [o]]) => {
      if ((31 /* MEMBER_FLAGS.Prop */ & o || 2 /* PROXY_FLAGS.proxyState */ & n && 32 /* MEMBER_FLAGS.State */ & o) && (0 == (2048 /* MEMBER_FLAGS.Getter */ & o) ? 
      // proxyComponent - prop
      Object.defineProperty(i, t, {
        get() {
          // proxyComponent, get value
          return ((t, e) => getHostRef(t)._$$instanceValues$$_.get(e))(this, t);
        },
        set(n) {
          // proxyComponent, set value
          setValue(this, t, n, e);
        },
        configurable: !0,
        enumerable: !0
      }) : 1 /* PROXY_FLAGS.isElementConstructor */ & n && 2048 /* MEMBER_FLAGS.Getter */ & o && 
      // lazy maps the element get / set to the class get / set
      // proxyComponent - lazy prop getter
      Object.defineProperty(i, t, {
        get() {
          const e = getHostRef(this), n = e ? e._$$lazyInstance$$_ : i;
          if (n) return n[t];
        },
        configurable: !0,
        enumerable: !0
      }), 4096 /* MEMBER_FLAGS.Setter */ & o)) {
        // proxyComponent - lazy and non-lazy. Catches original set to fire updates (for @Watch)
        const n = Object.getOwnPropertyDescriptor(i, t).set;
        Object.defineProperty(i, t, {
          set(o) {
            const i = getHostRef(this);
            // non-lazy setter - amends original set to fire update
                        if (n) return n.call(this, o), void setValue(this, t, i._$$hostElement$$_[t], e);
            if (!i) return;
            // lazy setter maps the element set to the class set
                        const setVal = (n = !1) => {
              i._$$lazyInstance$$_[t] = o, setValue(this, t, i._$$lazyInstance$$_[t], e, !n);
            };
            // If there's a value from an attribute, (before the class is defined), queue & set async
                        i._$$lazyInstance$$_ ? setVal() : i._$$onInstancePromise$$_.then((() => setVal(!0)));
          }
        });
      }
    })), 1 /* PROXY_FLAGS.isElementConstructor */ & n) {
      const e = new Map;
      i.attributeChangedCallback = function(t, n, o) {
        w.jmp((() => {
          const n = e.get(t);
          //  In a web component lifecycle the attributeChangedCallback runs prior to connectedCallback
          //  in the case where an attribute was set inline.
          //  ```html
          //    <my-component some-attribute="some-value"></my-component>
          //  ```
          
          //  There is an edge case where a developer sets the attribute inline on a custom element and then
          //  programmatically changes it before it has been upgraded as shown below:
          
          //  ```html
          //    <!-- this component has _not_ been upgraded yet -->
          //    <my-component id="test" some-attribute="some-value"></my-component>
          //    <script>
          //      // grab non-upgraded component
          //      el = document.querySelector("#test");
          //      el.someAttribute = "another-value";
          //      // upgrade component
          //      customElements.define('my-component', MyComponent);
          //    <\/script>
          //  ```
          //  In this case if we do not unshadow here and use the value of the shadowing property, attributeChangedCallback
          //  will be called with `newValue = "some-value"` and will set the shadowed property (this.someAttribute = "another-value")
          //  to the value that was set inline i.e. "some-value" from above example. When
          //  the connectedCallback attempts to unshadow it will use "some-value" as the initial value rather than "another-value"
          
          //  The case where the attribute was NOT set inline but was not set programmatically shall be handled/unshadowed
          //  by connectedCallback as this attributeChangedCallback will not fire.
          
          //  https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
          
          //  TODO(STENCIL-16) we should think about whether or not we actually want to be reflecting the attributes to
          //  properties here given that this goes against best practices outlined here
          //  https://developers.google.com/web/fundamentals/web-components/best-practices#avoid-reentrancy
                    if (this.hasOwnProperty(n)) o = this[n], delete this[n]; else if (i.hasOwnProperty(n) && "number" == typeof this[n] && this[n] == o) 
          // if the propName exists on the prototype of `Cstr`, this update may be a result of Stencil using native
          // APIs to reflect props as attributes. Calls to `setAttribute(someElement, propName)` will result in
          // `propName` to be converted to a `DOMString`, which may not be what we want for other primitive props.
          return;
          const l = Object.getOwnPropertyDescriptor(i, n);
          // test whether this property either has no 'getter' or if it does, has a 'setter'
          // before attempting to write back to component props
                    l.get && !l.set || (this[n] = (null !== o || "boolean" != typeof this[n]) && o);
        }));
      }, 
      // create an array of attributes to observe
      // and also create a map of html attribute name to js property name
      t.observedAttributes = o.filter((([t, e]) => 15 /* MEMBER_FLAGS.HasAttribute */ & e[0] // filter to only keep props that should match attributes
      )).map((([t, n]) => {
        const o = n[1] || t;
        return e.set(o, t), o;
      }));
    }
  }
  return t;
}, connectedCallback = t => {
  if (0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & w._$$flags$$_)) {
    const e = getHostRef(t), n = e._$$cmpMeta$$_, o = (n._$$tagName$$_, () => {});
    if (!(1 /* HOST_FLAGS.hasConnected */ & e._$$flags$$_)) {
      let o;
      if (
      // first time this component has connected
      e._$$flags$$_ |= 1 /* HOST_FLAGS.hasConnected */ , o = t.getAttribute(c), o) {
        if (1 /* CMP_FLAGS.shadowDomEncapsulation */ & n._$$flags$$_) {
          const e = addStyle(t.shadowRoot, n);
          t.classList.remove(e + "-h", e + "-s");
        } else if (2 /* CMP_FLAGS.scopedCssEncapsulation */ & n._$$flags$$_) {
          let e = getScopeId(n);
          t["s-sc"] = e;
        }
        ((t, e, n, o) => {
          const endHydrate = () => {}, i = t.shadowRoot, l = [], s = [], r = i ? [] : null;
          let f = newVNode(e, null);
          f._$$elm$$_ = t, w._$$orgLocNodes$$_ || 
          // this is the first pass over of this whole document
          // does a quick scrape to construct a 'bare-bones' tree of
          // what elements we have and where content has been moved from
          initializeDocumentHydrate(S.body, w._$$orgLocNodes$$_ = new Map), t[c] = n, t.removeAttribute(c), 
          o._$$vnode$$_ = clientHydrate(f, l, [], r, t, t, n, s);
          let u = 0;
          const d = l.length;
          let a;
          // Steps through childNodes we found.
          // If moved from an original location (by nature of being rendered in SSR markup)
          // we might be able to move it back there now,
          // so slotted nodes don't get added to internal shadowDOMs
                    for (;u < d; u++) {
            a = l[u];
            const n = a._$$hostId$$_ + "." + a._$$nodeId$$_, o = w._$$orgLocNodes$$_.get(n), s = a._$$elm$$_;
            i || (s["s-hn"] = e.toUpperCase(), "slot" === a._$$tag$$_ && (
            // if this is a 'mock slot'
            // add it's content position reference now.
            // otherwise vdom-render will try to add nodes to it
            // (it's a comment node so will error)
            s["s-cr"] = t["s-cr"])), o && o.isConnected && (i && "" === o["s-en"] && 
            // if this node is within a shadowDOM, with an original location home
            // we're safe to move it now
            o.parentNode.insertBefore(s, o.nextSibling), 
            // Remove original location / slot reference comment now regardless:
            // 1) Stops SSR frameworks complaining about mismatches
            // 2) is un-required for non-shadow, slotted nodes as
            //    we'll add all the meta nodes we need when we deal with *all* slotted nodes ↓↓↓
            o.parentNode.removeChild(o), i || (
            // Add the original order of this node.
            // we'll use it later to make sure slotted nodes
            // get added in the right, original order
            s["s-oo"] = parseInt(a._$$nodeId$$_))), 
            // remove the original location from the map
            w._$$orgLocNodes$$_.delete(n);
          }
          const $ = [];
          let b = 0;
          const m = s.length;
          let v, g, p, j;
          // Loops through all the slotted nodes we found while
          // stepping through this component
          for (;b < m; b++) if (v = s[b], v && v.length) for (p = v.length, g = 0; g < p; g++) {
            // this shouldn't happen
            // as we collect all the custom elements first in `initializeDocumentHydrate`
            if (j = v[g], $[j.hostId] || (
            // cache this host for other grouped slotted nodes
            $[j.hostId] = w._$$orgLocNodes$$_.get(j.hostId)), !$[j.hostId]) continue;
            const t = $[j.hostId];
            // this node is either slotted in a non-shadow host, OR
            // *that* host is nested in a non-shadow host
                        if (!t.shadowRoot || !i) {
              if (
              // try to set an appropriate content position reference
              // (CR) node for this host element
              // a CR already set on the host?
              j.slot["s-cr"] = t["s-cr"], !j.slot["s-cr"] && t.shadowRoot) 
              // host is shadowDOM - just use the host itself as the CR for native slotting
              j.slot["s-cr"] = t; else {
                // if all else fails - just set the CR as the first child
                // (9/10 if node['s-cr'] hasn't been set, the node will be at the element root)
                const e = t.__childNodes || t.childNodes;
                j.slot["s-cr"] = e[0];
              }
              // create our original location node
                            addSlotRelocateNode(j.node, j.slot, j.node["s-oo"]), 
              // patch this node for accessors like `nextSibling` (et al)
              patchNextPrev(j.node);
            }
            t.shadowRoot && j.node.parentElement !== t && 
            // shadowDOM - move the item to the element root for
            // native slotting
            t.appendChild(j.node);
          }
          if (i) {
            // add all the root nodes in the shadowDOM
            // (a root node can have a whole nested DOM tree)
            let t = 0;
            const e = r.length;
            for (;t < e; t++) i.appendChild(r[t]);
          }
          o._$$hostElement$$_ = t, endHydrate();
        })(t, n._$$tagName$$_, o, e);
      }
      o || 
      // initUpdate
      // if the slot polyfill is required we'll need to put some nodes
      // in here to act as original content anchors as we move nodes around
      // host element has been connected to the DOM
      12 /* CMP_FLAGS.needsShadowDomShim */ & n._$$flags$$_ && setContentReference(t);
      {
        // find the first ancestor component (if there is one) and register
        // this component as one of the actively loading child components for its ancestor
        let n = t;
        for (;n = n.parentNode || n.host; ) 
        // climb up the ancestors looking for the first
        // component that hasn't finished its lifecycle update yet
        if (1 /* NODE_TYPE.ElementNode */ === n.nodeType && n.hasAttribute("s-id") && n["s-p"] || n["s-p"]) {
          // we found this components first ancestor component
          // keep a reference to this component's ancestor component
          attachToAncestor(e, e._$$ancestorComponent$$_ = n);
          break;
        }
      }
      // Lazy properties
      // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
            n._$$members$$_ && Object.entries(n._$$members$$_).map((([e, [n]]) => {
        if (31 /* MEMBER_FLAGS.Prop */ & n && t.hasOwnProperty(e)) {
          const n = t[e];
          delete t[e], t[e] = n;
        }
      })), (async (t, e, n, o, i) => {
        // initializeComponent
        if (0 == (32 /* HOST_FLAGS.hasInitializedComponent */ & e._$$flags$$_)) {
          {
            if (
            // we haven't initialized this element yet
            e._$$flags$$_ |= 32 /* HOST_FLAGS.hasInitializedComponent */ , (
            // lazy loaded components
            // request the component's implementation to be
            // wired up with the host element
            i = loadModule(n, e)).then) {
              // Await creates a micro-task avoid if possible
              const endLoad = () => {};
              i = await i, endLoad();
            }
            if (!i) throw Error(`Constructor for "${n._$$tagName$$_}#${e._$$modeName$$_}" was not found`);
            i.isProxied || (proxyComponent(i, n, 2 /* PROXY_FLAGS.proxyState */), i.isProxied = !0);
            const o = (n._$$tagName$$_, () => {});
            // ok, time to construct the instance
            // but let's keep track of when we start and stop
            // so that the getters/setters don't incorrectly step on data
                        e._$$flags$$_ |= 8 /* HOST_FLAGS.isConstructingInstance */;
            // construct the lazy-loaded component implementation
            // passing the hostRef is very important during
            // construction in order to directly wire together the
            // host element and the lazy-loaded instance
            try {
              new i(e);
            } catch (e) {
              consoleError(e, t);
            }
            e._$$flags$$_ &= -9 /* HOST_FLAGS.isConstructingInstance */ , o();
          }
          if (i.style) {
            // this component has styles but we haven't registered them yet
            let t = i.style;
            const e = getScopeId(n);
            if (!j.has(e)) {
              const o = (n._$$tagName$$_, () => {});
              registerStyle(e, t, !!(1 /* CMP_FLAGS.shadowDomEncapsulation */ & n._$$flags$$_)), 
              o();
            }
          }
        }
        // we've successfully created a lazy instance
                const l = e._$$ancestorComponent$$_, schedule = () => scheduleUpdate(e, !0);
        l && l["s-rc"] ? 
        // this is the initial load and this component it has an ancestor component
        // but the ancestor component has NOT fired its will update lifecycle yet
        // so let's just cool our jets and wait for the ancestor to continue first
        // this will get fired off when the ancestor component
        // finally gets around to rendering its lazy self
        // fire off the initial update
        l["s-rc"].push(schedule) : schedule();
      })(t, e, n);
    }
    o();
  }
}, setContentReference = t => {
  // only required when we're NOT using native shadow dom (slot)
  // or this browser doesn't support native shadow dom
  // and this host element was NOT created with SSR
  // let's pick out the inner content for slot projection
  // create a node to represent where the original
  // content was first placed, which is useful later on
  const e = t["s-cr"] = S.createComment(`content-ref (host=${t.localName})`);
  e["s-cn"] = !0;
  const n = t.__firstChild || t.firstChild;
  n ? t.__insertBefore ? t.__insertBefore(e, n) : t.insertBefore(e, n) : t.__appendChild ? t.__appendChild(e) : t.appendChild(e);
}, bootstrapLazy = (t, e = {}) => {
  var n;
  const endBootstrap = () => {}, o = [], i = e.exclude || [], l = y.customElements, s = S.head, r =  s.querySelector("meta[charset]"), c =  S.createElement("style"), u = [], d =  S.querySelectorAll(`[${f}]`);
  let a, $ = !0;
  Object.assign(w, e), w._$$resourcesUrl$$_ = new URL(e.resourcesUrl || "./", S.baseURI).href, 
  // If the app is already hydrated there is not point to disable the
  // async queue. This will improve the first input delay
  w._$$flags$$_ |= 2 /* PLATFORM_FLAGS.appLoaded */ , t.map((t => {
    t[1].map((e => {
      const n = {
        _$$flags$$_: e[0],
        _$$tagName$$_: e[1],
        _$$members$$_: e[2],
        _$$listeners$$_: e[3]
      };
      n._$$members$$_ = e[2];
      const s = n._$$tagName$$_, r = class extends HTMLElement {
        // StencilLazyHost
        constructor(t) {
          // @ts-ignore
          super(t);
          {
            const e = getScopeId(n, (t => O.map((e => e(t))).find((t => !!t)))
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
 */ (t = this)), o = Array.from(d).find((t => t.getAttribute(f) === e));
            o && (1 /* CMP_FLAGS.shadowDomEncapsulation */ & n._$$flags$$_ ? registerStyle(e, (t => t.replace(/\/\*!@([^\/]+)\*\/[^\{]+\{/g, "$1{"))
            /**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */ (o.innerHTML), !0) : registerStyle(e, o.innerHTML, !1));
          }
          registerHost(t, n), 1 /* CMP_FLAGS.shadowDomEncapsulation */ & n._$$flags$$_ && t.attachShadow({
            mode: "open"
          });
        }
        connectedCallback() {
          a && (clearTimeout(a), a = null), $ ? 
          // connectedCallback will be processed once all components have been registered
          u.push(this) : w.jmp((() => connectedCallback(this)));
        }
        disconnectedCallback() {
          w.jmp((() => (t => {
            0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & w._$$flags$$_) && getHostRef(t);
          })(this)));
        }
        componentOnReady() {
          return getHostRef(this)._$$onReadyPromise$$_;
        }
      };
      (4 /* CMP_FLAGS.hasSlotRelocation */ & n._$$flags$$_ || 8 /* CMP_FLAGS.needsShadowDomShim */ & n._$$flags$$_) && ((t, e) => {
        patchChildNodes(t, e), patchInsertBefore(t), patchAppendChild(t), patchAppend(t), 
        patchPrepend(t), patchInsertAdjacentHTML(t), patchInsertAdjacentText(t), patchInsertAdjacentElement(t), 
        patchReplaceChildren(t), patchInnerHTML(t, e), patchInnerText(t, e), patchTextContent(t, e);
      })(r.prototype), n._$$lazyBundleId$$_ = t[0], i.includes(s) || l.get(s) || (o.push(s), 
      l.define(s, proxyComponent(r, n, 1 /* PROXY_FLAGS.isElementConstructor */)));
    }));
  }));
  {
    c.innerHTML = o + "{visibility:hidden}.hydrated{visibility:inherit}", c.setAttribute("data-styles", "");
    // Apply CSP nonce to the style tag if it exists
    const t = null !== (n = w._$$nonce$$_) && void 0 !== n ? n : queryNonceMetaTagContent(S);
    null != t && c.setAttribute("nonce", t), s.insertBefore(c, r ? r.nextSibling : s.firstChild);
  }
  // Process deferred connectedCallbacks now all components have been registered
    $ = !1, u.length ? u.map((t => t.connectedCallback())) : w.jmp((() => a = setTimeout(appDidLoad, 30))), 
  // Fallback appLoad event
  endBootstrap();
}, setNonce = t => w._$$nonce$$_ = t, g =  new WeakMap, getHostRef = t => g.get(t), registerInstance = (t, e) => g.set(e._$$lazyInstance$$_ = t, e), registerHost = (t, e) => {
  const n = {
    _$$flags$$_: 0,
    _$$hostElement$$_: t,
    _$$cmpMeta$$_: e,
    _$$instanceValues$$_: new Map
  };
  return n._$$onReadyPromise$$_ = new Promise((t => n._$$onReadyResolve$$_ = t)), 
  t["s-p"] = [], t["s-rc"] = [], g.set(t, n);
}, isMemberInElement = (t, e) => e in t, consoleError = (t, e) => (0, console.error)(t, e), p =  new Map, loadModule = (t, e, n) => {
  // loadModuleImport
  const o = t._$$tagName$$_.replace(/-/g, "_"), i = t._$$lazyBundleId$$_, l = p.get(i);
  return l ? l[o] : import(
  /* @vite-ignore */
  /* webpackInclude: /\.entry\.js$/ */
  /* webpackExclude: /\.system\.entry\.js$/ */
  /* webpackMode: "lazy" */
  `./${i}.entry.js`).then((t => (i && p.set(i, t), t[o])), (t => {
    consoleError(t, e._$$hostElement$$_);
  }))
  /*!__STENCIL_STATIC_IMPORT_SWITCH__*/;
}, j =  new Map, O = [], y = "undefined" != typeof window ? window : {}, S = y.document || {
  head: {}
}, w = {
  _$$flags$$_: 0,
  _$$resourcesUrl$$_: "",
  jmp: t => t(),
  raf: t => requestAnimationFrame(t),
  ael: (t, e, n, o) => t.addEventListener(e, n, o),
  rel: (t, e, n, o) => t.removeEventListener(e, n, o),
  ce: (t, e) => new CustomEvent(t, e)
}, promiseResolve = t => Promise.resolve(t), T =  (() => {
  try {
    return new CSSStyleSheet, "function" == typeof (new CSSStyleSheet).replaceSync;
  } catch (t) {}
  return !1;
})(), _ = [], x = [], queueTask = (t, e) => n => {
  t.push(n), r || (r = !0, e && 4 /* PLATFORM_FLAGS.queueSync */ & w._$$flags$$_ ? nextTick(flush) : w.raf(flush));
}, consume = t => {
  for (let e = 0; e < t.length; e++) try {
    t[e](performance.now());
  } catch (t) {
    consoleError(t);
  }
  t.length = 0;
}, flush = () => {
  // always force a bunch of medium callbacks to run, but still have
  // a throttle on how many can run in a certain time
  // DOM READS!!!
  consume(_), consume(x), (r = _.length > 0) && 
  // still more to do yet, but we've run out of time
  // let's let this thing cool off and try again in the next tick
  w.raf(flush);
}, nextTick = t => promiseResolve().then(t), E =  queueTask(x, !0);

export { $ as H, bootstrapLazy as b, h, promiseResolve as p, registerInstance as r, setNonce as s }