import { p as plt, w as win, d as doc, N as NAMESPACE, a as promiseResolve, H, b as bootstrapLazy } from './index-a2c0d171.js';
export { s as setNonce } from './index-a2c0d171.js';
import { g as globalScripts } from './app-globals-3316b05b.js';

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
        plt.$cssShim$ = win.__cssshim;
    }
    {
        // opted-in to polyfill cloneNode() for slot polyfilled components
        patchCloneNodeFix(H.prototype);
    }
    // @ts-ignore
    const scriptElm = Array.from(doc.querySelectorAll('script')).find((s) => new RegExp(`\/${NAMESPACE}(\\.esm)?\\.js($|\\?|#)`).test(s.src) ||
            s.getAttribute('data-stencil-namespace') === NAMESPACE)
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
        opts.resourcesUrl = new URL('.', new URL(scriptElm.getAttribute('data-resources-url') || scriptElm.src, win.location.href)).href;
        {
            patchDynamicImport(opts.resourcesUrl, scriptElm);
        }
        if (!win.customElements) {
            // module support, but no custom elements support (Old Edge)
            // @ts-ignore
            return import(/* webpackChunkName: "polyfills-dom" */ './dom-70ce71ed.js').then(() => opts);
        }
    }
    return promiseResolve(opts);
};
const patchDynamicImport = (base, orgScriptElm) => {
    const importFunctionName = getDynamicImportFunction(NAMESPACE);
    try {
        // test if this browser supports dynamic imports
        // There is a caching issue in V8, that breaks using import() in Function
        // By generating a random string, we can workaround it
        // Check https://bugs.chromium.org/p/chromium/issues/detail?id=990810 for more info
        win[importFunctionName] = new Function('w', `return import(w);//${Math.random()}`);
    }
    catch (e) {
        // this shim is specifically for browsers that do support "esm" imports
        // however, they do NOT support "dynamic" imports
        // basically this code is for old Edge, v18 and below
        const moduleMap = new Map();
        win[importFunctionName] = (src) => {
            var _a;
            const url = new URL(src, base).href;
            let mod = moduleMap.get(url);
            if (!mod) {
                const script = doc.createElement('script');
                script.type = 'module';
                script.crossOrigin = orgScriptElm.crossOrigin;
                script.src = URL.createObjectURL(new Blob([`import * as m from '${url}'; window.${importFunctionName}.m = m;`], {
                    type: 'application/javascript',
                }));
                // Apply CSP nonce to the script tag if it exists
                const nonce = (_a = plt.$nonce$) !== null && _a !== void 0 ? _a : queryNonceMetaTagContent(doc);
                if (nonce != null) {
                    script.setAttribute('nonce', nonce);
                }
                mod = new Promise((resolve) => {
                    script.onload = () => {
                        resolve(win[importFunctionName].m);
                        script.remove();
                    };
                });
                moduleMap.set(url, mod);
                doc.head.appendChild(script);
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
  globalScripts();
  return bootstrapLazy([["custom-element-root",[[1,"custom-element-root"]]],["lifecycle-async-a",[[0,"lifecycle-async-a",{"value":[32],"loads":[32],"updates":[32]},[[0,"lifecycleLoad","lifecycleLoad"],[0,"lifecycleUpdate","lifecycleUpdate"]]]]],["lifecycle-basic-a",[[0,"lifecycle-basic-a",{"value":[32],"rendered":[32],"loads":[32],"updates":[32]},[[0,"lifecycleLoad","lifecycleLoad"],[0,"lifecycleUpdate","lifecycleUpdate"]]]]],["lifecycle-unload-root",[[0,"lifecycle-unload-root",{"renderCmp":[32]}]]],["lifecycle-update-a",[[0,"lifecycle-update-a",{"values":[32]}]]],["slot-list-light-root",[[0,"slot-list-light-root",{"items":[1040]}]]],["slot-list-light-scoped-root",[[0,"slot-list-light-scoped-root",{"items":[1040]}]]],["attribute-basic-root",[[0,"attribute-basic-root"]]],["conditional-rerender-root",[[0,"conditional-rerender-root",{"showContent":[32],"showFooter":[32]}]]],["custom-element-root-different-name-than-class",[[1,"custom-element-root-different-name-than-class"]]],["listen-jsx-root",[[0,"listen-jsx-root",{"wasClicked":[32]}]]],["parent-reflect-nan-attribute",[[1,"parent-reflect-nan-attribute"]]],["parent-with-reflect-child",[[1,"parent-with-reflect-child"]]],["scoped-basic-root",[[34,"scoped-basic-root"]]],["shadow-dom-array-root",[[0,"shadow-dom-array-root",{"values":[32]}]]],["shadow-dom-basic-root",[[1,"shadow-dom-basic-root"]]],["shadow-dom-mode-root",[[0,"shadow-dom-mode-root",{"showRed":[32]}]]],["shadow-dom-slot-nested-root",[[1,"shadow-dom-slot-nested-root"]]],["slot-array-complex-root",[[0,"slot-array-complex-root",{"endSlot":[32]}]]],["slot-basic-order-root",[[0,"slot-basic-order-root"]]],["slot-basic-root",[[0,"slot-basic-root",{"inc":[32]}]]],["slot-dynamic-wrapper-root",[[0,"slot-dynamic-wrapper-root",{"tag":[32]}]]],["slot-fallback-root",[[0,"slot-fallback-root",{"fallbackInc":[32],"inc":[32],"slotContent":[32]}]]],["slot-light-dom-root",[[0,"slot-light-dom-root",{"a":[32],"b":[32],"c":[32],"d":[32],"e":[32],"f":[32],"g":[32],"h":[32],"i":[32],"j":[32],"k":[32],"l":[32],"m":[32]}]]],["slot-map-order-root",[[0,"slot-map-order-root"]]],["slot-nested-order-parent",[[4,"slot-nested-order-parent"]]],["slot-reorder-root",[[0,"slot-reorder-root",{"reordered":[32]}]]],["slot-replace-wrapper-root",[[0,"slot-replace-wrapper-root",{"href":[32]}]]],["stencil-sibling",[[0,"stencil-sibling"]]],["append-child",[[6,"append-child"]]],["attribute-boolean",[[0,"attribute-boolean",{"boolState":[516,"bool-state"],"strState":[513,"str-state"],"noreflect":[4]}]]],["attribute-boolean-root",[[0,"attribute-boolean-root",{"state":[32],"toggleState":[64]}]]],["attribute-complex",[[0,"attribute-complex",{"nu0":[2,"nu-0"],"nu1":[2,"nu-1"],"nu2":[2,"nu-2"],"bool0":[4,"bool-0"],"bool1":[4,"bool-1"],"bool2":[4,"bool-2"],"str0":[1,"str-0"],"str1":[1,"str-1"],"str2":[1,"str-2"],"obj":[6145],"getInstance":[64]}]]],["attribute-host",[[0,"attribute-host",{"attrsAdded":[32]}]]],["attribute-html-root",[[0,"attribute-html-root",{"strAttr":[1,"str-attr"],"anyAttr":[8,"any-attr"],"nuAttr":[2,"nu-attr"]}]]],["bad-shared-jsx",[[0,"bad-shared-jsx"]]],["build-data",[[0,"build-data"]]],["cmp-label",[[6,"cmp-label"]]],["cmp-label-with-slot-sibling",[[6,"cmp-label-with-slot-sibling"]]],["conditional-basic",[[0,"conditional-basic",{"showContent":[32]}]]],["css-cmp",[[1,"css-cmp"]]],["css-variables-no-encapsulation",[[0,"css-variables-no-encapsulation"]]],["css-variables-shadow-dom",[[1,"css-variables-shadow-dom",{"isGreen":[32]}]]],["custom-elements-delegates-focus",[[17,"custom-elements-delegates-focus"]]],["custom-elements-no-delegates-focus",[[1,"custom-elements-no-delegates-focus"]]],["custom-event-root",[[0,"custom-event-root",{"output":[32]}]]],["delegates-focus",[[17,"delegates-focus"]]],["dom-reattach",[[0,"dom-reattach",{"willLoad":[1026,"will-load"],"didLoad":[1026,"did-load"],"didUnload":[1026,"did-unload"]}]]],["dom-reattach-clone",[[4,"dom-reattach-clone"]]],["dom-reattach-clone-deep-slot",[[4,"dom-reattach-clone-deep-slot"]]],["dom-reattach-clone-host",[[4,"dom-reattach-clone-host"]]],["dynamic-css-variable",[[0,"dynamic-css-variable",{"bgColor":[32]}]]],["dynamic-import",[[0,"dynamic-import",{"value":[32],"update":[64]}]]],["es5-addclass-svg",[[1,"es5-addclass-svg"]]],["esm-import",[[1,"esm-import",{"propVal":[2,"prop-val"],"isReady":[32],"stateVal":[32],"listenVal":[32],"someEventInc":[32],"someMethod":[64]},[[0,"click","testClick"]]]]],["event-basic",[[0,"event-basic",{"counter":[32]},[[0,"testEvent","testEventHandler"]]]]],["event-custom-type",[[0,"event-custom-type",{"counter":[32],"lastEventValue":[32]},[[0,"testEvent","testEventHandler"]]]]],["external-import-a",[[0,"external-import-a"]]],["external-import-b",[[0,"external-import-b"]]],["external-import-c",[[0,"external-import-c"]]],["factory-jsx",[[0,"factory-jsx"]]],["image-import",[[0,"image-import"]]],["init-css-root",[[0,"init-css-root"]]],["input-basic-root",[[0,"input-basic-root",{"value":[1025]}]]],["json-basic",[[0,"json-basic"]]],["key-reorder",[[0,"key-reorder",{"num":[2]}]]],["key-reorder-root",[[0,"key-reorder-root",{"isReversed":[32]}]]],["lifecycle-nested-a",[[1,"lifecycle-nested-a"]]],["lifecycle-nested-b",[[1,"lifecycle-nested-b"]]],["lifecycle-nested-c",[[1,"lifecycle-nested-c"]]],["listen-reattach",[[2,"listen-reattach",{"clicked":[32]},[[0,"click","click"]]]]],["listen-window",[[0,"listen-window",{"clicked":[32],"scrolled":[32]},[[8,"click","winClick"],[9,"scroll","winScroll"]]]]],["no-delegates-focus",[[1,"no-delegates-focus"]]],["node-globals",[[0,"node-globals"]]],["node-resolution",[[0,"node-resolution"]]],["reflect-nan-attribute",[[1,"reflect-nan-attribute",{"val":[514]}]]],["reflect-nan-attribute-hyphen",[[1,"reflect-nan-attribute-hyphen",{"valNum":[514,"val-num"]}]]],["reflect-to-attr",[[0,"reflect-to-attr",{"str":[513],"nu":[514],"undef":[513],"null":[513],"bool":[516],"otherBool":[516,"other-bool"],"disabled":[516],"dynamicStr":[1537,"dynamic-str"],"dynamicNu":[514,"dynamic-nu"]}]]],["reparent-style-no-vars",[[1,"reparent-style-no-vars"]]],["reparent-style-with-vars",[[1,"reparent-style-with-vars"]]],["sass-cmp",[[1,"sass-cmp"]]],["shadow-dom-slot-basic",[[1,"shadow-dom-slot-basic"]]],["slot-array-basic",[[4,"slot-array-basic"]]],["slot-array-top",[[1,"slot-array-top"]]],["slot-children-root",[[1,"slot-children-root"]]],["slot-html",[[4,"slot-html",{"inc":[2]}]]],["slot-ng-if",[[4,"slot-ng-if"]]],["slot-no-default",[[4,"slot-no-default"]]],["slotted-css",[[1,"slotted-css"]]],["static-styles",[[0,"static-styles"]]],["svg-attr",[[0,"svg-attr",{"isOpen":[32]}]]],["svg-class",[[0,"svg-class",{"hasColor":[32]}]]],["tag-3d-component",[[0,"tag-3d-component"]]],["tag-88",[[0,"tag-88"]]],["custom-element-child",[[1,"custom-element-child"]]],["lifecycle-async-b",[[0,"lifecycle-async-b",{"value":[1]}]]],["lifecycle-basic-b",[[0,"lifecycle-basic-b",{"value":[1],"rendered":[32]}]]],["lifecycle-unload-a",[[1,"lifecycle-unload-a"]]],["lifecycle-update-b",[[0,"lifecycle-update-b",{"value":[2]}]]],["slot-dynamic-scoped-list",[[2,"slot-dynamic-scoped-list",{"items":[16]}]]],["slot-dynamic-shadow-list",[[1,"slot-dynamic-shadow-list",{"items":[16]}]]],["attribute-basic",[[0,"attribute-basic",{"single":[1],"multiWord":[1,"multi-word"],"customAttr":[1,"my-custom-attr"],"getter":[6145]}]]],["child-reflect-nan-attribute",[[1,"child-reflect-nan-attribute",{"val":[514]}]]],["child-with-reflection",[[1,"child-with-reflection",{"val":[520]}]]],["conditional-rerender",[[4,"conditional-rerender"]]],["custom-element-child-different-name-than-class",[[1,"custom-element-child-different-name-than-class"]]],["listen-jsx",[[2,"listen-jsx",{"wasClicked":[32]},[[0,"click","onClick"]]]]],["scoped-basic",[[6,"scoped-basic"]]],["shadow-dom-array",[[1,"shadow-dom-array",{"values":[16]}]]],["shadow-dom-basic",[[1,"shadow-dom-basic"]]],["shadow-dom-mode",[[33,"shadow-dom-mode"]]],["shadow-dom-slot-nested",[[1,"shadow-dom-slot-nested",{"i":[2]}]]],["sibling-root",[[6,"sibling-root"]]],["slot-array-complex",[[4,"slot-array-complex"]]],["slot-basic",[[4,"slot-basic"]]],["slot-basic-order",[[4,"slot-basic-order"]]],["slot-dynamic-wrapper",[[4,"slot-dynamic-wrapper",{"tag":[1]}]]],["slot-fallback",[[4,"slot-fallback",{"inc":[2]}]]],["slot-light-dom-content",[[4,"slot-light-dom-content"]]],["slot-map-order",[[4,"slot-map-order"]]],["slot-nested-order-child",[[4,"slot-nested-order-child"]]],["slot-reorder",[[4,"slot-reorder",{"reordered":[4]}]]],["slot-replace-wrapper",[[4,"slot-replace-wrapper",{"href":[1]}]]],["custom-element-nested-child",[[1,"custom-element-nested-child"]]],["lifecycle-async-c",[[0,"lifecycle-async-c",{"value":[1]}]]],["lifecycle-basic-c",[[0,"lifecycle-basic-c",{"value":[1],"rendered":[32]}]]],["lifecycle-unload-b",[[1,"lifecycle-unload-b"]]],["lifecycle-update-c",[[0,"lifecycle-update-c",{"value":[2]}]]],["slot-light-list",[[4,"slot-light-list"]]],["slot-light-scoped-list",[[4,"slot-light-scoped-list"]]]], options);
});
