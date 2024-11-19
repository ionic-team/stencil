'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-b8958464.js');
const appGlobals = require('./app-globals-23501464.js');

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
 */
function queryNonceMetaTagContent(doc) {
    var _a, _b, _c;
    return (_c = (_b = (_a = doc.head) === null || _a === void 0 ? void 0 : _a.querySelector('meta[name="csp-nonce"]')) === null || _b === void 0 ? void 0 : _b.getAttribute('content')) !== null && _c !== void 0 ? _c : undefined;
}
const getDynamicImportFunction = (namespace) => `__sc_import_${namespace.replace(/\s|-/g, '_')}`;
const patchBrowser = () => {
    {
        // shim css vars
        index.plt.$cssShim$ = index.win.__cssshim;
    }
    {
        // opted-in to polyfill cloneNode() for slot polyfilled components
        patchCloneNodeFix(index.H.prototype);
    }
    // @ts-ignore
    const scriptElm = Array.from(index.doc.querySelectorAll('script')).find((s) => new RegExp(`\/${index.NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) ||
            s.getAttribute('data-stencil-namespace') === index.NAMESPACE)
        ;
    const opts = scriptElm['data-opts'] || {} ;
    if ('onbeforeload' in scriptElm && !history.scrollRestoration /* IS_ESM_BUILD */) {
        // Safari < v11 support: This IF is true if it's Safari below v11.
        // This fn cannot use async/await since Safari didn't support it until v11,
        // however, Safari 10 did support modules. Safari 10 also didn't support "nomodule",
        // so both the ESM file and nomodule file would get downloaded. Only Safari
        // has 'onbeforeload' in the script, and "history.scrollRestoration" was added
        // to Safari in v11. Return a noop then() so the async/await ESM code doesn't continue.
        // IS_ESM_BUILD is replaced at build time so this check doesn't happen in systemjs builds.
        return {
            then() {
                /* promise noop */
            },
        };
    }
    {
        opts.resourcesUrl = new URL('.', new URL(scriptElm.getAttribute('data-resources-url') || scriptElm.src, index.win.location.href)).href;
        {
            patchDynamicImport(opts.resourcesUrl, scriptElm);
        }
        if (!index.win.customElements) {
            // module support, but no custom elements support (Old Edge)
            // @ts-ignore
            return Promise.resolve().then(function () { return require(/* webpackChunkName: "polyfills-dom" */ './dom-d997d06c.js'); }).then(() => opts);
        }
    }
    return index.promiseResolve(opts);
};
const patchDynamicImport = (base, orgScriptElm) => {
    const importFunctionName = getDynamicImportFunction(index.NAMESPACE);
    try {
        // test if this browser supports dynamic imports
        // There is a caching issue in V8, that breaks using import() in Function
        // By generating a random string, we can workaround it
        // Check https://bugs.chromium.org/p/chromium/issues/detail?id=990810 for more info
        index.win[importFunctionName] = new Function('w', `return import(w);//${Math.random()}`);
    }
    catch (e) {
        // this shim is specifically for browsers that do support "esm" imports
        // however, they do NOT support "dynamic" imports
        // basically this code is for old Edge, v18 and below
        const moduleMap = new Map();
        index.win[importFunctionName] = (src) => {
            var _a;
            const url = new URL(src, base).href;
            let mod = moduleMap.get(url);
            if (!mod) {
                const script = index.doc.createElement('script');
                script.type = 'module';
                script.crossOrigin = orgScriptElm.crossOrigin;
                script.src = URL.createObjectURL(new Blob([`import * as m from '${url}'; window.${importFunctionName}.m = m;`], {
                    type: 'application/javascript',
                }));
                // Apply CSP nonce to the script tag if it exists
                const nonce = (_a = index.plt.$nonce$) !== null && _a !== void 0 ? _a : queryNonceMetaTagContent(index.doc);
                if (nonce != null) {
                    script.setAttribute('nonce', nonce);
                }
                mod = new Promise((resolve) => {
                    script.onload = () => {
                        resolve(index.win[importFunctionName].m);
                        script.remove();
                    };
                });
                moduleMap.set(url, mod);
                index.doc.head.appendChild(script);
            }
            return mod;
        };
    }
};
const patchCloneNodeFix = (HTMLElementPrototype) => {
    const nativeCloneNodeFn = HTMLElementPrototype.cloneNode;
    HTMLElementPrototype.cloneNode = function (deep) {
        if (this.nodeName === 'TEMPLATE') {
            return nativeCloneNodeFn.call(this, deep);
        }
        const clonedNode = nativeCloneNodeFn.call(this, false);
        const srcChildNodes = this.childNodes;
        if (deep) {
            for (let i = 0; i < srcChildNodes.length; i++) {
                // Node.ATTRIBUTE_NODE === 2, and checking because IE11
                if (srcChildNodes[i].nodeType !== 2) {
                    clonedNode.appendChild(srcChildNodes[i].cloneNode(true));
                }
            }
        }
        return clonedNode;
    };
};

patchBrowser().then(options => {
  appGlobals.globalScripts();
  return index.bootstrapLazy([["custom-element-root.cjs",[[1,"custom-element-root"]]],["lifecycle-async-a.cjs",[[0,"lifecycle-async-a",{"value":[32],"loads":[32],"updates":[32]},[[0,"lifecycleLoad","lifecycleLoad"],[0,"lifecycleUpdate","lifecycleUpdate"]]]]],["lifecycle-basic-a.cjs",[[0,"lifecycle-basic-a",{"value":[32],"rendered":[32],"loads":[32],"updates":[32]},[[0,"lifecycleLoad","lifecycleLoad"],[0,"lifecycleUpdate","lifecycleUpdate"]]]]],["lifecycle-unload-root.cjs",[[0,"lifecycle-unload-root",{"renderCmp":[32]}]]],["lifecycle-update-a.cjs",[[0,"lifecycle-update-a",{"values":[32]}]]],["slot-list-light-root.cjs",[[0,"slot-list-light-root",{"items":[1040]}]]],["slot-list-light-scoped-root.cjs",[[0,"slot-list-light-scoped-root",{"items":[1040]}]]],["attribute-basic-root.cjs",[[0,"attribute-basic-root"]]],["conditional-rerender-root.cjs",[[0,"conditional-rerender-root",{"showContent":[32],"showFooter":[32]}]]],["custom-element-root-different-name-than-class.cjs",[[1,"custom-element-root-different-name-than-class"]]],["listen-jsx-root.cjs",[[0,"listen-jsx-root",{"wasClicked":[32]}]]],["parent-reflect-nan-attribute.cjs",[[1,"parent-reflect-nan-attribute"]]],["parent-with-reflect-child.cjs",[[1,"parent-with-reflect-child"]]],["scoped-basic-root.cjs",[[34,"scoped-basic-root"]]],["shadow-dom-array-root.cjs",[[0,"shadow-dom-array-root",{"values":[32]}]]],["shadow-dom-basic-root.cjs",[[1,"shadow-dom-basic-root"]]],["shadow-dom-mode-root.cjs",[[0,"shadow-dom-mode-root",{"showRed":[32]}]]],["shadow-dom-slot-nested-root.cjs",[[1,"shadow-dom-slot-nested-root"]]],["slot-array-complex-root.cjs",[[0,"slot-array-complex-root",{"endSlot":[32]}]]],["slot-basic-order-root.cjs",[[0,"slot-basic-order-root"]]],["slot-basic-root.cjs",[[0,"slot-basic-root",{"inc":[32]}]]],["slot-dynamic-wrapper-root.cjs",[[0,"slot-dynamic-wrapper-root",{"tag":[32]}]]],["slot-fallback-root.cjs",[[0,"slot-fallback-root",{"fallbackInc":[32],"inc":[32],"slotContent":[32]}]]],["slot-light-dom-root.cjs",[[0,"slot-light-dom-root",{"a":[32],"b":[32],"c":[32],"d":[32],"e":[32],"f":[32],"g":[32],"h":[32],"i":[32],"j":[32],"k":[32],"l":[32],"m":[32]}]]],["slot-map-order-root.cjs",[[0,"slot-map-order-root"]]],["slot-nested-order-parent.cjs",[[4,"slot-nested-order-parent"]]],["slot-reorder-root.cjs",[[0,"slot-reorder-root",{"reordered":[32]}]]],["slot-replace-wrapper-root.cjs",[[0,"slot-replace-wrapper-root",{"href":[32]}]]],["stencil-sibling.cjs",[[0,"stencil-sibling"]]],["append-child.cjs",[[6,"append-child"]]],["attribute-boolean.cjs",[[0,"attribute-boolean",{"boolState":[516,"bool-state"],"strState":[513,"str-state"],"noreflect":[4]}]]],["attribute-boolean-root.cjs",[[0,"attribute-boolean-root",{"state":[32],"toggleState":[64]}]]],["attribute-complex.cjs",[[0,"attribute-complex",{"nu0":[2,"nu-0"],"nu1":[2,"nu-1"],"nu2":[2,"nu-2"],"bool0":[4,"bool-0"],"bool1":[4,"bool-1"],"bool2":[4,"bool-2"],"str0":[1,"str-0"],"str1":[1,"str-1"],"str2":[1,"str-2"],"obj":[6145],"getInstance":[64]}]]],["attribute-host.cjs",[[0,"attribute-host",{"attrsAdded":[32]}]]],["attribute-html-root.cjs",[[0,"attribute-html-root",{"strAttr":[1,"str-attr"],"anyAttr":[8,"any-attr"],"nuAttr":[2,"nu-attr"]}]]],["bad-shared-jsx.cjs",[[0,"bad-shared-jsx"]]],["build-data.cjs",[[0,"build-data"]]],["cmp-label.cjs",[[6,"cmp-label"]]],["cmp-label-with-slot-sibling.cjs",[[6,"cmp-label-with-slot-sibling"]]],["conditional-basic.cjs",[[0,"conditional-basic",{"showContent":[32]}]]],["css-cmp.cjs",[[1,"css-cmp"]]],["css-variables-no-encapsulation.cjs",[[0,"css-variables-no-encapsulation"]]],["css-variables-shadow-dom.cjs",[[1,"css-variables-shadow-dom",{"isGreen":[32]}]]],["custom-elements-delegates-focus.cjs",[[17,"custom-elements-delegates-focus"]]],["custom-elements-no-delegates-focus.cjs",[[1,"custom-elements-no-delegates-focus"]]],["custom-event-root.cjs",[[0,"custom-event-root",{"output":[32]}]]],["delegates-focus.cjs",[[17,"delegates-focus"]]],["dom-reattach.cjs",[[0,"dom-reattach",{"willLoad":[1026,"will-load"],"didLoad":[1026,"did-load"],"didUnload":[1026,"did-unload"]}]]],["dom-reattach-clone.cjs",[[4,"dom-reattach-clone"]]],["dom-reattach-clone-deep-slot.cjs",[[4,"dom-reattach-clone-deep-slot"]]],["dom-reattach-clone-host.cjs",[[4,"dom-reattach-clone-host"]]],["dynamic-css-variable.cjs",[[0,"dynamic-css-variable",{"bgColor":[32]}]]],["dynamic-import.cjs",[[0,"dynamic-import",{"value":[32],"update":[64]}]]],["es5-addclass-svg.cjs",[[1,"es5-addclass-svg"]]],["esm-import.cjs",[[1,"esm-import",{"propVal":[2,"prop-val"],"isReady":[32],"stateVal":[32],"listenVal":[32],"someEventInc":[32],"someMethod":[64]},[[0,"click","testClick"]]]]],["event-basic.cjs",[[0,"event-basic",{"counter":[32]},[[0,"testEvent","testEventHandler"]]]]],["event-custom-type.cjs",[[0,"event-custom-type",{"counter":[32],"lastEventValue":[32]},[[0,"testEvent","testEventHandler"]]]]],["external-import-a.cjs",[[0,"external-import-a"]]],["external-import-b.cjs",[[0,"external-import-b"]]],["external-import-c.cjs",[[0,"external-import-c"]]],["factory-jsx.cjs",[[0,"factory-jsx"]]],["image-import.cjs",[[0,"image-import"]]],["init-css-root.cjs",[[0,"init-css-root"]]],["input-basic-root.cjs",[[0,"input-basic-root",{"value":[1025]}]]],["json-basic.cjs",[[0,"json-basic"]]],["key-reorder.cjs",[[0,"key-reorder",{"num":[2]}]]],["key-reorder-root.cjs",[[0,"key-reorder-root",{"isReversed":[32]}]]],["lifecycle-nested-a.cjs",[[1,"lifecycle-nested-a"]]],["lifecycle-nested-b.cjs",[[1,"lifecycle-nested-b"]]],["lifecycle-nested-c.cjs",[[1,"lifecycle-nested-c"]]],["listen-reattach.cjs",[[2,"listen-reattach",{"clicked":[32]},[[0,"click","click"]]]]],["listen-window.cjs",[[0,"listen-window",{"clicked":[32],"scrolled":[32]},[[8,"click","winClick"],[9,"scroll","winScroll"]]]]],["no-delegates-focus.cjs",[[1,"no-delegates-focus"]]],["node-globals.cjs",[[0,"node-globals"]]],["node-resolution.cjs",[[0,"node-resolution"]]],["reflect-nan-attribute.cjs",[[1,"reflect-nan-attribute",{"val":[514]}]]],["reflect-nan-attribute-hyphen.cjs",[[1,"reflect-nan-attribute-hyphen",{"valNum":[514,"val-num"]}]]],["reflect-to-attr.cjs",[[0,"reflect-to-attr",{"str":[513],"nu":[514],"undef":[513],"null":[513],"bool":[516],"otherBool":[516,"other-bool"],"disabled":[516],"dynamicStr":[1537,"dynamic-str"],"dynamicNu":[514,"dynamic-nu"]}]]],["reparent-style-no-vars.cjs",[[1,"reparent-style-no-vars"]]],["reparent-style-with-vars.cjs",[[1,"reparent-style-with-vars"]]],["sass-cmp.cjs",[[1,"sass-cmp"]]],["shadow-dom-slot-basic.cjs",[[1,"shadow-dom-slot-basic"]]],["slot-array-basic.cjs",[[4,"slot-array-basic"]]],["slot-array-top.cjs",[[1,"slot-array-top"]]],["slot-children-root.cjs",[[1,"slot-children-root"]]],["slot-html.cjs",[[4,"slot-html",{"inc":[2]}]]],["slot-ng-if.cjs",[[4,"slot-ng-if"]]],["slot-no-default.cjs",[[4,"slot-no-default"]]],["slotted-css.cjs",[[1,"slotted-css"]]],["static-styles.cjs",[[0,"static-styles"]]],["svg-attr.cjs",[[0,"svg-attr",{"isOpen":[32]}]]],["svg-class.cjs",[[0,"svg-class",{"hasColor":[32]}]]],["tag-3d-component.cjs",[[0,"tag-3d-component"]]],["tag-88.cjs",[[0,"tag-88"]]],["custom-element-child.cjs",[[1,"custom-element-child"]]],["lifecycle-async-b.cjs",[[0,"lifecycle-async-b",{"value":[1]}]]],["lifecycle-basic-b.cjs",[[0,"lifecycle-basic-b",{"value":[1],"rendered":[32]}]]],["lifecycle-unload-a.cjs",[[1,"lifecycle-unload-a"]]],["lifecycle-update-b.cjs",[[0,"lifecycle-update-b",{"value":[2]}]]],["slot-dynamic-scoped-list.cjs",[[2,"slot-dynamic-scoped-list",{"items":[16]}]]],["slot-dynamic-shadow-list.cjs",[[1,"slot-dynamic-shadow-list",{"items":[16]}]]],["attribute-basic.cjs",[[0,"attribute-basic",{"single":[1],"multiWord":[1,"multi-word"],"customAttr":[1,"my-custom-attr"],"getter":[6145]}]]],["child-reflect-nan-attribute.cjs",[[1,"child-reflect-nan-attribute",{"val":[514]}]]],["child-with-reflection.cjs",[[1,"child-with-reflection",{"val":[520]}]]],["conditional-rerender.cjs",[[4,"conditional-rerender"]]],["custom-element-child-different-name-than-class.cjs",[[1,"custom-element-child-different-name-than-class"]]],["listen-jsx.cjs",[[2,"listen-jsx",{"wasClicked":[32]},[[0,"click","onClick"]]]]],["scoped-basic.cjs",[[6,"scoped-basic"]]],["shadow-dom-array.cjs",[[1,"shadow-dom-array",{"values":[16]}]]],["shadow-dom-basic.cjs",[[1,"shadow-dom-basic"]]],["shadow-dom-mode.cjs",[[33,"shadow-dom-mode"]]],["shadow-dom-slot-nested.cjs",[[1,"shadow-dom-slot-nested",{"i":[2]}]]],["sibling-root.cjs",[[6,"sibling-root"]]],["slot-array-complex.cjs",[[4,"slot-array-complex"]]],["slot-basic.cjs",[[4,"slot-basic"]]],["slot-basic-order.cjs",[[4,"slot-basic-order"]]],["slot-dynamic-wrapper.cjs",[[4,"slot-dynamic-wrapper",{"tag":[1]}]]],["slot-fallback.cjs",[[4,"slot-fallback",{"inc":[2]}]]],["slot-light-dom-content.cjs",[[4,"slot-light-dom-content"]]],["slot-map-order.cjs",[[4,"slot-map-order"]]],["slot-nested-order-child.cjs",[[4,"slot-nested-order-child"]]],["slot-reorder.cjs",[[4,"slot-reorder",{"reordered":[4]}]]],["slot-replace-wrapper.cjs",[[4,"slot-replace-wrapper",{"href":[1]}]]],["custom-element-nested-child.cjs",[[1,"custom-element-nested-child"]]],["lifecycle-async-c.cjs",[[0,"lifecycle-async-c",{"value":[1]}]]],["lifecycle-basic-c.cjs",[[0,"lifecycle-basic-c",{"value":[1],"rendered":[32]}]]],["lifecycle-unload-b.cjs",[[1,"lifecycle-unload-b"]]],["lifecycle-update-c.cjs",[[0,"lifecycle-update-c",{"value":[2]}]]],["slot-light-list.cjs",[[4,"slot-light-list"]]],["slot-light-scoped-list.cjs",[[4,"slot-light-scoped-list"]]]], options);
});

exports.setNonce = index.setNonce;
