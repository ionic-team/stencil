var __extends = this && this.__extends || function() {
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
}(), __awaiter = this && this.__awaiter || function(e, t, n, r) {
  return new (n || (n = Promise))((function(o, s) {
    function fulfilled(e) {
      try {
        step(r.next(e));
      } catch (t) {
        s(t);
      }
    }
    function rejected(e) {
      try {
        step(r.throw(e));
      } catch (t) {
        s(t);
      }
    }
    function step(e) {
      var t;
      e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n((function(e) {
        e(t);
      }))).then(fulfilled, rejected);
    }
    step((r = r.apply(e, t || [])).next());
  }));
}, __generator = this && this.__generator || function(e, t) {
  var n, r, o, s, i = {
    label: 0,
    sent: function() {
      if (1 & o[0]) throw o[1];
      return o[1];
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
  function verb(l) {
    return function(a) {
      return function(l) {
        if (n) throw new TypeError("Generator is already executing.");
        for (;s && (s = 0, l[0] && (i = 0)), i; ) try {
          if (n = 1, r && (o = 2 & l[0] ? r.return : l[0] ? r.throw || ((o = r.return) && o.call(r), 
          0) : r.next) && !(o = o.call(r, l[1])).done) return o;
          switch (r = 0, o && (l = [ 2 & l[0], o.value ]), l[0]) {
           case 0:
           case 1:
            o = l;
            break;

           case 4:
            return i.label++, {
              value: l[1],
              done: !1
            };

           case 5:
            i.label++, r = l[1], l = [ 0 ];
            continue;

           case 7:
            l = i.ops.pop(), i.trys.pop();
            continue;

           default:
            if (!(o = i.trys, (o = o.length > 0 && o[o.length - 1]) || 6 !== l[0] && 2 !== l[0])) {
              i = 0;
              continue;
            }
            if (3 === l[0] && (!o || l[1] > o[0] && l[1] < o[3])) {
              i.label = l[1];
              break;
            }
            if (6 === l[0] && i.label < o[1]) {
              i.label = o[1], o = l;
              break;
            }
            if (o && i.label < o[2]) {
              i.label = o[2], i.ops.push(l);
              break;
            }
            o[2] && i.ops.pop(), i.trys.pop();
            continue;
          }
          l = t.call(e, i);
        } catch (a) {
          l = [ 6, a ], r = 0;
        } finally {
          n = o = 0;
        }
        if (5 & l[0]) throw l[1];
        return {
          value: l[0] ? l[1] : void 0,
          done: !0
        };
      }([ l, a ]);
    };
  }
}, __spreadArray = this && this.__spreadArray || function(e, t, n) {
  if (n || 2 === arguments.length) for (var r, o = 0, s = t.length; o < s; o++) !r && o in t || (r || (r = Array.prototype.slice.call(t, 0, o)), 
  r[o] = t[o]);
  return e.concat(r || Array.prototype.slice.call(t));
};

System.register([], (function(e, t) {
  "use strict";
  return {
    execute: function() {
      var n, r, o, s = this, i = e("N", "testapp"), l = !1, a = !1, c = !1, f = !1, $ = !1, u = (e("B", {
        isDev: !1,
        isBrowser: !0,
        isServer: !1,
        isTesting: !1
      }), function(e, t) {
        return void 0 === t && (t = ""), function() {};
      }), d = "http://www.w3.org/1999/xlink", p = {}, isComplexType = function(e) {
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
        var t, n, r;
        return null !== (r = null === (n = null === (t = e.head) || void 0 === t ? void 0 : t.querySelector('meta[name="csp-nonce"]')) || void 0 === n ? void 0 : n.getAttribute("content")) && void 0 !== r ? r : void 0;
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
            var h = e("h", (function(e, t) {
        for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
        var o = null, s = null, i = null, l = !1, a = !1, c = [], walk = function(t) {
          for (var n = 0; n < t.length; n++) o = t[n], Array.isArray(o) ? walk(o) : null != o && "boolean" != typeof o && ((l = "function" != typeof e && !isComplexType(o)) && (o = String(o)), 
          l && a ? 
          // If the previous child was simple (string), we merge both
          c[c.length - 1].$text$ += o : 
          // Append a new vNode, if it's text, we create a text vNode
          c.push(l ? newVNode(null, o) : o), a = l);
        };
        if (walk(n), t) {
          // normalize class / classname attributes
          t.key && (s = t.key), t.name && (i = t.name);
          var f = t.className || t.class;
          f && (t.class = "object" != typeof f ? f : Object.keys(f).filter((function(e) {
            return f[e];
          })).join(" "));
        }
        if ("function" == typeof e) 
        // nodeName is a functional component
        return e(null === t ? {} : t, c, v);
        var $ = newVNode(e, null);
        return $.$attrs$ = t, c.length > 0 && ($.$children$ = c), $.$key$ = s, $.$name$ = i, 
        $;
      })), newVNode = function(e, t) {
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
      }, m = e("e", {}), v = {
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
        var n, r = e.parentNode.__childNodes || e.parentNode.childNodes, o = r.length, s = 0; s < o; s++) (n = r[s])["s-sr"] && t && n["s-psn"] === e["s-sn"] ? 
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
          var t, n, r, o, s, i, l = e.__childNodes || e.childNodes;
          for (n = 0, r = l.length; n < r; n++) {
            // slot reference node?
            if (l[n]["s-sr"]) 
            // because we found a slot fallback node let's loop over all
            // the children again to
            for (
            // this component uses slots and we're on a slot node
            // let's find all it's slotted children or lack thereof
            // and show or hide fallback nodes (`<slot />` children)
            // get the slot name for this slot reference node
            s = l[n]["s-sn"], t = l[n], 
            // by default always show a fallback slot node
            // then hide it if there are other slotted nodes in the light dom
            renderSlotFallbackContent(t, !1), o = 0; o < r; o++) 
            // ignore slot fallback nodes
            if (i = l[o].nodeType, !l[o]["s-sf"]) 
            // is sibling node is from a different component OR is a named fallback slot node?
            if (l[o]["s-hn"] !== t["s-hn"] || "" !== s) {
              // you can't slot a textNode in a named slot
              if (1 /* NODE_TYPE.ElementNode */ === i && s === l[o]["s-sn"]) {
                // we found a slotted element!
                // let's hide all the fallback nodes
                renderSlotFallbackContent(t, !0), 
                // patches this node's removal methods
                // so if it gets removed in the future
                // re-asses the fallback node status
                patchRemove(l[o]);
                break;
              }
            } else if (l[o]["s-sn"] === s && (1 /* NODE_TYPE.ElementNode */ === i || 3 /* NODE_TYPE.TextNode */ === i && l[o] && l[o].textContent && "" !== l[o].textContent.trim())) {
              // we found a slotted something
              // let's hide all the fallback nodes
              renderSlotFallbackContent(t, !0), 
              // patches this node's removal methods
              // so if it gets removed in the future
              // re-asses the fallback node status
              patchRemove(l[o]);
              break;
            }
            // keep drilling down
                        updateFallbackSlotVisibility(l[n]);
          }
        }
      }, patchChildNodes = function(e, t) {
        if (globalThis.Node) {
          var n = /** @class */ function(e) {
            function FakeNodeList() {
              return null !== e && e.apply(this, arguments) || this;
            }
            return __extends(FakeNodeList, e), FakeNodeList.prototype.item = function(e) {
              return this[e];
            }, FakeNodeList;
          }(Array), r = Object.getOwnPropertyDescriptor(t || Node.prototype, "childNodes");
          r || (r = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Node.prototype), "childNodes")), 
          r && Object.defineProperty(e, "__childNodes", r);
          var o = Object.getOwnPropertyDescriptor(t || Element.prototype, "children");
          // MockNode won't have these
                    o && Object.defineProperty(e, "__children", o);
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
          }), r && Object.defineProperty(e, "childNodes", {
            get: function() {
              for (var e = this.__childNodes, t = new n, r = 0; r < e.length; r++) {
                var o = e[r]["s-nr"];
                !o || 8 /* NODE_TYPE.CommentNode */ === o.nodeType && 0 === o.nodeValue.indexOf("o.") || t.push(o);
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
          var n = this, r = e["s-sn"] = getSlotName(e), o = getHostSlotNode(this.__childNodes, r);
          if (o) {
            var s = !1;
            if (this.childNodes.forEach((function(i) {
              // we found the node in our list of other 'lightDOM' / slotted nodes
              if (i !== t && null !== t) ; else {
                if (s = !0, addSlotRelocateNode(e, o), null === t) return void n.__append(e);
                r === t["s-sn"] ? ((t.parentNode.__insertBefore || t.parentNode.insertBefore).call(t.parentNode, e, t), 
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
            var r = getHostSlotChildNodes(n), o = r[r.length - 1];
            if (o.parentNode) {
              var s = o.parentNode;
              s.__insertBefore ? s.__insertBefore(e, o.nextSibling) : s.insertBefore(e, o.nextSibling), 
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
            var n = t["s-sn"] = getSlotName(t), r = getHostSlotNode(e.__childNodes, n);
            if (r) {
              addSlotRelocateNode(t, r);
              var o = getHostSlotChildNodes(r)[0];
              return o.parentNode && (o.parentNode.insertBefore(t, o.nextSibling), patchRemove(t)), 
              void (r["s-hsf"] && updateFallbackSlotVisibility(r.parentNode));
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
            var r = getHostSlotChildNodes(n);
            r.forEach((function(e) {
              e["s-sr"] || e.remove();
            })), this.append.apply(this, e);
          }
        });
      }, patchInsertAdjacentHTML = function(e) {
        e.__insertAdjacentHTML || (e.__insertAdjacentHTML = e.insertAdjacentHTML, e.insertAdjacentHTML = function(e, t) {
          if ("afterbegin" !== e && "beforeend" !== e) return this.__insertAdjacentHTML(e, t);
          var n, r = this.ownerDocument.createElement("_");
          if (r.innerHTML = t, "afterbegin" === e) for (;n = r.firstChild; ) this.prepend(n); else if ("beforeend" === e) for (;n = r.firstChild; ) this.append(n);
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
          var r = document.createTextNode("");
          if (r["s-nr"] = e, t["s-cr"] && t["s-cr"].parentNode) {
            var o = t["s-cr"].parentNode, s = o.__appendChild || o.appendChild;
            if (void 0 !== n) {
              r["s-oo"] = n;
              var i = o.__childNodes || o.childNodes, l = [ r ];
              i.forEach((function(e) {
                e["s-nr"] && l.push(e);
              })), l.sort((function(e, t) {
                return !e["s-oo"] || e["s-oo"] < t["s-oo"] ? -1 : !t["s-oo"] || t["s-oo"] < e["s-oo"] ? 1 : 0;
              })), l.forEach((function(e) {
                return s.call(t["s-cr"].parentNode, e);
              }));
            } else s.call(t["s-cr"].parentNode, r);
          }
          e["s-ol"] = r;
        }
      }, getSlotName = function(e) {
        return e["s-sn"] || 1 /* NODE_TYPE.ElementNode */ === e.nodeType && e.getAttribute("slot") || e.slot || "";
      }, getHostSlotNode = function(e, t) {
        var n, r = 0;
        if (!e) return null;
        for (;r < e.length; r++) {
          if ((n = e[r])["s-sr"] && n["s-sn"] === t) return n;
          if (n = getHostSlotNode(n.childNodes, t)) return n;
        }
        return null;
      }, getHostSlotChildNodes = function(e) {
        for (var t = [ e ], n = e["s-sn"] || ""; (e = e.nextSibling) && e["s-sn"] === n; ) t.push(e);
        return t;
      }, g = (e("c", (function(e) {
        return E.push(e);
      })), e("i", (function(e) {
        return getHostRef(e).$modeName$;
      })), e("g", (function(e) {
        return getHostRef(e).$hostElement$;
      }))), y = (e("f", (function(e, t, n) {
        var r = g(e);
        return {
          emit: function(e) {
            return y(r, t, {
              bubbles: !!(4 /* EVENT_FLAGS.Bubbles */ & n),
              composed: !!(2 /* EVENT_FLAGS.Composed */ & n),
              cancelable: !!(1 /* EVENT_FLAGS.Cancellable */ & n),
              detail: e
            });
          }
        };
      })), function(e, t, n) {
        var r = R.ce(t, n);
        return e.dispatchEvent(r), r;
      }), _ =  new WeakMap, attachStyles = function(e) {
        var t = e.$cmpMeta$, n = e.$hostElement$, r = t.$flags$, o = u(0, t.$tagName$), s = function(e, t, n, r) {
          var o, s = getScopeId(t, n), i = j.get(s);
          if (
          // if an element is NOT connected then getRootNode() will return the wrong root node
          // so the fallback is to always use the document for the root node in those cases
          e = 11 /* NODE_TYPE.DocumentFragment */ === e.nodeType ? e : S, i) if ("string" == typeof i) {
            e = e.head || e;
            var l = _.get(e), a = void 0;
            if (l || _.set(e, l = new Set), !l.has(s)) {
              if (R.$cssShim$) {
                var c = (a = R.$cssShim$.createHostStyle(r, s, i, !!(10 /* CMP_FLAGS.needsScopedEncapsulation */ & t.$flags$)))["s-sc"];
                c && (s = c, 
                // we don't want to add this styleID to the appliedStyles Set
                // since the cssVarShim might need to apply several different
                // stylesheets for the same component
                l = null);
              } else (a = S.createElement("style")).innerHTML = i;
              // Apply CSP nonce to the style tag if it exists
                            var f = null !== (o = R.$nonce$) && void 0 !== o ? o : queryNonceMetaTagContent(S);
              null != f && a.setAttribute("nonce", f), e.insertBefore(a, e.querySelector("link")), 
              l && l.add(s);
            }
          } else e.adoptedStyleSheets.includes(i) || (e.adoptedStyleSheets = __spreadArray(__spreadArray([], e.adoptedStyleSheets, !0), [ i ], !1));
          return s;
        }(L && n.shadowRoot ? n.shadowRoot : n.getRootNode(), t, e.$modeName$, n);
        10 /* CMP_FLAGS.needsScopedEncapsulation */ & r && (
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        // DOM WRITE!!
        n["s-sc"] = s, n.classList.add(s + "-h"), 2 /* CMP_FLAGS.scopedCssEncapsulation */ & r && n.classList.add(s + "-s")), 
        o();
      }, getScopeId = function(e, t) {
        return "sc-" + (t && 32 /* CMP_FLAGS.hasMode */ & e.$flags$ ? e.$tagName$ + "-" + t : e.$tagName$);
      }, setAccessor = function(e, t, n, r, o, s) {
        if (n !== r) {
          var i = isMemberInElement(e, t), l = t.toLowerCase();
          if ("class" === t) {
            var a = e.classList, c = parseClassList(n), f = parseClassList(r);
            // for `scoped: true` components, new nodes after initial hydration
            // from SSR don't have the slotted class added. Let's add that now
            e["s-si"] && f.indexOf(e["s-si"]) < 0 && f.push(e["s-si"]), a.remove.apply(a, c.filter((function(e) {
              return e && !f.includes(e);
            }))), a.add.apply(a, f.filter((function(e) {
              return e && !c.includes(e);
            })));
          } else if ("style" === t) {
            for (var $ in n) r && null != r[$] || ($.includes("-") ? e.style.removeProperty($) : e.style[$] = "");
            for (var $ in r) n && r[$] === n[$] || ($.includes("-") ? e.style.setProperty($, r[$]) : e.style[$] = r[$]);
          } else if ("key" === t) ; else if ("ref" === t) 
          // minifier will clean this up
          r && r(e); else if (i || "o" !== t[0] || "n" !== t[1]) {
            // Set property if it exists and it's not a SVG
            var u = isComplexType(r);
            if ((i || u && null !== r) && !o) try {
              if (e.tagName.includes("-")) e[t] = r; else {
                var p = null == r ? "" : r;
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
             */            var h = !1;
            l !== (l = l.replace(/^xlink\:?/, "")) && (t = l, h = !0), null == r || !1 === r ? !1 === r && "" !== e.getAttribute(t) || (h ? e.removeAttributeNS(d, t) : e.removeAttribute(t)) : (!i || 4 /* VNODE_FLAGS.isHost */ & s || o) && !u && (r = !0 === r ? "" : r, 
            h ? e.setAttributeNS(d, t, r) : e.setAttribute(t, r));
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
          t = "-" === t[2] ? t.slice(3) : isMemberInElement(O, l) ? l.slice(2) : l[2] + t.slice(3), 
          n && R.rel(e, t, n, !1), r && R.ael(e, t, r, !1);
        }
      }, N = /\s/, parseClassList = function(e) {
        return e ? e.split(N) : [];
      }, updateElement = function(e, t, n, r) {
        // if the element passed in is a shadow root, which is a document fragment
        // then we want to be adding attrs/props to the shadow root's "host" element
        // if it's not a shadow root, then we add attrs/props to the same element
        var o = 11 /* NODE_TYPE.DocumentFragment */ === t.$elm$.nodeType && t.$elm$.host ? t.$elm$.host : t.$elm$, s = e && e.$attrs$ || p, i = t.$attrs$ || p;
        // remove attributes no longer present on the vnode by setting them to undefined
        for (r in s) r in i || setAccessor(o, r, s[r], void 0, n, t.$flags$);
        // add new & update changed attributes
        for (r in i) setAccessor(o, r, s[r], i[r], n, t.$flags$);
      }, createElm = function(e, t, s, i) {
        // tslint:disable-next-line: prefer-const
        var a, $, u, d = t.$children$[s], p = 0;
        if (l || (
        // remember for later we need to check to relocate nodes
        c = !0, "slot" === d.$tag$ && (n && 
        // scoped css needs to add its scoped id to the parent element
        i.classList.add(n + "-s"), d.$flags$ |= d.$children$ ? // slot element has fallback content
        2 /* VNODE_FLAGS.isSlotFallback */ : // slot element does not have fallback content
        1 /* VNODE_FLAGS.isSlotReference */)), null !== d.$text$) 
        // create text node
        a = d.$elm$ = S.createTextNode(d.$text$); else if (3 /* VNODE_FLAGS.isSlotFallback */ & d.$flags$) 
        // create a slot reference node
        a = d.$elm$ = slotReferenceDebugNode(d); else {
          if (f || (f = "svg" === d.$tag$), 
          // create element
          a = d.$elm$ = S.createElementNS(f ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml", d.$tag$), 
          f && "foreignObject" === d.$tag$ && (f = !1), updateElement(null, d, f), null != n && a["s-si"] !== n && 
          // if there is a scopeId and this is the initial render
          // then let's add the scopeId as a css class
          a.classList.add(a["s-si"] = n), d.$children$) for (p = 0; p < d.$children$.length; ++p) 
          // create the node
          // return node could have been null
          ($ = createElm(e, d, p, a)) && (
          // append our new node
          a.__appendChild ? a.__appendChild($) : a.appendChild($));
          "svg" === d.$tag$ ? 
          // Only reset the SVG context when we're exiting <svg> element
          f = !1 : "foreignObject" === a.tagName && (
          // Reenter SVG context when we're exiting <foreignObject> element
          f = !0);
        }
        if (a["s-hn"] = o, 3 /* VNODE_FLAGS.isSlotReference */ & d.$flags$) {
          if (
          // this is a slot reference node
          a["s-sr"] = !0, 
          // remember the content reference comment
          a["s-cr"] = r, 
          // remember the slot name, or empty string for default slot
          a["s-sn"] = d.$name$ || "", 
          // if this slot is nested within another parent slot, add that slot's name.
          // (used in 'renderSlotFallbackContent')
          t.$name$ && (a["s-psn"] = t.$name$), 2 /* VNODE_FLAGS.isSlotFallback */ & d.$flags$) {
            if (d.$children$) 
            // this slot has fallback nodes
            for (p = 0; p < d.$children$.length; ++p) {
              for (
              // create the node
              var h = 1 /* NODE_TYPE.ElementNode */ === a.nodeType ? a : i; 1 /* NODE_TYPE.ElementNode */ !== h.nodeType; ) h = h.parentNode;
              // add new node meta.
              // slot has fallback and childnode is slot fallback
              ($ = createElm(e, d, p, h))["s-sf"] = a["s-hsf"] = !0, void 0 === $["s-sn"] && ($["s-sn"] = d.$name$ || ""), 
              3 /* NODE_TYPE.TextNode */ === $.nodeType && ($["s-sfc"] = $.textContent), 
              // make sure a node was created
              // and we don't have a node already present
              // (if a node is already attached, we'll just patch it)
              !$ || e && e.$children$ || 
              // append our new node
              h.appendChild($);
            }
            e && e.$children$ && patch(e, d);
          }
          // check if we've got an old vnode for this slot
                    (u = e && e.$children$ && e.$children$[s]) && u.$tag$ === d.$tag$ && e.$elm$ && 
          // we've got an old slot vnode and the wrapper is being replaced
          // so let's move the old slot content back to it's original location
          putBackInOriginalLocation(e.$elm$, !1);
        }
        return a;
      }, putBackInOriginalLocation = function(e, t) {
        R.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
        for (var n = e.__childNodes || e.childNodes, r = n.length - 1; r >= 0; r--) {
          var s = n[r];
          s["s-hn"] !== o && s["s-ol"] && (
          // // this child node in the old element is from another component
          // // remove this node from the old slot's parent
          // childNode.remove();
          // and relocate it back to it's original location
          parentReferenceNode(s).insertBefore(s, referenceNode(s)), 
          // remove the old original location comment entirely
          // later on the patch function will know what to do
          // and move this to the correct spot in need be
          s["s-ol"].remove(), s["s-ol"] = void 0, c = !0), t && putBackInOriginalLocation(s, t);
        }
        R.$flags$ &= -2 /* PLATFORM_FLAGS.isTmpDisconnected */;
      }, addVnodes = function(e, t, n, r, s, i) {
        var l, a = e["s-cr"] && e["s-cr"].parentNode || e;
        for (a.shadowRoot && a.tagName === o && (a = a.shadowRoot); s <= i; ++s) r[s] && (l = createElm(null, n, s, e)) && (r[s].$elm$ = l, 
        a.insertBefore(l, referenceNode(t)));
      }, saveSlottedNodes = function(e) {
        // by removing the hostname reference
        // any current slotted elements will be 'reset' and re-slotted
        var t, n, r, o = e.__childNodes || e.childNodes;
        for (n = 0, r = o.length; n < r; n++) (t = o[n])["s-ol"] ? t["s-hn"] && (t["s-hn"] = void 0) : saveSlottedNodes(t);
      }, removeVnodes = function(e, t, n, r, o) {
        for (;t <= n; ++t) (r = e[t]) && (o = r.$elm$, callNodeRefs(r), 
        // we're removing this element
        // so it's possible we need to show slot fallback content now
        a = !0, saveSlottedNodes(o), o["s-ol"] ? 
        // remove the original location comment
        o["s-ol"].remove() : 
        // it's possible that child nodes of the node
        // that's being removed are slot nodes
        putBackInOriginalLocation(o, !0), 
        // remove the vnode's element from the dom
        o.remove());
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
        var n, r = t.$elm$ = e.$elm$, o = e.$children$, s = t.$children$, i = t.$tag$, l = t.$text$;
        null === l ? (
        // test if we're rendering an svg element, or still rendering nodes inside of one
        // only add this to the when the compiler sees we're using an svg somewhere
        f = "svg" === i || "foreignObject" !== i && f, "slot" === i || 
        // either this is the first render of an element OR it's an update
        // AND we already know it's possible it could have changed
        // this updates the element's css classes, attrs, props, listeners, etc.
        updateElement(e, t, f), null !== o && null !== s ? 
        // looks like there's child vnodes for both the old and new vnodes
        // so we need to call `updateChildren` to reconcile them
        function(e, t, n, r) {
          for (var o, s, i, l, c, f, $, u, d, p = [], h = {}, m = 0, v = 0, g = 0, y = 0, _ = 0, N = t.length - 1, b = t[0], w = t[N], C = r.length - 1, x = r[0], T = r[C]; m <= N && v <= C; ) if (null == b) 
          // VNode might have been moved left
          b = t[++m]; else if (null == w) w = t[--N]; else if (null == x) x = r[++v]; else if (null == T) T = r[--C]; else if (isSameVnode(b, x)) 
          // if the start nodes are the same then we should patch the new VNode
          // onto the old one, and increment our `newStartIdx` and `oldStartIdx`
          // indices to reflect that. We don't need to move any DOM Nodes around
          // since things are matched up in order.
          patch(b, x), b = t[++m], x = r[++v]; else if (isSameVnode(w, T)) 
          // likewise, if the end nodes are the same we patch new onto old and
          // decrement our end indices, and also likewise in this case we don't
          // need to move any DOM Nodes.
          patch(w, T), w = t[--N], T = r[--C]; else if (isSameVnode(b, T)) 
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
          "slot" !== b.$tag$ && "slot" !== T.$tag$ || putBackInOriginalLocation(b.$elm$.parentNode, !1), 
          patch(b, T), 
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
          e.insertBefore(b.$elm$, w.$elm$.nextSibling), b = t[++m], T = r[--C]; else if (isSameVnode(w, x)) 
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
          "slot" !== b.$tag$ && "slot" !== T.$tag$ || putBackInOriginalLocation(w.$elm$.parentNode, !1), 
          patch(w, x), 
          // We've already checked above if `oldStartVnode` and `newStartVnode` are
          // the same node, so since we're here we know that they are not. Thus we
          // can move the element for `oldEndVnode` _before_ the element for
          // `oldStartVnode`, leaving `oldStartVnode` to be reconciled in the
          // future.
          e.insertBefore(w.$elm$, b.$elm$), w = t[--N], x = r[++v]; else {
            for (
            // Here we do some checks to match up old and new nodes based on the
            // `$key$` attribute, which is set by putting a `key="my-key"` attribute
            // in the JSX for a DOM element in the implementation of a Stencil
            // component.
            // First we check to see if there are any nodes in the array of old
            // children which have the same key as the first node in the new
            // children.
            g = -1, y = m; y <= N; ++y) if (t[y] && null !== t[y].$key$ && t[y].$key$ === x.$key$) {
              g = y;
              break;
            }
            g >= 0 ? (
            // We found a node in the old children which matches up with the first
            // node in the new children! So let's deal with that
            (s = t[g]).$tag$ !== x.$tag$ ? 
            // the tag doesn't match so we'll need a new DOM element
            o = createElm(t && t[v], n, g, e) : (patch(s, x), 
            // invalidate the matching old node so that we won't try to update it
            // again later on
            t[g] = void 0, o = s.$elm$), x = r[++v]) : (
            // We either didn't find an element in the old children that matches
            // the key of the first new child OR the build is not using `key`
            // attributes at all. In either case we need to create a new element
            // for the new node.
            o = createElm(t && t[v], n, v, e), x = r[++v]), o && parentReferenceNode(b.$elm$).insertBefore(o, referenceNode(b.$elm$));
          }
          // reorder fallback slot nodes
          if (m > N ? 
          // we have some more new nodes to add which don't match up with old nodes
          addVnodes(e, null == r[C + 1] ? null : r[C + 1].$elm$, n, r, v, C) : v > C && 
          // there are nodes in the `oldCh` array which no longer correspond to nodes
          // in the new array, so lets remove them (which entails cleaning up the
          // relevant DOM nodes)
          removeVnodes(t, m, N), e.parentNode && n.$elm$["s-hsf"]) {
            for (l = (i = e.parentNode.__childNodes || e.parentNode.childNodes).length - 1, 
            y = 0; y <= l; ++y) ($ = i[y])["s-hsf"] ? p.push($) : $["s-sf"] && (h[$["s-sn"]] || (h[$["s-sn"]] = []), 
            h[$["s-sn"]].push($));
            for (c = p.length - 1, y = 0; y <= c; ++y) if (void 0 !== h[(u = p[y])["s-sn"]]) for (f = h[u["s-sn"]].length - 1, 
            _ = 0; _ <= f; ++_) d = h[u["s-sn"]][_], u.parentNode.insertBefore(d, u);
            a = !0;
          }
        }(r, o, t, s) : null !== s ? (
        // no old child vnodes, but there are new child vnodes to add
        null !== e.$text$ && (
        // the old vnode was text, so be sure to clear it out
        r.textContent = ""), 
        // add the new vnode children
        addVnodes(r, null, t, s, 0, s.length - 1)) : null !== o && 
        // no new child vnodes, but there are old child vnodes to remove
        removeVnodes(o, 0, o.length - 1), f && "svg" === i && (f = !1)) : (n = r["s-cr"]) ? 
        // this element has slotted content
        n.parentNode.textContent = l : e.$text$ !== l && (
        // update the text content for the text only vnode
        // and also only if the text is different than before
        r.textContent = l, r["s-sf"] && (r["s-sfc"] = l));
      }, b = [], relocateSlotContent = function(e) {
        for (
        // tslint:disable-next-line: prefer-const
        var t, n, r, o, s, i, l = 0, c = e.__childNodes || e.childNodes, f = c.length; l < f; l++) {
          if ((t = c[l])["s-sr"] && (n = t["s-cr"]) && n.parentNode) for (t["s-hsf"] && (a = !0), 
          // first got the content reference comment node
          // then we got it's parent, which is where all the host content is in now
          r = n.parentNode.__childNodes || n.parentNode.childNodes, o = t["s-sn"], i = r.length - 1; i >= 0; i--) (n = r[i])["s-cn"] || n["s-nr"] || n["s-hn"] === t["s-hn"] || (
          // let's do some relocating to its new home
          // but never relocate a content reference node
          // that is suppose to always represent the original content location
          isNodeLocatedInSlot(n, o) ? (
          // it's possible we've already decided to relocate this node
          s = b.find((function(e) {
            return e.$nodeToRelocate$ === n;
          })), 
          // made some changes to slots
          // let's make sure we also double check
          // fallbacks are correctly hidden or shown
          a = !0, n["s-sn"] = n["s-sn"] || o, s ? 
          // previously we never found a slot home for this node
          // but turns out we did, so let's remember it now
          s.$slotRefNode$ = t : 
          // add to our list of nodes to relocate
          b.push({
            $slotRefNode$: t,
            $nodeToRelocate$: n
          }), n["s-sr"] && b.map((function(e) {
            isNodeLocatedInSlot(e.$nodeToRelocate$, n["s-sn"]) && (s = b.find((function(e) {
              return e.$nodeToRelocate$ === n;
            }))) && !e.$slotRefNode$ && (e.$slotRefNode$ = s.$slotRefNode$);
          }))) : b.some((function(e) {
            return e.$nodeToRelocate$ === n;
          })) || 
          // so far this element does not have a slot home, not setting slotRefNode on purpose
          // if we never find a home for this element then we'll need to hide it
          b.push({
            $nodeToRelocate$: n
          }));
          1 /* NODE_TYPE.ElementNode */ === t.nodeType && relocateSlotContent(t);
        }
      }, isNodeLocatedInSlot = function(e, t) {
        return 1 /* NODE_TYPE.ElementNode */ === e.nodeType ? null === e.getAttribute("slot") && "" === t || e.getAttribute("slot") === t : e["s-sn"] === t || "" === t;
      }, callNodeRefs = function(e) {
        e.$attrs$ && e.$attrs$.ref && e.$attrs$.ref(null), e.$children$ && e.$children$.map(callNodeRefs);
      }, renderVdom = function(e, t) {
        var s, i = e.$hostElement$, f = e.$cmpMeta$, $ = e.$vnode$ || newVNode(null, null), u = (s = t) && s.$tag$ === m ? t : h(null, null, t);
        if (o = i.tagName, f.$attrsToReflect$ && (u.$attrs$ = u.$attrs$ || {}, f.$attrsToReflect$.map((function(e) {
          var t = e[0], n = e[1];
          return u.$attrs$[n] = i[t];
        }))), u.$tag$ = null, u.$flags$ |= 4 /* VNODE_FLAGS.isHost */ , e.$vnode$ = u, u.$elm$ = $.$elm$ = i.shadowRoot || i, 
        n = i["s-sc"], r = i["s-cr"], l = L && 0 != (1 /* CMP_FLAGS.shadowDomEncapsulation */ & f.$flags$), 
        // always reset
        a = !1, 
        // synchronous patch
        patch($, u), 
        // while we're moving nodes around existing nodes, temporarily disable
        // the disconnectCallback from working
        R.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */ , c) {
          relocateSlotContent(u.$elm$);
          for (var d = void 0, p = void 0, v = void 0, g = void 0, y = void 0, _ = void 0, N = void 0, w = 0; w < b.length; w++) (p = (d = b[w]).$nodeToRelocate$)["s-ol"] || (
          // add a reference node marking this node's original location
          // keep a reference to this node for later lookups
          (v = originalLocationDebugNode(p))["s-nr"] = p, p.parentNode.insertBefore(p["s-ol"] = v, p));
          for (w = 0; w < b.length; w++) if (p = (d = b[w]).$nodeToRelocate$, d.$slotRefNode$) {
            for (
            // by default we're just going to insert it directly
            // after the slot reference node
            g = d.$slotRefNode$.parentNode, y = d.$slotRefNode$.__nextSibling || d.$slotRefNode$.nextSibling, 
            v = p["s-ol"], N = y; v = v.__previousSibling || v.previousSibling; ) if ((_ = v["s-nr"]) && _["s-sn"] === p["s-sn"] && g === _.parentNode && (!(_ = _.__nextSibling || _.nextSibling) || !_["s-nr"])) {
              y = _;
              break;
            }
            (!y && g !== p.parentNode || (p.__nextSibling || p.nextSibling) !== y) && (
            // we've checked that it's worth while to relocate
            // since that the node to relocate
            // has a different next sibling or parent relocated
            p !== y ? (!p["s-hn"] && p["s-ol"] && (
            // probably a component in the index.html that doesn't have it's hostname set
            p["s-hn"] = p["s-ol"].parentNode.nodeName), 
            // add it back to the dom but in its new home
            g.insertBefore(p, y), 
            // the node may have been hidden from when it didn't have a home. Re-show.
            p.hidden = !1) : g.insertBefore(p, N));
          } else 
          // this node doesn't have a slot home to go to, so let's hide it
          1 /* NODE_TYPE.ElementNode */ === p.nodeType && (p.hidden = !0);
        }
        a && updateFallbackSlotVisibility(u.$elm$), 
        // done moving nodes around
        // allow the disconnect callback to work again
        R.$flags$ &= -2 /* PLATFORM_FLAGS.isTmpDisconnected */ , 
        // always reset
        b.length = 0, 
        // Clear the content ref so we don't create a memory leak
        r = void 0;
      }, slotReferenceDebugNode = function(e) {
        return S.createComment("<slot".concat(e.$name$ ? ' name="' + e.$name$ + '"' : "", "> (host=").concat(o.toLowerCase(), ")"));
      }, originalLocationDebugNode = function(e) {
        return S.createComment("org-location for " + (e.localName ? "<".concat(e.localName, "> (host=").concat(e["s-hn"], ")") : "[".concat(e.textContent, "]")));
      }, attachToAncestor = function(e, t) {
        t && !e.$onRenderResolve$ && t["s-p"] && t["s-p"].push(new Promise((function(t) {
          return e.$onRenderResolve$ = t;
        })));
      }, scheduleUpdate = function(e, t) {
        if (e.$flags$ |= 16 /* HOST_FLAGS.isQueuedForUpdate */ , !(4 /* HOST_FLAGS.isWaitingForChildren */ & e.$flags$)) {
          attachToAncestor(e, e.$ancestorComponent$);
          return H((function() {
            return dispatchHooks(e, t);
          }));
        }
        e.$flags$ |= 512 /* HOST_FLAGS.needsRerender */;
      }, dispatchHooks = function(e, t) {
        var n, r = e.$hostElement$, o = u(0, e.$cmpMeta$.$tagName$), s = e.$lazyInstance$;
        return t ? (e.$flags$ |= 256 /* HOST_FLAGS.isListenReady */ , e.$queuedListeners$ && (e.$queuedListeners$.map((function(e) {
          var t = e[0], n = e[1];
          return safeCall(s, t, n, r);
        })), e.$queuedListeners$ = null), emitLifecycleEvent(r, "componentWillLoad"), n = safeCall(s, "componentWillLoad", void 0, r)) : (emitLifecycleEvent(r, "componentWillUpdate"), 
        n = safeCall(s, "componentWillUpdate", void 0, r)), emitLifecycleEvent(r, "componentWillRender"), 
        o(), then(n, (function() {
          return updateComponent(e, s, t);
        }));
      }, updateComponent = function(e, t, n) {
        return __awaiter(s, void 0, void 0, (function() {
          var r, o, s, i, l, a;
          return __generator(this, (function(c) {
            return r = e.$hostElement$, o = u(0, e.$cmpMeta$.$tagName$), s = r["s-rc"], n && 
            // DOM WRITE!
            attachStyles(e), i = u(0, e.$cmpMeta$.$tagName$), callRender(e, t), R.$cssShim$ && R.$cssShim$.updateHost(r), 
            s && (
            // ok, so turns out there are some child host elements
            // waiting on this parent element to load
            // let's fire off all update callbacks waiting
            s.map((function(e) {
              return e();
            })), r["s-rc"] = void 0), i(), o(), l = r["s-p"], a = function() {
              return postUpdateComponent(e);
            }, 0 === l.length ? a() : (Promise.all(l).then(a), e.$flags$ |= 4 /* HOST_FLAGS.isWaitingForChildren */ , 
            l.length = 0), [ 2 /*return*/ ];
          }));
        }));
      }, callRender = function(e, t, n) {
        try {
          t = t.render && t.render(), e.$flags$ &= -17 /* HOST_FLAGS.isQueuedForUpdate */ , 
          e.$flags$ |= 2 /* HOST_FLAGS.hasRendered */ , renderVdom(e, t);
        } catch (r) {
          consoleError(r, e.$hostElement$);
        }
        return null;
      }, postUpdateComponent = function(e) {
        var t = e.$cmpMeta$.$tagName$, n = e.$hostElement$, r = u(0, t), o = e.$lazyInstance$, s = e.$ancestorComponent$;
        emitLifecycleEvent(n, "componentDidRender"), 64 /* HOST_FLAGS.hasLoadedComponent */ & e.$flags$ ? (safeCall(o, "componentDidUpdate", void 0, n), 
        emitLifecycleEvent(n, "componentDidUpdate"), r()) : (e.$flags$ |= 64 /* HOST_FLAGS.hasLoadedComponent */ , 
        // DOM WRITE!
        addHydratedFlag(n), safeCall(o, "componentDidLoad", void 0, n), emitLifecycleEvent(n, "componentDidLoad"), 
        r(), e.$onReadyResolve$(n), s || appDidLoad()), e.$onInstanceResolve$(n), e.$onRenderResolve$ && (e.$onRenderResolve$(), 
        e.$onRenderResolve$ = void 0), 512 /* HOST_FLAGS.needsRerender */ & e.$flags$ && nextTick((function() {
          return scheduleUpdate(e, !1);
        })), e.$flags$ &= -517 /* HOST_FLAGS.needsRerender */;
      }, appDidLoad = function(e) {
        addHydratedFlag(S.documentElement), nextTick((function() {
          return y(O, "appload", {
            detail: {
              namespace: i
            }
          });
        }));
      }, safeCall = function(e, t, n, r) {
        if (e && e[t]) try {
          return e[t](n);
        } catch (o) {
          consoleError(o, r);
        }
      }, then = function(e, t) {
        return e && e.then ? e.then(t) : t();
      }, emitLifecycleEvent = function(e, t) {
        y(e, "stencil_" + t, {
          bubbles: !0,
          composed: !0,
          detail: {
            namespace: i
          }
        });
      }, addHydratedFlag = function(e) {
        return e.classList.add("hydrated");
      }, setValue = function(e, t, n, r, o) {
        void 0 === o && (o = !0);
        // check our new property value against our internal value
                var s, i, l = getHostRef(e), a = l.$instanceValues$.get(t), c = l.$flags$, f = l.$lazyInstance$;
        s = n, i = r.$members$[t][0], n = 
        // ensure this value is of the correct prop type
        null == s || isComplexType(s) ? s : 4 /* MEMBER_FLAGS.Boolean */ & i ? "false" !== s && ("" === s || !!s) : 2 /* MEMBER_FLAGS.Number */ & i ? parseFloat(s) : 1 /* MEMBER_FLAGS.String */ & i ? String(s) : s;
        // explicitly check for NaN on both sides, as `NaN === NaN` is always false
        var $ = Number.isNaN(a) && Number.isNaN(n);
        8 /* HOST_FLAGS.isConstructingInstance */ & c && void 0 !== a || !(n !== a && !$) || (
        // gadzooks! the property's value has changed!!
        // set our new value!
        l.$instanceValues$.set(t, n), f && 2 /* HOST_FLAGS.hasRendered */ == (18 /* HOST_FLAGS.isQueuedForUpdate */ & c) && 
        // looks like this value actually changed, so we've got work to do!
        // but only if we've already rendered, otherwise just chill out
        // queue that we need to do an update, but don't worry about queuing
        // up millions cuz this function ensures it only runs once
        scheduleUpdate(l, !1));
      }, proxyComponent = function(e, t, n) {
        if (t.$members$) {
          // It's better to have a const than two Object.entries()
          var r = Object.entries(t.$members$), o = e.prototype;
          if (r.map((function(e) {
            var r = e[0], s = e[1][0];
            if (31 /* MEMBER_FLAGS.Prop */ & s || 2 /* PROXY_FLAGS.proxyState */ & n && 32 /* MEMBER_FLAGS.State */ & s) {
              if (0 == (2048 /* MEMBER_FLAGS.Getter */ & s) ? 
              // proxyComponent - prop
              Object.defineProperty(o, r, {
                get: function() {
                  // proxyComponent, get value
                  return e = r, getHostRef(this).$instanceValues$.get(e);
                  var e;
                },
                set: function(e) {
                  // proxyComponent, set value
                  setValue(this, r, e, t);
                },
                configurable: !0,
                enumerable: !0
              }) : 1 /* PROXY_FLAGS.isElementConstructor */ & n && 2048 /* MEMBER_FLAGS.Getter */ & s && 
              // lazy maps the element get / set to the class get / set
              // proxyComponent - lazy prop getter
              Object.defineProperty(o, r, {
                get: function() {
                  var e = getHostRef(this), t = e ? e.$lazyInstance$ : o;
                  if (t) return t[r];
                },
                configurable: !0,
                enumerable: !0
              }), 4096 /* MEMBER_FLAGS.Setter */ & s) {
                // proxyComponent - lazy and non-lazy. Catches original set to fire updates (for @Watch)
                var i = Object.getOwnPropertyDescriptor(o, r).set;
                Object.defineProperty(o, r, {
                  set: function(e) {
                    var n = this, o = getHostRef(this);
                    // non-lazy setter - amends original set to fire update
                    if (i) return i.apply(this, [ e ]), void setValue(this, r, o.$hostElement$[r], t);
                    if (o) {
                      // lazy setter maps the element set to the class set
                      var setVal = function(s) {
                        void 0 === s && (s = !1), o.$lazyInstance$[r] = e, setValue(n, r, o.$lazyInstance$[r], t, !s);
                      };
                      // If there's a value from an attribute, (before the class is defined), queue & set async
                                            o.$lazyInstance$ ? setVal() : o.$onInstancePromise$.then((function() {
                        return setVal(!0);
                      }));
                    }
                  }
                });
              }
            } else 1 /* PROXY_FLAGS.isElementConstructor */ & n && 64 /* MEMBER_FLAGS.Method */ & s && 
            // proxyComponent - method
            Object.defineProperty(o, r, {
              value: function() {
                for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                var n = getHostRef(this);
                return n.$onInstancePromise$.then((function() {
                  var t;
                  return (t = n.$lazyInstance$)[r].apply(t, e);
                }));
              }
            });
          })), 1 /* PROXY_FLAGS.isElementConstructor */ & n) {
            var s = new Map;
            o.attributeChangedCallback = function(e, t, n) {
              var r = this;
              R.jmp((function() {
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
                                if (r.hasOwnProperty(t)) n = r[t], delete r[t]; else if (o.hasOwnProperty(t) && "number" == typeof r[t] && r[t] == n) 
                // if the propName exists on the prototype of `Cstr`, this update may be a result of Stencil using native
                // APIs to reflect props as attributes. Calls to `setAttribute(someElement, propName)` will result in
                // `propName` to be converted to a `DOMString`, which may not be what we want for other primitive props.
                return;
                var i = Object.getOwnPropertyDescriptor(o, t);
                // test whether this property either has no 'getter' or if it does, has a 'setter'
                // before attempting to write back to component props
                                i.get && !i.set || (r[t] = (null !== n || "boolean" != typeof r[t]) && n);
              }));
            }, 
            // create an array of attributes to observe
            // and also create a map of html attribute name to js property name
            e.observedAttributes = r.filter((function(e) {
              e[0];
              return 15 & e[1][0];
            } /* MEMBER_FLAGS.HasAttribute */)).map((function(e) {
              var n = e[0], r = e[1], o = r[1] || n;
              return s.set(o, n), 512 /* MEMBER_FLAGS.ReflectAttr */ & r[0] && t.$attrsToReflect$.push([ n, o ]), 
              o;
            }));
          }
        }
        return e;
      }, initializeComponent = function(e, n, r, o, i) {
        return __awaiter(s, void 0, void 0, (function() {
          var o, s, l, a, c, f, $;
          return __generator(this, (function(d) {
            switch (d.label) {
             case 0:
              return 0 != (32 /* HOST_FLAGS.hasInitializedComponent */ & n.$flags$) ? [ 3 /*break*/ , 5 ] : (
              // we haven't initialized this element yet
              n.$flags$ |= 32 /* HOST_FLAGS.hasInitializedComponent */ , (
              // lazy loaded components
              // request the component's implementation to be
              // wired up with the host element
              i = loadModule(r, n)).then ? (o = function() {}, [ 4 /*yield*/ , i ]) : [ 3 /*break*/ , 2 ]);

             case 1:
              i = d.sent(), o(), d.label = 2;

             case 2:
              if (!i) throw new Error('Constructor for "'.concat(r.$tagName$, "#").concat(n.$modeName$, '" was not found'));
              i.isProxied || (proxyComponent(i, r, 2 /* PROXY_FLAGS.proxyState */), i.isProxied = !0), 
              s = u(0, r.$tagName$), n.$flags$ |= 8 /* HOST_FLAGS.isConstructingInstance */;
              // construct the lazy-loaded component implementation
              // passing the hostRef is very important during
              // construction in order to directly wire together the
              // host element and the lazy-loaded instance
              try {
                new i(n);
              } catch (p) {
                consoleError(p, e);
              }
              return n.$flags$ &= -9 /* HOST_FLAGS.isConstructingInstance */ , s(), i.style ? ("string" != typeof (l = i.style) && (l = l[n.$modeName$ = function(e) {
                return E.map((function(t) {
                  return t(e);
                })).find((function(e) {
                  return !!e;
                }));
              }(e)]), a = getScopeId(r, n.$modeName$), j.has(a) ? [ 3 /*break*/ , 5 ] : (c = u(0, r.$tagName$), 
              8 /* CMP_FLAGS.needsShadowDomShim */ & r.$flags$ ? [ 4 /*yield*/ , t.import("./p-1416afdc.system.js").then((function(e) {
                return e.scopeCss(l, a, !1);
              })) ] : [ 3 /*break*/ , 4 ] /* CMP_FLAGS.needsShadowDomShim */)) : [ 3 /*break*/ , 5 ];

             case 3:
              l = d.sent(), d.label = 4;

             case 4:
              !function(e, t, n) {
                var r = j.get(e);
                A && n ? "string" == typeof (r = r || new CSSStyleSheet) ? r = t : r.replaceSync(t) : r = t, 
                j.set(e, r);
              }(a, l, !!(1 /* CMP_FLAGS.shadowDomEncapsulation */ & r.$flags$)), c(), d.label = 5;

             case 5:
              return f = n.$ancestorComponent$, $ = function() {
                return scheduleUpdate(n, !0);
              }, f && f["s-rc"] ? 
              // this is the initial load and this component it has an ancestor component
              // but the ancestor component has NOT fired its will update lifecycle yet
              // so let's just cool our jets and wait for the ancestor to continue first
              // this will get fired off when the ancestor component
              // finally gets around to rendering its lazy self
              // fire off the initial update
              f["s-rc"].push($) : $(), [ 2 /*return*/ ];
            }
          }));
        }));
      }, setContentReference = function(e) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        var t = e["s-cr"] = S.createComment("content-ref (host=".concat(e.localName, ")"));
        t["s-cn"] = !0;
        var n = e.__firstChild || e.firstChild;
        n ? e.__insertBefore ? e.__insertBefore(t, n) : e.insertBefore(t, n) : e.__appendChild ? e.__appendChild(t) : e.appendChild(t);
      }, w = (e("b", (function(e, t) {
        var n;
        void 0 === t && (t = {});
        var r, o = u(), s = [], i = t.exclude || [], l = O.customElements, a = S.head, c =  a.querySelector("meta[charset]"), f =  S.createElement("style"), $ = [], d = !0;
        Object.assign(R, t), R.$resourcesUrl$ = new URL(t.resourcesUrl || "./", S.baseURI).href, 
        e.map((function(e) {
          e[1].map((function(t) {
            var n = {
              $flags$: t[0],
              $tagName$: t[1],
              $members$: t[2],
              $listeners$: t[3]
            };
            n.$members$ = t[2], n.$listeners$ = t[3], n.$attrsToReflect$ = [], !L && 1 /* CMP_FLAGS.shadowDomEncapsulation */ & n.$flags$ && (n.$flags$ |= 8 /* CMP_FLAGS.needsShadowDomShim */);
            var o, a, c = n.$tagName$, f = /** @class */ function(e) {
              // StencilLazyHost
              function HostElement(t) {
                var r = 
                // @ts-ignore
                e.call(this, t) || this;
                return x(t = r, n), 1 /* CMP_FLAGS.shadowDomEncapsulation */ & n.$flags$ && (
                // this component is using shadow dom
                // and this browser supports shadow dom
                // add the read-only property "shadowRoot" to the host element
                // adding the shadow root build conditionals to minimize runtime
                L ? t.attachShadow({
                  mode: "open",
                  delegatesFocus: !!(16 /* CMP_FLAGS.shadowDelegatesFocus */ & n.$flags$)
                }) : "shadowRoot" in t || (t.shadowRoot = t)), r;
              }
              return __extends(HostElement, e), HostElement.prototype.connectedCallback = function() {
                var e = this;
                r && (clearTimeout(r), r = null), d ? 
                // connectedCallback will be processed once all components have been registered
                $.push(this) : R.jmp((function() {
                  return function(e) {
                    if (0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & R.$flags$)) {
                      var t = getHostRef(e), n = t.$cmpMeta$, r = u(0, n.$tagName$);
                      if (1 /* HOST_FLAGS.hasConnected */ & t.$flags$) t && 
                      // not the first time this has connected
                      // reattach any event listeners to the host
                      // since they would have been removed when disconnected
                      w(e, t, n.$listeners$); else {
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
                        var o = e; o = o.parentNode || o.host; ) 
                        // climb up the ancestors looking for the first
                        // component that hasn't finished its lifecycle update yet
                        if (o["s-p"]) {
                          // we found this components first ancestor component
                          // keep a reference to this component's ancestor component
                          attachToAncestor(t, t.$ancestorComponent$ = o);
                          break;
                        }
                        // Lazy properties
                        // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
                        n.$members$ && Object.entries(n.$members$).map((function(t) {
                          var n = t[0];
                          if (31 /* MEMBER_FLAGS.Prop */ & t[1][0] && e.hasOwnProperty(n)) {
                            var r = e[n];
                            delete e[n], e[n] = r;
                          }
                        })), initializeComponent(e, t, n);
                      }
                      r();
                    }
                  }(e);
                }));
              }, HostElement.prototype.disconnectedCallback = function() {
                var e = this;
                R.jmp((function() {
                  return function(e) {
                    if (0 == (1 /* PLATFORM_FLAGS.isTmpDisconnected */ & R.$flags$)) {
                      var t = getHostRef(e), n = t.$lazyInstance$;
                      t.$rmListeners$ && (t.$rmListeners$.map((function(e) {
                        return e();
                      })), t.$rmListeners$ = void 0), 
                      // clear CSS var-shim tracking
                      R.$cssShim$ && R.$cssShim$.removeHost(e), safeCall(n, "disconnectedCallback", void 0, e);
                    }
                  }(e);
                }));
              }, HostElement.prototype.componentOnReady = function() {
                return getHostRef(this).$onReadyPromise$;
              }, HostElement;
            }(HTMLElement);
            (4 /* CMP_FLAGS.hasSlotRelocation */ & n.$flags$ || 8 /* CMP_FLAGS.needsShadowDomShim */ & n.$flags$) && (o = f.prototype, 
            patchChildNodes(o, a), patchInsertBefore(o), patchAppendChild(o), patchAppend(o), 
            patchPrepend(o), patchInsertAdjacentHTML(o), patchInsertAdjacentText(o), patchInsertAdjacentElement(o), 
            patchReplaceChildren(o), patchInnerHTML(o, a), patchInnerText(o, a), patchTextContent(o, a), 
            function(e) {
              e.__cloneNode = e.cloneNode, e.cloneNode = function(t) {
                var n = this, r = e.__cloneNode.call(n, !1);
                if (t) for (var o = 0, s = void 0, i = void 0, l = [ "s-id", "s-cr", "s-lr", "s-rc", "s-sc", "s-p", "s-cn", "s-sr", "s-sn", "s-hn", "s-ol", "s-nr", "s-si", "s-sf", "s-sfc", "s-hsf" ]; o < n.__childNodes.length; o++) s = n.__childNodes[o]["s-nr"], 
                i = l.every((function(e) {
                  return !n.__childNodes[o][e];
                })), s && r.__appendChild(s.cloneNode(!0)), i && r.__appendChild(n.__childNodes[o].cloneNode(!0));
                return r;
              };
            }(f.prototype)), n.$lazyBundleId$ = e[0], i.includes(c) || l.get(c) || (s.push(c), 
            l.define(c, proxyComponent(f, n, 1 /* PROXY_FLAGS.isElementConstructor */)));
          }));
        })), f.innerHTML = s + "{visibility:hidden}.hydrated{visibility:inherit}", f.setAttribute("data-styles", "");
        // Apply CSP nonce to the style tag if it exists
        var p = null !== (n = R.$nonce$) && void 0 !== n ? n : queryNonceMetaTagContent(S);
        null != p && f.setAttribute("nonce", p), a.insertBefore(f, c ? c.nextSibling : a.firstChild), 
        // Process deferred connectedCallbacks now all components have been registered
        d = !1, $.length ? $.map((function(e) {
          return e.connectedCallback();
        })) : R.jmp((function() {
          return r = setTimeout(appDidLoad, 30);
        })), 
        // Fallback appLoad event
        o();
      })), function(e, t, n, r) {
        n && n.map((function(n) {
          var r = n[0], o = n[1], s = n[2], i = getHostListenerTarget(e, r), l = hostListenerProxy(t, s), a = hostListenerOpts(r);
          R.ael(i, o, l, a), (t.$rmListeners$ = t.$rmListeners$ || []).push((function() {
            return R.rel(i, o, l, a);
          }));
        }));
      }), hostListenerProxy = function(e, t) {
        return function(n) {
          try {
            256 /* HOST_FLAGS.isListenReady */ & e.$flags$ ? 
            // instance is ready, let's call it's member method for this event
            e.$lazyInstance$[t](n) : (e.$queuedListeners$ = e.$queuedListeners$ || []).push([ t, n ]);
          } catch (r) {
            consoleError(r, e.$hostElement$ || null);
          }
        };
      }, getHostListenerTarget = function(e, t) {
        return 8 /* LISTENER_FLAGS.TargetWindow */ & t ? O : e;
      }, hostListenerOpts = function(e) {
        return 0 != (2 /* LISTENER_FLAGS.Capture */ & e);
      }, C = ( e("s", (function(e) {
        return R.$nonce$ = e;
      })), new WeakMap), getHostRef = function(e) {
        return C.get(e);
      }, x = (e("r", (function(e, t) {
        return C.set(t.$lazyInstance$ = e, t);
      })), function(e, t) {
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
        })), e["s-p"] = [], e["s-rc"] = [], w(e, n, t.$listeners$), C.set(e, n);
      }), isMemberInElement = function(e, t) {
        return t in e;
      }, consoleError = function(e, t) {
        return (0, console.error)(e, t);
      }, T =  new Map, loadModule = function(e, n, r) {
        // loadModuleImport
        var o = e.$tagName$.replace(/-/g, "_"), s = e.$lazyBundleId$, i = T.get(s);
        return i ? i[o] : t.import(
        /* @vite-ignore */
        /* webpackInclude: /\.entry\.js$/ */
        /* webpackExclude: /\.system\.entry\.js$/ */
        /* webpackMode: "lazy" */
        "./".concat(s, ".entry.js").concat("")).then((function(e) {
          return s && T.set(s, e), e[o];
        }), (function(e) {
          consoleError(e, n.$hostElement$);
        }))
        /*!__STENCIL_STATIC_IMPORT_SWITCH__*/;
      }, j =  new Map, E = [], O = e("w", "undefined" != typeof window ? window : {}), S = (e("C", O.CSS), 
      e("d", O.document || {
        head: {}
      })), R = (e("H", O.HTMLElement || function() {}), e("p", {
        $flags$: 0,
        $resourcesUrl$: "",
        jmp: function(e) {
          return e();
        },
        raf: function(e) {
          return requestAnimationFrame(e);
        },
        ael: function(e, t, n, r) {
          return e.addEventListener(t, n, r);
        },
        rel: function(e, t, n, r) {
          return e.removeEventListener(t, n, r);
        },
        ce: function(e, t) {
          return new CustomEvent(e, t);
        }
      })), L =  function() {
        return (S.head.attachShadow + "").indexOf("[native") > -1;
      }(), P = e("a", (function(e) {
        return Promise.resolve(e);
      })), A =  function() {
        try {
          return new CSSStyleSheet, "function" == typeof (new CSSStyleSheet).replaceSync;
        } catch (e) {}
        return !1;
      }(), k = [], M = [], queueTask = function(e, t) {
        return function(n) {
          e.push(n), $ || ($ = !0, t && 4 /* PLATFORM_FLAGS.queueSync */ & R.$flags$ ? nextTick(flush) : R.raf(flush));
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
        consume(k), consume(M), ($ = k.length > 0) && 
        // still more to do yet, but we've run out of time
        // let's let this thing cool off and try again in the next tick
        R.raf(flush);
      }, nextTick = function(e) {
        return P().then(e);
      }, H =  queueTask(M, !0);
    }
  };
}));