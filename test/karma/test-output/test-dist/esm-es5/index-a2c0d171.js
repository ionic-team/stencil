var scopeId, contentRef, hostTagName, __extends = this && this.__extends || function() {
  var extendStatics = function(e, t) {
    return extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(e, t) {
      e.__proto__ = t;
    } || function(e, t) {
      for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
    }, extendStatics(e, t);
  };
  return function(e, t) {
    if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    function __() {
      this.constructor = e;
    }
    extendStatics(e, t), e.prototype = null === t ? Object.create(t) : (__.prototype = t.prototype, 
    new __);
  };
}(), __awaiter = this && this.__awaiter || function(e, t, n, o) {
  return new (n || (n = Promise))((function(r, s) {
    function fulfilled(e) {
      try {
        step(o.next(e));
      } catch (t) {
        s(t);
      }
    }
    function rejected(e) {
      try {
        step(o.throw(e));
      } catch (t) {
        s(t);
      }
    }
    function step(e) {
      var t;
      e.done ? r(e.value) : (t = e.value, t instanceof n ? t : new n((function(e) {
        e(t);
      }))).then(fulfilled, rejected);
    }
    step((o = o.apply(e, t || [])).next());
  }));
}, __generator = this && this.__generator || function(e, t) {
  var n, o, r, s, i = {
    label: 0,
    sent: function() {
      if (1 & r[0]) throw r[1];
      return r[1];
    },
    trys: [],
    ops: []
  };
  return s = {
    next: verb(0),
    throw: verb(1),
    return: verb(2)
  }, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
    return this;
  }), s;
  function verb(a) {
    return function(l) {
      return function(a) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;s && (s = 0, a[0] && (i = 0)), i; ) try {
          if (n = 1, o && (r = 2 & a[0] ? o.return : a[0] ? o.throw || ((r = o.return) && r.call(o), 
          0) : o.next) && !(r = r.call(o, a[1])).done) return r;
          switch (o = 0, r && (a = [ 2 & a[0], r.value ]), a[0]) {
           case 0:
           case 1:
            r = a;
            break;

           case 4:
            return i.label++, {
              value: a[1],
              done: !1
            };

           case 5:
            i.label++, o = a[1], a = [ 0 ];
            continue;

           case 7:
            a = i.ops.pop(), i.trys.pop();
            continue;

           default:
            if (!(r = i.trys, (r = r.length > 0 && r[r.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
              i = 0;
              continue;
            }
            if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
              i.label = a[1];
              break;
            }
            if (6 === a[0] && i.label < r[1]) {
              i.label = r[1], r = a;
              break;
            }
            if (r && i.label < r[2]) {
              i.label = r[2], i.ops.push(a);
              break;
            }
            r[2] && i.ops.pop(), i.trys.pop();
            continue;
          }
          a = t.call(e, i);
        } catch (l) {
          a = [ 6, l ], o = 0;
        } finally {
          n = r = 0;
        }
        if (5 & a[0]) throw a[1];
        return {
          value: a[0] ? a[1] : void 0,
          done: !0
        };
      }([ a, l ]);
    };
  }
}, __spreadArray = this && this.__spreadArray || function(e, t, n) {
  if (n || 2 === arguments.length) for (var o, r = 0, s = t.length; r < s; r++) !o && r in t || (o || (o = Array.prototype.slice.call(t, 0, r)), 
  o[r] = t[r]);
  return e.concat(o || Array.prototype.slice.call(t));
}, NAMESPACE = "testapp", useNativeShadowDom = !1, checkSlotFallbackVisibility = !1, checkSlotRelocate = !1, isSvgMode = !1, queuePending = !1, Build = {
  isDev: !1,
  isBrowser: !0,
  isServer: !1,
  isTesting: !1
}, createTime = function(e, t) {
  return void 0 === t && (t = ""), function() {};
}, uniqueTime = function(e, t) {
  return function() {};
}, ORG_LOCATION_ID = "o", HYDRATED_CSS = "{visibility:hidden}.hydrated{visibility:inherit}", XLINK_NS = "http://www.w3.org/1999/xlink", EMPTY_OBJ = {}, SVG_NS = "http://www.w3.org/2000/svg", HTML_NS = "http://www.w3.org/1999/xhtml", isDef = function(e) {
  return null != e;
}, isComplexType = function(e) {
  return "object" === (
  // https://jsperf.com/typeof-fn-object/5
  e = typeof e) || "function" === e;
};

/**
 * Helper method for querying a `meta` tag that contains a nonce value
 * out of a DOM's head.
 *
 * @param doc The DOM containing the `head` to query against
 * @returns The content of the meta tag representing the nonce value, or `undefined` if no tag
 * exists or the tag has no content.
 */
