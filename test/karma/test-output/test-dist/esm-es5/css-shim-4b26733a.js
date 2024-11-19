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
  return parseCss(lex(t = clean(t)), t);
}

function clean(t) {
  return t.replace(RX.comments, "").replace(RX.port, "");
}

function lex(t) {
  var r = new StyleNode;
  r.start = 0, r.end = t.length;
  for (var n = r, o = 0, a = t.length; o < a; o++) if (t[o] === OPEN_BRACE) {
    n.rules || (n.rules = []);
    var i = n, l = i.rules[i.rules.length - 1] || null;
    (n = new StyleNode).start = o + 1, n.parent = i, n.previous = l, i.rules.push(n);
  } else t[o] === CLOSE_BRACE && (n.end = o + 1, n = n.parent || r);
  return r;
}

function parseCss(t, r) {
  var n = r.substring(t.start, t.end - 1);
  if (t.parsedCssText = t.cssText = n.trim(), t.parent) {
    var o = t.previous ? t.previous.end : t.parent.start;
    n = (n = (n = _expandUnicodeEscapes(n = r.substring(o, t.start - 1))).replace(RX.multipleSpaces, " ")).substring(n.lastIndexOf(";") + 1);
    var a = t.parsedSelector = t.selector = n.trim();
    t.atRule = 0 === a.indexOf(AT_START), t.atRule ? 0 === a.indexOf(MEDIA_START) ? t.type = types.MEDIA_RULE : a.match(RX.keyframesRule) && (t.type = types.KEYFRAMES_RULE, 
    t.keyframesName = t.selector.split(RX.multipleSpaces).pop()) : 0 === a.indexOf(VAR_START) ? t.type = types.MIXIN_RULE : t.type = types.STYLE_RULE;
  }
  var i = t.rules;
  if (i) for (var l = 0, c = i.length, u = void 0; l < c && (u = i[l]); l++) parseCss(u, r);
  return t;
}

function _expandUnicodeEscapes(t) {
  return t.replace(/\\([0-9a-f]{1,6})\s/gi, (function() {
    for (var t = arguments[1], r = 6 - t.length; r--; ) t = "0" + t;
    return "\\" + t;
  }));
}

