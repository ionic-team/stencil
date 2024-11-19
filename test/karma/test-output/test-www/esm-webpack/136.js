(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[136],{

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scopeCss", function() { return scopeCss; });
var __spreadArray = undefined && undefined.__spreadArray || function(e, t, o) {
  if (o || 2 === arguments.length) for (var r, n = 0, c = t.length; n < c; n++) !r && n in t || (r || (r = Array.prototype.slice.call(t, 0, n)), 
  r[n] = t[n]);
  return e.concat(r || Array.prototype.slice.call(t));
}, safeSelector = function(e) {
  var t = [], o = 0;
  return {
    content: (
    // Replaces attribute selectors with placeholders.
    // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
    e = e.replace(/(\[[^\]]*\])/g, (function(e, r) {
      var n = "__ph-".concat(o, "__");
      return t.push(r), o++, n;
    }))).replace(/(:nth-[-\w]+)(\([^)]+\))/g, (function(e, r, n) {
      var c = "__ph-".concat(o, "__");
      return t.push(n), o++, r + c;
    })),
    placeholders: t
  };
}, restoreSafeSelector = function(e, t) {
  return t.replace(/__ph-(\d+)__/g, (function(t, o) {
    return e[+o];
  }));
}, _polyfillHost = "-shadowcsshost", _polyfillSlotted = "-shadowcssslotted", _polyfillHostContext = "-shadowcsscontext", _parenSuffix = ")(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)", _cssColonHostRe = new RegExp("(" + _polyfillHost + _parenSuffix, "gim"), _cssColonHostContextRe = new RegExp("(" + _polyfillHostContext + _parenSuffix, "gim"), _cssColonSlottedRe = new RegExp("(" + _polyfillSlotted + _parenSuffix, "gim"), _polyfillHostNoCombinator = _polyfillHost + "-no-combinator", _polyfillHostNoCombinatorRe = /-shadowcsshost-no-combinator([^\s]*)/, _shadowDOMSelectorsRe = [ /::shadow/g, /::content/g ], _selectorReSuffix = "([>\\s~+[.,{:][\\s\\S]*)?$", _polyfillHostRe = /-shadowcsshost/gim, _colonHostRe = /:host/gim, _colonSlottedRe = /::slotted/gim, _colonHostContextRe = /:host-context/gim, _commentRe = /\/\*\s*[\s\S]*?\*\//g, stripComments = function(e) {
  return e.replace(_commentRe, "");
}, _commentWithHashRe = /\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g, extractCommentsWithHash = function(e) {
  return e.match(_commentWithHashRe) || [];
}, _ruleRe = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g, _curlyRe = /([{}])/g, _selectorPartsRe = /(^.*?[^\\])??((:+)(.*)|$)/, OPEN_CURLY = "{", CLOSE_CURLY = "}", BLOCK_PLACEHOLDER = "%BLOCK%", processRules = function(e, t) {
  var o = escapeBlocks(e), r = 0;
  return o.escapedString.replace(_ruleRe, (function() {
    for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
    var c = e[2], s = "", l = e[4], i = "";
    l && l.startsWith("{" + BLOCK_PLACEHOLDER) && (s = o.blocks[r++], l = l.substring(BLOCK_PLACEHOLDER.length + 1), 
    i = "{");
    var a = {
      selector: c,
      content: s
    }, p = t(a);
    return "".concat(e[1]).concat(p.selector).concat(e[3]).concat(i).concat(p.content).concat(l);
  }));
}, escapeBlocks = function(e) {
  for (var t = e.split(_curlyRe), o = [], r = [], n = 0, c = [], s = 0; s < t.length; s++) {
    var l = t[s];
    l === CLOSE_CURLY && n--, n > 0 ? c.push(l) : (c.length > 0 && (r.push(c.join("")), 
    o.push(BLOCK_PLACEHOLDER), c = []), o.push(l)), l === OPEN_CURLY && n++;
  }
  return c.length > 0 && (r.push(c.join("")), o.push(BLOCK_PLACEHOLDER)), {
    escapedString: o.join(""),
    blocks: r
  };
}, insertPolyfillHostInCssText = function(e) {
  return e = e.replace(_colonHostContextRe, _polyfillHostContext).replace(_colonHostRe, _polyfillHost).replace(_colonSlottedRe, _polyfillSlotted);
}, convertColonRule = function(e, t, o) {
  // m[1] = :host(-context), m[2] = contents of (), m[3] rest of rule
  return e.replace(t, (function() {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    if (e[2]) {
      for (var r = e[2].split(","), n = [], c = 0; c < r.length; c++) {
        var s = r[c].trim();
        if (!s) break;
        n.push(o(_polyfillHostNoCombinator, s, e[3]));
      }
      return n.join(",");
    }
    return _polyfillHostNoCombinator + e[3];
  }));
}, colonHostPartReplacer = function(e, t, o) {
  return e + t.replace(_polyfillHost, "") + o;
}, convertColonHost = function(e) {
  return convertColonRule(e, _cssColonHostRe, colonHostPartReplacer);
}, colonHostContextPartReplacer = function(e, t, o) {
  return t.indexOf(_polyfillHost) > -1 ? colonHostPartReplacer(e, t, o) : e + t + o + ", " + t + " " + e + o;
}, convertColonSlotted = function(e, t) {
  var o = "." + t + " > ", r = [];
  return e = e.replace(_cssColonSlottedRe, (function() {
    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
    if (e[2]) {
      for (var n = e[2].trim(), c = e[3], s = o + n + c, l = "", i = e[4] - 1; i >= 0; i--) {
        var a = e[5][i];
        if ("}" === a || "," === a) break;
        l = a + l;
      }
      var p = l + s, u = "".concat(l.trimRight()).concat(s.trim());
      if (p.trim() !== u.trim()) {
        var f = "".concat(u, ", ").concat(p);
        r.push({
          orgSelector: p,
          updatedSelector: f
        });
      }
      return s;
    }
    return _polyfillHostNoCombinator + e[3];
  })), {
    selectors: r,
    cssText: e
  };
}, convertColonHostContext = function(e) {
  return convertColonRule(e, _cssColonHostContextRe, colonHostContextPartReplacer);
}, convertShadowDOMSelectors = function(e) {
  return _shadowDOMSelectorsRe.reduce((function(e, t) {
    return e.replace(t, " ");
  }), e);
}, makeScopeMatcher = function(e) {
  return e = e.replace(/\[/g, "\\[").replace(/\]/g, "\\]"), new RegExp("^(" + e + ")" + _selectorReSuffix, "m");
}, selectorNeedsScoping = function(e, t) {
  return !makeScopeMatcher(t).test(e);
}, injectScopingSelector = function(e, t) {
  return e.replace(_selectorPartsRe, (function(e, o, r, n, c) {
    return void 0 === o && (o = ""), void 0 === n && (n = ""), void 0 === c && (c = ""), 
    o + t + n + c;
  }));
}, applySimpleSelectorScope = function(e, t, o) {
  if (
  // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
  _polyfillHostRe.lastIndex = 0, _polyfillHostRe.test(e)) {
    var r = ".".concat(o);
    return e.replace(_polyfillHostNoCombinatorRe, (function(e, t) {
      return injectScopingSelector(t, r);
    })).replace(_polyfillHostRe, r + " ");
  }
  return t + " " + e;
}, applyStrictSelectorScope = function(e, t, o) {
  t = t.replace(/\[is=([^\]]*)\]/g, (function(e) {
    for (var t = [], o = 1; o < arguments.length; o++) t[o - 1] = arguments[o];
    return t[0];
  }));
  for (var r, n = "." + t, _scopeSelectorPart = function(e) {
    var r = e.trim();
    if (!r) return "";
    if (e.indexOf(_polyfillHostNoCombinator) > -1) r = applySimpleSelectorScope(e, t, o); else {
      // remove :host since it should be unnecessary
      var c = e.replace(_polyfillHostRe, "");
      c.length > 0 && (r = injectScopingSelector(c, n));
    }
    return r;
  }, c = safeSelector(e), s = "", l = 0, i = /( |>|\+|~(?!=))\s*/g, a = !((e = c.content).indexOf(_polyfillHostNoCombinator) > -1); null !== (r = i.exec(e)); ) {
    var p = r[1], u = e.slice(l, r.index).trim(), f = (a = a || u.indexOf(_polyfillHostNoCombinator) > -1) ? _scopeSelectorPart(u) : u;
    s += "".concat(f, " ").concat(p, " "), l = i.lastIndex;
  }
  var _ = e.substring(l);
  // replace the placeholders with their original values
  return s += (a = a || _.indexOf(_polyfillHostNoCombinator) > -1) ? _scopeSelectorPart(_) : _, 
  restoreSafeSelector(c.placeholders, s);
}, scopeSelector = function(e, t, o, r) {
  return e.split(",").map((function(e) {
    return r && e.indexOf("." + r) > -1 ? e.trim() : selectorNeedsScoping(e, t) ? applyStrictSelectorScope(e, t, o).trim() : e.trim();
  })).join(", ");
}, scopeSelectors = function(e, t, o, r, n) {
  return processRules(e, (function(e) {
    var n = e.selector, c = e.content;
    return "@" !== e.selector[0] ? n = scopeSelector(e.selector, t, o, r) : (e.selector.startsWith("@media") || e.selector.startsWith("@supports") || e.selector.startsWith("@page") || e.selector.startsWith("@document")) && (c = scopeSelectors(e.content, t, o, r)), 
    {
      selector: n.replace(/\s{2,}/g, " ").trim(),
      content: c
    };
  }));
}, scopeCssText = function(e, t, o, r, n) {
  e = insertPolyfillHostInCssText(e), e = convertColonHost(e), e = convertColonHostContext(e);
  var c = convertColonSlotted(e, r);
  return e = c.cssText, e = convertShadowDOMSelectors(e), t && (e = scopeSelectors(e, t, o, r)), 
  {
    cssText: (e = (e = e.replace(/-shadowcsshost-no-combinator/g, ".".concat(o))).replace(/>\s*\*\s+([^{, ]+)/gm, " $1 ")).trim(),
    slottedSelectors: c.selectors
  };
}, scopeCss = function(e, t, o) {
  var r = t + "-h", n = t + "-s", c = extractCommentsWithHash(e);
  e = stripComments(e);
  var s = [];
  if (o) {
    var processCommentedSelector_1 = function(e) {
      var t = "/*!@___".concat(s.length, "___*/"), o = "/*!@".concat(e.selector, "*/");
      return s.push({
        placeholder: t,
        comment: o
      }), e.selector = t + e.selector, e;
    };
    e = processRules(e, (function(e) {
      return "@" !== e.selector[0] ? processCommentedSelector_1(e) : e.selector.startsWith("@media") || e.selector.startsWith("@supports") || e.selector.startsWith("@page") || e.selector.startsWith("@document") ? (e.content = processRules(e.content, processCommentedSelector_1), 
      e) : e;
    }));
  }
  var l = scopeCssText(e, t, r, n);
  return e = __spreadArray([ l.cssText ], c, !0).join("\n"), o && s.forEach((function(t) {
    var o = t.placeholder, r = t.comment;
    e = e.replace(o, r);
  })), l.slottedSelectors.forEach((function(t) {
    e = e.replace(t.orgSelector, t.updatedSelector);
  })), e;
};

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

/***/ })

}]);