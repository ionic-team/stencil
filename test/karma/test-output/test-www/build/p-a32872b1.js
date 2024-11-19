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
const e = "-shadowcsshost", t = "-shadowcssslotted", s = "-shadowcsscontext", r = ")(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)", c = new RegExp("(" + e + r, "gim"), o = new RegExp("(" + s + r, "gim"), n = new RegExp("(" + t + r, "gim"), l = e + "-no-combinator", i = /-shadowcsshost-no-combinator([^\s]*)/, a = [ /::shadow/g, /::content/g ], p = /-shadowcsshost/gim, h = /:host/gim, g = /::slotted/gim, u = /:host-context/gim, d = /\/\*\s*[\s\S]*?\*\//g, m = /\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g, f = /(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g, x = /([{}])/g, $ = /(^.*?[^\\])??((:+)(.*)|$)/, _ = "%BLOCK%", processRules = (e, t) => {
  const s = escapeBlocks(e);
  let r = 0;
  return s.escapedString.replace(f, ((...e) => {
    const c = e[2];
    let o = "", n = e[4], l = "";
    n && n.startsWith("{" + _) && (o = s.blocks[r++], n = n.substring(_.length + 1), 
    l = "{");
    const i = t({
      selector: c,
      content: o
    });
    return `${e[1]}${i.selector}${e[3]}${l}${i.content}${n}`;
  }));
}, escapeBlocks = e => {
  const t = e.split(x), s = [], r = [];
  let c = 0, o = [];
  for (let n = 0; n < t.length; n++) {
    const e = t[n];
    "}" === e && c--, c > 0 ? o.push(e) : (o.length > 0 && (r.push(o.join("")), s.push(_), 
    o = []), s.push(e)), "{" === e && c++;
  }
  o.length > 0 && (r.push(o.join("")), s.push(_));
  return {
    escapedString: s.join(""),
    blocks: r
  };
}, convertColonRule = (e, t, s) => e.replace(t, ((...e) => {
  if (e[2]) {
    const t = e[2].split(","), r = [];
    for (let c = 0; c < t.length; c++) {
      const o = t[c].trim();
      if (!o) break;
      r.push(s(l, o, e[3]));
    }
    return r.join(",");
  }
  return l + e[3];
})), colonHostPartReplacer = (t, s, r) => t + s.replace(e, "") + r, colonHostContextPartReplacer = (t, s, r) => s.indexOf(e) > -1 ? colonHostPartReplacer(t, s, r) : t + s + r + ", " + s + " " + t + r, selectorNeedsScoping = (e, t) => {
  const s = (e => (e = e.replace(/\[/g, "\\[").replace(/\]/g, "\\]"), new RegExp("^(" + e + ")([>\\s~+[.,{:][\\s\\S]*)?$", "m")))(t);
  return !s.test(e);
}, injectScopingSelector = (e, t) => e.replace($, ((e, s = "", r, c = "", o = "") => s + t + c + o)), applyStrictSelectorScope = (e, t, s) => {
  const r = "." + (t = t.replace(/\[is=([^\]]*)\]/g, ((e, ...t) => t[0]))), _scopeSelectorPart = e => {
    let c = e.trim();
    if (!c) return "";
    if (e.indexOf(l) > -1) c = ((e, t, s) => {
      if (
      // In Android browser, the lastIndex is not reset when the regex is used in String.replace()
      p.lastIndex = 0, p.test(e)) {
        const t = `.${s}`;
        return e.replace(i, ((e, s) => injectScopingSelector(s, t))).replace(p, t + " ");
      }
      return t + " " + e;
    })(e, t, s); else {
      // remove :host since it should be unnecessary
      const t = e.replace(p, "");
      t.length > 0 && (c = injectScopingSelector(t, r));
    }
    return c;
  }, c = (e => {
    const t = [];
    let s = 0;
    // Replaces attribute selectors with placeholders.
    // The WS in [attr="va lue"] would otherwise be interpreted as a selector separator.
        return {
      content: (e = e.replace(/(\[[^\]]*\])/g, ((e, r) => {
        const c = `__ph-${s}__`;
        return t.push(r), s++, c;
      }))).replace(/(:nth-[-\w]+)(\([^)]+\))/g, ((e, r, c) => {
        const o = `__ph-${s}__`;
        return t.push(c), s++, r + o;
      })),
      placeholders: t
    };
  })(e);
  let o, n = "", a = 0;
  const h = /( |>|\+|~(?!=))\s*/g;
  // If a selector appears before :host it should not be shimmed as it
  // matches on ancestor elements and not on elements in the host's shadow
  // `:host-context(div)` is transformed to
  // `-shadowcsshost-no-combinatordiv, div -shadowcsshost-no-combinator`
  // the `div` is not part of the component in the 2nd selectors and should not be scoped.
  // Historically `component-tag:host` was matching the component so we also want to preserve
  // this behavior to avoid breaking legacy apps (it should not match).
  // The behavior should be:
  // - `tag:host` -> `tag[h]` (this is to avoid breaking legacy apps, should not match anything)
  // - `tag :host` -> `tag [h]` (`tag` is not scoped because it's considered part of a
  //   `:host-context(tag)`)
    // Only scope parts after the first `-shadowcsshost-no-combinator` when it is present
  let g = !((e = c.content).indexOf(l) > -1);
  for (;null !== (o = h.exec(e)); ) {
    const t = o[1], s = e.slice(a, o.index).trim();
    g = g || s.indexOf(l) > -1;
    n += `${g ? _scopeSelectorPart(s) : s} ${t} `, a = h.lastIndex;
  }
  const u = e.substring(a);
  // replace the placeholders with their original values
  return g = g || u.indexOf(l) > -1, n += g ? _scopeSelectorPart(u) : u, d = c.placeholders, 
  n.replace(/__ph-(\d+)__/g, ((e, t) => d[+t]));
  var d;
}, scopeSelectors = (e, t, s, r, c) => processRules(e, (e => {
  let c = e.selector, o = e.content;
  "@" !== e.selector[0] ? c = ((e, t, s, r) => e.split(",").map((e => r && e.indexOf("." + r) > -1 ? e.trim() : selectorNeedsScoping(e, t) ? applyStrictSelectorScope(e, t, s).trim() : e.trim())).join(", "))(e.selector, t, s, r) : (e.selector.startsWith("@media") || e.selector.startsWith("@supports") || e.selector.startsWith("@page") || e.selector.startsWith("@document")) && (o = scopeSelectors(e.content, t, s, r));
  return {
    selector: c.replace(/\s{2,}/g, " ").trim(),
    content: o
  };
})), scopeCssText = (r, i, p, d, m) => {
  const f = ((e, t) => {
    const s = "." + t + " > ", r = [];
    return e = e.replace(n, ((...e) => {
      if (e[2]) {
        const t = e[2].trim(), c = e[3], o = s + t + c;
        let n = "";
        for (let s = e[4] - 1; s >= 0; s--) {
          const t = e[5][s];
          if ("}" === t || "," === t) break;
          n = t + n;
        }
        const l = n + o, i = `${n.trimRight()}${o.trim()}`;
        if (l.trim() !== i.trim()) {
          const e = `${i}, ${l}`;
          r.push({
            orgSelector: l,
            updatedSelector: e
          });
        }
        return o;
      }
      return l + e[3];
    })), {
      selectors: r,
      cssText: e
    };
  })(r = (e => convertColonRule(e, o, colonHostContextPartReplacer))(r = (e => convertColonRule(e, c, colonHostPartReplacer))(r = r.replace(u, s).replace(h, e).replace(g, t))), d);
  return r = (e => a.reduce(((e, t) => e.replace(t, " ")), e))(r = f.cssText), i && (r = scopeSelectors(r, i, p, d)), 
  {
    cssText: (r = (r = r.replace(/-shadowcsshost-no-combinator/g, `.${p}`)).replace(/>\s*\*\s+([^{, ]+)/gm, " $1 ")).trim(),
    slottedSelectors: f.selectors
  };
}, scopeCss = (e, t, s) => {
  const r = t + "-h", c = t + "-s", o = e.match(m) || [];
  e = (e => e.replace(d, ""))(e);
  const n = [];
  if (s) {
    const processCommentedSelector = e => {
      const t = `/*!@___${n.length}___*/`, s = `/*!@${e.selector}*/`;
      return n.push({
        placeholder: t,
        comment: s
      }), e.selector = t + e.selector, e;
    };
    e = processRules(e, (e => "@" !== e.selector[0] ? processCommentedSelector(e) : e.selector.startsWith("@media") || e.selector.startsWith("@supports") || e.selector.startsWith("@page") || e.selector.startsWith("@document") ? (e.content = processRules(e.content, processCommentedSelector), 
    e) : e));
  }
  const l = scopeCssText(e, t, r, c);
  return e = [ l.cssText, ...o ].join("\n"), s && n.forEach((({placeholder: t, comment: s}) => {
    e = e.replace(t, s);
  })), l.slottedSelectors.forEach((t => {
    e = e.replace(t.orgSelector, t.updatedSelector);
  })), e;
};

export { scopeCss }