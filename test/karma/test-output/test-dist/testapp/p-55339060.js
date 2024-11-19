const t = "testapp";

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */ let e, n, o, s = !1, i = !1, l = !1, r = !1, c = !1;

const f = {
  isDev: !1,
  isBrowser: !0,
  isServer: !1,
  isTesting: !1
}, u = "http://www.w3.org/1999/xlink", a = {}, isComplexType = t => "object" === (
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
  let o = null, s = null, i = null, l = !1, r = !1;
  const c = [], walk = e => {
    for (let n = 0; n < e.length; n++) o = e[n], Array.isArray(o) ? walk(o) : null != o && "boolean" != typeof o && ((l = "function" != typeof t && !isComplexType(o)) && (o += ""), 
    l && r ? 
    // If the previous child was simple (string), we merge both
    c[c.length - 1]._$$text$$_ += o : 
    // Append a new vNode, if it's text, we create a text vNode
    c.push(l ? newVNode(null, o) : o), r = l);
  };
  if (walk(n), e) {
    // normalize class / classname attributes
    e.key && (s = e.key), e.name && (i = e.name);
    {
      const t = e.className || e.class;
      t && (e.class = "object" != typeof t ? t : Object.keys(t).filter((e => t[e])).join(" "));
    }
  }
  if ("function" == typeof t) 
  // nodeName is a functional component
  return t(null === e ? {} : e, c, b);
  const f = newVNode(t, null);
  return f._$$attrs$$_ = e, c.length > 0 && (f._$$children$$_ = c), f._$$key$$_ = s, 
  f._$$name$$_ = i, f;
}, newVNode = (t, e) => {
  const n = {
    _$$flags$$_: 0,
    _$$tag$$_: t,
    _$$text$$_: e,
    _$$elm$$_: null,
    _$$children$$_: null,
    _$$attrs$$_: null,
    _$$key$$_: null,
    _$$name$$_: null
  };
  return n;
}, d = {}, b = {
  forEach: (t, e) => t.map(convertToPublic).forEach(e),
  map: (t, e) => t.map(convertToPublic).map(e).map(convertToPrivate)
}, convertToPublic = t => ({
  vattrs: t._$$attrs$$_,
  vchildren: t._$$children$$_,
  vkey: t._$$key$$_,
  vname: t._$$name$$_,
  vtag: t._$$tag$$_,
  vtext: t._$$text$$_
}), convertToPrivate = t => {
  if ("function" == typeof t.vtag) {
    const e = Object.assign({}, t.vattrs);
    return t.vkey && (e.key = t.vkey), t.vname && (e.name = t.vname), h(t.vtag, e, ...t.vchildren || []);
  }
  const e = newVNode(t.vtag, t.vtext);
  return e._$$attrs$$_ = t.vattrs, e._$$children$$_ = t.vchildren, e._$$key$$_ = t.vkey, 
  e._$$name$$_ = t.vname, e;
}, renderSlotFallbackContent = (t, e) => {
  // if this slot doesn't have fallback content, return
  if (!t["s-hsf"] || !t.parentNode) return;
  // in non-shadow component, slot nodes are just empty text nodes or comment nodes
  // the 'children' nodes are therefore placed next to it.
  // let's loop through those now
    let n, o = t.parentNode.__childNodes || t.parentNode.childNodes;
  const s = o.length;
  let i = 0;
  for (;i < s; i++) n = o[i], n["s-sr"] && e && n["s-psn"] === t["s-sn"] ? 
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
  let n, o, s, i, l, r;
  for (o = 0, s = e.length; o < s; o++) {
    // slot reference node?
    if (e[o]["s-sr"]) 
    // because we found a slot fallback node let's loop over all
    // the children again to
    for (
    // this component uses slots and we're on a slot node
    // let's find all it's slotted children or lack thereof
    // and show or hide fallback nodes (`<slot />` children)
    // get the slot name for this slot reference node
    l = e[o]["s-sn"], n = e[o], 
    // by default always show a fallback slot node
    // then hide it if there are other slotted nodes in the light dom
    renderSlotFallbackContent(n, !1), i = 0; i < s; i++) 
    // ignore slot fallback nodes
    if (r = e[i].nodeType, !e[i]["s-sf"]) 
    // is sibling node is from a different component OR is a named fallback slot node?
    if (e[i]["s-hn"] !== n["s-hn"] || "" !== l) {
      // you can't slot a textNode in a named slot
      if (1 /* NODE_TYPE.ElementNode */ === r && l === e[i]["s-sn"]) {
        // we found a slotted element!
        // let's hide all the fallback nodes
        renderSlotFallbackContent(n, !0), 
        // patches this node's removal methods
        // so if it gets removed in the future
        // re-asses the fallback node status
        patchRemove(e[i]);
        break;
      }
    } else if (e[i]["s-sn"] === l && (1 /* NODE_TYPE.ElementNode */ === r || 3 /* NODE_TYPE.TextNode */ === r && e[i] && e[i].textContent && "" !== e[i].textContent.trim())) {
      // we found a slotted something
      // let's hide all the fallback nodes
      renderSlotFallbackContent(n, !0), 
      // patches this node's removal methods
      // so if it gets removed in the future
      // re-asses the fallback node status
      patchRemove(e[i]);
      break;
    }
    // keep drilling down
        updateFallbackSlotVisibility(e[o]);
  }
}, patchCloneNode = t => {
  t.__cloneNode = t.cloneNode, t.cloneNode = function(e) {
    const n = this, o = t.__cloneNode.call(n, !1);
    if (e) {
      let t, e, s = 0;
      const i = [ "s-id", "s-cr", "s-lr", "s-rc", "s-sc", "s-p", "s-cn", "s-sr", "s-sn", "s-hn", "s-ol", "s-nr", "s-si", "s-sf", "s-sfc", "s-hsf" ];
      for (;s < n.__childNodes.length; s++) t = n.__childNodes[s]["s-nr"], e = i.every((t => !n.__childNodes[s][t])), 
      t && o.__appendChild(t.cloneNode(!0)), e && o.__appendChild(n.__childNodes[s].cloneNode(!0));
    }
    return o;
  };
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
  let s = Object.getOwnPropertyDescriptor(e || Element.prototype, "children");
  // MockNode won't have these
    s && Object.defineProperty(t, "__children", s);
  const i = Object.getOwnPropertyDescriptor(e || Element.prototype, "childElementCount");
  i && Object.defineProperty(t, "__childElementCount", i), Object.defineProperty(t, "children", {
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
        } catch (e) {}
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
      let s = !1;
      if (this.childNodes.forEach((i => {
        // we found the node in our list of other 'lightDOM' / slotted nodes
        if (i !== e && null !== e) ; else {
          if (s = !0, addSlotRelocateNode(t, o), null === e) return void this.__append(t);
          if (n === e["s-sn"]) {
            (e.parentNode.__insertBefore || e.parentNode.insertBefore).call(e.parentNode, t, e), 
            patchRemove(t);
          } else 
          // current child is not in the same slot as 'slot before' node
          // so just toss the node in wherever
          this.__append(t);
        }
      })), s) return t;
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
    const t = e["s-cr"].parentNode, s = t.__appendChild || t.appendChild;
    if (void 0 !== n) {
      o["s-oo"] = n;
      const i = t.__childNodes || t.childNodes, l = [ o ];
      i.forEach((t => {
        t["s-nr"] && l.push(t);
      })), l.sort(((t, e) => !t["s-oo"] || t["s-oo"] < e["s-oo"] ? -1 : !e["s-oo"] || e["s-oo"] < t["s-oo"] ? 1 : 0)), 
      l.forEach((t => s.call(e["s-cr"].parentNode, t)));
    } else s.call(e["s-cr"].parentNode, o);
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
}, setMode = t => j.push(t), getMode = t => getHostRef(t)._$$modeName$$_
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
 */ , getElement = t => getHostRef(t)._$$hostElement$$_, createEvent = (t, e, n) => {
  const o = getElement(t);
  return {
    emit: t => emitEvent(o, e, {
      bubbles: !!(4 /* EVENT_FLAGS.Bubbles */ & n),
      composed: !!(2 /* EVENT_FLAGS.Composed */ & n),
      cancelable: !!(1 /* EVENT_FLAGS.Cancellable */ & n),
      detail: t
    })
  };
}, emitEvent = (t, e, n) => {
  const o = C.ce(e, n);
  return t.dispatchEvent(o), o;
}, p =  new WeakMap, attachStyles = t => {
  const e = t._$$cmpMeta$$_, n = t._$$hostElement$$_, o = e._$$flags$$_, s = (e._$$tagName$$_, 
  () => {}), i = ((t, e, n, o) => {
    var s;
    let i = getScopeId(e, n);
    const l = y.get(i);
    // if an element is NOT connected then getRootNode() will return the wrong root node
    // so the fallback is to always use the document for the root node in those cases
        if (t = 11 /* NODE_TYPE.DocumentFragment */ === t.nodeType ? t : T, l) if ("string" == typeof l) {
      t = t.head || t;
      let n, r = p.get(t);
      if (r || p.set(t, r = new Set), !r.has(i)) {
        {
          if (C._$$cssShim$$_) {
            n = C._$$cssShim$$_.createHostStyle(o, i, l, !!(10 /* CMP_FLAGS.needsScopedEncapsulation */ & e._$$flags$$_));
            const t = n["s-sc"];
            t && (i = t, 
            // we don't want to add this styleID to the appliedStyles Set
            // since the cssVarShim might need to apply several different
            // stylesheets for the same component
            r = null);
          } else n = T.createElement("style"), n.innerHTML = l;
          // Apply CSP nonce to the style tag if it exists
                    const c = null !== (s = C._$$nonce$$_) && void 0 !== s ? s : queryNonceMetaTagContent(T);
          null != c && n.setAttribute("nonce", c), t.insertBefore(n, t.querySelector("link"));
        }
        r && r.add(i);
      }
    } else t.adoptedStyleSheets.includes(l) || (t.adoptedStyleSheets = [ ...t.adoptedStyleSheets, l ]);
    return i;
  })(M && n.shadowRoot ? n.shadowRoot : n.getRootNode(), e, t._$$modeName$$_, n);
  10 /* CMP_FLAGS.needsScopedEncapsulation */ & o && (
  // only required when we're NOT using native shadow dom (slot)
  // or this browser doesn't support native shadow dom
  // and this host element was NOT created with SSR
  // let's pick out the inner content for slot projection
  // create a node to represent where the original
  // content was first placed, which is useful later on
  // DOM WRITE!!
  n["s-sc"] = i, n.classList.add(i + "-h"), 2 /* CMP_FLAGS.scopedCssEncapsulation */ & o && n.classList.add(i + "-s")), 
  s();
}, getScopeId = (t, e) => "sc-" + (e && 32 /* CMP_FLAGS.hasMode */ & t._$$flags$$_ ? t._$$tagName$$_ + "-" + e : t._$$tagName$$_)
/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */ , setAccessor = (t, e, n, o, s, i) => {
  if (n !== o) {
    let r = isMemberInElement(t, e), c = e.toLowerCase();
    if ("class" === e) {
      const e = t.classList, s = parseClassList(n), i = parseClassList(o);
      // for `scoped: true` components, new nodes after initial hydration
      // from SSR don't have the slotted class added. Let's add that now
      t["s-si"] && i.indexOf(t["s-si"]) < 0 && i.push(t["s-si"]), e.remove(...s.filter((t => t && !i.includes(t)))), 
      e.add(...i.filter((t => t && !s.includes(t))));
    } else if ("style" === e) {
      for (const e in n) o && null != o[e] || (e.includes("-") ? t.style.removeProperty(e) : t.style[e] = "");
      for (const e in o) n && o[e] === n[e] || (e.includes("-") ? t.style.setProperty(e, o[e]) : t.style[e] = o[e]);
    } else if ("key" === e) ; else if ("ref" === e) 
    // minifier will clean this up
    o && o(t); else if (r || "o" !== e[0] || "n" !== e[1]) {
      // Set property if it exists and it's not a SVG
      const f = isComplexType(o);
      if ((r || f && null !== o) && !s) try {
        if (t.tagName.includes("-")) t[e] = o; else {
          const s = null == o ? "" : o;
          // Workaround for Safari, moving the <input> caret when re-assigning the same valued
                    "list" === e ? r = !1 : null != n && t[e] == s || (t[e] = s);
        }
      } catch (l) {}
      /**
             * Need to manually update attribute if:
             * - memberName is not an attribute
             * - if we are rendering the host element in order to reflect attribute
             * - if it's a SVG, since properties might not work in <svg>
             * - if the newValue is null/undefined or 'false'.
             */      let a = !1;
      c !== (c = c.replace(/^xlink\:?/, "")) && (e = c, a = !0), null == o || !1 === o ? !1 === o && "" !== t.getAttribute(e) || (a ? t.removeAttributeNS(u, e) : t.removeAttribute(e)) : (!r || 4 /* VNODE_FLAGS.isHost */ & i || s) && !f && (o = !0 === o ? "" : o, 
      a ? t.setAttributeNS(u, e, o) : t.setAttribute(e, o));
    } else 
    // Event Handlers
    // so if the member name starts with "on" and the 3rd characters is
    // a capital letter, and it's not already a member on the element,
    // then we're assuming it's an event listener
    // on- prefixed events
    // allows to be explicit about the dom event to listen without any magic
    // under the hood:
    // <my-cmp on-click> // listens for "click"
    // <my-cmp on-Click> // listens for "Click"
    // <my-cmp on-ionChange> // listens for "ionChange"
    // <my-cmp on-EVENTS> // listens for "EVENTS"
    e = "-" === e[2] ? e.slice(3) : isMemberInElement(w, c) ? c.slice(2) : c[2] + e.slice(3), 
    n && C.rel(t, e, n, !1), o && C.ael(t, e, o, !1);
  }
}, m = /\s/, parseClassList = t => t ? t.split(m) : [], updateElement = (t, e, n, o) => {
  // if the element passed in is a shadow root, which is a document fragment
  // then we want to be adding attrs/props to the shadow root's "host" element
  // if it's not a shadow root, then we add attrs/props to the same element
  const s = 11 /* NODE_TYPE.DocumentFragment */ === e._$$elm$$_.nodeType && e._$$elm$$_.host ? e._$$elm$$_.host : e._$$elm$$_, i = t && t._$$attrs$$_ || a, l = e._$$attrs$$_ || a;
  // remove attributes no longer present on the vnode by setting them to undefined
  for (o in i) o in l || setAccessor(s, o, i[o], void 0, n, e._$$flags$$_);
  // add new & update changed attributes
  for (o in l) setAccessor(s, o, i[o], l[o], n, e._$$flags$$_);
}, createElm = (t, i, c, f) => {
  // tslint:disable-next-line: prefer-const
  const u = i._$$children$$_[c];
  let a, d, b, p = 0;
  if (s || (
  // remember for later we need to check to relocate nodes
  l = !0, "slot" === u._$$tag$$_ && (e && 
  // scoped css needs to add its scoped id to the parent element
  f.classList.add(e + "-s"), u._$$flags$$_ |= u._$$children$$_ ? // slot element has fallback content
  2 /* VNODE_FLAGS.isSlotFallback */ : // slot element does not have fallback content
  1 /* VNODE_FLAGS.isSlotReference */)), null !== u._$$text$$_) 
  // create text node
  a = u._$$elm$$_ = T.createTextNode(u._$$text$$_); else if (3 /* VNODE_FLAGS.isSlotFallback */ & u._$$flags$$_) 
  // create a slot reference node
  a = u._$$elm$$_ = slotReferenceDebugNode(u); else {
    if (r || (r = "svg" === u._$$tag$$_), 
    // create element
    a = u._$$elm$$_ = T.createElementNS(r ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml", u._$$tag$$_), 
    r && "foreignObject" === u._$$tag$$_ && (r = !1), updateElement(null, u, r), (t => null != t)(e) && a["s-si"] !== e && 
    // if there is a scopeId and this is the initial render
    // then let's add the scopeId as a css class
    a.classList.add(a["s-si"] = e), u._$$children$$_) for (p = 0; p < u._$$children$$_.length; ++p) 
    // create the node
    d = createElm(t, u, p, a), 
    // return node could have been null
    d && (
    // append our new node
    a.__appendChild ? a.__appendChild(d) : a.appendChild(d));
    "svg" === u._$$tag$$_ ? 
    // Only reset the SVG context when we're exiting <svg> element
    r = !1 : "foreignObject" === a.tagName && (
    // Reenter SVG context when we're exiting <foreignObject> element
    r = !0);
  }
  if (a["s-hn"] = o, 3 /* VNODE_FLAGS.isSlotReference */ & u._$$flags$$_) {
    if (
    // this is a slot reference node
    a["s-sr"] = !0, 
    // remember the content reference comment
    a["s-cr"] = n, 
    // remember the slot name, or empty string for default slot
    a["s-sn"] = u._$$name$$_ || "", 
    // if this slot is nested within another parent slot, add that slot's name.
    // (used in 'renderSlotFallbackContent')
    i._$$name$$_ && (a["s-psn"] = i._$$name$$_), 2 /* VNODE_FLAGS.isSlotFallback */ & u._$$flags$$_) {
      if (u._$$children$$_) 
      // this slot has fallback nodes
      for (p = 0; p < u._$$children$$_.length; ++p) {
        // create the node
        let e = 1 /* NODE_TYPE.ElementNode */ === a.nodeType ? a : f;
        for (;1 /* NODE_TYPE.ElementNode */ !== e.nodeType; ) e = e.parentNode;
        d = createElm(t, u, p, e), 
        // add new node meta.
        // slot has fallback and childnode is slot fallback
        d["s-sf"] = a["s-hsf"] = !0, void 0 === d["s-sn"] && (d["s-sn"] = u._$$name$$_ || ""), 
        3 /* NODE_TYPE.TextNode */ === d.nodeType && (d["s-sfc"] = d.textContent), 
        // make sure a node was created
        // and we don't have a node already present
        // (if a node is already attached, we'll just patch it)
        !d || t && t._$$children$$_ || 
        // append our new node
        e.appendChild(d);
      }
      t && t._$$children$$_ && patch(t, u);
    }
    // check if we've got an old vnode for this slot
        b = t && t._$$children$$_ && t._$$children$$_[c], b && b._$$tag$$_ === u._$$tag$$_ && t._$$elm$$_ && 
    // we've got an old slot vnode and the wrapper is being replaced
    // so let's move the old slot content back to it's original location
    putBackInOriginalLocation(t._$$elm$$_, !1);
  }
  return a;
}, putBackInOriginalLocation = (t, e) => {
  C._$$flags$$_ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
  const n = t.__childNodes || t.childNodes;
  for (let s = n.length - 1; s >= 0; s--) {
    const t = n[s];
    t["s-hn"] !== o && t["s-ol"] && (
    // // this child node in the old element is from another component
    // // remove this node from the old slot's parent
    // childNode.remove();
    // and relocate it back to it's original location
    parentReferenceNode(t).insertBefore(t, referenceNode(t)), 
    // remove the old original location comment entirely
    // later on the patch function will know what to do
    // and move this to the correct spot in need be
    t["s-ol"].remove(), t["s-ol"] = void 0, l = !0), e && putBackInOriginalLocation(t, e);
  }
  C._$$flags$$_ &= -2 /* PLATFORM_FLAGS.isTmpDisconnected */;
}, addVnodes = (t, e, n, s, i, l) => {
  let r, c = t["s-cr"] && t["s-cr"].parentNode || t;
  for (c.shadowRoot && c.tagName === o && (c = c.shadowRoot); i <= l; ++i) s[i] && (r = createElm(null, n, i, t), 
  r && (s[i]._$$elm$$_ = r, c.insertBefore(r, referenceNode(e))));
}, saveSlottedNodes = t => {
  // by removing the hostname reference
  // any current slotted elements will be 'reset' and re-slotted
  const e = t.__childNodes || t.childNodes;
  let n, o, s;
  for (o = 0, s = e.length; o < s; o++) n = e[o], n["s-ol"] ? n["s-hn"] && (n["s-hn"] = void 0) : saveSlottedNodes(n);
}, removeVnodes = (t, e, n, o, s) => {
  for (;e <= n; ++e) (o = t[e]) && (s = o._$$elm$$_, callNodeRefs(o), 
  // we're removing this element
  // so it's possible we need to show slot fallback content now
  i = !0, saveSlottedNodes(s), s["s-ol"] ? 
  // remove the original location comment
  s["s-ol"].remove() : 
  // it's possible that child nodes of the node
  // that's being removed are slot nodes
  putBackInOriginalLocation(s, !0), 
  // remove the vnode's element from the dom
  s.remove());
}, isSameVnode = (t, e) => 
// compare if two vnode to see if they're "technically" the same
// need to have the same element tag, and same key to be the same
t._$$tag$$_ === e._$$tag$$_ && ("slot" === t._$$tag$$_ ? t._$$name$$_ === e._$$name$$_ : t._$$key$$_ === e._$$key$$_), referenceNode = t => t && t["s-ol"] || t, parentReferenceNode = t => (t["s-ol"] ? t["s-ol"] : t).parentNode
/**
 * Handle reconciling an outdated VNode with a new one which corresponds to
 * it. This function handles flushing updates to the DOM and reconciling the
 * children of the two nodes (if any).
 *
 * @param oldVNode an old VNode whose DOM element and children we want to update
 * @param newVNode a new VNode representing an updated version of the old one
 */ , patch = (t, e) => {
  const n = e._$$elm$$_ = t._$$elm$$_, o = t._$$children$$_, s = e._$$children$$_, l = e._$$tag$$_, c = e._$$text$$_;
  let f;
  null === c ? (
  // test if we're rendering an svg element, or still rendering nodes inside of one
  // only add this to the when the compiler sees we're using an svg somewhere
  r = "svg" === l || "foreignObject" !== l && r, "slot" === l || 
  // either this is the first render of an element OR it's an update
  // AND we already know it's possible it could have changed
  // this updates the element's css classes, attrs, props, listeners, etc.
  updateElement(t, e, r), null !== o && null !== s ? 
  // looks like there's child vnodes for both the old and new vnodes
  // so we need to call `updateChildren` to reconcile them
  ((t, e, n, o) => {
    const s = [], l = {};
    let r, c, f, u, a, d, b, p, m, v = 0, g = 0, $ = 0, y = 0, j = 0, w = e.length - 1, O = e[0], T = e[w], _ = o.length - 1, C = o[0], M = o[_];
    for (;v <= w && g <= _; ) if (null == O) 
    // VNode might have been moved left
    O = e[++v]; else if (null == T) T = e[--w]; else if (null == C) C = o[++g]; else if (null == M) M = o[--_]; else if (isSameVnode(O, C)) 
    // if the start nodes are the same then we should patch the new VNode
    // onto the old one, and increment our `newStartIdx` and `oldStartIdx`
    // indices to reflect that. We don't need to move any DOM Nodes around
    // since things are matched up in order.
    patch(O, C), O = e[++v], C = o[++g]; else if (isSameVnode(T, M)) 
    // likewise, if the end nodes are the same we patch new onto old and
    // decrement our end indices, and also likewise in this case we don't
    // need to move any DOM Nodes.
    patch(T, M), T = e[--w], M = o[--_]; else if (isSameVnode(O, M)) 
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
    "slot" !== O._$$tag$$_ && "slot" !== M._$$tag$$_ || putBackInOriginalLocation(O._$$elm$$_.parentNode, !1), 
    patch(O, M), 
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
    t.insertBefore(O._$$elm$$_, T._$$elm$$_.nextSibling), O = e[++v], M = o[--_]; else if (isSameVnode(T, C)) 
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
    "slot" !== O._$$tag$$_ && "slot" !== M._$$tag$$_ || putBackInOriginalLocation(T._$$elm$$_.parentNode, !1), 
    patch(T, C), 
    // We've already checked above if `oldStartVnode` and `newStartVnode` are
    // the same node, so since we're here we know that they are not. Thus we
    // can move the element for `oldEndVnode` _before_ the element for
    // `oldStartVnode`, leaving `oldStartVnode` to be reconciled in the
    // future.
    t.insertBefore(T._$$elm$$_, O._$$elm$$_), T = e[--w], C = o[++g]; else {
      for (
      // Here we do some checks to match up old and new nodes based on the
      // `$key$` attribute, which is set by putting a `key="my-key"` attribute
      // in the JSX for a DOM element in the implementation of a Stencil
      // component.
      // First we check to see if there are any nodes in the array of old
      // children which have the same key as the first node in the new
      // children.
      $ = -1, y = v; y <= w; ++y) if (e[y] && null !== e[y]._$$key$$_ && e[y]._$$key$$_ === C._$$key$$_) {
        $ = y;
        break;
      }
      $ >= 0 ? (
      // We found a node in the old children which matches up with the first
      // node in the new children! So let's deal with that
      c = e[$], c._$$tag$$_ !== C._$$tag$$_ ? 
      // the tag doesn't match so we'll need a new DOM element
      r = createElm(e && e[g], n, $, t) : (patch(c, C), 
      // invalidate the matching old node so that we won't try to update it
      // again later on
      e[$] = void 0, r = c._$$elm$$_), C = o[++g]) : (
      // We either didn't find an element in the old children that matches
      // the key of the first new child OR the build is not using `key`
      // attributes at all. In either case we need to create a new element
      // for the new node.
      r = createElm(e && e[g], n, g, t), C = o[++g]), r && parentReferenceNode(O._$$elm$$_).insertBefore(r, referenceNode(O._$$elm$$_));
    }
    // reorder fallback slot nodes
    if (v > w ? 
    // we have some more new nodes to add which don't match up with old nodes
    addVnodes(t, null == o[_ + 1] ? null : o[_ + 1]._$$elm$$_, n, o, g, _) : g > _ && 
    // there are nodes in the `oldCh` array which no longer correspond to nodes
    // in the new array, so lets remove them (which entails cleaning up the
    // relevant DOM nodes)
    removeVnodes(e, v, w), t.parentNode && n._$$elm$$_["s-hsf"]) {
      for (f = t.parentNode.__childNodes || t.parentNode.childNodes, u = f.length - 1, 
      y = 0; y <= u; ++y) b = f[y], b["s-hsf"] ? s.push(b) : b["s-sf"] && (l[b["s-sn"]] || (l[b["s-sn"]] = []), 
      l[b["s-sn"]].push(b));
      for (a = s.length - 1, y = 0; y <= a; ++y) if (p = s[y], void 0 !== l[p["s-sn"]]) for (d = l[p["s-sn"]].length - 1, 
      j = 0; j <= d; ++j) m = l[p["s-sn"]][j], p.parentNode.insertBefore(m, p);
      i = !0;
    }
  })(n, o, e, s) : null !== s ? (
  // no old child vnodes, but there are new child vnodes to add
  null !== t._$$text$$_ && (
  // the old vnode was text, so be sure to clear it out
  n.textContent = ""), 
  // add the new vnode children
  addVnodes(n, null, e, s, 0, s.length - 1)) : null !== o && 
  // no new child vnodes, but there are old child vnodes to remove
  removeVnodes(o, 0, o.length - 1), r && "svg" === l && (r = !1)) : (f = n["s-cr"]) ? 
  // this element has slotted content
  f.parentNode.textContent = c : t._$$text$$_ !== c && (
  // update the text content for the text only vnode
  // and also only if the text is different than before
  n.textContent = c, n["s-sf"] && (n["s-sfc"] = c));
}, v = [], relocateSlotContent = t => {
  // tslint:disable-next-line: prefer-const
  let e, n, o, s, l, r, c = 0;
  const f = t.__childNodes || t.childNodes, u = f.length;
  for (;c < u; c++) {
    if (e = f[c], e["s-sr"] && (n = e["s-cr"]) && n.parentNode) for (e["s-hsf"] && (i = !0), 
    // first got the content reference comment node
    // then we got it's parent, which is where all the host content is in now
    o = n.parentNode.__childNodes || n.parentNode.childNodes, s = e["s-sn"], r = o.length - 1; r >= 0; r--) n = o[r], 
    n["s-cn"] || n["s-nr"] || n["s-hn"] === e["s-hn"] || (
    // let's do some relocating to its new home
    // but never relocate a content reference node
    // that is suppose to always represent the original content location
    isNodeLocatedInSlot(n, s) ? (
    // it's possible we've already decided to relocate this node
    l = v.find((t => t._$$nodeToRelocate$$_ === n)), 
    // made some changes to slots
    // let's make sure we also double check
    // fallbacks are correctly hidden or shown
    i = !0, n["s-sn"] = n["s-sn"] || s, l ? 
    // previously we never found a slot home for this node
    // but turns out we did, so let's remember it now
    l._$$slotRefNode$$_ = e : 
    // add to our list of nodes to relocate
    v.push({
      _$$slotRefNode$$_: e,
      _$$nodeToRelocate$$_: n
    }), n["s-sr"] && v.map((t => {
      isNodeLocatedInSlot(t._$$nodeToRelocate$$_, n["s-sn"]) && (l = v.find((t => t._$$nodeToRelocate$$_ === n)), 
      l && !t._$$slotRefNode$$_ && (t._$$slotRefNode$$_ = l._$$slotRefNode$$_));
    }))) : v.some((t => t._$$nodeToRelocate$$_ === n)) || 
    // so far this element does not have a slot home, not setting slotRefNode on purpose
    // if we never find a home for this element then we'll need to hide it
    v.push({
      _$$nodeToRelocate$$_: n
    }));
    1 /* NODE_TYPE.ElementNode */ === e.nodeType && relocateSlotContent(e);
  }
}, isNodeLocatedInSlot = (t, e) => 1 /* NODE_TYPE.ElementNode */ === t.nodeType ? null === t.getAttribute("slot") && "" === e || t.getAttribute("slot") === e : t["s-sn"] === e || "" === e, callNodeRefs = t => {
  t._$$attrs$$_ && t._$$attrs$$_.ref && t._$$attrs$$_.ref(null), t._$$children$$_ && t._$$children$$_.map(callNodeRefs);
}, renderVdom = (t, r) => {
  const c = t._$$hostElement$$_, f = t._$$cmpMeta$$_, u = t._$$vnode$$_ || newVNode(null, null), a = (t => t && t._$$tag$$_ === d)
  /**
 * Implementation of {@link d.FunctionalUtilities} for Stencil's VDom.
 *
 * Note that these functions convert from {@link d.VNode} to
 * {@link d.ChildNode} to give functional component developers a friendly
 * interface.
 */ (r) ? r : h(null, null, r);
  if (o = c.tagName, f._$$attrsToReflect$$_ && (a._$$attrs$$_ = a._$$attrs$$_ || {}, 
  f._$$attrsToReflect$$_.map((([t, e]) => a._$$attrs$$_[e] = c[t]))), a._$$tag$$_ = null, 
  a._$$flags$$_ |= 4 /* VNODE_FLAGS.isHost */ , t._$$vnode$$_ = a, a._$$elm$$_ = u._$$elm$$_ = c.shadowRoot || c, 
  e = c["s-sc"], n = c["s-cr"], s = M && 0 != (1 /* CMP_FLAGS.shadowDomEncapsulation */ & f._$$flags$$_), 
  // always reset
  i = !1, 
  // synchronous patch
  patch(u, a), 
  // while we're moving nodes around existing nodes, temporarily disable
  // the disconnectCallback from working
  C._$$flags$$_ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */ , l) {
    let t, e, n, o, s, i, l;
    relocateSlotContent(a._$$elm$$_);
    let r = 0;
    for (;r < v.length; r++) t = v[r], e = t._$$nodeToRelocate$$_, e["s-ol"] || (
    // add a reference node marking this node's original location
    // keep a reference to this node for later lookups
    n = originalLocationDebugNode(e), n["s-nr"] = e, e.parentNode.insertBefore(e["s-ol"] = n, e));
    for (r = 0; r < v.length; r++) if (t = v[r], e = t._$$nodeToRelocate$$_, t._$$slotRefNode$$_) {
      for (
      // by default we're just going to insert it directly
      // after the slot reference node
      o = t._$$slotRefNode$$_.parentNode, s = t._$$slotRefNode$$_.__nextSibling || t._$$slotRefNode$$_.nextSibling, 
      n = e["s-ol"], l = s; n = n.__previousSibling || n.previousSibling; ) if (i = n["s-nr"], 
      i && i["s-sn"] === e["s-sn"] && o === i.parentNode && (i = i.__nextSibling || i.nextSibling, 
      !i || !i["s-nr"])) {
        s = i;
        break;
      }
      (!s && o !== e.parentNode || (e.__nextSibling || e.nextSibling) !== s) && (
      // we've checked that it's worth while to relocate
      // since that the node to relocate
      // has a different next sibling or parent relocated
      e !== s ? (!e["s-hn"] && e["s-ol"] && (
      // probably a component in the index.html that doesn't have it's hostname set
      e["s-hn"] = e["s-ol"].parentNode.nodeName), 
      // add it back to the dom but in its new home
      o.insertBefore(e, s), 
      // the node may have been hidden from when it didn't have a home. Re-show.
      e.hidden = !1) : o.insertBefore(e, l));
    } else 
    // this node doesn't have a slot home to go to, so let's hide it
    1 /* NODE_TYPE.ElementNode */ === e.nodeType && (e.hidden = !0);
  }
  i && updateFallbackSlotVisibility(a._$$elm$$_), 
  // done moving nodes around
  // allow the disconnect callback to work again
  C._$$flags$$_ &= -2 /* PLATFORM_FLAGS.isTmpDisconnected */ , 
  // always reset
  v.length = 0, 
  // Clear the content ref so we don't create a memory leak
  n = void 0;
}, slotReferenceDebugNode = t => T.createComment(`<slot${t._$$name$$_ ? ' name="' + t._$$name$$_ + '"' : ""}> (host=${o.toLowerCase()})`), originalLocationDebugNode = t => T.createComment("org-location for " + (t.localName ? `<${t.localName}> (host=${t["s-hn"]})` : `[${t.textContent}]`)), attachToAncestor = (t, e) => {
  e && !t._$$onRenderResolve$$_ && e["s-p"] && e["s-p"].push(new Promise((e => t._$$onRenderResolve$$_ = e)));
}, scheduleUpdate = (t, e) => {
  if (t._$$flags$$_ |= 16 /* HOST_FLAGS.isQueuedForUpdate */ , 4 /* HOST_FLAGS.isWaitingForChildren */ & t._$$flags$$_) return void (t._$$flags$$_ |= 512 /* HOST_FLAGS.needsRerender */);
  attachToAncestor(t, t._$$ancestorComponent$$_);
  return E((() => dispatchHooks(t, e)));
}, dispatchHooks = (t, e) => {
  const n = t._$$hostElement$$_, o = (t._$$cmpMeta$$_._$$tagName$$_, () => {}), s = t._$$lazyInstance$$_;
  let i;
  return e ? (t._$$flags$$_ |= 256 /* HOST_FLAGS.isListenReady */ , t._$$queuedListeners$$_ && (t._$$queuedListeners$$_.map((([t, e]) => safeCall(s, t, e, n))), 
  t._$$queuedListeners$$_ = null), emitLifecycleEvent(n, "componentWillLoad"), i = safeCall(s, "componentWillLoad", void 0, n)) : (emitLifecycleEvent(n, "componentWillUpdate"), 
  i = safeCall(s, "componentWillUpdate", void 0, n)), emitLifecycleEvent(n, "componentWillRender"), 
  o(), then(i, (() => updateComponent(t, s, e)));
}, updateComponent = async (t, e, n) => {
  // updateComponent
  const o = t._$$hostElement$$_, s = (t._$$cmpMeta$$_._$$tagName$$_, () => {}), i = o["s-rc"];
  n && 
  // DOM WRITE!
  attachStyles(t);
  const l = (t._$$cmpMeta$$_._$$tagName$$_, () => {});
  callRender(t, e), C._$$cssShim$$_ && C._$$cssShim$$_.updateHost(o), i && (
  // ok, so turns out there are some child host elements
  // waiting on this parent element to load
  // let's fire off all update callbacks waiting
  i.map((t => t())), o["s-rc"] = void 0), l(), s();
  {
    const e = o["s-p"], postUpdate = () => postUpdateComponent(t);
    0 === e.length ? postUpdate() : (Promise.all(e).then(postUpdate), t._$$flags$$_ |= 4 /* HOST_FLAGS.isWaitingForChildren */ , 
    e.length = 0);
  }
}, callRender = (t, e, n) => {
  try {
    e = e.render && e.render(), t._$$flags$$_ &= -17 /* HOST_FLAGS.isQueuedForUpdate */ , 
    t._$$flags$$_ |= 2 /* HOST_FLAGS.hasRendered */ , renderVdom(t, e);
  } catch (o) {
    consoleError(o, t._$$hostElement$$_);
  }
  return null;
}, postUpdateComponent = t => {
  t._$$cmpMeta$$_._$$tagName$$_;
  const e = t._$$hostElement$$_, endPostUpdate = () => {}, n = t._$$lazyInstance$$_, o = t._$$ancestorComponent$$_;
  emitLifecycleEvent(e, "componentDidRender"), 64 /* HOST_FLAGS.hasLoadedComponent */ & t._$$flags$$_ ? (safeCall(n, "componentDidUpdate", void 0, e), 
  emitLifecycleEvent(e, "componentDidUpdate"), endPostUpdate()) : (t._$$flags$$_ |= 64 /* HOST_FLAGS.hasLoadedComponent */ , 
  // DOM WRITE!
  addHydratedFlag(e), safeCall(n, "componentDidLoad", void 0, e), emitLifecycleEvent(e, "componentDidLoad"), 
  endPostUpdate(), t._$$onReadyResolve$$_(e), o || appDidLoad()), t._$$onInstanceResolve$$_(e), 
  t._$$onRenderResolve$$_ && (t._$$onRenderResolve$$_(), t._$$onRenderResolve$$_ = void 0), 
  512 /* HOST_FLAGS.needsRerender */ & t._$$flags$$_ && nextTick((() => scheduleUpdate(t, !1))), 
  t._$$flags$$_ &= -517 /* HOST_FLAGS.needsRerender */;
}
// ( •_•)
// ( •_•)>⌐■-■
// (⌐■_■)
, appDidLoad = e => {
  addHydratedFlag(T.documentElement), nextTick((() => emitEvent(w, "appload", {
    detail: {
      namespace: t
    }
  })));
}, safeCall = (t, e, n, o) => {
  if (t && t[e]) try {
    return t[e](n);
  } catch (s) {
    consoleError(s, o);
  }
}, then = (t, e) => t && t.then ? t.then(e) : e(), emitLifecycleEvent = (e, n) => {
  emitEvent(e, "stencil_" + n, {
    bubbles: !0,
    composed: !0,
    detail: {
      namespace: t
    }
  });
}, addHydratedFlag = t => t.classList.add("hydrated"), setValue = (t, e, n, o, s = !0) => {
  // check our new property value against our internal value
  const i = getHostRef(t), l = i._$$instanceValues$$_.get(e), r = i._$$flags$$_, c = i._$$lazyInstance$$_;
  n = ((t, e) => 
  // ensure this value is of the correct prop type
  null == t || isComplexType(t) ? t : 4 /* MEMBER_FLAGS.Boolean */ & e ? "false" !== t && ("" === t || !!t) : 2 /* MEMBER_FLAGS.Number */ & e ? parseFloat(t) : 1 /* MEMBER_FLAGS.String */ & e ? t + "" : t)(n, o._$$members$$_[e][0]);
  8 /* HOST_FLAGS.isConstructingInstance */ & r && void 0 !== l || !(n !== l && !(Number.isNaN(l) && Number.isNaN(n))) || (
  // gadzooks! the property's value has changed!!
  // set our new value!
  i._$$instanceValues$$_.set(e, n), c && 2 /* HOST_FLAGS.hasRendered */ == (18 /* HOST_FLAGS.isQueuedForUpdate */ & r) && 
  // looks like this value actually changed, so we've got work to do!
  // but only if we've already rendered, otherwise just chill out
  // queue that we need to do an update, but don't worry about queuing
  // up millions cuz this function ensures it only runs once
  scheduleUpdate(i, !1));
}, proxyComponent = (t, e, n) => {
  if (e._$$members$$_) {
    // It's better to have a const than two Object.entries()
    const o = Object.entries(e._$$members$$_), s = t.prototype;
    if (o.map((([t, [o]]) => {
      if (31 /* MEMBER_FLAGS.Prop */ & o || 2 /* PROXY_FLAGS.proxyState */ & n && 32 /* MEMBER_FLAGS.State */ & o) {
        if (0 == (2048 /* MEMBER_FLAGS.Getter */ & o) ? 
        // proxyComponent - prop
        Object.defineProperty(s, t, {
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
        Object.defineProperty(s, t, {
          get() {
            const e = getHostRef(this), n = e ? e._$$lazyInstance$$_ : s;
            if (n) return n[t];
          },
          configurable: !0,
          enumerable: !0
        }), 4096 /* MEMBER_FLAGS.Setter */ & o) {
          // proxyComponent - lazy and non-lazy. Catches original set to fire updates (for @Watch)
          const n = Object.getOwnPropertyDescriptor(s, t).set;
          Object.defineProperty(s, t, {
            set(o) {
              const s = getHostRef(this);
              // non-lazy setter - amends original set to fire update
                            if (n) return n.call(this, o), void setValue(this, t, s._$$hostElement$$_[t], e);
              if (!s) return;
              // lazy setter maps the element set to the class set
                            const setVal = (n = !1) => {
                s._$$lazyInstance$$_[t] = o, setValue(this, t, s._$$lazyInstance$$_[t], e, !n);
              };
              // If there's a value from an attribute, (before the class is defined), queue & set async
                            s._$$lazyInstance$$_ ? setVal() : s._$$onInstancePromise$$_.then((() => setVal(!0)));
            }
          });
        }
      } else 1 /* PROXY_FLAGS.isElementConstructor */ & n && 64 /* MEMBER_FLAGS.Method */ & o && 
      // proxyComponent - method
      Object.defineProperty(s, t, {
        value(...e) {
          const n = getHostRef(this);
          return n._$$onInstancePromise$$_.then((() => n._$$lazyInstance$$_[t](...e)));
        }
      });
    })), 1 /* PROXY_FLAGS.isElementConstructor */ & n) {
      const n = new Map;
      s.attributeChangedCallback = function(t, e, o) {
        C.jmp((() => {
          const e = n.get(t);
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
                    if (this.hasOwnProperty(e)) o = this[e], delete this[e]; else if (s.hasOwnProperty(e) && "number" == typeof this[e] && this[e] == o) 
          // if the propName exists on the prototype of `Cstr`, this update may be a result of Stencil using native
          // APIs to reflect props as attributes. Calls to `setAttribute(someElement, propName)` will result in
          // `propName` to be converted to a `DOMString`, which may not be what we want for other primitive props.
          return;
          const i = Object.getOwnPropertyDescriptor(s, e);
          // test whether this property either has no 'getter' or if it does, has a 'setter'
          // before attempting to write back to component props
                    i.get && !i.set || (this[e] = (null !== o || "boolean" != typeof this[e]) && o);
        }));
      }, 
      // create an array of attributes to observe
      // and also create a map of html attribute name to js property name
      t.observedAttributes = o.filter((([t, e]) => 15 /* MEMBER_FLAGS.HasAttribute */ & e[0] // filter to only keep props that should match attributes
      )).map((([t, o]) => {
        const s = o[1] || t;
        return n.set(s, t), 512 /* MEMBER_FLAGS.ReflectAttr */ & o[0] && e._$$attrsToReflect$$_.push([ t, s ]), 
        s;
      }));
    }
  }
  return t;
}, initializeComponent = async (t, e, n, o, s) => {
  // initializeComponent
  if (0 == (32 /* HOST_FLAGS.hasInitializedComponent */ & e._$$flags$$_)) {
    {
      if (
      // we haven't initialized this element yet
      e._$$flags$$_ |= 32 /* HOST_FLAGS.hasInitializedComponent */ , (
      // lazy loaded components
      // request the component's implementation to be
      // wired up with the host element
      s = loadModule(n, e)).then) {
        // Await creates a micro-task avoid if possible
        const endLoad = () => {};
        s = await s, endLoad();
      }
      if (!s) throw Error(`Constructor for "${n._$$tagName$$_}#${e._$$modeName$$_}" was not found`);
      s.isProxied || (proxyComponent(s, n, 2 /* PROXY_FLAGS.proxyState */), s.isProxied = !0);
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
        new s(e);
      } catch (l) {
        consoleError(l, t);
      }
      e._$$flags$$_ &= -9 /* HOST_FLAGS.isConstructingInstance */ , o();
    }
    if (s.style) {
      // this component has styles but we haven't registered them yet
      let o = s.style;
      "string" != typeof o && (o = o[e._$$modeName$$_ = (t => j.map((e => e(t))).find((t => !!t)))
      // Public
      (t)]);
      const i = getScopeId(n, e._$$modeName$$_);
      if (!y.has(i)) {
        const t = (n._$$tagName$$_, () => {});
        8 /* CMP_FLAGS.needsShadowDomShim */ & n._$$flags$$_ && (o = await __sc_import_testapp("./p-a32872b1.js").then((t => t.scopeCss(o, i, !1)))), 
        ((t, e, n) => {
          let o = y.get(t);
          k && n ? (o = o || new CSSStyleSheet, "string" == typeof o ? o = e : o.replaceSync(e)) : o = e, 
          y.set(t, o);
        })(i, o, !!(1 /* CMP_FLAGS.shadowDomEncapsulation */ & n._$$flags$$_)), t();
      }
    }
  }
  // we've successfully created a lazy instance
    const i = e._$$ancestorComponent$$_, schedule = () => scheduleUpdate(e, !0);
  i && i["s-rc"] ? 
  // this is the initial load and this component it has an ancestor component
  // but the ancestor component has NOT fired its will update lifecycle yet
  // so let's just cool our jets and wait for the ancestor to continue first
  // this will get fired off when the ancestor component
  // finally gets around to rendering its lazy self
  // fire off the initial update
  i["s-rc"].push(schedule) : schedule();
}, setContentReference = t => {
  // only required when we're NOT using native shadow dom (slot)
  // or this browser doesn't support native shadow dom
  // and this host element was NOT created with SSR
  // let's pick out the inner content for slot projection
  // create a node to represent where the original
  // content was first placed, which is useful later on
  const e = t["s-cr"] = T.createComment(`content-ref (host=${t.localName})`);
  e["s-cn"] = !0;
  const n = t.__firstChild || t.firstChild;
  n ? t.__insertBefore ? t.__insertBefore(e, n) : t.insertBefore(e, n) : t.__appendChild ? t.__appendChild(e) : t.appendChild(e);
}, bootstrapLazy = (t, e = {}) => {
  var n;
  const endBootstrap = () => {}, o = [], s = e.exclude || [], i = w.customElements, l = T.head, r =  l.querySelector("meta[charset]"), c =  T.createElement("style"), f = [];
  let u, a = !0;
  Object.assign(C, e), C._$$resourcesUrl$$_ = new URL(e.resourcesUrl || "./", T.baseURI).href, 
  t.map((t => {
    t[1].map((e => {
      const n = {
        _$$flags$$_: e[0],
        _$$tagName$$_: e[1],
        _$$members$$_: e[2],
        _$$listeners$$_: e[3]
      };
      n._$$members$$_ = e[2], n._$$listeners$$_ = e[3], n._$$attrsToReflect$$_ = [], !M && 1 /* CMP_FLAGS.shadowDomEncapsulation */ & n._$$flags$$_ && (n._$$flags$$_ |= 8 /* CMP_FLAGS.needsShadowDomShim */);
      const l = n._$$tagName$$_, r = class extends HTMLElement {
        // StencilLazyHost
        constructor(t) {
          // @ts-ignore
          super(t), registerHost(t = this, n), 1 /* CMP_FLAGS.shadowDomEncapsulation */ & n._$$flags$$_ && (
          // this component is using shadow dom
          // and this browser supports shadow dom
          // add the read-only property "shadowRoot" to the host element
          // adding the shadow root build conditionals to minimize runtime
          M ? t.attachShadow({
            mode: "open",
            delegatesFocus: !!(16 /* CMP_FLAGS.shadowDelegatesFocus */ & n._$$flags$$_)
          }) : "shadowRoot" in t || (t.shadowRoot = t));
        }
        connectedCallback() {
          u && (clearTimeout(u), u = null), a ? 
          // connectedCallback will be processed once all components have been registered
          f.push(this) : C.jmp((() => (t => {
            if (0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & C._$$flags$$_)) {
              const e = getHostRef(t), n = e._$$cmpMeta$$_, o = (n._$$tagName$$_, () => {});
              if (1 /* HOST_FLAGS.hasConnected */ & e._$$flags$$_) e && 
              // not the first time this has connected
              // reattach any event listeners to the host
              // since they would have been removed when disconnected
              addHostEventListeners(t, e, n._$$listeners$$_); else {
                // first time this component has connected
                e._$$flags$$_ |= 1 /* HOST_FLAGS.hasConnected */ , 
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
                  if (n["s-p"]) {
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
                })), initializeComponent(t, e, n);
              }
              o();
            }
          })(this)));
        }
        disconnectedCallback() {
          C.jmp((() => (t => {
            if (0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & C._$$flags$$_)) {
              const e = getHostRef(t), n = e._$$lazyInstance$$_;
              e._$$rmListeners$$_ && (e._$$rmListeners$$_.map((t => t())), e._$$rmListeners$$_ = void 0), 
              // clear CSS var-shim tracking
              C._$$cssShim$$_ && C._$$cssShim$$_.removeHost(t), safeCall(n, "disconnectedCallback", void 0, t);
            }
          })(this)));
        }
        componentOnReady() {
          return getHostRef(this)._$$onReadyPromise$$_;
        }
      };
      (4 /* CMP_FLAGS.hasSlotRelocation */ & n._$$flags$$_ || 8 /* CMP_FLAGS.needsShadowDomShim */ & n._$$flags$$_) && (((t, e) => {
        patchChildNodes(t, e), patchInsertBefore(t), patchAppendChild(t), patchAppend(t), 
        patchPrepend(t), patchInsertAdjacentHTML(t), patchInsertAdjacentText(t), patchInsertAdjacentElement(t), 
        patchReplaceChildren(t), patchInnerHTML(t, e), patchInnerText(t, e), patchTextContent(t, e);
      })(r.prototype), patchCloneNode(r.prototype)), n._$$lazyBundleId$$_ = t[0], s.includes(l) || i.get(l) || (o.push(l), 
      i.define(l, proxyComponent(r, n, 1 /* PROXY_FLAGS.isElementConstructor */)));
    }));
  }));
  {
    c.innerHTML = o + "{visibility:hidden}.hydrated{visibility:inherit}", c.setAttribute("data-styles", "");
    // Apply CSP nonce to the style tag if it exists
    const t = null !== (n = C._$$nonce$$_) && void 0 !== n ? n : queryNonceMetaTagContent(T);
    null != t && c.setAttribute("nonce", t), l.insertBefore(c, r ? r.nextSibling : l.firstChild);
  }
  // Process deferred connectedCallbacks now all components have been registered
    a = !1, f.length ? f.map((t => t.connectedCallback())) : C.jmp((() => u = setTimeout(appDidLoad, 30))), 
  // Fallback appLoad event
  endBootstrap();
}, addHostEventListeners = (t, e, n, o) => {
  n && n.map((([n, o, s]) => {
    const i = getHostListenerTarget(t, n), l = hostListenerProxy(e, s), r = hostListenerOpts(n);
    C.ael(i, o, l, r), (e._$$rmListeners$$_ = e._$$rmListeners$$_ || []).push((() => C.rel(i, o, l, r)));
  }));
}, hostListenerProxy = (t, e) => n => {
  try {
    256 /* HOST_FLAGS.isListenReady */ & t._$$flags$$_ ? 
    // instance is ready, let's call it's member method for this event
    t._$$lazyInstance$$_[e](n) : (t._$$queuedListeners$$_ = t._$$queuedListeners$$_ || []).push([ e, n ]);
  } catch (o) {
    consoleError(o, t._$$hostElement$$_ || null);
  }
}, getHostListenerTarget = (t, e) => 8 /* LISTENER_FLAGS.TargetWindow */ & e ? w : t, hostListenerOpts = t => 0 != (2 /* LISTENER_FLAGS.Capture */ & t)
/**
 * Assigns the given value to the nonce property on the runtime platform object.
 * During runtime, this value is used to set the nonce attribute on all dynamically created script and style tags.
 * @param nonce The value to be assigned to the platform nonce property.
 * @returns void
 */ , setNonce = t => C._$$nonce$$_ = t, g =  new WeakMap, getHostRef = t => g.get(t), registerInstance = (t, e) => g.set(e._$$lazyInstance$$_ = t, e), registerHost = (t, e) => {
  const n = {
    _$$flags$$_: 0,
    _$$hostElement$$_: t,
    _$$cmpMeta$$_: e,
    _$$instanceValues$$_: new Map
  };
  return n._$$onInstancePromise$$_ = new Promise((t => n._$$onInstanceResolve$$_ = t)), 
  n._$$onReadyPromise$$_ = new Promise((t => n._$$onReadyResolve$$_ = t)), t["s-p"] = [], 
  t["s-rc"] = [], addHostEventListeners(t, n, e._$$listeners$$_), g.set(t, n);
}, isMemberInElement = (t, e) => e in t, consoleError = (t, e) => (0, console.error)(t, e), $ =  new Map, loadModule = (t, e, n) => {
  // loadModuleImport
  const o = t._$$tagName$$_.replace(/-/g, "_"), s = t._$$lazyBundleId$$_, i = $.get(s);
  return i ? i[o] : __sc_import_testapp(
  /* @vite-ignore */
  /* webpackInclude: /\.entry\.js$/ */
  /* webpackExclude: /\.system\.entry\.js$/ */
  /* webpackMode: "lazy" */
  `./${s}.entry.js`).then((t => (s && $.set(s, t), t[o])), (t => {
    consoleError(t, e._$$hostElement$$_);
  }))
  /*!__STENCIL_STATIC_IMPORT_SWITCH__*/;
}, y =  new Map, j = [], w = "undefined" != typeof window ? window : {}, O = w.CSS, T = w.document || {
  head: {}
}, _ = w.HTMLElement || class {}, C = {
  _$$flags$$_: 0,
  _$$resourcesUrl$$_: "",
  jmp: t => t(),
  raf: t => requestAnimationFrame(t),
  ael: (t, e, n, o) => t.addEventListener(e, n, o),
  rel: (t, e, n, o) => t.removeEventListener(e, n, o),
  ce: (t, e) => new CustomEvent(t, e)
}, M =  (() => (T.head.attachShadow + "").indexOf("[native") > -1)(), promiseResolve = t => Promise.resolve(t), k =  (() => {
  try {
    return new CSSStyleSheet, "function" == typeof (new CSSStyleSheet).replaceSync;
  } catch (t) {}
  return !1;
})(), x = [], N = [], queueTask = (t, e) => n => {
  t.push(n), c || (c = !0, e && 4 /* PLATFORM_FLAGS.queueSync */ & C._$$flags$$_ ? nextTick(flush) : C.raf(flush));
}, consume = t => {
  for (let n = 0; n < t.length; n++) try {
    t[n](performance.now());
  } catch (e) {
    consoleError(e);
  }
  t.length = 0;
}, flush = () => {
  // always force a bunch of medium callbacks to run, but still have
  // a throttle on how many can run in a certain time
  // DOM READS!!!
  consume(x), consume(N), (c = x.length > 0) && 
  // still more to do yet, but we've run out of time
  // let's let this thing cool off and try again in the next tick
  C.raf(flush);
}, nextTick = t => promiseResolve().then(t), E =  queueTask(N, !0);

export { f as B, O as C, _ as H, t as N, promiseResolve as a, bootstrapLazy as b, setMode as c, T as d, d as e, createEvent as f, getElement as g, h, getMode as i, C as p, registerInstance as r, setNonce as s, w }