var types = {
  STYLE_RULE: 1,
  KEYFRAMES_RULE: 7,
  MEDIA_RULE: 4,
  MIXIN_RULE: 1e3
}, OPEN_BRACE = "{", CLOSE_BRACE = "}", RX = {
  comments: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,
  port: /@import[^;]*;/gim,
  customProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,
  mixinProp: /(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,
  mixinApply: /@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,
  varApply: /[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,
  keyframesRule: /^@[^\s]*keyframes/,
  multipleSpaces: /\s+/g
}, VAR_START = "--", MEDIA_START = "@media", AT_START = "@", VAR_USAGE_START = /\bvar\(/, VAR_ASSIGN_START = /\B--[\w-]+\s*:/, COMMENTS = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim, TRAILING_LINES = /^[\t ]+\n/gm;

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

function resolveVar(t, r, n) {
  return t[r] ? t[r] : n ? executeTemplate(n, t) : "";
}

function findVarEndIndex(t, r) {
  for (var n = 0, o = r; o < t.length; o++) {
    var a = t[o];
    if ("(" === a) n++; else if (")" === a && --n <= 0) return o + 1;
  }
  return o;
}

function parseVar(t, r) {
  var n = findRegex(VAR_USAGE_START, t, r);
  if (!n) return null;
  var o = findVarEndIndex(t, n.start), a = t.substring(n.end, o - 1).split(","), i = a[0], l = a.slice(1);
  return {
    start: n.start,
    end: o,
    propName: i.trim(),
    fallback: l.length > 0 ? l.join(",").trim() : void 0
  };
}

function compileVar(t, r, n) {
  var o = parseVar(t, n);
  if (!o) return r.push(t.substring(n, t.length)), t.length;
  var a = o.propName, i = null != o.fallback ? compileTemplate(o.fallback) : void 0;
  return r.push(t.substring(n, o.start), (function(t) {
    return resolveVar(t, a, i);
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

function removeCustomAssigns(t) {
  for (var r = "", n = 0; ;) {
    var o = findRegex(VAR_ASSIGN_START, t, n), a = o ? o.start : t.length;
    if (r += t.substring(n, a), !o) break;
    n = findEndValue(t, a);
  }
  return r;
}

function compileTemplate(t) {
  var r = 0;
  t = removeCustomAssigns(t = t.replace(COMMENTS, "")).replace(TRAILING_LINES, "");
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

function getSelectors(t, r) {
  if (void 0 === r && (r = 0), !t.rules) return [];
  var n = [];
  return t.rules.filter((function(t) {
    return t.type === types.STYLE_RULE;
  })).forEach((function(t) {
    var o = getDeclarations(t.cssText);
    o.length > 0 && t.parsedSelector.split(",").forEach((function(t) {
      t = t.trim(), n.push({
        selector: t,
        declarations: o,
        specificity: computeSpecificity(),
        nu: r
      });
    })), r++;
  })), n;
}

function computeSpecificity(t) {
  return 1;
}

var IMPORTANT = "!important", FIND_DECLARATIONS = /(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gm;

function getDeclarations(t) {
  for (var r, n = []; r = FIND_DECLARATIONS.exec(t.trim()); ) {
    var o = normalizeValue(r[2]), a = o.value, i = o.important;
    n.push({
      prop: r[1].trim(),
      value: compileTemplate(a),
      important: i
    });
  }
  return n;
}

function normalizeValue(t) {
  var r = (t = t.replace(/\s+/gim, " ").trim()).endsWith(IMPORTANT);
  return r && (t = t.slice(0, t.length - IMPORTANT.length).trim()), {
    value: t,
    important: r
  };
}

function getActiveSelectors(t, r, n) {
  var o = [], a = getScopesForElement(r, t);
  return n.forEach((function(t) {
    return o.push(t);
  })), a.forEach((function(t) {
    return o.push(t);
  })), sortSelectors(getSelectorsForScopes(o).filter((function(r) {
    return matches(t, r.selector);
  })));
}

function getScopesForElement(t, r) {
  for (var n = []; r; ) {
    var o = t.get(r);
    o && n.push(o), r = r.parentElement;
  }
  return n;
}

function getSelectorsForScopes(t) {
  var r = [];
  return t.forEach((function(t) {
    r.push.apply(r, t.selectors);
  })), r;
}

function sortSelectors(t) {
  return t.sort((function(t, r) {
    return t.specificity === r.specificity ? t.nu - r.nu : t.specificity - r.specificity;
  })), t;
}

function matches(t, r) {
  return ":root" === r || "html" === r || t.matches(r);
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

function reScope(t, r) {
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
}

function replaceScope(t, r, n) {
  return replaceAll(t, "\\.".concat(r), ".".concat(n));
}

function replaceAll(t, r, n) {
  return t.replace(new RegExp(r, "g"), n);
}

function loadDocument(t, r) {
  return loadDocumentStyles(t, r), loadDocumentLinks(t, r).then((function() {
    updateGlobalScopes(r);
  }));
}

function startWatcher(t, r) {
  "undefined" != typeof MutationObserver && new MutationObserver((function() {
    loadDocumentStyles(t, r) && updateGlobalScopes(r);
  })).observe(document.head, {
    childList: !0
  });
}

function loadDocumentLinks(t, r) {
  for (var n = [], o = t.querySelectorAll('link[rel="stylesheet"][href]:not([data-no-shim])'), a = 0; a < o.length; a++) n.push(addGlobalLink(t, r, o[a]));
  return Promise.all(n);
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
    if (hasCssVariables(a) && n.parentNode) {
      hasRelativeUrls(a) && (a = fixRelativeUrls(a, o));
      var i = t.createElement("style");
      i.setAttribute("data-styles", ""), i.textContent = a, addGlobalStyle(r, i), n.parentNode.insertBefore(i, n), 
      n.remove();
    }
  })).catch((function(t) {
    console.error(t);
  }));
}

var CSS_VARIABLE_REGEXP = /[\s;{]--[-a-zA-Z0-9]+\s*:/m;

function hasCssVariables(t) {
  return t.indexOf("var(") > -1 || CSS_VARIABLE_REGEXP.test(t);
}

var CSS_URL_REGEXP = /url[\s]*\([\s]*['"]?(?!(?:https?|data)\:|\/)([^\'\"\)]*)[\s]*['"]?\)[\s]*/gim;

function hasRelativeUrls(t) {
  return CSS_URL_REGEXP.lastIndex = 0, CSS_URL_REGEXP.test(t);
}

function fixRelativeUrls(t, r) {
  var n = r.replace(/[^/]*$/, "");
  return t.replace(CSS_URL_REGEXP, (function(t, r) {
    var o = n + r;
    return t.replace(r, o);
  }));
}

var CustomStyle = function() {
  function e(t, r) {
    this.win = t, this.doc = r, this.count = 0, this.hostStyleMap = new WeakMap, this.hostScopeMap = new WeakMap, 
    this.globalScopes = [], this.scopesMap = new Map, this.didInit = !1;
  }
  return e.prototype.i = function() {
    var t = this;
    return this.didInit || !this.win.requestAnimationFrame ? Promise.resolve() : (this.didInit = !0, 
    new Promise((function(r) {
      t.win.requestAnimationFrame((function() {
        startWatcher(t.doc, t.globalScopes), loadDocument(t.doc, t.globalScopes).then((function() {
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
    i.textContent = "/*needs update*/", this.hostStyleMap.set(t, i), this.hostScopeMap.set(t, reScope(a, r)), 
    this.count++) : (a.styleEl = i, a.usesCssVars || (i.textContent = executeTemplate(a.template, {})), 
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
        var o = resolveValues(getActiveSelectors(t, this.hostScopeMap, this.globalScopes));
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

!function(t) {
  !t || t.__cssshim || t.CSS && t.CSS.supports && t.CSS.supports("color", "var(--c)") || (t.__cssshim = new CustomStyle(t, t.document));
}("undefined" != typeof window && window);