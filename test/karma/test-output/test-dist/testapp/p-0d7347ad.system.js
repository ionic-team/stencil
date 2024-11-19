System.register([], (function() {
  "use strict";
  return {
    execute: function() {
      // Event.composedPath
      var t, o, i, s, f;
      /*
       Stencil Client Patch Browser v2.23.2 | MIT Licensed | https://stenciljs.com
       */
      (function() {
        var t = new Set("annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" "));
        function g(o) {
          var i = t.has(o);
          return o = /^[a-z][.0-9_a-z]*-[\-.0-9_a-z]*$/.test(o), !i && o;
        }
        function l(t) {
          var o = t.isConnected;
          if (void 0 !== o) return o;
          for (;t && !(t.__CE_isImportDocument || t instanceof Document); ) t = t.parentNode || (window.ShadowRoot && t instanceof ShadowRoot ? t.host : void 0);
          return !(!t || !(t.__CE_isImportDocument || t instanceof Document));
        }
        function n(t, o) {
          for (;o && o !== t && !o.nextSibling; ) o = o.parentNode;
          return o && o !== t ? o.nextSibling : null;
        }
        function p(t, o, i) {
          i = void 0 === i ? new Set : i;
          for (var s = t; s; ) {
            if (s.nodeType === Node.ELEMENT_NODE) {
              var f = s;
              o(f);
              var h = f.localName;
              if ("link" === h && "import" === f.getAttribute("rel")) {
                if ((s = f.import) instanceof Node && !i.has(s)) for (i.add(s), s = s.firstChild; s; s = s.nextSibling) p(s, o, i);
                s = n(t, f);
                continue;
              }
              if ("template" === h) {
                s = n(t, f);
                continue;
              }
              if (f = f.__CE_shadowRoot) for (f = f.firstChild; f; f = f.nextSibling) p(f, o, i);
            }
            s = s.firstChild ? s.firstChild : n(t, s);
          }
        }
        function r(t, o, i) {
          t[o] = i;
        }
        function u() {
          this.a = new Map, this.g = new Map, this.c = [], this.f = [], this.b = !1;
        }
        function v(t, o) {
          t.b && p(o, (function(o) {
            return w(t, o);
          }));
        }
        function w(t, o) {
          if (t.b && !o.__CE_patched) {
            o.__CE_patched = !0;
            for (var i = 0; i < t.c.length; i++) t.c[i](o);
            for (i = 0; i < t.f.length; i++) t.f[i](o);
          }
        }
        function x(t, o) {
          var i = [];
          for (p(o, (function(t) {
            return i.push(t);
          })), o = 0; o < i.length; o++) {
            var s = i[o];
            1 === s.__CE_state ? t.connectedCallback(s) : y(t, s);
          }
        }
        function z(t, o) {
          var i = [];
          for (p(o, (function(t) {
            return i.push(t);
          })), o = 0; o < i.length; o++) {
            var s = i[o];
            1 === s.__CE_state && t.disconnectedCallback(s);
          }
        }
        function A(t, o, i) {
          var s = (i = void 0 === i ? {} : i).u || new Set, f = i.i || function(o) {
            return y(t, o);
          }, h = [];
          if (p(o, (function(o) {
            if ("link" === o.localName && "import" === o.getAttribute("rel")) {
              var i = o.import;
              i instanceof Node && (i.__CE_isImportDocument = !0, i.__CE_hasRegistry = !0), i && "complete" === i.readyState ? i.__CE_documentLoadHandled = !0 : o.addEventListener("load", (function() {
                var i = o.import;
                if (!i.__CE_documentLoadHandled) {
                  i.__CE_documentLoadHandled = !0;
                  var h = new Set(s);
                  h.delete(i), A(t, i, {
                    u: h,
                    i: f
                  });
                }
              }));
            } else h.push(o);
          }), s), t.b) for (o = 0; o < h.length; o++) w(t, h[o]);
          for (o = 0; o < h.length; o++) f(h[o]);
        }
        function y(t, o) {
          if (void 0 === o.__CE_state) {
            var i = o.ownerDocument;
            if ((i.defaultView || i.__CE_isImportDocument && i.__CE_hasRegistry) && (i = t.a.get(o.localName))) {
              i.constructionStack.push(o);
              var s = i.constructorFunction;
              try {
                try {
                  if (new s !== o) throw Error("The custom element constructor did not produce the element being upgraded.");
                } finally {
                  i.constructionStack.pop();
                }
              } catch (m) {
                throw o.__CE_state = 2, m;
              }
              if (o.__CE_state = 1, o.__CE_definition = i, i.attributeChangedCallback) for (i = i.observedAttributes, 
              s = 0; s < i.length; s++) {
                var f = i[s], h = o.getAttribute(f);
                null !== h && t.attributeChangedCallback(o, f, null, h, null);
              }
              l(o) && t.connectedCallback(o);
            }
          }
        }
        function B(t) {
          var o = document;
          this.c = t, this.a = o, this.b = void 0, A(this.c, this.a), "loading" === this.a.readyState && (this.b = new MutationObserver(this.f.bind(this)), 
          this.b.observe(this.a, {
            childList: !0,
            subtree: !0
          }));
        }
        function C(t) {
          t.b && t.b.disconnect();
        }
        function ea() {
          var t = this;
          this.b = this.a = void 0, this.c = new Promise((function(o) {
            t.b = o, t.a && o(t.a);
          }));
        }
        function D(t) {
          if (t.a) throw Error("Already resolved.");
          t.a = void 0, t.b && t.b(void 0);
        }
        function E(t) {
          this.c = !1, this.a = t, this.j = new Map, this.f = function(t) {
            return t();
          }, this.b = !1, this.g = [], this.o = new B(t);
        }
        u.prototype.connectedCallback = function(t) {
          var o = t.__CE_definition;
          o.connectedCallback && o.connectedCallback.call(t);
        }, u.prototype.disconnectedCallback = function(t) {
          var o = t.__CE_definition;
          o.disconnectedCallback && o.disconnectedCallback.call(t);
        }, u.prototype.attributeChangedCallback = function(t, o, i, s, f) {
          var h = t.__CE_definition;
          h.attributeChangedCallback && -1 < h.observedAttributes.indexOf(o) && h.attributeChangedCallback.call(t, o, i, s, f);
        }, B.prototype.f = function(t) {
          var o = this.a.readyState;
          for ("interactive" !== o && "complete" !== o || C(this), o = 0; o < t.length; o++) for (var i = t[o].addedNodes, s = 0; s < i.length; s++) A(this.c, i[s]);
        }, E.prototype.l = function(t, o) {
          var i = this;
          if (!(o instanceof Function)) throw new TypeError("Custom element constructors must be functions.");
          if (!g(t)) throw new SyntaxError("The element name '" + t + "' is not valid.");
          if (this.a.a.get(t)) throw Error("A custom element with name '" + t + "' has already been defined.");
          if (this.c) throw Error("A custom element is already being defined.");
          this.c = !0;
          try {
            var c = function(t) {
              var o = s[t];
              if (void 0 !== o && !(o instanceof Function)) throw Error("The '" + t + "' callback must be a function.");
              return o;
            }, s = o.prototype;
            if (!(s instanceof Object)) throw new TypeError("The custom element constructor's prototype is not an object.");
            var f = c("connectedCallback"), h = c("disconnectedCallback"), m = c("adoptedCallback"), _ = c("attributeChangedCallback"), N = o.observedAttributes || [];
          } catch (S) {
            return;
          } finally {
            this.c = !1;
          }
          o = {
            localName: t,
            constructorFunction: o,
            connectedCallback: f,
            disconnectedCallback: h,
            adoptedCallback: m,
            attributeChangedCallback: _,
            observedAttributes: N,
            constructionStack: []
          }, function(t, o, i) {
            t.a.set(o, i), t.g.set(i.constructorFunction, i);
          }(this.a, t, o), this.g.push(o), this.b || (this.b = !0, this.f((function() {
            return function(t) {
              if (!1 !== t.b) {
                t.b = !1;
                for (var o = t.g, i = [], s = new Map, f = 0; f < o.length; f++) s.set(o[f].localName, []);
                for (A(t.a, document, {
                  i: function(o) {
                    if (void 0 === o.__CE_state) {
                      var f = o.localName, h = s.get(f);
                      h ? h.push(o) : t.a.a.get(f) && i.push(o);
                    }
                  }
                }), f = 0; f < i.length; f++) y(t.a, i[f]);
                for (;0 < o.length; ) {
                  var h = o.shift();
                  f = h.localName, h = s.get(h.localName);
                  for (var m = 0; m < h.length; m++) y(t.a, h[m]);
                  (f = t.j.get(f)) && D(f);
                }
              }
            }(i);
          })));
        }, E.prototype.i = function(t) {
          A(this.a, t);
        }, E.prototype.get = function(t) {
          if (t = this.a.a.get(t)) return t.constructorFunction;
        }, E.prototype.m = function(t) {
          if (!g(t)) return Promise.reject(new SyntaxError("'" + t + "' is not a valid custom element name."));
          var o = this.j.get(t);
          return o || (o = new ea, this.j.set(t, o), this.a.a.get(t) && !this.g.some((function(o) {
            return o.localName === t;
          })) && D(o)), o.c;
        }, E.prototype.s = function(t) {
          C(this.o);
          var o = this.f;
          this.f = function(i) {
            return t((function() {
              return o(i);
            }));
          };
        }, window.CustomElementRegistry = E, E.prototype.define = E.prototype.l, E.prototype.upgrade = E.prototype.i, 
        E.prototype.get = E.prototype.get, E.prototype.whenDefined = E.prototype.m, E.prototype.polyfillWrapFlushCallback = E.prototype.s;
        var o = window.Document.prototype.createElement, i = window.Document.prototype.createElementNS, s = window.Document.prototype.importNode, f = window.Document.prototype.prepend, h = window.Document.prototype.append, m = window.DocumentFragment.prototype.prepend, _ = window.DocumentFragment.prototype.append, N = window.Node.prototype.cloneNode, S = window.Node.prototype.appendChild, T = window.Node.prototype.insertBefore, k = window.Node.prototype.removeChild, O = window.Node.prototype.replaceChild, j = Object.getOwnPropertyDescriptor(window.Node.prototype, "textContent"), L = window.Element.prototype.attachShadow, M = Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML"), H = window.Element.prototype.getAttribute, R = window.Element.prototype.setAttribute, P = window.Element.prototype.removeAttribute, F = window.Element.prototype.getAttributeNS, I = window.Element.prototype.setAttributeNS, U = window.Element.prototype.removeAttributeNS, W = window.Element.prototype.insertAdjacentElement, q = window.Element.prototype.insertAdjacentHTML, $ = window.Element.prototype.prepend, V = window.Element.prototype.append, X = window.Element.prototype.before, G = window.Element.prototype.after, J = window.Element.prototype.replaceWith, K = window.Element.prototype.remove, Q = window.HTMLElement, Z = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, "innerHTML"), tt = window.HTMLElement.prototype.insertAdjacentElement, et = window.HTMLElement.prototype.insertAdjacentHTML, nt = new function() {};
        function Y(t, o, i) {
          function c(o) {
            return function(i) {
              for (var s = [], f = 0; f < arguments.length; ++f) s[f] = arguments[f];
              f = [];
              for (var h = [], m = 0; m < s.length; m++) {
                var _ = s[m];
                if (_ instanceof Element && l(_) && h.push(_), _ instanceof DocumentFragment) for (_ = _.firstChild; _; _ = _.nextSibling) f.push(_); else f.push(_);
              }
              for (o.apply(this, s), s = 0; s < h.length; s++) z(t, h[s]);
              if (l(this)) for (s = 0; s < f.length; s++) (h = f[s]) instanceof Element && x(t, h);
            };
          }
          void 0 !== i.h && (o.prepend = c(i.h)), void 0 !== i.append && (o.append = c(i.append));
        }
        var ot, rt = window.customElements;
        if (!rt || rt.forcePolyfill || "function" != typeof rt.define || "function" != typeof rt.get) {
          var it = new u;
          ot = it, window.HTMLElement = function() {
            function b() {
              var t = this.constructor, i = ot.g.get(t);
              if (!i) throw Error("The custom element being constructed was not registered with `customElements`.");
              var s = i.constructionStack;
              if (0 === s.length) return s = o.call(document, i.localName), Object.setPrototypeOf(s, t.prototype), 
              s.__CE_state = 1, s.__CE_definition = i, w(ot, s), s;
              var f = s[i = s.length - 1];
              if (f === nt) throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
              return s[i] = nt, Object.setPrototypeOf(f, t.prototype), w(ot, f), f;
            }
            return b.prototype = Q.prototype, Object.defineProperty(b.prototype, "constructor", {
              writable: !0,
              configurable: !0,
              enumerable: !1,
              value: b
            }), b;
          }(), function() {
            var t = it;
            r(Document.prototype, "createElement", (function(i) {
              if (this.__CE_hasRegistry) {
                var s = t.a.get(i);
                if (s) return new s.constructorFunction;
              }
              return i = o.call(this, i), w(t, i), i;
            })), r(Document.prototype, "importNode", (function(o, i) {
              return o = s.call(this, o, !!i), this.__CE_hasRegistry ? A(t, o) : v(t, o), o;
            })), r(Document.prototype, "createElementNS", (function(o, s) {
              if (this.__CE_hasRegistry && (null === o || "http://www.w3.org/1999/xhtml" === o)) {
                var f = t.a.get(s);
                if (f) return new f.constructorFunction;
              }
              return o = i.call(this, o, s), w(t, o), o;
            })), Y(t, Document.prototype, {
              h: f,
              append: h
            });
          }(), Y(it, DocumentFragment.prototype, {
            h: m,
            append: _
          }), function() {
            function a(o, i) {
              Object.defineProperty(o, "textContent", {
                enumerable: i.enumerable,
                configurable: !0,
                get: i.get,
                set: function(o) {
                  if (this.nodeType === Node.TEXT_NODE) i.set.call(this, o); else {
                    var s = void 0;
                    if (this.firstChild) {
                      var f = this.childNodes, h = f.length;
                      if (0 < h && l(this)) {
                        s = Array(h);
                        for (var m = 0; m < h; m++) s[m] = f[m];
                      }
                    }
                    if (i.set.call(this, o), s) for (o = 0; o < s.length; o++) z(t, s[o]);
                  }
                }
              });
            }
            var t = it;
            r(Node.prototype, "insertBefore", (function(o, i) {
              if (o instanceof DocumentFragment) {
                var s = Array.prototype.slice.apply(o.childNodes);
                if (o = T.call(this, o, i), l(this)) for (i = 0; i < s.length; i++) x(t, s[i]);
                return o;
              }
              return s = l(o), i = T.call(this, o, i), s && z(t, o), l(this) && x(t, o), i;
            })), r(Node.prototype, "appendChild", (function(o) {
              if (o instanceof DocumentFragment) {
                var i = Array.prototype.slice.apply(o.childNodes);
                if (o = S.call(this, o), l(this)) for (var s = 0; s < i.length; s++) x(t, i[s]);
                return o;
              }
              return i = l(o), s = S.call(this, o), i && z(t, o), l(this) && x(t, o), s;
            })), r(Node.prototype, "cloneNode", (function(o) {
              return o = N.call(this, !!o), this.ownerDocument.__CE_hasRegistry ? A(t, o) : v(t, o), 
              o;
            })), r(Node.prototype, "removeChild", (function(o) {
              var i = l(o), s = k.call(this, o);
              return i && z(t, o), s;
            })), r(Node.prototype, "replaceChild", (function(o, i) {
              if (o instanceof DocumentFragment) {
                var s = Array.prototype.slice.apply(o.childNodes);
                if (o = O.call(this, o, i), l(this)) for (z(t, i), i = 0; i < s.length; i++) x(t, s[i]);
                return o;
              }
              s = l(o);
              var f = O.call(this, o, i), h = l(this);
              return h && z(t, i), s && z(t, o), h && x(t, o), f;
            })), j && j.get ? a(Node.prototype, j) : function(t, o) {
              t.b = !0, t.c.push(o);
            }(t, (function(t) {
              a(t, {
                enumerable: !0,
                configurable: !0,
                get: function() {
                  for (var t = [], o = 0; o < this.childNodes.length; o++) {
                    var i = this.childNodes[o];
                    i.nodeType !== Node.COMMENT_NODE && t.push(i.textContent);
                  }
                  return t.join("");
                },
                set: function(t) {
                  for (;this.firstChild; ) k.call(this, this.firstChild);
                  null != t && "" !== t && S.call(this, document.createTextNode(t));
                }
              });
            }));
          }(), function() {
            function a(o, i) {
              Object.defineProperty(o, "innerHTML", {
                enumerable: i.enumerable,
                configurable: !0,
                get: i.get,
                set: function(o) {
                  var s = this, f = void 0;
                  if (l(this) && (f = [], p(this, (function(t) {
                    t !== s && f.push(t);
                  }))), i.set.call(this, o), f) for (var h = 0; h < f.length; h++) {
                    var m = f[h];
                    1 === m.__CE_state && t.disconnectedCallback(m);
                  }
                  return this.ownerDocument.__CE_hasRegistry ? A(t, this) : v(t, this), o;
                }
              });
            }
            function b(o, i) {
              r(o, "insertAdjacentElement", (function(o, s) {
                var f = l(s);
                return o = i.call(this, o, s), f && z(t, s), l(o) && x(t, s), o;
              }));
            }
            function d(o, i) {
              function e(o, i) {
                for (var s = []; o !== i; o = o.nextSibling) s.push(o);
                for (i = 0; i < s.length; i++) A(t, s[i]);
              }
              r(o, "insertAdjacentHTML", (function(t, o) {
                if ("beforebegin" === (t = t.toLowerCase())) {
                  var s = this.previousSibling;
                  i.call(this, t, o), e(s || this.parentNode.firstChild, this);
                } else if ("afterbegin" === t) s = this.firstChild, i.call(this, t, o), e(this.firstChild, s); else if ("beforeend" === t) s = this.lastChild, 
                i.call(this, t, o), e(s || this.firstChild, null); else {
                  if ("afterend" !== t) throw new SyntaxError("The value provided (" + String(t) + ") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");
                  s = this.nextSibling, i.call(this, t, o), e(this.nextSibling, s);
                }
              }));
            }
            var t = it;
            L && r(Element.prototype, "attachShadow", (function(o) {
              o = L.call(this, o);
              var i = t;
              if (i.b && !o.__CE_patched) {
                o.__CE_patched = !0;
                for (var s = 0; s < i.c.length; s++) i.c[s](o);
              }
              return this.__CE_shadowRoot = o;
            })), M && M.get ? a(Element.prototype, M) : Z && Z.get ? a(HTMLElement.prototype, Z) : function(t, o) {
              t.b = !0, t.f.push(o);
            }(t, (function(t) {
              a(t, {
                enumerable: !0,
                configurable: !0,
                get: function() {
                  return N.call(this, !0).innerHTML;
                },
                set: function(t) {
                  var o = "template" === this.localName, s = o ? this.content : this, f = i.call(document, this.namespaceURI, this.localName);
                  for (f.innerHTML = t; 0 < s.childNodes.length; ) k.call(s, s.childNodes[0]);
                  for (t = o ? f.content : f; 0 < t.childNodes.length; ) S.call(s, t.childNodes[0]);
                }
              });
            })), r(Element.prototype, "setAttribute", (function(o, i) {
              if (1 !== this.__CE_state) return R.call(this, o, i);
              var s = H.call(this, o);
              R.call(this, o, i), i = H.call(this, o), t.attributeChangedCallback(this, o, s, i, null);
            })), r(Element.prototype, "setAttributeNS", (function(o, i, s) {
              if (1 !== this.__CE_state) return I.call(this, o, i, s);
              var f = F.call(this, o, i);
              I.call(this, o, i, s), s = F.call(this, o, i), t.attributeChangedCallback(this, i, f, s, o);
            })), r(Element.prototype, "removeAttribute", (function(o) {
              if (1 !== this.__CE_state) return P.call(this, o);
              var i = H.call(this, o);
              P.call(this, o), null !== i && t.attributeChangedCallback(this, o, i, null, null);
            })), r(Element.prototype, "removeAttributeNS", (function(o, i) {
              if (1 !== this.__CE_state) return U.call(this, o, i);
              var s = F.call(this, o, i);
              U.call(this, o, i);
              var f = F.call(this, o, i);
              s !== f && t.attributeChangedCallback(this, i, s, f, o);
            })), tt ? b(HTMLElement.prototype, tt) : W ? b(Element.prototype, W) : console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched."), 
            et ? d(HTMLElement.prototype, et) : q ? d(Element.prototype, q) : console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched."), 
            Y(t, Element.prototype, {
              h: $,
              append: V
            }), function(t) {
              function b(o) {
                return function(i) {
                  for (var s = [], f = 0; f < arguments.length; ++f) s[f] = arguments[f];
                  f = [];
                  for (var h = [], m = 0; m < s.length; m++) {
                    var _ = s[m];
                    if (_ instanceof Element && l(_) && h.push(_), _ instanceof DocumentFragment) for (_ = _.firstChild; _; _ = _.nextSibling) f.push(_); else f.push(_);
                  }
                  for (o.apply(this, s), s = 0; s < h.length; s++) z(t, h[s]);
                  if (l(this)) for (s = 0; s < f.length; s++) (h = f[s]) instanceof Element && x(t, h);
                };
              }
              var o = Element.prototype;
              void 0 !== X && (o.before = b(X)), void 0 !== X && (o.after = b(G)), void 0 !== J && r(o, "replaceWith", (function(o) {
                for (var i = [], s = 0; s < arguments.length; ++s) i[s] = arguments[s];
                s = [];
                for (var f = [], h = 0; h < i.length; h++) {
                  var m = i[h];
                  if (m instanceof Element && l(m) && f.push(m), m instanceof DocumentFragment) for (m = m.firstChild; m; m = m.nextSibling) s.push(m); else s.push(m);
                }
                for (h = l(this), J.apply(this, i), i = 0; i < f.length; i++) z(t, f[i]);
                if (h) for (z(t, this), i = 0; i < s.length; i++) (f = s[i]) instanceof Element && x(t, f);
              })), void 0 !== K && r(o, "remove", (function() {
                var o = l(this);
                K.call(this), o && z(t, this);
              }));
            }(t);
          }(), document.__CE_hasRegistry = !0;
          var at = new E(it);
          Object.defineProperty(window, "customElements", {
            configurable: !0,
            enumerable: !0,
            value: at
          });
        }
      }).call(self), 
      // Polyfill document.baseURI
      "string" != typeof document.baseURI && Object.defineProperty(Document.prototype, "baseURI", {
        enumerable: !0,
        configurable: !0,
        get: function() {
          var t = document.querySelector("base");
          return t && t.href ? t.href : document.URL;
        }
      }), 
      // Polyfill CustomEvent
      "function" != typeof window.CustomEvent && (window.CustomEvent = function(t, o) {
        o = o || {
          bubbles: !1,
          cancelable: !1,
          detail: void 0
        };
        var i = document.createEvent("CustomEvent");
        return i.initCustomEvent(t, o.bubbles, o.cancelable, o.detail), i;
      }, window.CustomEvent.prototype = window.Event.prototype), t = Event.prototype, 
      o = document, i = window, t.composedPath || (t.composedPath = function() {
        if (this.path) return this.path;
        var t = this.target;
        for (this.path = []; null !== t.parentNode; ) this.path.push(t), t = t.parentNode;
        return this.path.push(o, i), this.path;
      }), "function" != typeof (
      /*!
      Element.closest and Element.matches
      https://github.com/jonathantneal/closest
      Creative Commons Zero v1.0 Universal
      */
      s = window.Element.prototype).matches && (s.matches = s.msMatchesSelector || s.mozMatchesSelector || s.webkitMatchesSelector || function(t) {
        t = (this.document || this.ownerDocument).querySelectorAll(t);
        for (var o = 0; t[o] && t[o] !== this; ) ++o;
        return !!t[o];
      }), "function" != typeof s.closest && (s.closest = function(t) {
        for (var o = this; o && 1 === o.nodeType; ) {
          if (o.matches(t)) return o;
          o = o.parentNode;
        }
        return null;
      }), 
      /*!
      Element.getRootNode()
      */
      function(t) {
        function d(t) {
          return (t = b(t)) && 11 === t.nodeType ? d(t.host) : t;
        }
        function b(t) {
          return t && t.parentNode ? b(t.parentNode) : t;
        }
        "function" != typeof t.getRootNode && (t.getRootNode = function(t) {
          return t && t.composed ? d(this) : b(this);
        });
      }(Element.prototype), 
      /*!
      Element.isConnected()
      */
      function(t) {
        "isConnected" in t || Object.defineProperty(t, "isConnected", {
          configurable: !0,
          enumerable: !0,
          get: function() {
            var t = this.getRootNode({
              composed: !0
            });
            return t && 9 === t.nodeType;
          }
        });
      }(Element.prototype), [ Element.prototype, CharacterData.prototype, DocumentType.prototype ].forEach((function(t) {
        t.hasOwnProperty("remove") || Object.defineProperty(t, "remove", {
          configurable: !0,
          enumerable: !0,
          writable: !0,
          value: function() {
            null !== this.parentNode && this.parentNode.removeChild(this);
          }
        });
      })), "classList" in (f = Element.prototype) || Object.defineProperty(f, "classList", {
        get: function() {
          var t = this, o = (t.getAttribute("class") || "").replace(/^\s+|\s$/g, "").split(/\s+/g);
          function n() {
            o.length > 0 ? t.setAttribute("class", o.join(" ")) : t.removeAttribute("class");
          }
          return "" === o[0] && o.splice(0, 1), o.toggle = function(t, i) {
            void 0 !== i ? i ? o.add(t) : o.remove(t) : -1 !== o.indexOf(t) ? o.splice(o.indexOf(t), 1) : o.push(t), 
            n();
          }, o.add = function() {
            for (var t = [].slice.call(arguments), i = 0, s = t.length; i < s; i++) -1 === o.indexOf(t[i]) && o.push(t[i]);
            n();
          }, o.remove = function() {
            for (var t = [].slice.call(arguments), i = 0, s = t.length; i < s; i++) -1 !== o.indexOf(t[i]) && o.splice(o.indexOf(t[i]), 1);
            n();
          }, o.item = function(t) {
            return o[t];
          }, o.contains = function(t) {
            return -1 !== o.indexOf(t);
          }, o.replace = function(t, i) {
            -1 !== o.indexOf(t) && o.splice(o.indexOf(t), 1, i), n();
          }, o.value = t.getAttribute("class") || "", o;
        }
      }), 
      /*!
      DOMTokenList
      */
      function(t) {
        try {
          document.body.classList.add();
        } catch (f) {
          var o = t.add, i = t.remove;
          t.add = function() {
            for (var t = 0; t < arguments.length; t++) o.call(this, arguments[t]);
          }, t.remove = function() {
            for (var t = 0; t < arguments.length; t++) i.call(this, arguments[t]);
          };
        }
      }(DOMTokenList.prototype);
    }
  };
}));