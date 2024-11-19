const t = "testinvisibletrueprehydration";

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */ let e = !1;

const isComplexType = t => "object" === (
// https://jsperf.com/typeof-fn-object/5
t = typeof t) || "function" === t;

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
  let i = null, o = !1, r = !1;
  const s = [], walk = e => {
    for (let n = 0; n < e.length; n++) i = e[n], Array.isArray(i) ? walk(i) : null != i && "boolean" != typeof i && ((o = "function" != typeof t && !isComplexType(i)) && (i += ""), 
    o && r ? 
    // If the previous child was simple (string), we merge both
    s[s.length - 1]._$$text$$_ += i : 
    // Append a new vNode, if it's text, we create a text vNode
    s.push(o ? newVNode(null, i) : i), r = o);
  };
  walk(n);
  const l = newVNode(t, null);
  return l._$$attrs$$_ = e, s.length > 0 && (l._$$children$$_ = s), l;
}, newVNode = (t, e) => ({
  _$$flags$$_: 0,
  _$$tag$$_: t,
  _$$text$$_: e,
  _$$elm$$_: null,
  _$$children$$_: null
}), n = {}, renderSlotFallbackContent = (t, e) => {
  // if this slot doesn't have fallback content, return
  if (!t["s-hsf"] || !t.parentNode) return;
  // in non-shadow component, slot nodes are just empty text nodes or comment nodes
  // the 'children' nodes are therefore placed next to it.
  // let's loop through those now
    let n, i = t.parentNode.__childNodes || t.parentNode.childNodes;
  const o = i.length;
  let r = 0;
  for (;r < o; r++) n = i[r], n["s-sr"] && e && n["s-psn"] === t["s-sn"] ? 
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
  let n, i, o, r, s, l;
  for (i = 0, o = e.length; i < o; i++) {
    // slot reference node?
    if (e[i]["s-sr"]) 
    // because we found a slot fallback node let's loop over all
    // the children again to
    for (
    // this component uses slots and we're on a slot node
    // let's find all it's slotted children or lack thereof
    // and show or hide fallback nodes (`<slot />` children)
    // get the slot name for this slot reference node
    s = e[i]["s-sn"], n = e[i], 
    // by default always show a fallback slot node
    // then hide it if there are other slotted nodes in the light dom
    renderSlotFallbackContent(n, !1), r = 0; r < o; r++) 
    // ignore slot fallback nodes
    if (l = e[r].nodeType, !e[r]["s-sf"]) 
    // is sibling node is from a different component OR is a named fallback slot node?
    if (e[r]["s-hn"] !== n["s-hn"] || "" !== s) {
      // you can't slot a textNode in a named slot
      if (1 /* NODE_TYPE.ElementNode */ === l && s === e[r]["s-sn"]) {
        // we found a slotted element!
        // let's hide all the fallback nodes
        renderSlotFallbackContent(n, !0), 
        // patches this node's removal methods
        // so if it gets removed in the future
        // re-asses the fallback node status
        patchRemove(e[r]);
        break;
      }
    } else if (e[r]["s-sn"] === s && (1 /* NODE_TYPE.ElementNode */ === l || 3 /* NODE_TYPE.TextNode */ === l && e[r] && e[r].textContent && "" !== e[r].textContent.trim())) {
      // we found a slotted something
      // let's hide all the fallback nodes
      renderSlotFallbackContent(n, !0), 
      // patches this node's removal methods
      // so if it gets removed in the future
      // re-asses the fallback node status
      patchRemove(e[r]);
      break;
    }
    // keep drilling down
        updateFallbackSlotVisibility(e[i]);
  }
}, patchChildNodes = (t, e) => {
  if (!globalThis.Node) return;
  class n extends Array {
    item(t) {
      return this[t];
    }
  }
  let i = Object.getOwnPropertyDescriptor(e || Node.prototype, "childNodes");
  i || (i = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Node.prototype), "childNodes")), 
  i && Object.defineProperty(t, "__childNodes", i);
  let o = Object.getOwnPropertyDescriptor(e || Element.prototype, "children");
  // MockNode won't have these
    o && Object.defineProperty(t, "__children", o);
  const r = Object.getOwnPropertyDescriptor(e || Element.prototype, "childElementCount");
  r && Object.defineProperty(t, "__childElementCount", r), Object.defineProperty(t, "children", {
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
  }), i && Object.defineProperty(t, "childNodes", {
    get() {
      const t = this.__childNodes, e = new n;
      for (let n = 0; n < t.length; n++) {
        const i = t[n]["s-nr"];
        !i || 8 /* NODE_TYPE.CommentNode */ === i.nodeType && 0 === i.nodeValue.indexOf("o.") || e.push(i);
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
    const n = t["s-sn"] = getSlotName(t), i = getHostSlotNode(this.__childNodes, n);
    if (i) {
      let o = !1;
      if (this.childNodes.forEach((r => {
        // we found the node in our list of other 'lightDOM' / slotted nodes
        if (r !== e && null !== e) ; else {
          if (o = !0, addSlotRelocateNode(t, i), null === e) return void this.__append(t);
          if (n === e["s-sn"]) {
            (e.parentNode.__insertBefore || e.parentNode.insertBefore).call(e.parentNode, t, e), 
            patchRemove(t);
          } else 
          // current child is not in the same slot as 'slot before' node
          // so just toss the node in wherever
          this.__append(t);
        }
      })), o) return t;
    }
    return this.__insertBefore(t, e);
  });
}, patchAppendChild = t => {
  t.__appendChild || (t.__appendChild = t.appendChild, t.appendChild = function(t) {
    const e = t["s-sn"] = getSlotName(t), n = getHostSlotNode(this.__childNodes || this.childNodes, e);
    if (n) {
      addSlotRelocateNode(t, n);
      const e = getHostSlotChildNodes(n), i = e[e.length - 1];
      if (i.parentNode) {
        const e = i.parentNode;
        e.__insertBefore ? e.__insertBefore(t, i.nextSibling) : e.insertBefore(t, i.nextSibling), 
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
    let i;
    if (n.innerHTML = e, "afterbegin" === t) for (;i = n.firstChild; ) this.prepend(i); else if ("beforeend" === t) for (;i = n.firstChild; ) this.append(i);
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
  const i = document.createTextNode("");
  if (i["s-nr"] = t, e["s-cr"] && e["s-cr"].parentNode) {
    const t = e["s-cr"].parentNode, o = t.__appendChild || t.appendChild;
    if (void 0 !== n) {
      i["s-oo"] = n;
      const r = t.__childNodes || t.childNodes, s = [ i ];
      r.forEach((t => {
        t["s-nr"] && s.push(t);
      })), s.sort(((t, e) => !t["s-oo"] || t["s-oo"] < e["s-oo"] ? -1 : !e["s-oo"] || e["s-oo"] < t["s-oo"] ? 1 : 0)), 
      s.forEach((t => o.call(e["s-cr"].parentNode, t)));
    } else o.call(e["s-cr"].parentNode, i);
  }
  t["s-ol"] = i;
}, getSlotName = t => t["s-sn"] || 1 /* NODE_TYPE.ElementNode */ === t.nodeType && t.getAttribute("slot") || t.slot || ""
/**
 * Recursively searches a series of child nodes for a slot with the provided name.
 * @param childNodes the nodes to search for a slot with a specific name.
 * @param slotName the name of the slot to match on.
 * @returns a reference to the slot node that matches the provided name, `null` otherwise
 */ , getHostSlotNode = (t, e) => {
  let n, i = 0;
  if (!t) return null;
  for (;i < t.length; i++) {
    if (n = t[i], n["s-sr"] && n["s-sn"] === e) return n;
    if (n = getHostSlotNode(n.childNodes, e), n) return n;
  }
  return null;
}, getHostSlotChildNodes = t => {
  const e = [ t ], n = t["s-sn"] || "";
  for (;(t = t.nextSibling) && t["s-sn"] === n; ) e.push(t);
  return e;
}, emitEvent = (t, e, n) => {
  const i = l.ce(e, n);
  return t.dispatchEvent(i), i;
}, createElm = (t, e, n, i) => {
  // tslint:disable-next-line: prefer-const
  const o = e._$$children$$_[n];
  let r, l, c = 0;
  if (null !== o._$$text$$_) 
  // create text node
  r = o._$$elm$$_ = s.createTextNode(o._$$text$$_); else if (
  // create element
  r = o._$$elm$$_ = s.createElement(o._$$tag$$_), o._$$children$$_) for (c = 0; c < o._$$children$$_.length; ++c) 
  // create the node
  l = createElm(t, o, c), 
  // return node could have been null
  l && (
  // append our new node
  r.__appendChild ? r.__appendChild(l) : r.appendChild(l));
  return r;
}, patch = (t, e) => {
  const n = e._$$elm$$_ = t._$$elm$$_, i = e._$$children$$_, o = e._$$text$$_;
  null === o ? null !== i && 
  // add the new vnode children
  ((t, e, n, i, o, r) => {
    let s, l = t;
    for (;o <= r; ++o) i[o] && (s = createElm(null, n, o), s && (i[o]._$$elm$$_ = s, 
    l.insertBefore(s, e)));
  })(n, null, e, i, 0, i.length - 1) : t._$$text$$_ !== o && (
  // update the text content for the text only vnode
  // and also only if the text is different than before
  n.textContent = o, n["s-sf"] && (n["s-sfc"] = o));
}, renderVdom = (t, e) => {
  const i = t._$$hostElement$$_, o = t._$$vnode$$_ || newVNode(null, null), r = (t => t && t._$$tag$$_ === n)
  /**
 * Show or hide a slot nodes children
 * @param slotNode a slot node, the 'children' of which should be shown or hidden
 * @param hide whether to hide the slot node 'children'
 * @returns
 */ (e) ? e : h(null, null, e);
  r._$$tag$$_ = null, r._$$flags$$_ |= 4 /* VNODE_FLAGS.isHost */ , t._$$vnode$$_ = r, 
  r._$$elm$$_ = o._$$elm$$_ = i, 
  // synchronous patch
  patch(o, r);
}, attachToAncestor = (t, e) => {
  e && !t._$$onRenderResolve$$_ && e["s-p"] && e["s-p"].push(new Promise((e => t._$$onRenderResolve$$_ = e)));
}, scheduleUpdate = (t, e) => {
  if (4 /* HOST_FLAGS.isWaitingForChildren */ & t._$$flags$$_) return void (t._$$flags$$_ |= 512 /* HOST_FLAGS.needsRerender */);
  attachToAncestor(t, t._$$ancestorComponent$$_);
  return f((() => dispatchHooks(t, e)));
}, dispatchHooks = (t, e) => {
  const n = t._$$hostElement$$_, i = (t._$$cmpMeta$$_._$$tagName$$_, () => {}), o = t._$$lazyInstance$$_;
  return emitLifecycleEvent(n, e ? "componentWillLoad" : "componentWillUpdate"), emitLifecycleEvent(n, "componentWillRender"), 
  i(), then(undefined, (() => updateComponent(t, o)));
}, updateComponent = async (t, e, n) => {
  // updateComponent
  const i = t._$$hostElement$$_, o = (t._$$cmpMeta$$_._$$tagName$$_, () => {}), r = i["s-rc"], s = (t._$$cmpMeta$$_._$$tagName$$_, 
  () => {});
  callRender(t, e), r && (
  // ok, so turns out there are some child host elements
  // waiting on this parent element to load
  // let's fire off all update callbacks waiting
  r.map((t => t())), i["s-rc"] = void 0), s(), o();
  {
    const e = i["s-p"], postUpdate = () => postUpdateComponent(t);
    0 === e.length ? postUpdate() : (Promise.all(e).then(postUpdate), t._$$flags$$_ |= 4 /* HOST_FLAGS.isWaitingForChildren */ , 
    e.length = 0);
  }
}, callRender = (t, e, n) => {
  try {
    e = e.render(), t._$$flags$$_ |= 2 /* HOST_FLAGS.hasRendered */ , renderVdom(t, e);
  } catch (e) {
    consoleError(e, t._$$hostElement$$_);
  }
  return null;
}, postUpdateComponent = t => {
  t._$$cmpMeta$$_._$$tagName$$_;
  const e = t._$$hostElement$$_, endPostUpdate = () => {}, n = t._$$ancestorComponent$$_;
  emitLifecycleEvent(e, "componentDidRender"), 64 /* HOST_FLAGS.hasLoadedComponent */ & t._$$flags$$_ ? (emitLifecycleEvent(e, "componentDidUpdate"), 
  endPostUpdate()) : (t._$$flags$$_ |= 64 /* HOST_FLAGS.hasLoadedComponent */ , 
  // DOM WRITE!
  addHydratedFlag(e), emitLifecycleEvent(e, "componentDidLoad"), endPostUpdate(), 
  t._$$onReadyResolve$$_(e), n || appDidLoad()), t._$$onRenderResolve$$_ && (t._$$onRenderResolve$$_(), 
  t._$$onRenderResolve$$_ = void 0), 512 /* HOST_FLAGS.needsRerender */ & t._$$flags$$_ && nextTick((() => scheduleUpdate(t, !1))), 
  t._$$flags$$_ &= -517 /* HOST_FLAGS.needsRerender */;
}
// ( •_•)
// ( •_•)>⌐■-■
// (⌐■_■)
, appDidLoad = e => {
  addHydratedFlag(s.documentElement), nextTick((() => emitEvent(r, "appload", {
    detail: {
      namespace: t
    }
  })));
}, then = (t, e) => t && t.then ? t.then(e) : e(), emitLifecycleEvent = (e, n) => {
  emitEvent(e, "stencil_" + n, {
    bubbles: !0,
    composed: !0,
    detail: {
      namespace: t
    }
  });
}, addHydratedFlag = t => t.classList.add("hydrated")
/**
 * Attach a series of runtime constructs to a compiled Stencil component
 * constructor, including getters and setters for the `@Prop` and `@State`
 * decorators, callbacks for when attributes change, and so on.
 *
 * @param Cstr the constructor for a component that we need to process
 * @param cmpMeta metadata collected previously about the component
 * @param flags a number used to store a series of bit flags
 * @returns a reference to the same constructor passed in (but now mutated)
 */ , connectedCallback = t => {
  if (0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & l._$$flags$$_)) {
    const e = getHostRef(t), n = e._$$cmpMeta$$_, i = (n._$$tagName$$_, () => {});
    if (!(1 /* HOST_FLAGS.hasConnected */ & e._$$flags$$_)) {
      // first time this component has connected
      e._$$flags$$_ |= 1 /* HOST_FLAGS.hasConnected */;
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
      (async (t, e, n, i, o) => {
        // initializeComponent
        if (0 == (32 /* HOST_FLAGS.hasInitializedComponent */ & e._$$flags$$_)) {
          if (
          // we haven't initialized this element yet
          e._$$flags$$_ |= 32 /* HOST_FLAGS.hasInitializedComponent */ , (
          // lazy loaded components
          // request the component's implementation to be
          // wired up with the host element
          o = loadModule(n, e)).then) {
            // Await creates a micro-task avoid if possible
            const endLoad = () => {};
            o = await o, endLoad();
          }
          if (!o) throw Error(`Constructor for "${n._$$tagName$$_}#${e._$$modeName$$_}" was not found`);
          const i = (n._$$tagName$$_, () => {});
          // construct the lazy-loaded component implementation
          // passing the hostRef is very important during
          // construction in order to directly wire together the
          // host element and the lazy-loaded instance
                    try {
            new o(e);
          } catch (e) {
            consoleError(e, t);
          }
          i();
        }
        // we've successfully created a lazy instance
                const r = e._$$ancestorComponent$$_, schedule = () => scheduleUpdate(e, !0);
        r && r["s-rc"] ? 
        // this is the initial load and this component it has an ancestor component
        // but the ancestor component has NOT fired its will update lifecycle yet
        // so let's just cool our jets and wait for the ancestor to continue first
        // this will get fired off when the ancestor component
        // finally gets around to rendering its lazy self
        // fire off the initial update
        r["s-rc"].push(schedule) : schedule();
      })(t, e, n);
    }
    i();
  }
}, bootstrapLazy = (t, e = {}) => {
  var n;
  const endBootstrap = () => {}, i = [], o = e.exclude || [], c = r.customElements, u = s.head, f =  u.querySelector("meta[charset]"), a =  s.createElement("style"), d = [];
  let b, m = !0;
  Object.assign(l, e), l._$$resourcesUrl$$_ = new URL(e.resourcesUrl || "./", s.baseURI).href, 
  t.map((t => {
    t[1].map((e => {
      const n = {
        _$$flags$$_: e[0],
        _$$tagName$$_: e[1],
        _$$members$$_: e[2],
        _$$listeners$$_: e[3]
      }, r = n._$$tagName$$_, s = class extends HTMLElement {
        // StencilLazyHost
        constructor(t) {
          // @ts-ignore
          super(t), registerHost(t = this, n);
        }
        connectedCallback() {
          b && (clearTimeout(b), b = null), m ? 
          // connectedCallback will be processed once all components have been registered
          d.push(this) : l.jmp((() => connectedCallback(this)));
        }
        disconnectedCallback() {
          l.jmp((() => (t => {
            0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & l._$$flags$$_) && getHostRef(t);
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
      })(s.prototype), n._$$lazyBundleId$$_ = t[0], o.includes(r) || c.get(r) || (i.push(r), 
      c.define(r, ((t, e, n) => t)(s)));
    }));
  }));
  {
    a.innerHTML = i + "{visibility:hidden}.hydrated{visibility:inherit}", a.setAttribute("data-styles", "");
    // Apply CSP nonce to the style tag if it exists
    const t = null !== (n = l._$$nonce$$_) && void 0 !== n ? n : 
    /**
 * Helper method for querying a `meta` tag that contains a nonce value
 * out of a DOM's head.
 *
 * @param doc The DOM containing the `head` to query against
 * @returns The content of the meta tag representing the nonce value, or `undefined` if no tag
 * exists or the tag has no content.
 */
    function(t) {
      var e, n, i;
      return null !== (i = null === (n = null === (e = t.head) || void 0 === e ? void 0 : e.querySelector('meta[name="csp-nonce"]')) || void 0 === n ? void 0 : n.getAttribute("content")) && void 0 !== i ? i : void 0;
    }(s);
    null != t && a.setAttribute("nonce", t), u.insertBefore(a, f ? f.nextSibling : u.firstChild);
  }
  // Process deferred connectedCallbacks now all components have been registered
    m = !1, d.length ? d.map((t => t.connectedCallback())) : l.jmp((() => b = setTimeout(appDidLoad, 30))), 
  // Fallback appLoad event
  endBootstrap();
}, setNonce = t => l._$$nonce$$_ = t, i =  new WeakMap, getHostRef = t => i.get(t), registerInstance = (t, e) => i.set(e._$$lazyInstance$$_ = t, e), registerHost = (t, e) => {
  const n = {
    _$$flags$$_: 0,
    _$$hostElement$$_: t,
    _$$cmpMeta$$_: e,
    _$$instanceValues$$_: new Map
  };
  return n._$$onReadyPromise$$_ = new Promise((t => n._$$onReadyResolve$$_ = t)), 
  t["s-p"] = [], t["s-rc"] = [], i.set(t, n);
}, consoleError = (t, e) => (0, console.error)(t, e), o =  new Map, loadModule = (t, e, n) => {
  // loadModuleImport
  const i = t._$$tagName$$_.replace(/-/g, "_"), r = t._$$lazyBundleId$$_, s = o.get(r);
  return s ? s[i] : import(
  /* @vite-ignore */
  /* webpackInclude: /\.entry\.js$/ */
  /* webpackExclude: /\.system\.entry\.js$/ */
  /* webpackMode: "lazy" */
  `./${r}.entry.js`).then((t => (r && o.set(r, t), t[i])), (t => {
    consoleError(t, e._$$hostElement$$_);
  }))
  /*!__STENCIL_STATIC_IMPORT_SWITCH__*/;
}, r = "undefined" != typeof window ? window : {}, s = r.document || {
  head: {}
}, l = {
  _$$flags$$_: 0,
  _$$resourcesUrl$$_: "",
  jmp: t => t(),
  raf: t => requestAnimationFrame(t),
  ael: (t, e, n, i) => t.addEventListener(e, n, i),
  rel: (t, e, n, i) => t.removeEventListener(e, n, i),
  ce: (t, e) => new CustomEvent(t, e)
}, promiseResolve = t => Promise.resolve(t), c = [], u = [], queueTask = (t, n) => i => {
  t.push(i), e || (e = !0, n && 4 /* PLATFORM_FLAGS.queueSync */ & l._$$flags$$_ ? nextTick(flush) : l.raf(flush));
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
  consume(c), consume(u), (e = c.length > 0) && 
  // still more to do yet, but we've run out of time
  // let's let this thing cool off and try again in the next tick
  l.raf(flush);
}, nextTick = t => promiseResolve().then(t), f =  queueTask(u, !0);

export { bootstrapLazy as b, h, promiseResolve as p, registerInstance as r, setNonce as s }