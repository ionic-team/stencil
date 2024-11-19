System.register([], (function() {
  "use strict";
  return {
    execute: function() {
      /*
       Stencil Client Patch Esm v2.23.2 | MIT Licensed | https://stenciljs.com
       */
      var __assign = function() {
        return __assign = Object.assign || function(t) {
          for (var r, n = 1, o = arguments.length; n < o; n++) for (var a in r = arguments[n]) Object.prototype.hasOwnProperty.call(r, a) && (t[a] = r[a]);
          return t;
        }, __assign.apply(this, arguments);
      }, StyleNode = function() {
        this.start = 0, this.end = 0, this.previous = null, this.parent = null, this.rules = null, 
        this.parsedCssText = "", this.cssText = "", this.atRule = !1, this.type = 0, this.keyframesName = "", 
        this.selector = "", this.parsedSelector = "";
      };
      function parse(t) {
        return parseCss(function(t) {
          var o = new StyleNode;
          o.start = 0, o.end = t.length;
          for (var a = o, i = 0, l = t.length; i < l; i++) if (t[i] === r) {
            a.rules || (a.rules = []);
            var u = a, c = u.rules[u.rules.length - 1] || null;
            (a = new StyleNode).start = i + 1, a.parent = u, a.previous = c, u.rules.push(a);
          } else t[i] === n && (a.end = i + 1, a = a.parent || o);
          return o;
        }(t = function(t) {
          return t.replace(o.comments, "").replace(o.port, "");
        }(t)), t);
      }
      function parseCss(r, n) {
        var u = n.substring(r.start, r.end - 1);
        if (r.parsedCssText = r.cssText = u.trim(), r.parent) {
          var c = r.previous ? r.previous.end : r.parent.start;
          u = (u = (u = function(t) {
            return t.replace(/\\([0-9a-f]{1,6})\s/gi, (function() {
              for (var t = arguments[1], r = 6 - t.length; r--; ) t = "0" + t;
              return "\\" + t;
            }));
          }(u = n.substring(c, r.start - 1))).replace(o.multipleSpaces, " ")).substring(u.lastIndexOf(";") + 1);
          var p = r.parsedSelector = r.selector = u.trim();
          r.atRule = 0 === p.indexOf(l), r.atRule ? 0 === p.indexOf(i) ? r.type = t.MEDIA_RULE : p.match(o.keyframesRule) && (r.type = t.KEYFRAMES_RULE, 
          r.keyframesName = r.selector.split(o.multipleSpaces).pop()) : 0 === p.indexOf(a) ? r.type = t.MIXIN_RULE : r.type = t.STYLE_RULE;
        }
        var f = r.rules;
        if (f) for (var h = 0, d = f.length, m = void 0; h < d && (m = f[h]); h++) parseCss(m, n);
        return r;
      }
      var t = {
        STYLE_RULE: 1,
        KEYFRAMES_RULE: 7,
        MEDIA_RULE: 4,
        MIXIN_RULE: 1e3
      }, r = "{", n = "}", o = {
        comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
        port: /@import[^;]*;/gim,
        customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
        mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
        mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
        varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
        keyframesRule: /^@[^\s]*keyframes/,
        multipleSpaces: /\s+/g
      }, a = "--", i = "@media", l = "@", u = /\bvar\(/, c = /\B--[\w-]+\s*:/, p = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim, f = /^[\t ]+\n/gm;
      function findRegex(t, r, n) {
        t.lastIndex = 0;
        var o = r.substring(n).match(t);
        if (o) {
          var a = n + o.index;
          return {
            start: a,
            end: a + o[0].length
          };
        }
        return null;
      }
      function compileVar(t, r, n) {
        var o = function(t, r) {
          var n = findRegex(u, t, r);
          if (!n) return null;
          var o = function(t, r) {
            for (var n = 0, o = r; o < t.length; o++) {
              var a = t[o];
              if ("(" === a) n++; else if (")" === a && --n <= 0) return o + 1;
            }
            return o;
          }(t, n.start), a = t.substring(n.end, o - 1).split(","), i = a[0], l = a.slice(1);
          return {
            start: n.start,
            end: o,
            propName: i.trim(),
            fallback: l.length > 0 ? l.join(",").trim() : void 0
          };
        }(t, n);
        if (!o) return r.push(t.substring(n, t.length)), t.length;
        var a = o.propName, i = null != o.fallback ? compileTemplate(o.fallback) : void 0;
        return r.push(t.substring(n, o.start), (function(t) {
          return function(t, r, n) {
            return t[r] ? t[r] : n ? executeTemplate(n, t) : "";
          }(t, a, i);
        })), o.end;
      }
      function executeTemplate(t, r) {
        for (var n = "", o = 0; o < t.length; o++) {
          var a = t[o];
          n += "string" == typeof a ? a : a(r);
        }
        return n;
      }
      function findEndValue(t, r) {
        for (var n = !1, o = !1, a = r; a < t.length; a++) {
          var i = t[a];
          if (n) o && '"' === i && (n = !1), o || "'" !== i || (n = !1); else if ('"' === i) n = !0, 
          o = !0; else if ("'" === i) n = !0, o = !1; else {
            if (";" === i) return a + 1;
            if ("}" === i) return a;
          }
        }
        return a;
      }
      function compileTemplate(t) {
        var r = 0;
        t = function(t) {
          for (var r = "", n = 0; ;) {
            var o = findRegex(c, t, n), a = o ? o.start : t.length;
            if (r += t.substring(n, a), !o) break;
            n = findEndValue(t, a);
          }
          return r;
        }(t = t.replace(p, "")).replace(f, "");
        for (var n = []; r < t.length; ) r = compileVar(t, n, r);
        return n;
      }
      function resolveValues(t) {
        var r = {};
        t.forEach((function(t) {
          t.declarations.forEach((function(t) {
            r[t.prop] = t.value;
          }));
        }));
        for (var n = {}, o = Object.entries(r), s = function(t) {
          var r = !1;
          if (o.forEach((function(t) {
            var o = t[0], a = executeTemplate(t[1], n);
            a !== n[o] && (n[o] = a, r = !0);
          })), !r) return "break";
        }, a = 0; a < 10 && "break" !== s(); a++) ;
        return n;
      }
      function getSelectors(r, n) {
        if (void 0 === n && (n = 0), !r.rules) return [];
        var o = [];
        return r.rules.filter((function(r) {
          return r.type === t.STYLE_RULE;
        })).forEach((function(t) {
          var r = function(t) {
            for (var r, n = []; r = d.exec(t.trim()); ) {
              var o = normalizeValue(r[2]), a = o.value, i = o.important;
              n.push({
                prop: r[1].trim(),
                value: compileTemplate(a),
                important: i
              });
            }
            return n;
          }(t.cssText);
          r.length > 0 && t.parsedSelector.split(",").forEach((function(t) {
            t = t.trim(), o.push({
              selector: t,
              declarations: r,
              specificity: 1,
              nu: n
            });
          })), n++;
        })), o;
      }
      var h = "!important", d = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gm;
      function normalizeValue(t) {
        var r = (t = t.replace(/\s+/gim, " ").trim()).endsWith(h);
        return r && (t = t.slice(0, t.length - h.length).trim()), {
          value: t,
          important: r
        };
      }
      function getSelectorsForScopes(t) {
        var r = [];
        return t.forEach((function(t) {
          r.push.apply(r, t.selectors);
        })), r;
      }
      function parseCSS(t) {
        var r = parse(t), n = compileTemplate(t);
        return {
          original: t,
          template: n,
          selectors: getSelectors(r),
          usesCssVars: n.length > 1
        };
      }
      function addGlobalStyle(t, r) {
        if (t.some((function(t) {
          return t.styleEl === r;
        }))) return !1;
        var n = parseCSS(r.textContent);
        return n.styleEl = r, t.push(n), !0;
      }
      function updateGlobalScopes(t) {
        var r = resolveValues(getSelectorsForScopes(t));
        t.forEach((function(t) {
          t.usesCssVars && (t.styleEl.textContent = executeTemplate(t.template, r));
        }));
      }
      function replaceScope(t, r, n) {
        return function(t, r, n) {
          return t.replace(new RegExp(r, "g"), n);
        }(t, "\\.".concat(r), ".".concat(n));
      }
      function loadDocument(t, r) {
        return loadDocumentStyles(t, r), function(t, r) {
          for (var n = [], o = t.querySelectorAll('link[rel="stylesheet"][href]:not([data-no-shim])'), a = 0; a < o.length; a++) n.push(addGlobalLink(t, r, o[a]));
          return Promise.all(n);
        }(t, r).then((function() {
          updateGlobalScopes(r);
        }));
      }
      function loadDocumentStyles(t, r) {
        return Array.from(t.querySelectorAll("style:not([data-styles]):not([data-no-shim])")).map((function(t) {
          return addGlobalStyle(r, t);
        })).some(Boolean);
      }
      function addGlobalLink(t, r, n) {
        var o = n.href;
        return fetch(o).then((function(t) {
          return t.text();
        })).then((function(a) {
          if (function(t) {
            return t.indexOf("var(") > -1 || m.test(t);
          }(a) && n.parentNode) {
            (function(t) {
              return v.lastIndex = 0, v.test(t);
            })(a) && (a = function(t, r) {
              var n = r.replace(/[^/]*$/, "");
              return t.replace(v, (function(t, r) {
                var o = n + r;
                return t.replace(r, o);
              }));
            }(a, o));
            var i = t.createElement("style");
            i.setAttribute("data-styles", ""), i.textContent = a, addGlobalStyle(r, i), n.parentNode.insertBefore(i, n), 
            n.remove();
          }
        })).catch((function(t) {
          console.error(t);
        }));
      }
      var m = /[\s;{]--[-a-zA-Z0-9]+\s*:/m;
      var v = /url[\s]*\([\s]*['"]?(?!(?:https?|data)\:|\/)([^\'\"\)]*)[\s]*['"]?\)[\s]*/gim;
      var S, g = function() {
        function e(t, r) {
          this.win = t, this.doc = r, this.count = 0, this.hostStyleMap = new WeakMap, this.hostScopeMap = new WeakMap, 
          this.globalScopes = [], this.scopesMap = new Map, this.didInit = !1;
        }
        return e.prototype.i = function() {
          var t = this;
          return this.didInit || !this.win.requestAnimationFrame ? Promise.resolve() : (this.didInit = !0, 
          new Promise((function(r) {
            t.win.requestAnimationFrame((function() {
              (function(t, r) {
                "undefined" != typeof MutationObserver && new MutationObserver((function() {
                  loadDocumentStyles(t, r) && updateGlobalScopes(r);
                })).observe(document.head, {
                  childList: !0
                });
              })(t.doc, t.globalScopes), loadDocument(t.doc, t.globalScopes).then((function() {
                return r();
              }));
            }));
          })));
        }, e.prototype.addLink = function(t) {
          var r = this;
          return addGlobalLink(this.doc, this.globalScopes, t).then((function() {
            r.updateGlobal();
          }));
        }, e.prototype.addGlobalStyle = function(t) {
          addGlobalStyle(this.globalScopes, t) && this.updateGlobal();
        }, e.prototype.createHostStyle = function(t, r, n, o) {
          if (this.hostScopeMap.has(t)) throw new Error("host style already created");
          var a = this.registerHostTemplate(n, r, o), i = this.doc.createElement("style");
          return i.setAttribute("data-no-shim", ""), a.usesCssVars ? o ? (i["s-sc"] = r = "".concat(a.scopeId, "-").concat(this.count), 
          i.textContent = "/*needs update*/", this.hostStyleMap.set(t, i), this.hostScopeMap.set(t, function(t, r) {
            var n = t.template.map((function(n) {
              return "string" == typeof n ? replaceScope(n, t.scopeId, r) : n;
            })), o = t.selectors.map((function(n) {
              return __assign(__assign({}, n), {
                selector: replaceScope(n.selector, t.scopeId, r)
              });
            }));
            return __assign(__assign({}, t), {
              template: n,
              selectors: o,
              scopeId: r
            });
          }(a, r)), this.count++) : (a.styleEl = i, a.usesCssVars || (i.textContent = executeTemplate(a.template, {})), 
          this.globalScopes.push(a), this.updateGlobal(), this.hostScopeMap.set(t, a)) : i.textContent = n, 
          i;
        }, e.prototype.removeHost = function(t) {
          var r = this.hostStyleMap.get(t);
          r && r.remove(), this.hostStyleMap.delete(t), this.hostScopeMap.delete(t);
        }, e.prototype.updateHost = function(t) {
          var r = this.hostScopeMap.get(t);
          if (r && r.usesCssVars && r.isScoped) {
            var n = this.hostStyleMap.get(t);
            if (n) {
              var o = resolveValues(function(t, r, n) {
                var o = [], a = function(t, r) {
                  for (var n = []; r; ) {
                    var o = t.get(r);
                    o && n.push(o), r = r.parentElement;
                  }
                  return n;
                }(r, t);
                return n.forEach((function(t) {
                  return o.push(t);
                })), a.forEach((function(t) {
                  return o.push(t);
                })), function(t) {
                  return t.sort((function(t, r) {
                    return t.specificity === r.specificity ? t.nu - r.nu : t.specificity - r.specificity;
                  })), t;
                }(getSelectorsForScopes(o).filter((function(r) {
                  return function(t, r) {
                    return ":root" === r || "html" === r || t.matches(r);
                  }(t, r.selector);
                })));
              }(t, this.hostScopeMap, this.globalScopes));
              n.textContent = executeTemplate(r.template, o);
            }
          }
        }, e.prototype.updateGlobal = function() {
          updateGlobalScopes(this.globalScopes);
        }, e.prototype.registerHostTemplate = function(t, r, n) {
          var o = this.scopesMap.get(r);
          return o || ((o = parseCSS(t)).scopeId = r, o.isScoped = n, this.scopesMap.set(r, o)), 
          o;
        }, e;
      }();
      !(S = "undefined" != typeof window && window) || S.__cssshim || S.CSS && S.CSS.supports && S.CSS.supports("color", "var(--c)") || (S.__cssshim = new g(S, S.document));
    }
  };
}));