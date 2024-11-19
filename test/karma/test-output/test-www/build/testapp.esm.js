import { p as e, w as t, d as o, N as a, a as c, H as l, b as r } from "./p-55339060.js";

export { s as setNonce } from "./p-55339060.js";

import { g as d } from "./p-02f27c50.js";

/*
 Stencil Client Patch Browser v2.23.2 | MIT Licensed | https://stenciljs.com
 */
/**
 * Helper method for querying a `meta` tag that contains a nonce value
 * out of a DOM's head.
 *
 * @param doc The DOM containing the `head` to query against
 * @returns The content of the meta tag representing the nonce value, or `undefined` if no tag
 * exists or the tag has no content.
 */ const patchDynamicImport = (c, l) => {
  const s = `__sc_import_${a.replace(/\s|-/g, "_")}`;
  try {
    // test if this browser supports dynamic imports
    // There is a caching issue in V8, that breaks using import() in Function
    // By generating a random string, we can workaround it
    // Check https://bugs.chromium.org/p/chromium/issues/detail?id=990810 for more info
    t[s] = new Function("w", `return import(w);//${Math.random()}`);
  } catch (r) {
    // this shim is specifically for browsers that do support "esm" imports
    // however, they do NOT support "dynamic" imports
    // basically this code is for old Edge, v18 and below
    const a = new Map;
    t[s] = r => {
      var d;
      const n = new URL(r, c).href;
      let p = a.get(n);
      if (!p) {
        const c = o.createElement("script");
        c.type = "module", c.crossOrigin = l.crossOrigin, c.src = URL.createObjectURL(new Blob([ `import * as m from '${n}'; window.${s}.m = m;` ], {
          type: "application/javascript"
        }));
        // Apply CSP nonce to the script tag if it exists
        const r = null !== (d = e.$nonce$) && void 0 !== d ? d : function(e) {
          var t, o, a;
          return null !== (a = null === (o = null === (t = e.head) || void 0 === t ? void 0 : t.querySelector('meta[name="csp-nonce"]')) || void 0 === o ? void 0 : o.getAttribute("content")) && void 0 !== a ? a : void 0;
        }(o);
        null != r && c.setAttribute("nonce", r), p = new Promise((e => {
          c.onload = () => {
            e(t[s].m), c.remove();
          };
        })), a.set(n, p), o.head.appendChild(c);
      }
      return p;
    };
  }
}, patchCloneNodeFix = e => {
  const t = e.cloneNode;
  e.cloneNode = function(e) {
    if ("TEMPLATE" === this.nodeName) return t.call(this, e);
    const o = t.call(this, !1), a = this.childNodes;
    if (e) for (let t = 0; t < a.length; t++) 
    // Node.ATTRIBUTE_NODE === 2, and checking because IE11
    2 !== a[t].nodeType && o.appendChild(a[t].cloneNode(!0));
    return o;
  };
};

