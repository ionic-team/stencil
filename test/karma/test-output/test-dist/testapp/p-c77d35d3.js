/*
 Stencil Client Patch Browser v2.23.2 | MIT Licensed | https://stenciljs.com
 */
// Event.composedPath
var t, o, i, s, h;

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
        var h = s;
        o(h);
        var f = h.localName;
        if ("link" === f && "import" === h.getAttribute("rel")) {
          if ((s = h.import) instanceof Node && !i.has(s)) for (i.add(s), s = s.firstChild; s; s = s.nextSibling) p(s, o, i);
          s = n(t, h);
          continue;
        }
        if ("template" === f) {
          s = n(t, h);
          continue;
        }
        if (h = h.__CE_shadowRoot) for (h = h.firstChild; h; h = h.nextSibling) p(h, o, i);
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
    var s = (i = void 0 === i ? {} : i).u || new Set, h = i.i || function(o) {
      return y(t, o);
    }, f = [];
    if (p(o, (function(o) {
      if ("link" === o.localName && "import" === o.getAttribute("rel")) {
        var i = o.import;
        i instanceof Node && (i.__CE_isImportDocument = !0, i.__CE_hasRegistry = !0), i && "complete" === i.readyState ? i.__CE_documentLoadHandled = !0 : o.addEventListener("load", (function() {
          var i = o.import;
          if (!i.__CE_documentLoadHandled) {
            i.__CE_documentLoadHandled = !0;
            var f = new Set(s);
            f.delete(i), A(t, i, {
              u: f,
              i: h
            });
          }
        }));
      } else f.push(o);
    }), s), t.b) for (o = 0; o < f.length; o++) w(t, f[o]);
    for (o = 0; o < f.length; o++) h(f[o]);
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
          var h = i[s], f = o.getAttribute(h);
          null !== f && t.attributeChangedCallback(o, h, null, f, null);
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
  }, u.prototype.attributeChangedCallback = function(t, o, i, s, h) {
    var f = t.__CE_definition;
    f.attributeChangedCallback && -1 < f.observedAttributes.indexOf(o) && f.attributeChangedCallback.call(t, o, i, s, h);
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
      var h = c("connectedCallback"), f = c("disconnectedCallback"), m = c("adoptedCallback"), _ = c("attributeChangedCallback"), N = o.observedAttributes || [];
    } catch (S) {
      return;
    } finally {
      this.c = !1;
    }
    o = {
      localName: t,
      constructorFunction: o,
      connectedCallback: h,
      disconnectedCallback: f,
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
          for (var o = t.g, i = [], s = new Map, h = 0; h < o.length; h++) s.set(o[h].localName, []);
          for (A(t.a, document, {
            i: function(o) {
              if (void 0 === o.__CE_state) {
                var h = o.localName, f = s.get(h);
                f ? f.push(o) : t.a.a.get(h) && i.push(o);
              }
            }
          }), h = 0; h < i.length; h++) y(t.a, i[h]);
          for (;0 < o.length; ) {
            var f = o.shift();
            h = f.localName, f = s.get(f.localName);
            for (var m = 0; m < f.length; m++) y(t.a, f[m]);
            (h = t.j.get(h)) && D(h);
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
  var o = window.Document.prototype.createElement, i = window.Document.prototype.createElementNS, s = window.Document.prototype.importNode, h = window.Document.prototype.prepend, f = window.Document.prototype.append, m = window.DocumentFragment.prototype.prepend, _ = window.DocumentFragment.prototype.append, N = window.Node.prototype.cloneNode, S = window.Node.prototype.appendChild, T = window.Node.prototype.insertBefore, k = window.Node.prototype.removeChild, O = window.Node.prototype.replaceChild, j = Object.getOwnPropertyDescriptor(window.Node.prototype, "textContent"), L = window.Element.prototype.attachShadow, M = Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML"), H = window.Element.prototype.getAttribute, R = window.Element.prototype.setAttribute, P = window.Element.prototype.removeAttribute, F = window.Element.prototype.getAttributeNS, I = window.Element.prototype.setAttributeNS, U = window.Element.prototype.removeAttributeNS, W = window.Element.prototype.insertAdjacentElement, q = window.Element.prototype.insertAdjacentHTML, $ = window.Element.prototype.prepend, V = window.Element.prototype.append, X = window.Element.prototype.before, G = window.Element.prototype.after, J = window.Element.prototype.replaceWith, K = window.Element.prototype.remove, Q = window.HTMLElement, Z = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, "innerHTML"), tt = window.HTMLElement.prototype.insertAdjacentElement, et = window.HTMLElement.prototype.insertAdjacentHTML, nt = new function() {};
  function Y(t, o, i) {
    function c(o) {
      return function(i) {
        for (var s = [], h = 0; h < arguments.length; ++h) s[h] = arguments[h];
        h = [];
        for (var f = [], m = 0; m < s.length; m++) {
          var _ = s[m];
          if (_ instanceof Element && l(_) && f.push(_), _ instanceof DocumentFragment) for (_ = _.firstChild; _; _ = _.nextSibling) h.push(_); else h.push(_);
        }
        for (o.apply(this, s), s = 0; s < f.length; s++) z(t, f[s]);
        if (l(this)) for (s = 0; s < h.length; s++) (f = h[s]) instanceof Element && x(t, f);
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
        var h = s[i = s.length - 1];
        if (h === nt) throw Error("The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.");
        return s[i] = nt, Object.setPrototypeOf(h, t.prototype), w(ot, h), h;
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
          var h = t.a.get(s);
          if (h) return new h.constructorFunction;
        }
        return o = i.call(this, o, s), w(t, o), o;
      })), Y(t, Document.prototype, {
        h,
        append: f
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
                var h = this.childNodes, f = h.length;
                if (0 < f && l(this)) {
                  s = Array(f);
                  for (var m = 0; m < f; m++) s[m] = h[m];
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
        var h = O.call(this, o, i), f = l(this);
        return f && z(t, i), s && z(t, o), f && x(t, o), h;
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
            var s = this, h = void 0;
            if (l(this) && (h = [], p(this, (function(t) {
              t !== s && h.push(t);
            }))), i.set.call(this, o), h) for (var f = 0; f < h.length; f++) {
              var m = h[f];
              1 === m.__CE_state && t.disconnectedCallback(m);
            }
            return this.ownerDocument.__CE_hasRegistry ? A(t, this) : v(t, this), o;
          }
        });
      }
      function b(o, i) {
        r(o, "insertAdjacentElement", (function(o, s) {
          var h = l(s);
          return o = i.call(this, o, s), h && z(t, s), l(o) && x(t, s), o;
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
            var o = "template" === this.localName, s = o ? this.content : this, h = i.call(document, this.namespaceURI, this.localName);
            for (h.innerHTML = t; 0 < s.childNodes.length; ) k.call(s, s.childNodes[0]);
            for (t = o ? h.content : h; 0 < t.childNodes.length; ) S.call(s, t.childNodes[0]);
          }
        });
      })), r(Element.prototype, "setAttribute", (function(o, i) {
        if (1 !== this.__CE_state) return R.call(this, o, i);
        var s = H.call(this, o);
        R.call(this, o, i), i = H.call(this, o), t.attributeChangedCallback(this, o, s, i, null);
      })), r(Element.prototype, "setAttributeNS", (function(o, i, s) {
        if (1 !== this.__CE_state) return I.call(this, o, i, s);
        var h = F.call(this, o, i);
        I.call(this, o, i, s), s = F.call(this, o, i), t.attributeChangedCallback(this, i, h, s, o);
      })), r(Element.prototype, "removeAttribute", (function(o) {
        if (1 !== this.__CE_state) return P.call(this, o);
        var i = H.call(this, o);
        P.call(this, o), null !== i && t.attributeChangedCallback(this, o, i, null, null);
      })), r(Element.prototype, "removeAttributeNS", (function(o, i) {
        if (1 !== this.__CE_state) return U.call(this, o, i);
        var s = F.call(this, o, i);
        U.call(this, o, i);
        var h = F.call(this, o, i);
        s !== h && t.attributeChangedCallback(this, i, s, h, o);
      })), tt ? b(HTMLElement.prototype, tt) : W ? b(Element.prototype, W) : console.warn("Custom Elements: `Element#insertAdjacentElement` was not patched."), 
      et ? d(HTMLElement.prototype, et) : q ? d(Element.prototype, q) : console.warn("Custom Elements: `Element#insertAdjacentHTML` was not patched."), 
      Y(t, Element.prototype, {
        h: $,
        append: V
      }), function(t) {
        function b(o) {
          return function(i) {
            for (var s = [], h = 0; h < arguments.length; ++h) s[h] = arguments[h];
            h = [];
            for (var f = [], m = 0; m < s.length; m++) {
              var _ = s[m];
              if (_ instanceof Element && l(_) && f.push(_), _ instanceof DocumentFragment) for (_ = _.firstChild; _; _ = _.nextSibling) h.push(_); else h.push(_);
            }
            for (o.apply(this, s), s = 0; s < f.length; s++) z(t, f[s]);
            if (l(this)) for (s = 0; s < h.length; s++) (f = h[s]) instanceof Element && x(t, f);
          };
        }
        var o = Element.prototype;
        void 0 !== X && (o.before = b(X)), void 0 !== X && (o.after = b(G)), void 0 !== J && r(o, "replaceWith", (function(o) {
          for (var i = [], s = 0; s < arguments.length; ++s) i[s] = arguments[s];
          s = [];
          for (var h = [], f = 0; f < i.length; f++) {
            var m = i[f];
            if (m instanceof Element && l(m) && h.push(m), m instanceof DocumentFragment) for (m = m.firstChild; m; m = m.nextSibling) s.push(m); else s.push(m);
          }
          for (f = l(this), J.apply(this, i), i = 0; i < h.length; i++) z(t, h[i]);
          if (f) for (z(t, this), i = 0; i < s.length; i++) (h = s[i]) instanceof Element && x(t, h);
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
})), "classList" in (h = Element.prototype) || Object.defineProperty(h, "classList", {
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
  } catch (h) {
    var o = t.add, i = t.remove;
    t.add = function() {
      for (var t = 0; t < arguments.length; t++) o.call(this, arguments[t]);
    }, t.remove = function() {
      for (var t = 0; t < arguments.length; t++) i.call(this, arguments[t]);
    };
  }
}(DOMTokenList.prototype);