function queryNonceMetaTagContent(e) {
  var t, n, o;
  return null !== (o = null === (n = null === (t = e.head) || void 0 === t ? void 0 : t.querySelector('meta[name="csp-nonce"]')) || void 0 === n ? void 0 : n.getAttribute("content")) && void 0 !== o ? o : void 0;
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
var h = function(e, t) {
  for (var n = [], o = 2; o < arguments.length; o++) n[o - 2] = arguments[o];
  var r = null, s = null, i = null, a = !1, l = !1, c = [], walk = function(t) {
    for (var n = 0; n < t.length; n++) r = t[n], Array.isArray(r) ? walk(r) : null != r && "boolean" != typeof r && ((a = "function" != typeof e && !isComplexType(r)) && (r = String(r)), 
    a && l ? 
    // If the previous child was simple (string), we merge both
    c[c.length - 1].$text$ += r : 
    // Append a new vNode, if it's text, we create a text vNode
    c.push(a ? newVNode(null, r) : r), l = a);
  };
  if (walk(n), t) {
    // normalize class / classname attributes
    t.key && (s = t.key), t.name && (i = t.name);
    var d = t.className || t.class;
    d && (t.class = "object" != typeof d ? d : Object.keys(d).filter((function(e) {
      return d[e];
    })).join(" "));
  }
  if ("function" == typeof e) 
  // nodeName is a functional component
  return e(null === t ? {} : t, c, vdomFnUtils);
  var u = newVNode(e, null);
  return u.$attrs$ = t, c.length > 0 && (u.$children$ = c), u.$key$ = s, u.$name$ = i, 
  u;
}, newVNode = function(e, t) {
  var n = {
    $flags$: 0,
    $tag$: e,
    $text$: t,
    $elm$: null,
    $children$: null,
    $attrs$: null,
    $key$: null,
    $name$: null
  };
  return n;
}, Host = {}, isHost = function(e) {
  return e && e.$tag$ === Host;
}, vdomFnUtils = {
  forEach: function(e, t) {
    return e.map(convertToPublic).forEach(t);
  },
  map: function(e, t) {
    return e.map(convertToPublic).map(t).map(convertToPrivate);
  }
}, convertToPublic = function(e) {
  return {
    vattrs: e.$attrs$,
    vchildren: e.$children$,
    vkey: e.$key$,
    vname: e.$name$,
    vtag: e.$tag$,
    vtext: e.$text$
  };
}, convertToPrivate = function(e) {
  if ("function" == typeof e.vtag) {
    var t = Object.assign({}, e.vattrs);
    return e.vkey && (t.key = e.vkey), e.vname && (t.name = e.vname), h.apply(void 0, __spreadArray([ e.vtag, t ], e.vchildren || [], !1));
  }
  var n = newVNode(e.vtag, e.vtext);
  return n.$attrs$ = e.vattrs, n.$children$ = e.vchildren, n.$key$ = e.vkey, n.$name$ = e.vname, 
  n;
}, renderSlotFallbackContent = function(e, t) {
  // if this slot doesn't have fallback content, return
  if (e["s-hsf"] && e.parentNode) for (
  // in non-shadow component, slot nodes are just empty text nodes or comment nodes
  // the 'children' nodes are therefore placed next to it.
  // let's loop through those now
  var n, o = e.parentNode.__childNodes || e.parentNode.childNodes, r = o.length, s = 0; s < r; s++) (n = o[s])["s-sr"] && t && n["s-psn"] === e["s-sn"] ? 
  // if this child node is a nested slot
  // drill into it's children to hide them in-turn
  renderSlotFallbackContent(n, !0) : 
  // this child node doesn't relate to this slot?
  n["s-sn"] === e["s-sn"] && (1 /* NODE_TYPE.ElementNode */ === n.nodeType && n["s-sf"] ? (
  // we found an fallback element. Hide or show
  n.hidden = t, n.style.display = t ? "none" : "") : n["s-sfc"] && (
  // this child has fallback text. Add or remove it
  t ? (n["s-sfc"] = n.textContent || void 0, n.textContent = "") : n.textContent && "" !== n.textContent.trim() || (n.textContent = n["s-sfc"])));
}, updateFallbackSlotVisibility = function(e) {
  if (e) {
    var t, n, o, r, s, i, a = e.__childNodes || e.childNodes;
    for (n = 0, o = a.length; n < o; n++) {
      // slot reference node?
      if (a[n]["s-sr"]) 
      // because we found a slot fallback node let's loop over all
      // the children again to
      for (
      // this component uses slots and we're on a slot node
      // let's find all it's slotted children or lack thereof
      // and show or hide fallback nodes (`<slot />` children)
      // get the slot name for this slot reference node
      s = a[n]["s-sn"], t = a[n], 
      // by default always show a fallback slot node
      // then hide it if there are other slotted nodes in the light dom
      renderSlotFallbackContent(t, !1), r = 0; r < o; r++) 
      // ignore slot fallback nodes
      if (i = a[r].nodeType, !a[r]["s-sf"]) 
      // is sibling node is from a different component OR is a named fallback slot node?
      if (a[r]["s-hn"] !== t["s-hn"] || "" !== s) {
        // you can't slot a textNode in a named slot
        if (1 /* NODE_TYPE.ElementNode */ === i && s === a[r]["s-sn"]) {
          // we found a slotted element!
          // let's hide all the fallback nodes
          renderSlotFallbackContent(t, !0), 
          // patches this node's removal methods
          // so if it gets removed in the future
          // re-asses the fallback node status
          patchRemove(a[r]);
          break;
        }
      } else if (a[r]["s-sn"] === s && (1 /* NODE_TYPE.ElementNode */ === i || 3 /* NODE_TYPE.TextNode */ === i && a[r] && a[r].textContent && "" !== a[r].textContent.trim())) {
        // we found a slotted something
        // let's hide all the fallback nodes
        renderSlotFallbackContent(t, !0), 
        // patches this node's removal methods
        // so if it gets removed in the future
        // re-asses the fallback node status
        patchRemove(a[r]);
        break;
      }
      // keep drilling down
            updateFallbackSlotVisibility(a[n]);
    }
  }
}, patchPseudoShadowDom = function(e, t) {
  patchChildNodes(e, t), patchInsertBefore(e), patchAppendChild(e), patchAppend(e), 
  patchPrepend(e), patchInsertAdjacentHTML(e), patchInsertAdjacentText(e), patchInsertAdjacentElement(e), 
  patchReplaceChildren(e), patchInnerHTML(e, t), patchInnerText(e, t), patchTextContent(e, t);
}, patchCloneNode = function(e) {
  e.__cloneNode = e.cloneNode, e.cloneNode = function(t) {
    var n = this, o = e.__cloneNode.call(n, !1);
    if (t) for (var r = 0, s = void 0, i = void 0, a = [ "s-id", "s-cr", "s-lr", "s-rc", "s-sc", "s-p", "s-cn", "s-sr", "s-sn", "s-hn", "s-ol", "s-nr", "s-si", "s-sf", "s-sfc", "s-hsf" ]; r < n.__childNodes.length; r++) s = n.__childNodes[r]["s-nr"], 
    i = a.every((function(e) {
      return !n.__childNodes[r][e];
    })), s && o.__appendChild(s.cloneNode(!0)), i && o.__appendChild(n.__childNodes[r].cloneNode(!0));
    return o;
  };
}, patchChildNodes = function(e, t) {
  if (globalThis.Node) {
    var n = /** @class */ function(e) {
      function FakeNodeList() {
        return null !== e && e.apply(this, arguments) || this;
      }
      return __extends(FakeNodeList, e), FakeNodeList.prototype.item = function(e) {
        return this[e];
      }, FakeNodeList;
    }(Array), o = Object.getOwnPropertyDescriptor(t || Node.prototype, "childNodes");
    o || (o = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Node.prototype), "childNodes")), 
    o && Object.defineProperty(e, "__childNodes", o);
    var r = Object.getOwnPropertyDescriptor(t || Element.prototype, "children");
    // MockNode won't have these
        r && Object.defineProperty(e, "__children", r);
    var s = Object.getOwnPropertyDescriptor(t || Element.prototype, "childElementCount");
    s && Object.defineProperty(e, "__childElementCount", s), Object.defineProperty(e, "children", {
      get: function() {
        return this.childNodes.map((function(e) {
          return 1 /* NODE_TYPE.ElementNode */ === e.nodeType ? e : null;
        })).filter((function(e) {
          return !!e;
        }));
      }
    }), Object.defineProperty(e, "firstChild", {
      get: function() {
        return this.childNodes[0];
      }
    }), Object.defineProperty(e, "lastChild", {
      get: function() {
        return this.childNodes[this.childNodes.length - 1];
      }
    }), Object.defineProperty(e, "childElementCount", {
      get: function() {
        return e.children.length;
      }
    }), o && Object.defineProperty(e, "childNodes", {
      get: function() {
        for (var e = this.__childNodes, t = new n, o = 0; o < e.length; o++) {
          var r = e[o]["s-nr"];
          !r || 8 /* NODE_TYPE.CommentNode */ === r.nodeType && 0 === r.nodeValue.indexOf(ORG_LOCATION_ID + ".") || t.push(r);
        }
        return t;
      }
    });
  }
}, patchInnerHTML = function(e, t) {
  if (globalThis.Element) {
    var n = Object.getOwnPropertyDescriptor(t || Element.prototype, "innerHTML");
    // on IE it's on HTMLElement.prototype
        n || (n = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML")), 
    // MockNode won't have these
    n && Object.defineProperty(e, "__innerHTML", n), Object.defineProperty(e, "innerHTML", {
      get: function() {
        var e = "";
        return this.childNodes.forEach((function(t) {
          return e += t.outerHTML || t.textContent;
        })), e;
      },
      set: function(e) {
        this.childNodes.forEach((function(e) {
          if (e["s-ol"]) try {
            e["s-ol"].remove();
          } catch (t) {}
          e.remove();
        })), this.insertAdjacentHTML("beforeend", e);
      }
    });
  }
}, patchInnerText = function(e, t) {
  if (globalThis.Element) {
    var n = Object.getOwnPropertyDescriptor(t || Element.prototype, "innerText");
    // on IE it's on HTMLElement.prototype
        n || (n = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerText")), 
    // MockNode won't have these
    n && Object.defineProperty(e, "__innerText", n), Object.defineProperty(e, "innerText", {
      get: function() {
        var e = "";
        return this.childNodes.forEach((function(t) {
          t.innerText ? e += t.innerText : t.textContent && (e += t.textContent.trimEnd());
        })), e;
      },
      set: function(e) {
        this.childNodes.forEach((function(e) {
          e["s-ol"] && e["s-ol"].remove(), e.remove();
        })), this.insertAdjacentHTML("beforeend", e);
      }
    });
  }
}, patchTextContent = function(e, t) {
  if (globalThis.Node) {
    var n = Object.getOwnPropertyDescriptor(t || Node.prototype, "textContent");
    // MockNode won't have these
        n && Object.defineProperty(e, "__textContent", n), Object.defineProperty(e, "textContent", {
      get: function() {
        var e = "";
        return this.childNodes.forEach((function(t) {
          return e += t.textContent || "";
        })), e;
      },
      set: function(e) {
        this.childNodes.forEach((function(e) {
          e["s-ol"] && e["s-ol"].remove(), e.remove();
        })), this.insertAdjacentHTML("beforeend", e);
      }
    });
  }
}, patchInsertBefore = function(e) {
  e.__insertBefore || (e.__insertBefore = e.insertBefore, e.insertBefore = function(e, t) {
    var n = this, o = e["s-sn"] = getSlotName(e), r = getHostSlotNode(this.__childNodes, o);
    if (r) {
      var s = !1;
      if (this.childNodes.forEach((function(i) {
        // we found the node in our list of other 'lightDOM' / slotted nodes
        if (i !== t && null !== t) ; else {
          if (s = !0, addSlotRelocateNode(e, r), null === t) return void n.__append(e);
          o === t["s-sn"] ? ((t.parentNode.__insertBefore || t.parentNode.insertBefore).call(t.parentNode, e, t), 
          patchRemove(e)) : 
          // current child is not in the same slot as 'slot before' node
          // so just toss the node in wherever
          n.__append(e);
        }
      })), s) return e;
    }
    return this.__insertBefore(e, t);
  });
}, patchAppendChild = function(e) {
  e.__appendChild || (e.__appendChild = e.appendChild, e.appendChild = function(e) {
    var t = e["s-sn"] = getSlotName(e), n = getHostSlotNode(this.__childNodes || this.childNodes, t);
    if (n) {
      addSlotRelocateNode(e, n);
      var o = getHostSlotChildNodes(n), r = o[o.length - 1];
      if (r.parentNode) {
        var s = r.parentNode;
        s.__insertBefore ? s.__insertBefore(e, r.nextSibling) : s.insertBefore(e, r.nextSibling), 
        patchRemove(e);
      }
      return n["s-hsf"] && updateFallbackSlotVisibility(n.parentNode), e;
    }
    return 1 /* NODE_TYPE.ElementNode */ === e.nodeType && e.getAttribute("slot") && this.__childNodes && (e.hidden = !0), 
    this.__appendChild(e);
  });
}, patchPrepend = function(e) {
  e.__prepend || (e.__prepend = e.prepend, e.prepend = function() {
    for (var e = this, t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
    t.forEach((function(t) {
      "string" == typeof t && (t = e.ownerDocument.createTextNode(t));
      var n = t["s-sn"] = getSlotName(t), o = getHostSlotNode(e.__childNodes, n);
      if (o) {
        addSlotRelocateNode(t, o);
        var r = getHostSlotChildNodes(o)[0];
        return r.parentNode && (r.parentNode.insertBefore(t, r.nextSibling), patchRemove(t)), 
        void (o["s-hsf"] && updateFallbackSlotVisibility(o.parentNode));
      }
      return 1 /* NODE_TYPE.ElementNode */ === t.nodeType && t.getAttribute("slot") && e.__childNodes && (t.hidden = !0), 
      e.__prepend(t);
    }));
  });
}, patchAppend = function(e) {
  e.__append || (e.__append = e.append, e.append = function() {
    for (var e = this, t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
    t.forEach((function(t) {
      "string" == typeof t && (t = e.ownerDocument.createTextNode(t)), e.appendChild(t);
    }));
  });
}, patchReplaceChildren = function(e) {
  e.__replaceChildren || (e.__replaceChildren = e.replaceChildren, e.replaceChildren = function() {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    var n = getHostSlotNode(this.__childNodes, "");
    if (n) {
      var o = getHostSlotChildNodes(n);
      o.forEach((function(e) {
        e["s-sr"] || e.remove();
      })), this.append.apply(this, e);
    }
  });
}, patchInsertAdjacentHTML = function(e) {
  e.__insertAdjacentHTML || (e.__insertAdjacentHTML = e.insertAdjacentHTML, e.insertAdjacentHTML = function(e, t) {
    if ("afterbegin" !== e && "beforeend" !== e) return this.__insertAdjacentHTML(e, t);
    var n, o = this.ownerDocument.createElement("_");
    if (o.innerHTML = t, "afterbegin" === e) for (;n = o.firstChild; ) this.prepend(n); else if ("beforeend" === e) for (;n = o.firstChild; ) this.append(n);
  });
}, patchInsertAdjacentText = function(e) {
  e.__insertAdjacentText || (e.__insertAdjacentText = e.insertAdjacentText, e.insertAdjacentText = function(e, t) {
    this.insertAdjacentHTML(e, t);
  });
}, patchInsertAdjacentElement = function(e) {
  e.__insertAdjacentElement || (e.__insertAdjacentElement = e.insertAdjacentElement, 
  e.insertAdjacentElement = function(e, t) {
    if ("afterbegin" !== e && "beforeend" !== e) return this.__insertAdjacentElement(e, t);
    "afterbegin" === e ? this.prepend(t) : "beforeend" === e && this.append(t);
  });
}, patchRemove = function(e) {
  e && !e.__remove && (e.__remove = e.remove || !0, patchRemoveChild(e.parentNode), 
  e.remove = function() {
    return this.parentNode ? this.parentNode.removeChild(this) : this.__remove();
  });
}, patchRemoveChild = function(e) {
  e && !e.__removeChild && (e.__removeChild = e.removeChild, e.removeChild = function(e) {
    if (e && void 0 !== e["s-sn"]) {
      var t = getHostSlotNode(this.__childNodes || this.childNodes, e["s-sn"]);
      return e.parentElement.__removeChild(e), void (t && t["s-hsf"] && updateFallbackSlotVisibility(t.parentElement));
    }
    return this.__removeChild(e);
  });
}, addSlotRelocateNode = function(e, t, n) {
  if (!e["s-ol"] || !e["s-ol"].isConnected) {
    var o = document.createTextNode("");
    if (o["s-nr"] = e, t["s-cr"] && t["s-cr"].parentNode) {
      var r = t["s-cr"].parentNode, s = r.__appendChild || r.appendChild;
      if (void 0 !== n) {
        o["s-oo"] = n;
        var i = r.__childNodes || r.childNodes, a = [ o ];
        i.forEach((function(e) {
          e["s-nr"] && a.push(e);
        })), a.sort((function(e, t) {
          return !e["s-oo"] || e["s-oo"] < t["s-oo"] ? -1 : !t["s-oo"] || t["s-oo"] < e["s-oo"] ? 1 : 0;
        })), a.forEach((function(e) {
          return s.call(t["s-cr"].parentNode, e);
        }));
      } else s.call(t["s-cr"].parentNode, o);
    }
    e["s-ol"] = o;
  }
}, getSlotName = function(e) {
  return e["s-sn"] || 1 /* NODE_TYPE.ElementNode */ === e.nodeType && e.getAttribute("slot") || e.slot || "";
}, getHostSlotNode = function(e, t) {
  var n, o = 0;
  if (!e) return null;
  for (;o < e.length; o++) {
    if ((n = e[o])["s-sr"] && n["s-sn"] === t) return n;
    if (n = getHostSlotNode(n.childNodes, t)) return n;
  }
  return null;
}, getHostSlotChildNodes = function(e) {
  for (var t = [ e ], n = e["s-sn"] || ""; (e = e.nextSibling) && e["s-sn"] === n; ) t.push(e);
  return t;
}, computeMode = function(e) {
  return modeResolutionChain.map((function(t) {
    return t(e);
  })).find((function(e) {
    return !!e;
  }));
}, setMode = function(e) {
  return modeResolutionChain.push(e);
}, getMode = function(e) {
  return getHostRef(e).$modeName$;
}, parsePropertyValue = function(e, t) {
  // ensure this value is of the correct prop type
  return null == e || isComplexType(e) ? e : 4 /* MEMBER_FLAGS.Boolean */ & t ? "false" !== e && ("" === e || !!e) : 2 /* MEMBER_FLAGS.Number */ & t ? parseFloat(e) : 1 /* MEMBER_FLAGS.String */ & t ? String(e) : e;
  // not sure exactly what type we want
  // so no need to change to a different type
}, getElement = function(e) {
  return getHostRef(e).$hostElement$;
}, createEvent = function(e, t, n) {
  var o = getElement(e);
  return {
    emit: function(e) {
      return emitEvent(o, t, {
        bubbles: !!(4 /* EVENT_FLAGS.Bubbles */ & n),
        composed: !!(2 /* EVENT_FLAGS.Composed */ & n),
        cancelable: !!(1 /* EVENT_FLAGS.Cancellable */ & n),
        detail: e
      });
    }
  };
}, emitEvent = function(e, t, n) {
  var o = plt.ce(t, n);
  return e.dispatchEvent(o), o;
}, rootAppliedStyles =  new WeakMap, registerStyle = function(e, t, n) {
  var o = styles.get(e);
  supportsConstructableStylesheets && n ? "string" == typeof (o = o || new CSSStyleSheet) ? o = t : o.replaceSync(t) : o = t, 
  styles.set(e, o);
}, addStyle = function(e, t, n, o) {
  var r, s = getScopeId(t, n), i = styles.get(s);
  if (
  // if an element is NOT connected then getRootNode() will return the wrong root node
  // so the fallback is to always use the document for the root node in those cases
  e = 11 /* NODE_TYPE.DocumentFragment */ === e.nodeType ? e : doc, i) if ("string" == typeof i) {
    e = e.head || e;
    var a = rootAppliedStyles.get(e), l = void 0;
    if (a || rootAppliedStyles.set(e, a = new Set), !a.has(s)) {
      if (plt.$cssShim$) {
        var c = (l = plt.$cssShim$.createHostStyle(o, s, i, !!(10 /* CMP_FLAGS.needsScopedEncapsulation */ & t.$flags$)))["s-sc"];
        c && (s = c, 
        // we don't want to add this styleID to the appliedStyles Set
        // since the cssVarShim might need to apply several different
        // stylesheets for the same component
        a = null);
      } else (l = doc.createElement("style")).innerHTML = i;
      // Apply CSP nonce to the style tag if it exists
            var d = null !== (r = plt.$nonce$) && void 0 !== r ? r : queryNonceMetaTagContent(doc);
      null != d && l.setAttribute("nonce", d), e.insertBefore(l, e.querySelector("link")), 
      a && a.add(s);
    }
  } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = __spreadArray(__spreadArray([], e.adoptedStyleSheets, !0), [ i ], !1));
  return s;
}, attachStyles = function(e) {
  var t = e.$cmpMeta$, n = e.$hostElement$, o = t.$flags$, r = createTime("attachStyles", t.$tagName$), s = addStyle(supportsShadow && n.shadowRoot ? n.shadowRoot : n.getRootNode(), t, e.$modeName$, n);
  10 /* CMP_FLAGS.needsScopedEncapsulation */ & o && (
  // only required when we're NOT using native shadow dom (slot)
  // or this browser doesn't support native shadow dom
  // and this host element was NOT created with SSR
  // let's pick out the inner content for slot projection
  // create a node to represent where the original
  // content was first placed, which is useful later on
  // DOM WRITE!!
  n["s-sc"] = s, n.classList.add(s + "-h"), 2 /* CMP_FLAGS.scopedCssEncapsulation */ & o && n.classList.add(s + "-s")), 
  r();
}, getScopeId = function(e, t) {
  return "sc-" + (t && 32 /* CMP_FLAGS.hasMode */ & e.$flags$ ? e.$tagName$ + "-" + t : e.$tagName$);
}, setAccessor = function(e, t, n, o, r, s) {
  if (n !== o) {
    var i = isMemberInElement(e, t), a = t.toLowerCase();
    if ("class" === t) {
      var l = e.classList, c = parseClassList(n), d = parseClassList(o);
      // for `scoped: true` components, new nodes after initial hydration
      // from SSR don't have the slotted class added. Let's add that now
      e["s-si"] && d.indexOf(e["s-si"]) < 0 && d.push(e["s-si"]), l.remove.apply(l, c.filter((function(e) {
        return e && !d.includes(e);
      }))), l.add.apply(l, d.filter((function(e) {
        return e && !c.includes(e);
      })));
    } else if ("style" === t) {
      for (var u in n) o && null != o[u] || (u.includes("-") ? e.style.removeProperty(u) : e.style[u] = "");
      for (var u in o) n && o[u] === n[u] || (u.includes("-") ? e.style.setProperty(u, o[u]) : e.style[u] = o[u]);
    } else if ("key" === t) ; else if ("ref" === t) 
    // minifier will clean this up
    o && o(e); else if (i || "o" !== t[0] || "n" !== t[1]) {
      // Set property if it exists and it's not a SVG
      var f = isComplexType(o);
      if ((i || f && null !== o) && !r) try {
        if (e.tagName.includes("-")) e[t] = o; else {
          var p = null == o ? "" : o;
          // Workaround for Safari, moving the <input> caret when re-assigning the same valued
                    "list" === t ? i = !1 : null != n && e[t] == p || (e[t] = p);
        }
      } catch (m) {}
      /**
       * Need to manually update attribute if:
       * - memberName is not an attribute
       * - if we are rendering the host element in order to reflect attribute
       * - if it's a SVG, since properties might not work in <svg>
       * - if the newValue is null/undefined or 'false'.
       */      var $ = !1;
      a !== (a = a.replace(/^xlink\:?/, "")) && (t = a, $ = !0), null == o || !1 === o ? !1 === o && "" !== e.getAttribute(t) || ($ ? e.removeAttributeNS(XLINK_NS, t) : e.removeAttribute(t)) : (!i || 4 /* VNODE_FLAGS.isHost */ & s || r) && !f && (o = !0 === o ? "" : o, 
      $ ? e.setAttributeNS(XLINK_NS, t, o) : e.setAttribute(t, o));
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
    t = "-" === t[2] ? t.slice(3) : isMemberInElement(win, a) ? a.slice(2) : a[2] + t.slice(3), 
    n && plt.rel(e, t, n, !1), o && plt.ael(e, t, o, !1);
  }
}, parseClassListRegex = /\s/, parseClassList = function(e) {
  return e ? e.split(parseClassListRegex) : [];
}, updateElement = function(e, t, n, o) {
  // if the element passed in is a shadow root, which is a document fragment
  // then we want to be adding attrs/props to the shadow root's "host" element
  // if it's not a shadow root, then we add attrs/props to the same element
  var r = 11 /* NODE_TYPE.DocumentFragment */ === t.$elm$.nodeType && t.$elm$.host ? t.$elm$.host : t.$elm$, s = e && e.$attrs$ || EMPTY_OBJ, i = t.$attrs$ || EMPTY_OBJ;
  // remove attributes no longer present on the vnode by setting them to undefined
  for (o in s) o in i || setAccessor(r, o, s[o], void 0, n, t.$flags$);
  // add new & update changed attributes
  for (o in i) setAccessor(r, o, s[o], i[o], n, t.$flags$);
}, createElm = function(e, t, n, o) {
  // tslint:disable-next-line: prefer-const
  var r, s, i, a = t.$children$[n], l = 0;
  if (useNativeShadowDom || (
  // remember for later we need to check to relocate nodes
  checkSlotRelocate = !0, "slot" === a.$tag$ && (scopeId && 
  // scoped css needs to add its scoped id to the parent element
  o.classList.add(scopeId + "-s"), a.$flags$ |= a.$children$ ? // slot element has fallback content
  2 /* VNODE_FLAGS.isSlotFallback */ : // slot element does not have fallback content
  1 /* VNODE_FLAGS.isSlotReference */)), null !== a.$text$) 
  // create text node
  r = a.$elm$ = doc.createTextNode(a.$text$); else if (3 /* VNODE_FLAGS.isSlotFallback */ & a.$flags$) 
  // create a slot reference node
  r = a.$elm$ = slotReferenceDebugNode(a); else {
    if (isSvgMode || (isSvgMode = "svg" === a.$tag$), 
    // create element
    r = a.$elm$ = doc.createElementNS(isSvgMode ? SVG_NS : HTML_NS, a.$tag$), isSvgMode && "foreignObject" === a.$tag$ && (isSvgMode = !1), 
    updateElement(null, a, isSvgMode), isDef(scopeId) && r["s-si"] !== scopeId && 
    // if there is a scopeId and this is the initial render
    // then let's add the scopeId as a css class
    r.classList.add(r["s-si"] = scopeId), a.$children$) for (l = 0; l < a.$children$.length; ++l) 
    // create the node
    // return node could have been null
    (s = createElm(e, a, l, r)) && (
    // append our new node
    r.__appendChild ? r.__appendChild(s) : r.appendChild(s));
    "svg" === a.$tag$ ? 
    // Only reset the SVG context when we're exiting <svg> element
    isSvgMode = !1 : "foreignObject" === r.tagName && (
    // Reenter SVG context when we're exiting <foreignObject> element
    isSvgMode = !0);
  }
  if (r["s-hn"] = hostTagName, 3 /* VNODE_FLAGS.isSlotReference */ & a.$flags$) {
    if (
    // this is a slot reference node
    r["s-sr"] = !0, 
    // remember the content reference comment
    r["s-cr"] = contentRef, 
    // remember the slot name, or empty string for default slot
    r["s-sn"] = a.$name$ || "", 
    // if this slot is nested within another parent slot, add that slot's name.
    // (used in 'renderSlotFallbackContent')
    t.$name$ && (r["s-psn"] = t.$name$), 2 /* VNODE_FLAGS.isSlotFallback */ & a.$flags$) {
      if (a.$children$) 
      // this slot has fallback nodes
      for (l = 0; l < a.$children$.length; ++l) {
        for (
        // create the node
        var c = 1 /* NODE_TYPE.ElementNode */ === r.nodeType ? r : o; 1 /* NODE_TYPE.ElementNode */ !== c.nodeType; ) c = c.parentNode;
        // add new node meta.
        // slot has fallback and childnode is slot fallback
        (s = createElm(e, a, l, c))["s-sf"] = r["s-hsf"] = !0, void 0 === s["s-sn"] && (s["s-sn"] = a.$name$ || ""), 
        3 /* NODE_TYPE.TextNode */ === s.nodeType && (s["s-sfc"] = s.textContent), 
        // make sure a node was created
        // and we don't have a node already present
        // (if a node is already attached, we'll just patch it)
        !s || e && e.$children$ || 
        // append our new node
        c.appendChild(s);
      }
      e && e.$children$ && patch(e, a);
    }
    // check if we've got an old vnode for this slot
        (i = e && e.$children$ && e.$children$[n]) && i.$tag$ === a.$tag$ && e.$elm$ && 
    // we've got an old slot vnode and the wrapper is being replaced
    // so let's move the old slot content back to it's original location
    putBackInOriginalLocation(e.$elm$, !1);
  }
  return r;
}, putBackInOriginalLocation = function(e, t) {
  plt.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
  for (var n = e.__childNodes || e.childNodes, o = n.length - 1; o >= 0; o--) {
    var r = n[o];
    r["s-hn"] !== hostTagName && r["s-ol"] && (
    // // this child node in the old element is from another component
    // // remove this node from the old slot's parent
    // childNode.remove();
    // and relocate it back to it's original location
    parentReferenceNode(r).insertBefore(r, referenceNode(r)), 
    // remove the old original location comment entirely
    // later on the patch function will know what to do
    // and move this to the correct spot in need be
    r["s-ol"].remove(), r["s-ol"] = void 0, checkSlotRelocate = !0), t && putBackInOriginalLocation(r, t);
  }
  plt.$flags$ &= -2 /* PLATFORM_FLAGS.isTmpDisconnected */;
}, addVnodes = function(e, t, n, o, r, s) {
  var i, a = e["s-cr"] && e["s-cr"].parentNode || e;
  for (a.shadowRoot && a.tagName === hostTagName && (a = a.shadowRoot); r <= s; ++r) o[r] && (i = createElm(null, n, r, e)) && (o[r].$elm$ = i, 
  a.insertBefore(i, referenceNode(t)));
}, saveSlottedNodes = function(e) {
  // by removing the hostname reference
  // any current slotted elements will be 'reset' and re-slotted
  var t, n, o, r = e.__childNodes || e.childNodes;
  for (n = 0, o = r.length; n < o; n++) (t = r[n])["s-ol"] ? t["s-hn"] && (t["s-hn"] = void 0) : saveSlottedNodes(t);
}, removeVnodes = function(e, t, n, o, r) {
  for (;t <= n; ++t) (o = e[t]) && (r = o.$elm$, callNodeRefs(o), 
  // we're removing this element
  // so it's possible we need to show slot fallback content now
  checkSlotFallbackVisibility = !0, saveSlottedNodes(r), r["s-ol"] ? 
  // remove the original location comment
  r["s-ol"].remove() : 
  // it's possible that child nodes of the node
  // that's being removed are slot nodes
  putBackInOriginalLocation(r, !0), 
  // remove the vnode's element from the dom
  r.remove());
}, updateChildren = function(e, t, n, o) {
  for (var r, s, i, a, l, c, d, u, f, p = [], $ = {}, m = 0, g = 0, v = 0, y = 0, N = 0, _ = t.length - 1, b = t[0], S = t[_], C = o.length - 1, T = o[0], E = o[C]; m <= _ && g <= C; ) if (null == b) 
  // VNode might have been moved left
  b = t[++m]; else if (null == S) S = t[--_]; else if (null == T) T = o[++g]; else if (null == E) E = o[--C]; else if (isSameVnode(b, T)) 
  // if the start nodes are the same then we should patch the new VNode
  // onto the old one, and increment our `newStartIdx` and `oldStartIdx`
  // indices to reflect that. We don't need to move any DOM Nodes around
  // since things are matched up in order.
  patch(b, T), b = t[++m], T = o[++g]; else if (isSameVnode(S, E)) 
  // likewise, if the end nodes are the same we patch new onto old and
  // decrement our end indices, and also likewise in this case we don't
  // need to move any DOM Nodes.
  patch(S, E), S = t[--_], E = o[--C]; else if (isSameVnode(b, E)) 
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
  "slot" !== b.$tag$ && "slot" !== E.$tag$ || putBackInOriginalLocation(b.$elm$.parentNode, !1), 
  patch(b, E), 
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
  e.insertBefore(b.$elm$, S.$elm$.nextSibling), b = t[++m], E = o[--C]; else if (isSameVnode(S, T)) 
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
  "slot" !== b.$tag$ && "slot" !== E.$tag$ || putBackInOriginalLocation(S.$elm$.parentNode, !1), 
  patch(S, T), 
  // We've already checked above if `oldStartVnode` and `newStartVnode` are
  // the same node, so since we're here we know that they are not. Thus we
  // can move the element for `oldEndVnode` _before_ the element for
  // `oldStartVnode`, leaving `oldStartVnode` to be reconciled in the
  // future.
  e.insertBefore(S.$elm$, b.$elm$), S = t[--_], T = o[++g]; else {
    for (
    // Here we do some checks to match up old and new nodes based on the
    // `$key$` attribute, which is set by putting a `key="my-key"` attribute
    // in the JSX for a DOM element in the implementation of a Stencil
    // component.
    // First we check to see if there are any nodes in the array of old
    // children which have the same key as the first node in the new
    // children.
    v = -1, y = m; y <= _; ++y) if (t[y] && null !== t[y].$key$ && t[y].$key$ === T.$key$) {
      v = y;
      break;
    }
    v >= 0 ? (
    // We found a node in the old children which matches up with the first
    // node in the new children! So let's deal with that
    (s = t[v]).$tag$ !== T.$tag$ ? 
    // the tag doesn't match so we'll need a new DOM element
    r = createElm(t && t[g], n, v, e) : (patch(s, T), 
    // invalidate the matching old node so that we won't try to update it
    // again later on
    t[v] = void 0, r = s.$elm$), T = o[++g]) : (
    // We either didn't find an element in the old children that matches
    // the key of the first new child OR the build is not using `key`
    // attributes at all. In either case we need to create a new element
    // for the new node.
    r = createElm(t && t[g], n, g, e), T = o[++g]), r && parentReferenceNode(b.$elm$).insertBefore(r, referenceNode(b.$elm$));
  }
  // reorder fallback slot nodes
  if (m > _ ? 
  // we have some more new nodes to add which don't match up with old nodes
  addVnodes(e, null == o[C + 1] ? null : o[C + 1].$elm$, n, o, g, C) : g > C && 
  // there are nodes in the `oldCh` array which no longer correspond to nodes
  // in the new array, so lets remove them (which entails cleaning up the
  // relevant DOM nodes)
  removeVnodes(t, m, _), e.parentNode && n.$elm$["s-hsf"]) {
    for (a = (i = e.parentNode.__childNodes || e.parentNode.childNodes).length - 1, 
    y = 0; y <= a; ++y) (d = i[y])["s-hsf"] ? p.push(d) : d["s-sf"] && ($[d["s-sn"]] || ($[d["s-sn"]] = []), 
    $[d["s-sn"]].push(d));
    for (l = p.length - 1, y = 0; y <= l; ++y) if (void 0 !== $[(u = p[y])["s-sn"]]) for (c = $[u["s-sn"]].length - 1, 
    N = 0; N <= c; ++N) f = $[u["s-sn"]][N], u.parentNode.insertBefore(f, u);
    checkSlotFallbackVisibility = !0;
  }
}, isSameVnode = function(e, t) {
  // compare if two vnode to see if they're "technically" the same
  // need to have the same element tag, and same key to be the same
  return e.$tag$ === t.$tag$ && ("slot" === e.$tag$ ? e.$name$ === t.$name$ : e.$key$ === t.$key$);
}, referenceNode = function(e) {
  // this node was relocated to a new location in the dom
  // because of some other component's slot
  // but we still have an html comment in place of where
  // it's original location was according to it's original vdom
  return e && e["s-ol"] || e;
}, parentReferenceNode = function(e) {
  return (e["s-ol"] ? e["s-ol"] : e).parentNode;
}, patch = function(e, t) {
  var n, o = t.$elm$ = e.$elm$, r = e.$children$, s = t.$children$, i = t.$tag$, a = t.$text$;
  null === a ? (
  // test if we're rendering an svg element, or still rendering nodes inside of one
  // only add this to the when the compiler sees we're using an svg somewhere
  isSvgMode = "svg" === i || "foreignObject" !== i && isSvgMode, "slot" === i || 
  // either this is the first render of an element OR it's an update
  // AND we already know it's possible it could have changed
  // this updates the element's css classes, attrs, props, listeners, etc.
  updateElement(e, t, isSvgMode), null !== r && null !== s ? 
  // looks like there's child vnodes for both the old and new vnodes
  // so we need to call `updateChildren` to reconcile them
  updateChildren(o, r, t, s) : null !== s ? (
  // no old child vnodes, but there are new child vnodes to add
  null !== e.$text$ && (
  // the old vnode was text, so be sure to clear it out
  o.textContent = ""), 
  // add the new vnode children
  addVnodes(o, null, t, s, 0, s.length - 1)) : null !== r && 
  // no new child vnodes, but there are old child vnodes to remove
  removeVnodes(r, 0, r.length - 1), isSvgMode && "svg" === i && (isSvgMode = !1)) : (n = o["s-cr"]) ? 
  // this element has slotted content
  n.parentNode.textContent = a : e.$text$ !== a && (
  // update the text content for the text only vnode
  // and also only if the text is different than before
  o.textContent = a, o["s-sf"] && (o["s-sfc"] = a));
}, relocateNodes = [], relocateSlotContent = function(e) {
  for (
  // tslint:disable-next-line: prefer-const
  var t, n, o, r, s, i, a = 0, l = e.__childNodes || e.childNodes, c = l.length; a < c; a++) {
    if ((t = l[a])["s-sr"] && (n = t["s-cr"]) && n.parentNode) for (t["s-hsf"] && (checkSlotFallbackVisibility = !0), 
    // first got the content reference comment node
    // then we got it's parent, which is where all the host content is in now
    o = n.parentNode.__childNodes || n.parentNode.childNodes, r = t["s-sn"], i = o.length - 1; i >= 0; i--) (n = o[i])["s-cn"] || n["s-nr"] || n["s-hn"] === t["s-hn"] || (
    // let's do some relocating to its new home
    // but never relocate a content reference node
    // that is suppose to always represent the original content location
    isNodeLocatedInSlot(n, r) ? (
    // it's possible we've already decided to relocate this node
    s = relocateNodes.find((function(e) {
      return e.$nodeToRelocate$ === n;
    })), 
    // made some changes to slots
    // let's make sure we also double check
    // fallbacks are correctly hidden or shown
    checkSlotFallbackVisibility = !0, n["s-sn"] = n["s-sn"] || r, s ? 
    // previously we never found a slot home for this node
    // but turns out we did, so let's remember it now
    s.$slotRefNode$ = t : 
    // add to our list of nodes to relocate
    relocateNodes.push({
      $slotRefNode$: t,
      $nodeToRelocate$: n
    }), n["s-sr"] && relocateNodes.map((function(e) {
      isNodeLocatedInSlot(e.$nodeToRelocate$, n["s-sn"]) && (s = relocateNodes.find((function(e) {
        return e.$nodeToRelocate$ === n;
      }))) && !e.$slotRefNode$ && (e.$slotRefNode$ = s.$slotRefNode$);
    }))) : relocateNodes.some((function(e) {
      return e.$nodeToRelocate$ === n;
    })) || 
    // so far this element does not have a slot home, not setting slotRefNode on purpose
    // if we never find a home for this element then we'll need to hide it
    relocateNodes.push({
      $nodeToRelocate$: n
    }));
    1 /* NODE_TYPE.ElementNode */ === t.nodeType && relocateSlotContent(t);
  }
}, isNodeLocatedInSlot = function(e, t) {
  return 1 /* NODE_TYPE.ElementNode */ === e.nodeType ? null === e.getAttribute("slot") && "" === t || e.getAttribute("slot") === t : e["s-sn"] === t || "" === t;
}, callNodeRefs = function(e) {
  e.$attrs$ && e.$attrs$.ref && e.$attrs$.ref(null), e.$children$ && e.$children$.map(callNodeRefs);
}, renderVdom = function(e, t) {
  var n = e.$hostElement$, o = e.$cmpMeta$, r = e.$vnode$ || newVNode(null, null), s = isHost(t) ? t : h(null, null, t);
  if (hostTagName = n.tagName, o.$attrsToReflect$ && (s.$attrs$ = s.$attrs$ || {}, 
  o.$attrsToReflect$.map((function(e) {
    var t = e[0], o = e[1];
    return s.$attrs$[o] = n[t];
  }))), s.$tag$ = null, s.$flags$ |= 4 /* VNODE_FLAGS.isHost */ , e.$vnode$ = s, s.$elm$ = r.$elm$ = n.shadowRoot || n, 
  scopeId = n["s-sc"], contentRef = n["s-cr"], useNativeShadowDom = supportsShadow && 0 != (1 /* CMP_FLAGS.shadowDomEncapsulation */ & o.$flags$), 
  // always reset
  checkSlotFallbackVisibility = !1, 
  // synchronous patch
  patch(r, s), 
  // while we're moving nodes around existing nodes, temporarily disable
  // the disconnectCallback from working
  plt.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */ , checkSlotRelocate) {
    relocateSlotContent(s.$elm$);
    for (var i = void 0, a = void 0, l = void 0, c = void 0, d = void 0, u = void 0, f = void 0, p = 0; p < relocateNodes.length; p++) (a = (i = relocateNodes[p]).$nodeToRelocate$)["s-ol"] || (
    // add a reference node marking this node's original location
    // keep a reference to this node for later lookups
    (l = originalLocationDebugNode(a))["s-nr"] = a, a.parentNode.insertBefore(a["s-ol"] = l, a));
    for (p = 0; p < relocateNodes.length; p++) if (a = (i = relocateNodes[p]).$nodeToRelocate$, 
    i.$slotRefNode$) {
      for (
      // by default we're just going to insert it directly
      // after the slot reference node
      c = i.$slotRefNode$.parentNode, d = i.$slotRefNode$.__nextSibling || i.$slotRefNode$.nextSibling, 
      l = a["s-ol"], f = d; l = l.__previousSibling || l.previousSibling; ) if ((u = l["s-nr"]) && u["s-sn"] === a["s-sn"] && c === u.parentNode && (!(u = u.__nextSibling || u.nextSibling) || !u["s-nr"])) {
        d = u;
        break;
      }
      (!d && c !== a.parentNode || (a.__nextSibling || a.nextSibling) !== d) && (
      // we've checked that it's worth while to relocate
      // since that the node to relocate
      // has a different next sibling or parent relocated
      a !== d ? (!a["s-hn"] && a["s-ol"] && (
      // probably a component in the index.html that doesn't have it's hostname set
      a["s-hn"] = a["s-ol"].parentNode.nodeName), 
      // add it back to the dom but in its new home
      c.insertBefore(a, d), 
      // the node may have been hidden from when it didn't have a home. Re-show.
      a.hidden = !1) : c.insertBefore(a, f));
    } else 
    // this node doesn't have a slot home to go to, so let's hide it
    1 /* NODE_TYPE.ElementNode */ === a.nodeType && (a.hidden = !0);
  }
  checkSlotFallbackVisibility && updateFallbackSlotVisibility(s.$elm$), 
  // done moving nodes around
  // allow the disconnect callback to work again
  plt.$flags$ &= -2 /* PLATFORM_FLAGS.isTmpDisconnected */ , 
  // always reset
  relocateNodes.length = 0, 
  // Clear the content ref so we don't create a memory leak
  contentRef = void 0;
}, slotReferenceDebugNode = function(e) {
  return doc.createComment("<slot".concat(e.$name$ ? ' name="' + e.$name$ + '"' : "", "> (host=").concat(hostTagName.toLowerCase(), ")"));
}, originalLocationDebugNode = function(e) {
  return doc.createComment("org-location for " + (e.localName ? "<".concat(e.localName, "> (host=").concat(e["s-hn"], ")") : "[".concat(e.textContent, "]")));
}, attachToAncestor = function(e, t) {
  t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((function(t) {
    return e.$onRenderResolve$ = t;
  })));
}, scheduleUpdate = function(e, t) {
  if (e.$flags$ |= 16 /* HOST_FLAGS.isQueuedForUpdate */ , !(4 /* HOST_FLAGS.isWaitingForChildren */ & e.$flags$)) {
    attachToAncestor(e, e.$ancestorComponent$);
    return writeTask((function() {
      return dispatchHooks(e, t);
    }));
  }
  e.$flags$ |= 512 /* HOST_FLAGS.needsRerender */;
}, dispatchHooks = function(e, t) {
  var n, o = e.$hostElement$, r = createTime("scheduleUpdate", e.$cmpMeta$.$tagName$), s = e.$lazyInstance$;
  return t ? (e.$flags$ |= 256 /* HOST_FLAGS.isListenReady */ , e.$queuedListeners$ && (e.$queuedListeners$.map((function(e) {
    var t = e[0], n = e[1];
    return safeCall(s, t, n, o);
  })), e.$queuedListeners$ = null), emitLifecycleEvent(o, "componentWillLoad"), n = safeCall(s, "componentWillLoad", void 0, o)) : (emitLifecycleEvent(o, "componentWillUpdate"), 
  n = safeCall(s, "componentWillUpdate", void 0, o)), emitLifecycleEvent(o, "componentWillRender"), 
  r(), then(n, (function() {
    return updateComponent(e, s, t);
  }));
}, updateComponent = function(e, t, n) {
  return __awaiter(void 0, void 0, void 0, (function() {
    var o, r, s, i, a, l;
    return __generator(this, (function(c) {
      return o = e.$hostElement$, r = createTime("update", e.$cmpMeta$.$tagName$), s = o["s-rc"], 
      n && 
      // DOM WRITE!
      attachStyles(e), i = createTime("render", e.$cmpMeta$.$tagName$), callRender(e, t), 
      plt.$cssShim$ && plt.$cssShim$.updateHost(o), s && (
      // ok, so turns out there are some child host elements
      // waiting on this parent element to load
      // let's fire off all update callbacks waiting
      s.map((function(e) {
        return e();
      })), o["s-rc"] = void 0), i(), r(), a = o["s-p"], l = function() {
        return postUpdateComponent(e);
      }, 0 === a.length ? l() : (Promise.all(a).then(l), e.$flags$ |= 4 /* HOST_FLAGS.isWaitingForChildren */ , 
      a.length = 0), [ 2 /*return*/ ];
    }));
  }));
}, callRender = function(e, t, n) {
  try {
    t = t.render && t.render(), e.$flags$ &= -17 /* HOST_FLAGS.isQueuedForUpdate */ , 
    e.$flags$ |= 2 /* HOST_FLAGS.hasRendered */ , renderVdom(e, t);
  } catch (o) {
    consoleError(o, e.$hostElement$);
  }
  return null;
}, postUpdateComponent = function(e) {
  var t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, o = createTime("postUpdate", t), r = e.$lazyInstance$, s = e.$ancestorComponent$;
  emitLifecycleEvent(n, "componentDidRender"), 64 /* HOST_FLAGS.hasLoadedComponent */ & e.$flags$ ? (safeCall(r, "componentDidUpdate", void 0, n), 
  emitLifecycleEvent(n, "componentDidUpdate"), o()) : (e.$flags$ |= 64 /* HOST_FLAGS.hasLoadedComponent */ , 
  // DOM WRITE!
  addHydratedFlag(n), safeCall(r, "componentDidLoad", void 0, n), emitLifecycleEvent(n, "componentDidLoad"), 
  o(), e.$onReadyResolve$(n), s || appDidLoad()), e.$onInstanceResolve$(n), e.$onRenderResolve$ && (e.$onRenderResolve$(), 
  e.$onRenderResolve$ = void 0), 512 /* HOST_FLAGS.needsRerender */ & e.$flags$ && nextTick((function() {
    return scheduleUpdate(e, !1);
  })), e.$flags$ &= -517 /* HOST_FLAGS.needsRerender */;
}, appDidLoad = function(e) {
  addHydratedFlag(doc.documentElement), nextTick((function() {
    return emitEvent(win, "appload", {
      detail: {
        namespace: NAMESPACE
      }
    });
  }));
}, safeCall = function(e, t, n, o) {
  if (e && e[t]) try {
    return e[t](n);
  } catch (r) {
    consoleError(r, o);
  }
}, then = function(e, t) {
  return e && e.then ? e.then(t) : t();
}, emitLifecycleEvent = function(e, t) {
  emitEvent(e, "stencil_" + t, {
    bubbles: !0,
    composed: !0,
    detail: {
      namespace: NAMESPACE
    }
  });
}, addHydratedFlag = function(e) {
  return e.classList.add("hydrated");
}, getValue = function(e, t) {
  return getHostRef(e).$instanceValues$.get(t);
}, setValue = function(e, t, n, o, r) {
  void 0 === r && (r = !0);
  // check our new property value against our internal value
    var s = getHostRef(e), i = s.$instanceValues$.get(t), a = s.$flags$, l = s.$lazyInstance$;
  n = parsePropertyValue(n, o.$members$[t][0]);
  // explicitly check for NaN on both sides, as `NaN === NaN` is always false
  var c = Number.isNaN(i) && Number.isNaN(n);
  8 /* HOST_FLAGS.isConstructingInstance */ & a && void 0 !== i || !(n !== i && !c) || (
  // gadzooks! the property's value has changed!!
  // set our new value!
  s.$instanceValues$.set(t, n), l && 2 /* HOST_FLAGS.hasRendered */ == (18 /* HOST_FLAGS.isQueuedForUpdate */ & a) && 
  // looks like this value actually changed, so we've got work to do!
  // but only if we've already rendered, otherwise just chill out
  // queue that we need to do an update, but don't worry about queuing
  // up millions cuz this function ensures it only runs once
  scheduleUpdate(s, !1));
}, proxyComponent = function(e, t, n) {
  if (t.$members$) {
    // It's better to have a const than two Object.entries()
    var o = Object.entries(t.$members$), r = e.prototype;
    if (o.map((function(e) {
      var o = e[0], s = e[1][0];
      if (31 /* MEMBER_FLAGS.Prop */ & s || 2 /* PROXY_FLAGS.proxyState */ & n && 32 /* MEMBER_FLAGS.State */ & s) {
        if (0 == (2048 /* MEMBER_FLAGS.Getter */ & s) ? 
        // proxyComponent - prop
        Object.defineProperty(r, o, {
          get: function() {
            // proxyComponent, get value
            return getValue(this, o);
          },
          set: function(e) {
            // proxyComponent, set value
            setValue(this, o, e, t);
          },
          configurable: !0,
          enumerable: !0
        }) : 1 /* PROXY_FLAGS.isElementConstructor */ & n && 2048 /* MEMBER_FLAGS.Getter */ & s && 
        // lazy maps the element get / set to the class get / set
        // proxyComponent - lazy prop getter
        Object.defineProperty(r, o, {
          get: function() {
            var e = getHostRef(this), t = e ? e.$lazyInstance$ : r;
            if (t) return t[o];
          },
          configurable: !0,
          enumerable: !0
        }), 4096 /* MEMBER_FLAGS.Setter */ & s) {
          // proxyComponent - lazy and non-lazy. Catches original set to fire updates (for @Watch)
          var i = Object.getOwnPropertyDescriptor(r, o).set;
          Object.defineProperty(r, o, {
            set: function(e) {
              var n = this, r = getHostRef(this);
              // non-lazy setter - amends original set to fire update
              if (i) return i.apply(this, [ e ]), void setValue(this, o, r.$hostElement$[o], t);
              if (r) {
                // lazy setter maps the element set to the class set
                var setVal = function(s) {
                  void 0 === s && (s = !1), r.$lazyInstance$[o] = e, setValue(n, o, r.$lazyInstance$[o], t, !s);
                };
                // If there's a value from an attribute, (before the class is defined), queue & set async
                                r.$lazyInstance$ ? setVal() : r.$onInstancePromise$.then((function() {
                  return setVal(!0);
                }));
              }
            }
          });
        }
      } else 1 /* PROXY_FLAGS.isElementConstructor */ & n && 64 /* MEMBER_FLAGS.Method */ & s && 
      // proxyComponent - method
      Object.defineProperty(r, o, {
        value: function() {
          for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
          var n = getHostRef(this);
          return n.$onInstancePromise$.then((function() {
            var t;
            return (t = n.$lazyInstance$)[o].apply(t, e);
          }));
        }
      });
    })), 1 /* PROXY_FLAGS.isElementConstructor */ & n) {
      var s = new Map;
      r.attributeChangedCallback = function(e, t, n) {
        var o = this;
        plt.jmp((function() {
          var t = s.get(e);
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
                    if (o.hasOwnProperty(t)) n = o[t], delete o[t]; else if (r.hasOwnProperty(t) && "number" == typeof o[t] && o[t] == n) 
          // if the propName exists on the prototype of `Cstr`, this update may be a result of Stencil using native
          // APIs to reflect props as attributes. Calls to `setAttribute(someElement, propName)` will result in
          // `propName` to be converted to a `DOMString`, which may not be what we want for other primitive props.
          return;
          var i = Object.getOwnPropertyDescriptor(r, t);
          // test whether this property either has no 'getter' or if it does, has a 'setter'
          // before attempting to write back to component props
                    i.get && !i.set || (o[t] = (null !== n || "boolean" != typeof o[t]) && n);
        }));
      }, 
      // create an array of attributes to observe
      // and also create a map of html attribute name to js property name
      e.observedAttributes = o.filter((function(e) {
        e[0];
        return 15 & e[1][0];
      } /* MEMBER_FLAGS.HasAttribute */)).map((function(e) {
        var n = e[0], o = e[1], r = o[1] || n;
        return s.set(r, n), 512 /* MEMBER_FLAGS.ReflectAttr */ & o[0] && t.$attrsToReflect$.push([ n, r ]), 
        r;
      }));
    }
  }
  return e;
}, initializeComponent = function(e, t, n, o, r) {
  return __awaiter(void 0, void 0, void 0, (function() {
    var o, s, i, a, l, c, d;
    return __generator(this, (function(u) {
      switch (u.label) {
       case 0:
        return 0 != (32 /* HOST_FLAGS.hasInitializedComponent */ & t.$flags$) ? [ 3 /*break*/ , 5 ] : (
        // we haven't initialized this element yet
        t.$flags$ |= 32 /* HOST_FLAGS.hasInitializedComponent */ , (
        // lazy loaded components
        // request the component's implementation to be
        // wired up with the host element
        r = loadModule(n, t)).then ? (o = uniqueTime(), [ 4 /*yield*/ , r ]) : [ 3 /*break*/ , 2 ]);

       case 1:
        r = u.sent(), o(), u.label = 2;

       case 2:
        if (!r) throw new Error('Constructor for "'.concat(n.$tagName$, "#").concat(t.$modeName$, '" was not found'));
        r.isProxied || (proxyComponent(r, n, 2 /* PROXY_FLAGS.proxyState */), r.isProxied = !0), 
        s = createTime("createInstance", n.$tagName$), t.$flags$ |= 8 /* HOST_FLAGS.isConstructingInstance */;
        // construct the lazy-loaded component implementation
        // passing the hostRef is very important during
        // construction in order to directly wire together the
        // host element and the lazy-loaded instance
        try {
          new r(t);
        } catch (f) {
          consoleError(f, e);
        }
        return t.$flags$ &= -9 /* HOST_FLAGS.isConstructingInstance */ , s(), r.style ? ("string" != typeof (i = r.style) && (i = i[t.$modeName$ = computeMode(e)]), 
        a = getScopeId(n, t.$modeName$), styles.has(a) ? [ 3 /*break*/ , 5 ] : (l = createTime("registerStyles", n.$tagName$), 
        8 /* CMP_FLAGS.needsShadowDomShim */ & n.$flags$ ? [ 4 /*yield*/ , import("./shadow-css-edfced8b.js").then((function(e) {
          return e.scopeCss(i, a, !1);
        })) ] : [ 3 /*break*/ , 4 ] /* CMP_FLAGS.needsShadowDomShim */)) : [ 3 /*break*/ , 5 ];

       case 3:
        i = u.sent(), u.label = 4;

       case 4:
        registerStyle(a, i, !!(1 /* CMP_FLAGS.shadowDomEncapsulation */ & n.$flags$)), l(), 
        u.label = 5;

       case 5:
        return c = t.$ancestorComponent$, d = function() {
          return scheduleUpdate(t, !0);
        }, c && c["s-rc"] ? 
        // this is the initial load and this component it has an ancestor component
        // but the ancestor component has NOT fired its will update lifecycle yet
        // so let's just cool our jets and wait for the ancestor to continue first
        // this will get fired off when the ancestor component
        // finally gets around to rendering its lazy self
        // fire off the initial update
        c["s-rc"].push(d) : d(), [ 2 /*return*/ ];
      }
    }));
  }));
}, connectedCallback = function(e) {
  if (0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & plt.$flags$)) {
    var t = getHostRef(e), n = t.$cmpMeta$, o = createTime("connectedCallback", n.$tagName$);
    if (1 /* HOST_FLAGS.hasConnected */ & t.$flags$) t && 
    // not the first time this has connected
    // reattach any event listeners to the host
    // since they would have been removed when disconnected
    addHostEventListeners(e, t, n.$listeners$); else {
      // first time this component has connected
      t.$flags$ |= 1 /* HOST_FLAGS.hasConnected */ , 
      // initUpdate
      // if the slot polyfill is required we'll need to put some nodes
      // in here to act as original content anchors as we move nodes around
      // host element has been connected to the DOM
      12 /* CMP_FLAGS.needsShadowDomShim */ & n.$flags$ && setContentReference(e);
      for (
      // find the first ancestor component (if there is one) and register
      // this component as one of the actively loading child components for its ancestor
      var r = e; r = r.parentNode || r.host; ) 
      // climb up the ancestors looking for the first
      // component that hasn't finished its lifecycle update yet
      if (r["s-p"]) {
        // we found this components first ancestor component
        // keep a reference to this component's ancestor component
        attachToAncestor(t, t.$ancestorComponent$ = r);
        break;
      }
      // Lazy properties
      // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
      n.$members$ && Object.entries(n.$members$).map((function(t) {
        var n = t[0];
        if (31 /* MEMBER_FLAGS.Prop */ & t[1][0] && e.hasOwnProperty(n)) {
          var o = e[n];
          delete e[n], e[n] = o;
        }
      })), initializeComponent(e, t, n);
    }
    o();
  }
}, setContentReference = function(e) {
  // only required when we're NOT using native shadow dom (slot)
  // or this browser doesn't support native shadow dom
  // and this host element was NOT created with SSR
  // let's pick out the inner content for slot projection
  // create a node to represent where the original
  // content was first placed, which is useful later on
  var t = e["s-cr"] = doc.createComment("content-ref (host=".concat(e.localName, ")"));
  t["s-cn"] = !0;
  var n = e.__firstChild || e.firstChild;
  n ? e.__insertBefore ? e.__insertBefore(t, n) : e.insertBefore(t, n) : e.__appendChild ? e.__appendChild(t) : e.appendChild(t);
}, disconnectedCallback = function(e) {
  if (0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & plt.$flags$)) {
    var t = getHostRef(e), n = t.$lazyInstance$;
    t.$rmListeners$ && (t.$rmListeners$.map((function(e) {
      return e();
    })), t.$rmListeners$ = void 0), 
    // clear CSS var-shim tracking
    plt.$cssShim$ && plt.$cssShim$.removeHost(e), safeCall(n, "disconnectedCallback", void 0, e);
  }
}, bootstrapLazy = function(e, t) {
  var n;
  void 0 === t && (t = {});
  var o, r = createTime(), s = [], i = t.exclude || [], a = win.customElements, l = doc.head, c =  l.querySelector("meta[charset]"), d =  doc.createElement("style"), u = [], f = !0;
  Object.assign(plt, t), plt.$resourcesUrl$ = new URL(t.resourcesUrl || "./", doc.baseURI).href, 
  e.map((function(e) {
    e[1].map((function(t) {
      var n = {
        $flags$: t[0],
        $tagName$: t[1],
        $members$: t[2],
        $listeners$: t[3]
      };
      n.$members$ = t[2], n.$listeners$ = t[3], n.$attrsToReflect$ = [], !supportsShadow && 1 /* CMP_FLAGS.shadowDomEncapsulation */ & n.$flags$ && (n.$flags$ |= 8 /* CMP_FLAGS.needsShadowDomShim */);
      var r = n.$tagName$, l = /** @class */ function(e) {
        // StencilLazyHost
        function HostElement(t) {
          var o = 
          // @ts-ignore
          e.call(this, t) || this;
          return registerHost(t = o, n), 1 /* CMP_FLAGS.shadowDomEncapsulation */ & n.$flags$ && (
          // this component is using shadow dom
          // and this browser supports shadow dom
          // add the read-only property "shadowRoot" to the host element
          // adding the shadow root build conditionals to minimize runtime
          supportsShadow ? t.attachShadow({
            mode: "open",
            delegatesFocus: !!(16 /* CMP_FLAGS.shadowDelegatesFocus */ & n.$flags$)
          }) : "shadowRoot" in t || (t.shadowRoot = t)), o;
        }
        return __extends(HostElement, e), HostElement.prototype.connectedCallback = function() {
          var e = this;
          o && (clearTimeout(o), o = null), f ? 
          // connectedCallback will be processed once all components have been registered
          u.push(this) : plt.jmp((function() {
            return connectedCallback(e);
          }));
        }, HostElement.prototype.disconnectedCallback = function() {
          var e = this;
          plt.jmp((function() {
            return disconnectedCallback(e);
          }));
        }, HostElement.prototype.componentOnReady = function() {
          return getHostRef(this).$onReadyPromise$;
        }, HostElement;
      }(HTMLElement);
      (4 /* CMP_FLAGS.hasSlotRelocation */ & n.$flags$ || 8 /* CMP_FLAGS.needsShadowDomShim */ & n.$flags$) && (patchPseudoShadowDom(l.prototype), 
      patchCloneNode(l.prototype)), n.$lazyBundleId$ = e[0], i.includes(r) || a.get(r) || (s.push(r), 
      a.define(r, proxyComponent(l, n, 1 /* PROXY_FLAGS.isElementConstructor */)));
    }));
  })), d.innerHTML = s + HYDRATED_CSS, d.setAttribute("data-styles", "");
  // Apply CSP nonce to the style tag if it exists
  var p = null !== (n = plt.$nonce$) && void 0 !== n ? n : queryNonceMetaTagContent(doc);
  null != p && d.setAttribute("nonce", p), l.insertBefore(d, c ? c.nextSibling : l.firstChild), 
  // Process deferred connectedCallbacks now all components have been registered
  f = !1, u.length ? u.map((function(e) {
    return e.connectedCallback();
  })) : plt.jmp((function() {
    return o = setTimeout(appDidLoad, 30);
  })), 
  // Fallback appLoad event
  r();
}, addHostEventListeners = function(e, t, n, o) {
  n && n.map((function(n) {
    var o = n[0], r = n[1], s = n[2], i = getHostListenerTarget(e, o), a = hostListenerProxy(t, s), l = hostListenerOpts(o);
    plt.ael(i, r, a, l), (t.$rmListeners$ = t.$rmListeners$ || []).push((function() {
      return plt.rel(i, r, a, l);
    }));
  }));
}, hostListenerProxy = function(e, t) {
  return function(n) {
    try {
      256 /* HOST_FLAGS.isListenReady */ & e.$flags$ ? 
      // instance is ready, let's call it's member method for this event
      e.$lazyInstance$[t](n) : (e.$queuedListeners$ = e.$queuedListeners$ || []).push([ t, n ]);
    } catch (o) {
      consoleError(o, e.$hostElement$ || null);
    }
  };
}, getHostListenerTarget = function(e, t) {
  return 8 /* LISTENER_FLAGS.TargetWindow */ & t ? win : e;
}, hostListenerOpts = function(e) {
  return 0 != (2 /* LISTENER_FLAGS.Capture */ & e);
}, setNonce = function(e) {
  return plt.$nonce$ = e;
}, hostRefs =  new WeakMap, getHostRef = function(e) {
  return hostRefs.get(e);
}, registerInstance = function(e, t) {
  return hostRefs.set(t.$lazyInstance$ = e, t);
}, registerHost = function(e, t) {
  var n = {
    $flags$: 0,
    $hostElement$: e,
    $cmpMeta$: t,
    $instanceValues$: new Map
  };
  return n.$onInstancePromise$ = new Promise((function(e) {
    return n.$onInstanceResolve$ = e;
  })), n.$onReadyPromise$ = new Promise((function(e) {
    return n.$onReadyResolve$ = e;
  })), e["s-p"] = [], e["s-rc"] = [], addHostEventListeners(e, n, t.$listeners$), 
  hostRefs.set(e, n);
}, isMemberInElement = function(e, t) {
  return t in e;
}, consoleError = function(e, t) {
  return (0, console.error)(e, t);
}, cmpModules =  new Map, loadModule = function(e, t, n) {
  // loadModuleImport
  var o = e.$tagName$.replace(/-/g, "_"), r = e.$lazyBundleId$, s = cmpModules.get(r);
  return s ? s[o] : import(
  /* @vite-ignore */
  /* webpackInclude: /\.entry\.js$/ */
  /* webpackExclude: /\.system\.entry\.js$/ */
  /* webpackMode: "lazy" */
  "./".concat(r, ".entry.js").concat("")).then((function(e) {
    return r && cmpModules.set(r, e), e[o];
  }), (function(e) {
    consoleError(e, t.$hostElement$);
  }))
  /*!__STENCIL_STATIC_IMPORT_SWITCH__*/;
}, styles =  new Map, modeResolutionChain = [], win = "undefined" != typeof window ? window : {}, CSS = win.CSS, doc = win.document || {
  head: {}
}, H = win.HTMLElement || function() {}, plt = {
  $flags$: 0,
  $resourcesUrl$: "",
  jmp: function(e) {
    return e();
  },
  raf: function(e) {
    return requestAnimationFrame(e);
  },
  ael: function(e, t, n, o) {
    return e.addEventListener(t, n, o);
  },
  rel: function(e, t, n, o) {
    return e.removeEventListener(t, n, o);
  },
  ce: function(e, t) {
    return new CustomEvent(e, t);
  }
}, supportsShadow =  function() {
  return (doc.head.attachShadow + "").indexOf("[native") > -1;
}(), promiseResolve = function(e) {
  return Promise.resolve(e);
}, supportsConstructableStylesheets =  function() {
  try {
    return new CSSStyleSheet, "function" == typeof (new CSSStyleSheet).replaceSync;
  } catch (e) {}
  return !1;
}(), queueDomReads = [], queueDomWrites = [], queueTask = function(e, t) {
  return function(n) {
    e.push(n), queuePending || (queuePending = !0, t && 4 /* PLATFORM_FLAGS.queueSync */ & plt.$flags$ ? nextTick(flush) : plt.raf(flush));
  };
}, consume = function(e) {
  for (var t = 0; t < e.length; t++) try {
    e[t](performance.now());
  } catch (n) {
    consoleError(n);
  }
  e.length = 0;
}, flush = function() {
  // always force a bunch of medium callbacks to run, but still have
  // a throttle on how many can run in a certain time
  // DOM READS!!!
  consume(queueDomReads), consume(queueDomWrites), (queuePending = queueDomReads.length > 0) && 
  // still more to do yet, but we've run out of time
  // let's let this thing cool off and try again in the next tick
  plt.raf(flush);
}, nextTick = function(e) {
  return promiseResolve().then(e);
}, writeTask =  queueTask(queueDomWrites, !0);

export { Build as B, CSS as C, H, NAMESPACE as N, promiseResolve as a, bootstrapLazy as b, setMode as c, doc as d, Host as e, createEvent as f, getElement as g, h, getMode as i, plt as p, registerInstance as r, setNonce as s, win as w };