(() => {
  // shim css vars
  e.$cssShim$ = t.__cssshim, 
  // opted-in to polyfill cloneNode() for slot polyfilled components
  patchCloneNodeFix(l.prototype);
  // @ts-ignore
  const s = Array.from(o.querySelectorAll("script")).find((e => new RegExp(`/${a}(\\.esm)?\\.js($|\\?|#)`).test(e.src) || e.getAttribute("data-stencil-namespace") === a)), r = s["data-opts"] || {};
  return "onbeforeload" in s && !history.scrollRestoration /* IS_ESM_BUILD */ ? {
    then() {
      /* promise noop */}
  } : (r.resourcesUrl = new URL(".", new URL(s.getAttribute("data-resources-url") || s.src, t.location.href)).href, 
  patchDynamicImport(r.resourcesUrl, s), t.customElements ? c(r) : __sc_import_testapp(/* webpackChunkName: "polyfills-dom" */ "./p-c77d35d3.js").then((() => r)));
})().then((e => (d(), r([ [ "p-6a721d04", [ [ 1, "custom-element-root" ] ] ], [ "p-dd6966bd", [ [ 0, "lifecycle-async-a", {
  value: [ 32 ],
  loads: [ 32 ],
  updates: [ 32 ]
}, [ [ 0, "lifecycleLoad", "lifecycleLoad" ], [ 0, "lifecycleUpdate", "lifecycleUpdate" ] ] ] ] ], [ "p-a65d7d44", [ [ 0, "lifecycle-basic-a", {
  value: [ 32 ],
  rendered: [ 32 ],
  loads: [ 32 ],
  updates: [ 32 ]
}, [ [ 0, "lifecycleLoad", "lifecycleLoad" ], [ 0, "lifecycleUpdate", "lifecycleUpdate" ] ] ] ] ], [ "p-0dd90910", [ [ 0, "lifecycle-unload-root", {
  renderCmp: [ 32 ]
} ] ] ], [ "p-894499af", [ [ 0, "lifecycle-update-a", {
  values: [ 32 ]
} ] ] ], [ "p-a1eea188", [ [ 0, "slot-list-light-root", {
  items: [ 1040 ]
} ] ] ], [ "p-20dfb22c", [ [ 0, "slot-list-light-scoped-root", {
  items: [ 1040 ]
} ] ] ], [ "p-7a7ccf6a", [ [ 0, "attribute-basic-root" ] ] ], [ "p-2789b0fc", [ [ 0, "conditional-rerender-root", {
  showContent: [ 32 ],
  showFooter: [ 32 ]
} ] ] ], [ "p-ef608ddc", [ [ 1, "custom-element-root-different-name-than-class" ] ] ], [ "p-5c27c1f9", [ [ 0, "listen-jsx-root", {
  wasClicked: [ 32 ]
} ] ] ], [ "p-42385ed1", [ [ 1, "parent-reflect-nan-attribute" ] ] ], [ "p-83c57979", [ [ 1, "parent-with-reflect-child" ] ] ], [ "p-3fe41c62", [ [ 34, "scoped-basic-root" ] ] ], [ "p-7ec44a14", [ [ 0, "shadow-dom-array-root", {
  values: [ 32 ]
} ] ] ], [ "p-361ff0e3", [ [ 1, "shadow-dom-basic-root" ] ] ], [ "p-035b84f0", [ [ 0, "shadow-dom-mode-root", {
  showRed: [ 32 ]
} ] ] ], [ "p-4a4324b0", [ [ 1, "shadow-dom-slot-nested-root" ] ] ], [ "p-9e4131b5", [ [ 0, "slot-array-complex-root", {
  endSlot: [ 32 ]
} ] ] ], [ "p-7b537093", [ [ 0, "slot-basic-order-root" ] ] ], [ "p-5c570916", [ [ 0, "slot-basic-root", {
  inc: [ 32 ]
} ] ] ], [ "p-b2112124", [ [ 0, "slot-dynamic-wrapper-root", {
  tag: [ 32 ]
} ] ] ], [ "p-bc734300", [ [ 0, "slot-fallback-root", {
  fallbackInc: [ 32 ],
  inc: [ 32 ],
  slotContent: [ 32 ]
} ] ] ], [ "p-35c0d34e", [ [ 0, "slot-light-dom-root", {
  a: [ 32 ],
  b: [ 32 ],
  c: [ 32 ],
  d: [ 32 ],
  e: [ 32 ],
  f: [ 32 ],
  g: [ 32 ],
  h: [ 32 ],
  i: [ 32 ],
  j: [ 32 ],
  k: [ 32 ],
  l: [ 32 ],
  m: [ 32 ]
} ] ] ], [ "p-8f0e92d9", [ [ 0, "slot-map-order-root" ] ] ], [ "p-9f1bc5b4", [ [ 4, "slot-nested-order-parent" ] ] ], [ "p-90f308cf", [ [ 0, "slot-reorder-root", {
  reordered: [ 32 ]
} ] ] ], [ "p-da76aa82", [ [ 0, "slot-replace-wrapper-root", {
  href: [ 32 ]
} ] ] ], [ "p-953e8a44", [ [ 0, "stencil-sibling" ] ] ], [ "p-0e16ce4b", [ [ 6, "append-child" ] ] ], [ "p-ca10464e", [ [ 0, "attribute-boolean", {
  boolState: [ 516, "bool-state" ],
  strState: [ 513, "str-state" ],
  noreflect: [ 4 ]
} ] ] ], [ "p-b8bb1daf", [ [ 0, "attribute-boolean-root", {
  state: [ 32 ],
  toggleState: [ 64 ]
} ] ] ], [ "p-5fec9a12", [ [ 0, "attribute-complex", {
  nu0: [ 2, "nu-0" ],
  nu1: [ 2, "nu-1" ],
  nu2: [ 2, "nu-2" ],
  bool0: [ 4, "bool-0" ],
  bool1: [ 4, "bool-1" ],
  bool2: [ 4, "bool-2" ],
  str0: [ 1, "str-0" ],
  str1: [ 1, "str-1" ],
  str2: [ 1, "str-2" ],
  obj: [ 6145 ],
  getInstance: [ 64 ]
} ] ] ], [ "p-3dabba36", [ [ 0, "attribute-host", {
  attrsAdded: [ 32 ]
} ] ] ], [ "p-feb8d993", [ [ 0, "attribute-html-root", {
  strAttr: [ 1, "str-attr" ],
  anyAttr: [ 8, "any-attr" ],
  nuAttr: [ 2, "nu-attr" ]
} ] ] ], [ "p-983180a5", [ [ 0, "bad-shared-jsx" ] ] ], [ "p-bfd4856b", [ [ 0, "build-data" ] ] ], [ "p-ea24540b", [ [ 6, "cmp-label" ] ] ], [ "p-53a71841", [ [ 6, "cmp-label-with-slot-sibling" ] ] ], [ "p-472edfea", [ [ 0, "conditional-basic", {
  showContent: [ 32 ]
} ] ] ], [ "p-dab76be1", [ [ 1, "css-cmp" ] ] ], [ "p-66b115ef", [ [ 0, "css-variables-no-encapsulation" ] ] ], [ "p-27cb203c", [ [ 1, "css-variables-shadow-dom", {
  isGreen: [ 32 ]
} ] ] ], [ "p-ebf5b438", [ [ 17, "custom-elements-delegates-focus" ] ] ], [ "p-66af3c7b", [ [ 1, "custom-elements-no-delegates-focus" ] ] ], [ "p-24b7c43e", [ [ 0, "custom-event-root", {
  output: [ 32 ]
} ] ] ], [ "p-383e272b", [ [ 17, "delegates-focus" ] ] ], [ "p-9f87e7c9", [ [ 0, "dom-reattach", {
  willLoad: [ 1026, "will-load" ],
  didLoad: [ 1026, "did-load" ],
  didUnload: [ 1026, "did-unload" ]
} ] ] ], [ "p-ab1bee1d", [ [ 4, "dom-reattach-clone" ] ] ], [ "p-99d19858", [ [ 4, "dom-reattach-clone-deep-slot" ] ] ], [ "p-3bf2c74f", [ [ 4, "dom-reattach-clone-host" ] ] ], [ "p-f68aa894", [ [ 0, "dynamic-css-variable", {
  bgColor: [ 32 ]
} ] ] ], [ "p-976d3956", [ [ 0, "dynamic-import", {
  value: [ 32 ],
  update: [ 64 ]
} ] ] ], [ "p-a11062e0", [ [ 1, "es5-addclass-svg" ] ] ], [ "p-e9920d34", [ [ 1, "esm-import", {
  propVal: [ 2, "prop-val" ],
  isReady: [ 32 ],
  stateVal: [ 32 ],
  listenVal: [ 32 ],
  someEventInc: [ 32 ],
  someMethod: [ 64 ]
}, [ [ 0, "click", "testClick" ] ] ] ] ], [ "p-e27e3f9b", [ [ 0, "event-basic", {
  counter: [ 32 ]
}, [ [ 0, "testEvent", "testEventHandler" ] ] ] ] ], [ "p-22c2e18d", [ [ 0, "event-custom-type", {
  counter: [ 32 ],
  lastEventValue: [ 32 ]
}, [ [ 0, "testEvent", "testEventHandler" ] ] ] ] ], [ "p-5f059f2c", [ [ 0, "external-import-a" ] ] ], [ "p-e3a83b18", [ [ 0, "external-import-b" ] ] ], [ "p-be01f391", [ [ 0, "external-import-c" ] ] ], [ "p-f7f63655", [ [ 0, "factory-jsx" ] ] ], [ "p-5862435b", [ [ 0, "image-import" ] ] ], [ "p-4c2f9349", [ [ 0, "init-css-root" ] ] ], [ "p-09078a09", [ [ 0, "input-basic-root", {
  value: [ 1025 ]
} ] ] ], [ "p-86bc89bc", [ [ 0, "json-basic" ] ] ], [ "p-ba09211a", [ [ 0, "key-reorder", {
  num: [ 2 ]
} ] ] ], [ "p-4904db02", [ [ 0, "key-reorder-root", {
  isReversed: [ 32 ]
} ] ] ], [ "p-cb792f47", [ [ 1, "lifecycle-nested-a" ] ] ], [ "p-1113ae19", [ [ 1, "lifecycle-nested-b" ] ] ], [ "p-0970842e", [ [ 1, "lifecycle-nested-c" ] ] ], [ "p-4ac2ea85", [ [ 2, "listen-reattach", {
  clicked: [ 32 ]
}, [ [ 0, "click", "click" ] ] ] ] ], [ "p-987b596c", [ [ 0, "listen-window", {
  clicked: [ 32 ],
  scrolled: [ 32 ]
}, [ [ 8, "click", "winClick" ], [ 9, "scroll", "winScroll" ] ] ] ] ], [ "p-fcc733c9", [ [ 1, "no-delegates-focus" ] ] ], [ "p-2c8d650c", [ [ 0, "node-globals" ] ] ], [ "p-a0f786c1", [ [ 0, "node-resolution" ] ] ], [ "p-8c5031be", [ [ 1, "reflect-nan-attribute", {
  val: [ 514 ]
} ] ] ], [ "p-41fe2494", [ [ 1, "reflect-nan-attribute-hyphen", {
  valNum: [ 514, "val-num" ]
} ] ] ], [ "p-91f08c69", [ [ 0, "reflect-to-attr", {
  str: [ 513 ],
  nu: [ 514 ],
  undef: [ 513 ],
  null: [ 513 ],
  bool: [ 516 ],
  otherBool: [ 516, "other-bool" ],
  disabled: [ 516 ],
  dynamicStr: [ 1537, "dynamic-str" ],
  dynamicNu: [ 514, "dynamic-nu" ]
} ] ] ], [ "p-033bfe51", [ [ 1, "reparent-style-no-vars" ] ] ], [ "p-7873d6ef", [ [ 1, "reparent-style-with-vars" ] ] ], [ "p-8c453b8d", [ [ 1, "sass-cmp" ] ] ], [ "p-19919e15", [ [ 1, "shadow-dom-slot-basic" ] ] ], [ "p-9f40cf68", [ [ 4, "slot-array-basic" ] ] ], [ "p-2577d9ac", [ [ 1, "slot-array-top" ] ] ], [ "p-20157ae7", [ [ 1, "slot-children-root" ] ] ], [ "p-e8cfc47c", [ [ 4, "slot-html", {
  inc: [ 2 ]
} ] ] ], [ "p-d4ae19be", [ [ 4, "slot-ng-if" ] ] ], [ "p-94155923", [ [ 4, "slot-no-default" ] ] ], [ "p-cf310737", [ [ 1, "slotted-css" ] ] ], [ "p-e1c998d8", [ [ 0, "static-styles" ] ] ], [ "p-c37b62b5", [ [ 0, "svg-attr", {
  isOpen: [ 32 ]
} ] ] ], [ "p-57811e28", [ [ 0, "svg-class", {
  hasColor: [ 32 ]
} ] ] ], [ "p-36fc123f", [ [ 0, "tag-3d-component" ] ] ], [ "p-3981c9be", [ [ 0, "tag-88" ] ] ], [ "p-cc1f7af0", [ [ 1, "custom-element-child" ] ] ], [ "p-d85e42bf", [ [ 0, "lifecycle-async-b", {
  value: [ 1 ]
} ] ] ], [ "p-f6f42b96", [ [ 0, "lifecycle-basic-b", {
  value: [ 1 ],
  rendered: [ 32 ]
} ] ] ], [ "p-ba59d099", [ [ 1, "lifecycle-unload-a" ] ] ], [ "p-1853245b", [ [ 0, "lifecycle-update-b", {
  value: [ 2 ]
} ] ] ], [ "p-34067231", [ [ 2, "slot-dynamic-scoped-list", {
  items: [ 16 ]
} ] ] ], [ "p-45f328c2", [ [ 1, "slot-dynamic-shadow-list", {
  items: [ 16 ]
} ] ] ], [ "p-340e3ea0", [ [ 0, "attribute-basic", {
  single: [ 1 ],
  multiWord: [ 1, "multi-word" ],
  customAttr: [ 1, "my-custom-attr" ],
  getter: [ 6145 ]
} ] ] ], [ "p-63f74c8e", [ [ 1, "child-reflect-nan-attribute", {
  val: [ 514 ]
} ] ] ], [ "p-414e0bb9", [ [ 1, "child-with-reflection", {
  val: [ 520 ]
} ] ] ], [ "p-8c23c4dc", [ [ 4, "conditional-rerender" ] ] ], [ "p-fe9f2a8a", [ [ 1, "custom-element-child-different-name-than-class" ] ] ], [ "p-82148cf2", [ [ 2, "listen-jsx", {
  wasClicked: [ 32 ]
}, [ [ 0, "click", "onClick" ] ] ] ] ], [ "p-fd5f5eb3", [ [ 6, "scoped-basic" ] ] ], [ "p-da56a5e2", [ [ 1, "shadow-dom-array", {
  values: [ 16 ]
} ] ] ], [ "p-1f62df1f", [ [ 1, "shadow-dom-basic" ] ] ], [ "p-4d023084", [ [ 33, "shadow-dom-mode" ] ] ], [ "p-67ad90f7", [ [ 1, "shadow-dom-slot-nested", {
  i: [ 2 ]
} ] ] ], [ "p-86b2122d", [ [ 6, "sibling-root" ] ] ], [ "p-0d3c82ce", [ [ 4, "slot-array-complex" ] ] ], [ "p-6d420fc7", [ [ 4, "slot-basic" ] ] ], [ "p-f0c72d81", [ [ 4, "slot-basic-order" ] ] ], [ "p-bb3ce6bc", [ [ 4, "slot-dynamic-wrapper", {
  tag: [ 1 ]
} ] ] ], [ "p-a94eb1ab", [ [ 4, "slot-fallback", {
  inc: [ 2 ]
} ] ] ], [ "p-1b1806c6", [ [ 4, "slot-light-dom-content" ] ] ], [ "p-ed7b9e17", [ [ 4, "slot-map-order" ] ] ], [ "p-16d49eb7", [ [ 4, "slot-nested-order-child" ] ] ], [ "p-b69a105b", [ [ 4, "slot-reorder", {
  reordered: [ 4 ]
} ] ] ], [ "p-6a941189", [ [ 4, "slot-replace-wrapper", {
  href: [ 1 ]
} ] ] ], [ "p-82b0ce76", [ [ 1, "custom-element-nested-child" ] ] ], [ "p-d1e529d1", [ [ 0, "lifecycle-async-c", {
  value: [ 1 ]
} ] ] ], [ "p-75a79139", [ [ 0, "lifecycle-basic-c", {
  value: [ 1 ],
  rendered: [ 32 ]
} ] ] ], [ "p-be655578", [ [ 1, "lifecycle-unload-b" ] ] ], [ "p-4c671590", [ [ 0, "lifecycle-update-c", {
  value: [ 2 ]
} ] ] ], [ "p-cabad75e", [ [ 4, "slot-light-list" ] ] ], [ "p-2eb0bccf", [ [ 4, "slot-light-scoped-list" ] ] ] ], e))));