var __spreadArray = this && this.__spreadArray || function(t, e, r) {
  if (r || 2 === arguments.length) for (var n, c = 0, o = e.length; c < o; c++) !n && c in e || (n || (n = Array.prototype.slice.call(e, 0, c)), 
  n[c] = e[c]);
  return t.concat(n || Array.prototype.slice.call(e));
};

System.register([], (function(t) {
  "use strict";
  return {
    execute: function() {
      /*
       Stencil Client Platform v2.23.2 | MIT Licensed | https://stenciljs.com
       */
      /**
       * @license
       * Copyright Google Inc. All Rights Reserved.
       *
       * Use of this source code is governed by an MIT-style license that can be
       * found in the LICENSE file at https://angular.io/license
       *
       * This file is a port of shadowCSS from webcomponents.js to TypeScript.
       * https://github.com/webcomponents/webcomponentsjs/blob/4efecd7e0e/src/ShadowCSS/ShadowCSS.js
       * https://github.com/angular/angular/blob/master/packages/compiler/src/shadow_css.ts
       */
      var e = "-shadowcsshost", r = "-shadowcssslotted", n = "-shadowcsscontext", c = ")(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)", o = new RegExp("(" + e + c, "gim"), s = new RegExp("(" + n + c, "gim"), a = new RegExp("(" + r + c, "gim"), i = e + "-no-combinator", u = /-shadowcsshost-no-combinator([^\s]*)/, l = [ /::shadow/g, /::content/g ], p = /-shadowcsshost/gim, f = /:host/gim, h = /::slotted/gim, g = /:host-context/gim, d = /\/\*\s*[\s\S]*?\*\//g, v = /\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g, m = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g, _ = /([{}])/g, x = /(^.*?[^\\])??((:+)(.*)|$)/, w = "%BLOCK%", processRules = function(t, e) {
        var r = escapeBlocks(t), n = 0;
        return r.escapedString.replace(m, (function() {
          for (var t = [], c = 0; c < arguments.length; c++) t[c] = arguments[c];
          var o = t[2], s = "", a = t[4], i = "";
          a && a.startsWith("{" + w) && (s = r.blocks[n++], a = a.substring(w.length + 1), 
          i = "{");
          var u = {
            selector: o,
            content: s
          }, l = e(u);
          return "".concat(t[1]).concat(l.selector).concat(t[3]).concat(i).concat(l.content).concat(a);
        }));
      }, escapeBlocks = function(t) {
        for (var e = t.split(_), r = [], n = [], c = 0, o = [], s = 0; s < e.length; s++) {
          var a = e[s];
          "}" === a && c--, c > 0 ? o.push(a) : (o.length > 0 && (n.push(o.join("")), r.push(w), 
          o = []), r.push(a)), "{" === a && c++;
        }
        return o.length > 0 && (n.push(o.join("")), r.push(w)), {
          escapedString: r.join(""),
          blocks: n
        };
      }, convertColonRule = function(t, e, r) {
        // m[1] = :host(-context), m[2] = contents of (), m[3] rest of rule
        return t.replace(e, (function() {
          for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
          if (t[2]) {
            for (var n = t[2].split(","), c = [], o = 0; o < n.length; o++) {
              var s = n[o].trim();
              if (!s) break;
              c.push(r(i, s, t[3]));
            }
            return c.join(",");
          }
          return i + t[3];
        }));
      }, colonHostPartReplacer = function(t, r, n) {
        return t + r.replace(e, "") + n;
      }, colonHostContextPartReplacer = function(t, r, n) {
        return r.indexOf(e) > -1 ? colonHostPartReplacer(t, r, n) : t + r + n + ", " + r + " " + t + n;
      }, selectorNeedsScoping = function(t, e) {
        var r = function(t) {
          return t = t.replace(/\[/g, "\\[").replace(/\]/g, "\\]"), new RegExp("^(" + t + ")([>\\s~+[.,{:][\\s\\S]*)?$", "m");
        }(e);
        return !r.test(t);
      }, injectScopingSelector = function(t, e) {
        return t.replace(x, (function(t, r, n, c, o) {
          return void 0 === r && (r = ""), void 0 === c && (c = ""), void 0 === o && (o = ""), 
          r + e + c + o;
        }));
      }, applyStrictSelectorScope = function(t, e, r) {
        e = e.replace(/\[is=([^\]]*)\]/g, (function(t) {
          for (var e = [], r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
          return e[0];
        }));
        for (var n, c = "." + e, _scopeSelectorPart = function(t) {
          var n = t.trim();
          if (!n) return "";
          if (t.indexOf(i) > -1) n = function(t, e, r) {
            if (
            // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
            p.lastIndex = 0, p.test(t)) {
              var n = ".".concat(r);
              return t.replace(u, (function(t, e) {
                return injectScopingSelector(e, n);
              })).replace(p, n + " ");
            }
            return e + " " + t;
          }(t, e, r); else {
            // remove :host since it should be unnecessary
            var o = t.replace(p, "");
            o.length > 0 && (n = injectScopingSelector(o, c));
          }
          return n;
        }, o = function(t) {
          var e = [], r = 0;
          return {
            content: (
            // Replaces attribute selectors with placeholders.
            // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
            t = t.replace(/(\[[^\]]*\])/g, (function(t, n) {
              var c = "__ph-".concat(r, "__");
              return e.push(n), r++, c;
            }))).replace(/(:nth-[-\w]+)(\([^)]+\))/g, (function(t, n, c) {
              var o = "__ph-".concat(r, "__");
              return e.push(c), r++, n + o;
            })),
            placeholders: e
          };
        }(t), s = "", a = 0, l = /( |>|\+|~(?!=))\s*/g, f = !((t = o.content).indexOf(i) > -1); null !== (n = l.exec(t)); ) {
          var h = n[1], g = t.slice(a, n.index).trim(), d = (f = f || g.indexOf(i) > -1) ? _scopeSelectorPart(g) : g;
          s += "".concat(d, " ").concat(h, " "), a = l.lastIndex;
        }
        var v, m = t.substring(a);
        // replace the placeholders with their original values
        return s += (f = f || m.indexOf(i) > -1) ? _scopeSelectorPart(m) : m, v = o.placeholders, 
        s.replace(/__ph-(\d+)__/g, (function(t, e) {
          return v[+e];
        }));
      }, scopeSelectors = function(t, e, r, n, c) {
        return processRules(t, (function(t) {
          var c = t.selector, o = t.content;
          return "@" !== t.selector[0] ? c = function(t, e, r, n) {
            return t.split(",").map((function(t) {
              return n && t.indexOf("." + n) > -1 ? t.trim() : selectorNeedsScoping(t, e) ? applyStrictSelectorScope(t, e, r).trim() : t.trim();
            })).join(", ");
          }(t.selector, e, r, n) : (t.selector.startsWith("@media") || t.selector.startsWith("@supports") || t.selector.startsWith("@page") || t.selector.startsWith("@document")) && (o = scopeSelectors(t.content, e, r, n)), 
          {
            selector: c.replace(/\s{2,}/g, " ").trim(),
            content: o
          };
        }));
      }, scopeCssText = function(t, c, u, p, d) {
        var v = function(t, e) {
          var r = "." + e + " > ", n = [];
          return t = t.replace(a, (function() {
            for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
            if (t[2]) {
              for (var c = t[2].trim(), o = t[3], s = r + c + o, a = "", u = t[4] - 1; u >= 0; u--) {
                var l = t[5][u];
                if ("}" === l || "," === l) break;
                a = l + a;
              }
              var p = a + s, f = "".concat(a.trimRight()).concat(s.trim());
              if (p.trim() !== f.trim()) {
                var h = "".concat(f, ", ").concat(p);
                n.push({
                  orgSelector: p,
                  updatedSelector: h
                });
              }
              return s;
            }
            return i + t[3];
          })), {
            selectors: n,
            cssText: t
          };
        }(t = function(t) {
          return convertColonRule(t, s, colonHostContextPartReplacer);
        }(t = function(t) {
          return convertColonRule(t, o, colonHostPartReplacer);
        }(t = t.replace(g, n).replace(f, e).replace(h, r))), p);
        return t = function(t) {
          return l.reduce((function(t, e) {
            return t.replace(e, " ");
          }), t);
        }(t = v.cssText), c && (t = scopeSelectors(t, c, u, p)), {
          cssText: (t = (t = t.replace(/-shadowcsshost-no-combinator/g, ".".concat(u))).replace(/>\s*\*\s+([^{, ]+)/gm, " $1 ")).trim(),
          slottedSelectors: v.selectors
        };
      };
      t("scopeCss", (function(t, e, r) {
        var n = e + "-h", c = e + "-s", o = t.match(v) || [];
        t = function(t) {
          return t.replace(d, "");
        }(t);
        var s = [];
        if (r) {
          var processCommentedSelector_1 = function(t) {
            var e = "/*!@___".concat(s.length, "___*/"), r = "/*!@".concat(t.selector, "*/");
            return s.push({
              placeholder: e,
              comment: r
            }), t.selector = e + t.selector, t;
          };
          t = processRules(t, (function(t) {
            return "@" !== t.selector[0] ? processCommentedSelector_1(t) : t.selector.startsWith("@media") || t.selector.startsWith("@supports") || t.selector.startsWith("@page") || t.selector.startsWith("@document") ? (t.content = processRules(t.content, processCommentedSelector_1), 
            t) : t;
          }));
        }
        var a = scopeCssText(t, e, n, c);
        return t = __spreadArray([ a.cssText ], o, !0).join("\n"), r && s.forEach((function(e) {
          var r = e.placeholder, n = e.comment;
          t = t.replace(r, n);
        })), a.slottedSelectors.forEach((function(e) {
          t = t.replace(e.orgSelector, e.updatedSelector);
        })), t;
      }));
    }
  };
}));