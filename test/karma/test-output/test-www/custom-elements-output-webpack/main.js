/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({}[chunkId]||chunkId) + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/custom-elements-output-webpack/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 0;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/John.Jenkins/projects/stencil/internal/app-data/index.js
const BUILD = {
    allRenderFn: false,
    cmpDidLoad: true,
    cmpDidUnload: false,
    cmpDidUpdate: true,
    cmpDidRender: true,
    cmpWillLoad: true,
    cmpWillUpdate: true,
    cmpWillRender: true,
    connectedCallback: true,
    disconnectedCallback: true,
    element: true,
    event: true,
    hasRenderFn: true,
    lifecycle: true,
    hostListener: true,
    hostListenerTargetWindow: true,
    hostListenerTargetDocument: true,
    hostListenerTargetBody: true,
    hostListenerTargetParent: false,
    hostListenerTarget: true,
    member: true,
    method: true,
    mode: true,
    observeAttribute: true,
    prop: true,
    propMutable: true,
    reflect: true,
    scoped: true,
    shadowDom: true,
    slot: true,
    cssAnnotations: true,
    state: true,
    style: true,
    svg: true,
    updatable: true,
    vdomAttribute: true,
    vdomXlink: true,
    vdomClass: true,
    vdomFunctional: true,
    vdomKey: true,
    vdomListener: true,
    vdomRef: true,
    vdomPropOrAttr: true,
    vdomRender: true,
    vdomStyle: true,
    vdomText: true,
    watchCallback: true,
    taskQueue: true,
    hotModuleReplacement: false,
    isDebug: false,
    isDev: false,
    isTesting: false,
    hydrateServerSide: false,
    hydrateClientSide: false,
    lifecycleDOMEvents: false,
    lazyLoad: false,
    profile: false,
    slotRelocation: true,
    cloneNodeFix: false,
    hydratedAttribute: false,
    hydratedClass: true,
    safari10: false,
    scriptDataOpts: false,
    shadowDomShim: false,
    invisiblePrehydration: true,
    propBoolean: true,
    propNumber: true,
    propString: true,
    cssVarShim: false,
    constructableCSS: true,
    cmpShouldUpdate: true,
    devTools: false,
    dynamicImportShim: false,
    shadowDelegatesFocus: true,
    initializeNextTick: false,
    asyncLoading: false,
    asyncQueue: false,
    transformTagName: false,
    attachStyles: true,
};
const Env = {};
const NAMESPACE = /* default */ 'app';



// CONCATENATED MODULE: /Users/John.Jenkins/projects/stencil/internal/client/index.js
/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/snabbdom/snabbdom/blob/master/LICENSE
 *
 * Modified for Stencil's renderer and slot projection
 */
let client_scopeId;
let contentRef;
let hostTagName;
let customError;
let client_i = 0;
let useNativeShadowDom = false;
let checkSlotFallbackVisibility = false;
let checkSlotRelocate = false;
let client_isSvgMode = false;
let renderingRef = null;
let queueCongestion = 0;
let queuePending = false;
/*
 Stencil Client Platform v2.23.2 | MIT Licensed | https://stenciljs.com
 */

const Build = {
    isDev: BUILD.isDev ? true : false,
    isBrowser: true,
    isServer: false,
    isTesting: BUILD.isTesting ? true : false,
};
const Context = {};
const getAssetPath = (path) => {
    const assetUrl = new URL(path, plt.$resourcesUrl$);
    return assetUrl.origin !== win.location.origin ? assetUrl.href : assetUrl.pathname;
};
const setAssetPath = (path) => (plt.$resourcesUrl$ = path);
const createTime = (fnName, tagName = '') => {
    if (BUILD.profile && performance.mark) {
        const key = `st:${fnName}:${tagName}:${client_i++}`;
        // Start
        performance.mark(key);
        // End
        return () => performance.measure(`[Stencil] ${fnName}() <${tagName}>`, key);
    }
    else {
        return () => {
            return;
        };
    }
};
const uniqueTime = (key, measureText) => {
    if (BUILD.profile && performance.mark) {
        if (performance.getEntriesByName(key).length === 0) {
            performance.mark(key);
        }
        return () => {
            if (performance.getEntriesByName(measureText).length === 0) {
                performance.measure(measureText, key);
            }
        };
    }
    else {
        return () => {
            return;
        };
    }
};
const inspect = (ref) => {
    const hostRef = getHostRef(ref);
    if (!hostRef) {
        return undefined;
    }
    const flags = hostRef.$flags$;
    const hostElement = hostRef.$hostElement$;
    return {
        renderCount: hostRef.$renderCount$,
        flags: {
            hasRendered: !!(flags & 2 /* HOST_FLAGS.hasRendered */),
            hasConnected: !!(flags & 1 /* HOST_FLAGS.hasConnected */),
            isWaitingForChildren: !!(flags & 4 /* HOST_FLAGS.isWaitingForChildren */),
            isConstructingInstance: !!(flags & 8 /* HOST_FLAGS.isConstructingInstance */),
            isQueuedForUpdate: !!(flags & 16 /* HOST_FLAGS.isQueuedForUpdate */),
            hasInitializedComponent: !!(flags & 32 /* HOST_FLAGS.hasInitializedComponent */),
            hasLoadedComponent: !!(flags & 64 /* HOST_FLAGS.hasLoadedComponent */),
            isWatchReady: !!(flags & 128 /* HOST_FLAGS.isWatchReady */),
            isListenReady: !!(flags & 256 /* HOST_FLAGS.isListenReady */),
            needsRerender: !!(flags & 512 /* HOST_FLAGS.needsRerender */),
        },
        instanceValues: hostRef.$instanceValues$,
        ancestorComponent: hostRef.$ancestorComponent$,
        hostElement,
        lazyInstance: hostRef.$lazyInstance$,
        vnode: hostRef.$vnode$,
        modeName: hostRef.$modeName$,
        onReadyPromise: hostRef.$onReadyPromise$,
        onReadyResolve: hostRef.$onReadyResolve$,
        onInstancePromise: hostRef.$onInstancePromise$,
        onInstanceResolve: hostRef.$onInstanceResolve$,
        onRenderResolve: hostRef.$onRenderResolve$,
        queuedListeners: hostRef.$queuedListeners$,
        rmListeners: hostRef.$rmListeners$,
        ['s-id']: hostElement['s-id'],
        ['s-cr']: hostElement['s-cr'],
        ['s-lr']: hostElement['s-lr'],
        ['s-p']: hostElement['s-p'],
        ['s-rc']: hostElement['s-rc'],
        ['s-sc']: hostElement['s-sc'],
    };
};
const installDevTools = () => {
    if (BUILD.devTools) {
        const stencil = (win.stencil = win.stencil || {});
        const originalInspect = stencil.inspect;
        stencil.inspect = (ref) => {
            let result = inspect(ref);
            if (!result && typeof originalInspect === 'function') {
                result = originalInspect(ref);
            }
            return result;
        };
    }
};
const CONTENT_REF_ID = 'r';
const ORG_LOCATION_ID = 'o';
const SLOT_NODE_ID = 's';
const TEXT_NODE_ID = 't';
const COMMENT_NODE_ID = 'c';
const HYDRATE_ID = 's-id';
const HYDRATED_STYLE_ID = 'sty-id';
const HYDRATE_CHILD_ID = 'c-id';
const HYDRATED_CSS = '{visibility:hidden}.hydrated{visibility:inherit}';
const HYDRATED_SLOT_FALLBACK_ID = 'sf-id';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
/**
 * Default style mode id
 */
/**
 * Reusable empty obj/array
 * Don't add values to these!!
 */
const EMPTY_OBJ = {};
/**
 * Namespaces
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const HTML_NS = 'http://www.w3.org/1999/xhtml';
const isDef = (v) => v != null;
const isComplexType = (o) => {
    // https://jsperf.com/typeof-fn-object/5
    o = typeof o;
    return o === 'object' || o === 'function';
};
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
/**
 * Production h() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, child?: d.ChildType): d.VNode;
// export function h(nodeName: string | d.FunctionalComponent, vnodeData: d.PropsType, ...children: d.ChildType[]): d.VNode;
const h = (nodeName, vnodeData, ...children) => {
    let child = null;
    let key = null;
    let slotName = null;
    let simple = false;
    let lastSimple = false;
    const vNodeChildren = [];
    const walk = (c) => {
        for (let i = 0; i < c.length; i++) {
            child = c[i];
            if (Array.isArray(child)) {
                walk(child);
            }
            else if (child != null && typeof child !== 'boolean') {
                if ((simple = typeof nodeName !== 'function' && !isComplexType(child))) {
                    child = String(child);
                }
                else if (BUILD.isDev && typeof nodeName !== 'function' && child.$flags$ === undefined) {
                    consoleDevError(`vNode passed as children has unexpected type.
Make sure it's using the correct h() function.
Empty objects can also be the cause, look for JSX comments that became objects.`);
                }
                if (simple && lastSimple) {
                    // If the previous child was simple (string), we merge both
                    vNodeChildren[vNodeChildren.length - 1].$text$ += child;
                }
                else {
                    // Append a new vNode, if it's text, we create a text vNode
                    vNodeChildren.push(simple ? client_newVNode(null, child) : child);
                }
                lastSimple = simple;
            }
        }
    };
    walk(children);
    if (vnodeData) {
        if (BUILD.isDev && nodeName === 'input') {
            validateInputProperties(vnodeData);
        }
        // normalize class / classname attributes
        if (BUILD.vdomKey && vnodeData.key) {
            key = vnodeData.key;
        }
        if (BUILD.slotRelocation && vnodeData.name) {
            slotName = vnodeData.name;
        }
        if (BUILD.vdomClass) {
            const classData = vnodeData.className || vnodeData.class;
            if (classData) {
                vnodeData.class =
                    typeof classData !== 'object'
                        ? classData
                        : Object.keys(classData)
                            .filter((k) => classData[k])
                            .join(' ');
            }
        }
    }
    if (BUILD.isDev && vNodeChildren.some(isHost)) {
        consoleDevError(`The <Host> must be the single root component. Make sure:
- You are NOT using hostData() and <Host> in the same component.
- <Host> is used once, and it's the single root component of the render() function.`);
    }
    if (BUILD.vdomFunctional && typeof nodeName === 'function') {
        // nodeName is a functional component
        return nodeName(vnodeData === null ? {} : vnodeData, vNodeChildren, vdomFnUtils);
    }
    const vnode = client_newVNode(nodeName, null);
    vnode.$attrs$ = vnodeData;
    if (vNodeChildren.length > 0) {
        vnode.$children$ = vNodeChildren;
    }
    if (BUILD.vdomKey) {
        vnode.$key$ = key;
    }
    if (BUILD.slotRelocation) {
        vnode.$name$ = slotName;
    }
    return vnode;
};
const client_newVNode = (tag, text) => {
    const vnode = {
        $flags$: 0,
        $tag$: tag,
        $text$: text,
        $elm$: null,
        $children$: null,
    };
    if (BUILD.vdomAttribute) {
        vnode.$attrs$ = null;
    }
    if (BUILD.vdomKey) {
        vnode.$key$ = null;
    }
    if (BUILD.slotRelocation) {
        vnode.$name$ = null;
    }
    return vnode;
};
const Host = {};
const isHost = (node) => node && node.$tag$ === Host;
/**
 * Implementation of {@link d.FunctionalUtilities} for Stencil's VDom.
 *
 * Note that these functions convert from {@link d.VNode} to
 * {@link d.ChildNode} to give functional component developers a friendly
 * interface.
 */
const vdomFnUtils = {
    forEach: (children, cb) => children.map(convertToPublic).forEach(cb),
    map: (children, cb) => children.map(convertToPublic).map(cb).map(convertToPrivate),
};
const convertToPublic = (node) => ({
    vattrs: node.$attrs$,
    vchildren: node.$children$,
    vkey: node.$key$,
    vname: node.$name$,
    vtag: node.$tag$,
    vtext: node.$text$,
});
const convertToPrivate = (node) => {
    if (typeof node.vtag === 'function') {
        const vnodeData = Object.assign({}, node.vattrs);
        if (node.vkey) {
            vnodeData.key = node.vkey;
        }
        if (node.vname) {
            vnodeData.name = node.vname;
        }
        return h(node.vtag, vnodeData, ...(node.vchildren || []));
    }
    const vnode = client_newVNode(node.vtag, node.vtext);
    vnode.$attrs$ = node.vattrs;
    vnode.$children$ = node.vchildren;
    vnode.$key$ = node.vkey;
    vnode.$name$ = node.vname;
    return vnode;
};
/**
 * Validates the ordering of attributes on an input element
 * @param inputElm the element to validate
 */
const validateInputProperties = (inputElm) => {
    const props = Object.keys(inputElm);
    const value = props.indexOf('value');
    if (value === -1) {
        return;
    }
    const typeIndex = props.indexOf('type');
    const minIndex = props.indexOf('min');
    const maxIndex = props.indexOf('max');
    const stepIndex = props.indexOf('step');
    if (value < typeIndex || value < minIndex || value < maxIndex || value < stepIndex) {
        consoleDevWarn(`The "value" prop of <input> should be set after "min", "max", "type" and "step"`);
    }
};
/**
 * Show or hide a slot nodes children
 * @param slotNode a slot node, the 'children' of which should be shown or hidden
 * @param hide whether to hide the slot node 'children'
 * @returns
 */
const renderSlotFallbackContent = (slotNode, hide) => {
    // if this slot doesn't have fallback content, return
    if (!slotNode['s-hsf'] || !slotNode.parentNode)
        return;
    // in non-shadow component, slot nodes are just empty text nodes or comment nodes
    // the 'children' nodes are therefore placed next to it.
    // let's loop through those now
    let childNodes = (slotNode.parentNode.__childNodes ||
        slotNode.parentNode.childNodes);
    let childNode;
    const childNodesLen = childNodes.length;
    let i = 0;
    for (i; i < childNodesLen; i++) {
        childNode = childNodes[i];
        if (childNode['s-sr'] && hide && childNode['s-psn'] === slotNode['s-sn']) {
            // if this child node is a nested slot
            // drill into it's children to hide them in-turn
            renderSlotFallbackContent(childNode, true);
            continue;
        }
        // this child node doesn't relate to this slot?
        if (childNode['s-sn'] !== slotNode['s-sn'])
            continue;
        if (childNode.nodeType === 1 /* NODE_TYPE.ElementNode */ && childNode['s-sf']) {
            // we found an fallback element. Hide or show
            childNode.hidden = hide;
            childNode.style.display = hide ? 'none' : '';
        }
        else if (!!childNode['s-sfc']) {
            // this child has fallback text. Add or remove it
            if (hide) {
                childNode['s-sfc'] = childNode.textContent || undefined;
                childNode.textContent = '';
            }
            else if (!childNode.textContent || childNode.textContent.trim() === '') {
                childNode.textContent = childNode['s-sfc'];
            }
        }
    }
};
/**
 * Function applied to non-shadow component nodes to mimic native shadowDom behaviour:
 * - When slotted node/s are not present, show `<slot>` node children
 * - When slotted node/s *are* present, hide `<slot>` node children
 * @param node an entry whose children to iterate over
 */
const updateFallbackSlotVisibility = (node) => {
    if (!node)
        return;
    const childNodes = node.__childNodes || node.childNodes;
    let slotNode;
    let i;
    let ilen;
    let j;
    let slotNameAttr;
    let nodeType;
    for (i = 0, ilen = childNodes.length; i < ilen; i++) {
        // slot reference node?
        if (childNodes[i]['s-sr']) {
            // this component uses slots and we're on a slot node
            // let's find all it's slotted children or lack thereof
            // and show or hide fallback nodes (`<slot />` children)
            // get the slot name for this slot reference node
            slotNameAttr = childNodes[i]['s-sn'];
            slotNode = childNodes[i];
            // by default always show a fallback slot node
            // then hide it if there are other slotted nodes in the light dom
            renderSlotFallbackContent(slotNode, false);
            // because we found a slot fallback node let's loop over all
            // the children again to
            for (j = 0; j < ilen; j++) {
                nodeType = childNodes[j].nodeType;
                // ignore slot fallback nodes
                if (childNodes[j]['s-sf'])
                    continue;
                // is sibling node is from a different component OR is a named fallback slot node?
                if (childNodes[j]['s-hn'] !== slotNode['s-hn'] || slotNameAttr !== '') {
                    // you can't slot a textNode in a named slot
                    if (nodeType === 1 /* NODE_TYPE.ElementNode */ && slotNameAttr === childNodes[j]['s-sn']) {
                        // we found a slotted element!
                        // let's hide all the fallback nodes
                        renderSlotFallbackContent(slotNode, true);
                        // patches this node's removal methods
                        // so if it gets removed in the future
                        // re-asses the fallback node status
                        patchRemove(childNodes[j]);
                        break;
                    }
                }
                else if (childNodes[j]['s-sn'] === slotNameAttr) {
                    // this is a default fallback slot node
                    // any element or text node (with content)
                    // should hide the default fallback slot node
                    if (nodeType === 1 /* NODE_TYPE.ElementNode */ ||
                        (nodeType === 3 /* NODE_TYPE.TextNode */ &&
                            childNodes[j] &&
                            childNodes[j].textContent &&
                            childNodes[j].textContent.trim() !== '')) {
                        // we found a slotted something
                        // let's hide all the fallback nodes
                        renderSlotFallbackContent(slotNode, true);
                        // patches this node's removal methods
                        // so if it gets removed in the future
                        // re-asses the fallback node status
                        patchRemove(childNodes[j]);
                        break;
                    }
                }
            }
        }
        // keep drilling down
        updateFallbackSlotVisibility(childNodes[i]);
    }
};
const patchPseudoShadowDom = (HostElementPrototype, DescriptorPrototype) => {
    patchChildNodes(HostElementPrototype, DescriptorPrototype);
    patchInsertBefore(HostElementPrototype);
    patchAppendChild(HostElementPrototype);
    patchAppend(HostElementPrototype);
    patchPrepend(HostElementPrototype);
    patchInsertAdjacentHTML(HostElementPrototype);
    patchInsertAdjacentText(HostElementPrototype);
    patchInsertAdjacentElement(HostElementPrototype);
    patchReplaceChildren(HostElementPrototype);
    patchInnerHTML(HostElementPrototype, DescriptorPrototype);
    patchInnerText(HostElementPrototype, DescriptorPrototype);
    patchTextContent(HostElementPrototype, DescriptorPrototype);
};
////// non-shadow host component patches
/**
 * Patch `cloneNode()` for non-shadow components ()
 * @param HostElementPrototype the host prototype to polyfill
 */
const patchCloneNode = (HostElementPrototype) => {
    HostElementPrototype.__cloneNode = HostElementPrototype.cloneNode;
    HostElementPrototype.cloneNode = function (deep) {
        const srcNode = this;
        const clonedNode = HostElementPrototype.__cloneNode.call(srcNode, false);
        if (BUILD.slot && deep) {
            let i = 0;
            let slotted, nonStencilNode;
            const stencilPrivates = [
                's-id',
                's-cr',
                's-lr',
                's-rc',
                's-sc',
                's-p',
                's-cn',
                's-sr',
                's-sn',
                's-hn',
                's-ol',
                's-nr',
                's-si',
                's-sf',
                's-sfc',
                's-hsf',
            ];
            for (; i < srcNode.__childNodes.length; i++) {
                slotted = srcNode.__childNodes[i]['s-nr'];
                nonStencilNode = stencilPrivates.every((privateField) => !srcNode.__childNodes[i][privateField]);
                if (slotted) {
                    clonedNode.__appendChild(slotted.cloneNode(true));
                }
                if (nonStencilNode) {
                    clonedNode.__appendChild(srcNode.__childNodes[i].cloneNode(true));
                }
            }
        }
        return clonedNode;
    };
};
/**
 * Patches children accessors of a non-shadow component.
 * (`childNodes`, `children`, `firstChild`, `lastChild` and `childElementCount`)
 * @param HostElementPrototype
 */
const patchChildNodes = (HostElementPrototype, DescriptorPrototype) => {
    if (!globalThis.Node)
        return;
    class FakeNodeList extends Array {
        item(n) {
            return this[n];
        }
    }
    let childNodesDesc = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'childNodes');
    if (!childNodesDesc) {
        childNodesDesc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Node.prototype), 'childNodes');
    }
    if (childNodesDesc)
        Object.defineProperty(HostElementPrototype, '__childNodes', childNodesDesc);
    let childrenDesc = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'children');
    // MockNode won't have these
    if (childrenDesc)
        Object.defineProperty(HostElementPrototype, '__children', childrenDesc);
    const childElementCountDesc = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'childElementCount');
    if (childElementCountDesc)
        Object.defineProperty(HostElementPrototype, '__childElementCount', childElementCountDesc);
    Object.defineProperty(HostElementPrototype, 'children', {
        get() {
            return this.childNodes
                .map((n) => {
                if (n.nodeType === 1 /* NODE_TYPE.ElementNode */)
                    return n;
                else
                    return null;
            })
                .filter((n) => !!n);
        },
    });
    Object.defineProperty(HostElementPrototype, 'firstChild', {
        get() {
            return this.childNodes[0];
        },
    });
    Object.defineProperty(HostElementPrototype, 'lastChild', {
        get() {
            return this.childNodes[this.childNodes.length - 1];
        },
    });
    Object.defineProperty(HostElementPrototype, 'childElementCount', {
        get() {
            return HostElementPrototype.children.length;
        },
    });
    if (!childNodesDesc)
        return;
    Object.defineProperty(HostElementPrototype, 'childNodes', {
        get() {
            const childNodes = this.__childNodes;
            const result = new FakeNodeList();
            for (let i = 0; i < childNodes.length; i++) {
                const slottedNode = childNodes[i]['s-nr'];
                if (slottedNode &&
                    (slottedNode.nodeType !== 8 /* NODE_TYPE.CommentNode */ || slottedNode.nodeValue.indexOf(ORG_LOCATION_ID + '.') !== 0)) {
                    result.push(slottedNode);
                }
            }
            return result;
        },
    });
};
/**
 * Patches the inner html accessors of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInnerHTML = (HostElementPrototype, DescriptorPrototype) => {
    if (!globalThis.Element)
        return;
    let descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'innerHTML');
    // on IE it's on HTMLElement.prototype
    if (!descriptor)
        descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerHTML');
    // MockNode won't have these
    if (descriptor)
        Object.defineProperty(HostElementPrototype, '__innerHTML', descriptor);
    Object.defineProperty(HostElementPrototype, 'innerHTML', {
        get: function () {
            let html = '';
            this.childNodes.forEach((node) => (html += node.outerHTML || node.textContent));
            return html;
        },
        set: function (value) {
            this.childNodes.forEach((node) => {
                if (node['s-ol']) {
                    try {
                        node['s-ol'].remove();
                    }
                    catch (e) { }
                }
                node.remove();
            });
            this.insertAdjacentHTML('beforeend', value);
        },
    });
};
/**
 * Patches the inner text accessors of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInnerText = (HostElementPrototype, DescriptorPrototype) => {
    if (!globalThis.Element)
        return;
    let descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'innerText');
    // on IE it's on HTMLElement.prototype
    if (!descriptor)
        descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');
    // MockNode won't have these
    if (descriptor)
        Object.defineProperty(HostElementPrototype, '__innerText', descriptor);
    Object.defineProperty(HostElementPrototype, 'innerText', {
        get: function () {
            let text = '';
            this.childNodes.forEach((node) => {
                if (node.innerText)
                    text += node.innerText;
                else if (node.textContent)
                    text += node.textContent.trimEnd();
            });
            return text;
        },
        set: function (value) {
            this.childNodes.forEach((node) => {
                if (node['s-ol'])
                    node['s-ol'].remove();
                node.remove();
            });
            this.insertAdjacentHTML('beforeend', value);
        },
    });
};
/**
 * Patches the text content accessors of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchTextContent = (HostElementPrototype, DescriptorPrototype) => {
    if (!globalThis.Node)
        return;
    const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'textContent');
    // MockNode won't have these
    if (descriptor)
        Object.defineProperty(HostElementPrototype, '__textContent', descriptor);
    Object.defineProperty(HostElementPrototype, 'textContent', {
        get: function () {
            let text = '';
            this.childNodes.forEach((node) => (text += node.textContent || ''));
            return text;
        },
        set: function (value) {
            this.childNodes.forEach((node) => {
                if (node['s-ol'])
                    node['s-ol'].remove();
                node.remove();
            });
            this.insertAdjacentHTML('beforeend', value);
        },
    });
};
/**
 * Patches the `insertBefore` of a non-shadow component.
 * The problem solved being that the 'current' node to insert before may not be in the root of our component.
 * This tries to find where the 'current' node lives within the component and insert the new node before it
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertBefore = (HostElementPrototype) => {
    if (HostElementPrototype.__insertBefore)
        return;
    HostElementPrototype.__insertBefore = HostElementPrototype.insertBefore;
    HostElementPrototype.insertBefore = function (newChild, curChild) {
        const slotName = (newChild['s-sn'] = getSlotName(newChild));
        const slotNode = getHostSlotNode(this.__childNodes, slotName);
        if (slotNode) {
            let found = false;
            this.childNodes.forEach((childNode) => {
                // we found the node in our list of other 'lightDOM' / slotted nodes
                if (childNode === curChild || curChild === null) {
                    found = true;
                    addSlotRelocateNode(newChild, slotNode);
                    if (curChild === null) {
                        this.__append(newChild);
                        return;
                    }
                    if (slotName === curChild['s-sn']) {
                        // current child ('slot before' node) is 'in' the same slot
                        const insertBefore = curChild.parentNode.__insertBefore || curChild.parentNode.insertBefore;
                        insertBefore.call(curChild.parentNode, newChild, curChild);
                        patchRemove(newChild);
                    }
                    else {
                        // current child is not in the same slot as 'slot before' node
                        // so just toss the node in wherever
                        this.__append(newChild);
                    }
                    return;
                }
            });
            if (found) {
                return newChild;
            }
        }
        return this.__insertBefore(newChild, curChild);
    };
};
/**
 * Patches the `appendChild` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchAppendChild = (HostElementPrototype) => {
    if (HostElementPrototype.__appendChild)
        return;
    HostElementPrototype.__appendChild = HostElementPrototype.appendChild;
    HostElementPrototype.appendChild = function (newChild) {
        const slotName = (newChild['s-sn'] = getSlotName(newChild));
        const slotNode = getHostSlotNode(this.__childNodes || this.childNodes, slotName);
        if (slotNode) {
            addSlotRelocateNode(newChild, slotNode);
            const slotChildNodes = getHostSlotChildNodes(slotNode);
            const appendAfter = slotChildNodes[slotChildNodes.length - 1];
            if (appendAfter.parentNode) {
                const parent = appendAfter.parentNode;
                parent.__insertBefore
                    ? parent.__insertBefore(newChild, appendAfter.nextSibling)
                    : parent.insertBefore(newChild, appendAfter.nextSibling);
                patchRemove(newChild);
            }
            if (slotNode['s-hsf']) {
                updateFallbackSlotVisibility(slotNode.parentNode);
            }
            return newChild;
        }
        if (newChild.nodeType === 1 /* NODE_TYPE.ElementNode */ && !!newChild.getAttribute('slot') && this.__childNodes)
            newChild.hidden = true;
        return this.__appendChild(newChild);
    };
};
/**
 * Patches the `prepend` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchPrepend = (HostElementPrototype) => {
    if (HostElementPrototype.__prepend)
        return;
    HostElementPrototype.__prepend = HostElementPrototype.prepend;
    HostElementPrototype.prepend = function (...newChildren) {
        newChildren.forEach((newChild) => {
            if (typeof newChild === 'string') {
                newChild = this.ownerDocument.createTextNode(newChild);
            }
            const slotName = (newChild['s-sn'] = getSlotName(newChild));
            const slotNode = getHostSlotNode(this.__childNodes, slotName);
            if (slotNode) {
                addSlotRelocateNode(newChild, slotNode);
                const slotChildNodes = getHostSlotChildNodes(slotNode);
                const appendAfter = slotChildNodes[0];
                if (appendAfter.parentNode) {
                    appendAfter.parentNode.insertBefore(newChild, appendAfter.nextSibling);
                    patchRemove(newChild);
                }
                if (slotNode['s-hsf']) {
                    updateFallbackSlotVisibility(slotNode.parentNode);
                }
                return;
            }
            if (newChild.nodeType === 1 /* NODE_TYPE.ElementNode */ && !!newChild.getAttribute('slot') && this.__childNodes)
                newChild.hidden = true;
            return this.__prepend(newChild);
        });
    };
};
/**
 * Patches the `append` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchAppend = (HostElementPrototype) => {
    if (HostElementPrototype.__append)
        return;
    HostElementPrototype.__append = HostElementPrototype.append;
    HostElementPrototype.append = function (...newChildren) {
        newChildren.forEach((newChild) => {
            if (typeof newChild === 'string') {
                newChild = this.ownerDocument.createTextNode(newChild);
            }
            this.appendChild(newChild);
        });
    };
};
/**
 * Patches the `replaceChildren` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchReplaceChildren = (HostElementPrototype) => {
    if (HostElementPrototype.__replaceChildren)
        return;
    HostElementPrototype.__replaceChildren = HostElementPrototype.replaceChildren;
    HostElementPrototype.replaceChildren = function (...newChildren) {
        const slotNode = getHostSlotNode(this.__childNodes, '');
        if (slotNode) {
            const slotChildNodes = getHostSlotChildNodes(slotNode);
            slotChildNodes.forEach((node) => {
                if (!node['s-sr']) {
                    node.remove();
                }
            });
            this.append(...newChildren);
        }
    };
};
/**
 * Patches the `insertAdjacentHTML` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertAdjacentHTML = (HostElementPrototype) => {
    if (HostElementPrototype.__insertAdjacentHTML)
        return;
    HostElementPrototype.__insertAdjacentHTML = HostElementPrototype.insertAdjacentHTML;
    HostElementPrototype.insertAdjacentHTML = function (position, text) {
        if (position !== 'afterbegin' && position !== 'beforeend') {
            return this.__insertAdjacentHTML(position, text);
        }
        const container = this.ownerDocument.createElement('_');
        let node;
        container.innerHTML = text;
        if (position === 'afterbegin') {
            while ((node = container.firstChild)) {
                this.prepend(node);
            }
        }
        else if (position === 'beforeend') {
            while ((node = container.firstChild)) {
                this.append(node);
            }
        }
    };
};
/**
 * Patches the `insertAdjacentText` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertAdjacentText = (HostElementPrototype) => {
    if (HostElementPrototype.__insertAdjacentText)
        return;
    HostElementPrototype.__insertAdjacentText = HostElementPrototype.insertAdjacentText;
    HostElementPrototype.insertAdjacentText = function (position, text) {
        this.insertAdjacentHTML(position, text);
    };
};
/**
 * Patches the `insertAdjacentElement` method of a non-shadow component
 * @param HostElementPrototype the host `Element` to be patched
 */
const patchInsertAdjacentElement = (HostElementPrototype) => {
    if (HostElementPrototype.__insertAdjacentElement)
        return;
    HostElementPrototype.__insertAdjacentElement = HostElementPrototype.insertAdjacentElement;
    HostElementPrototype.insertAdjacentElement = function (position, element) {
        if (position !== 'afterbegin' && position !== 'beforeend') {
            return this.__insertAdjacentElement(position, element);
        }
        if (position === 'afterbegin') {
            this.prepend(element);
        }
        else if (position === 'beforeend') {
            this.append(element);
        }
    };
};
////// Slotted node patches
/**
 * Patches sibling accessors (`nextSibling`, `nextSiblingElement`, `previousSibling`, `previousSiblingElement`)
 * of a 'slotted' node within a non-shadow component.
 * @param NodePrototype the slotted node to be patched
 */
const patchNextPrev = (NodePrototype) => {
    // Especially relevant when rendering components via SSR.
    // Frameworks will often try to reconcile their VDOM with the real DOM
    // by stepping through nodes with 'nextSibling' (and similar).
    // This works with a shadowDOM; the lightDOM matches the framework's VDOM.
    // This doesn't work without shadowDOM
    if (!NodePrototype || NodePrototype.__nextSibling || !globalThis.Node)
        return;
    patchNextSibling(NodePrototype);
    patchPreviousSibling(NodePrototype);
    patchNextElementSibling(NodePrototype);
    patchPreviousElementSibling(NodePrototype);
};
/**
 * Patches the `nextSibling` accessor of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
const patchNextSibling = (NodePrototype, DescriptorPrototype) => {
    if (!NodePrototype || NodePrototype.__nextSibling)
        return;
    const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'nextSibling');
    // MockNode might not have these
    if (descriptor)
        Object.defineProperty(NodePrototype, '__nextSibling', descriptor);
    else {
        NodePrototype.__nextSibling = NodePrototype.nextSibling || true;
    }
    Object.defineProperty(NodePrototype, 'nextSibling', {
        get: function () {
            var _a;
            const parentNodes = (_a = this['s-ol']) === null || _a === void 0 ? void 0 : _a.parentNode.childNodes;
            const index = parentNodes === null || parentNodes === void 0 ? void 0 : parentNodes.indexOf(this);
            if (parentNodes && index > -1) {
                return parentNodes[index + 1];
            }
            return this.__nextSibling;
        },
    });
};
/**
 * Patches the `nextElementSibling` accessor of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
const patchNextElementSibling = (ElementPrototype, DescriptorPrototype) => {
    if (!ElementPrototype || ElementPrototype.__nextElementSibling || !ElementPrototype.nextSiblingElement)
        return;
    const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'nextElementSibling');
    // MockNode won't have these
    if (descriptor)
        Object.defineProperty(ElementPrototype, '__nextElementSibling', descriptor);
    else {
        ElementPrototype.__nextElementSibling = ElementPrototype.nextSiblingElement || true;
    }
    Object.defineProperty(ElementPrototype, 'nextElementSibling', {
        get: function () {
            var _a;
            const parentEles = (_a = this['s-ol']) === null || _a === void 0 ? void 0 : _a.parentNode.children;
            const index = parentEles === null || parentEles === void 0 ? void 0 : parentEles.indexOf(this);
            if (parentEles && index > -1) {
                return parentEles[index + 1];
            }
            return this.__nextElementSibling;
        },
    });
};
/**
 * Patches the `previousSibling` accessor of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
const patchPreviousSibling = (NodePrototype, DescriptorPrototype) => {
    if (!NodePrototype || NodePrototype.__previousSibling)
        return;
    const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Node.prototype, 'previousSibling');
    // MockNode won't have these
    if (descriptor)
        Object.defineProperty(NodePrototype, '__previousSibling', descriptor);
    else {
        NodePrototype.__previousSibling = NodePrototype.previousSibling || true;
    }
    Object.defineProperty(NodePrototype, 'previousSibling', {
        get: function () {
            var _a;
            const parentNodes = (_a = this['s-ol']) === null || _a === void 0 ? void 0 : _a.parentNode.childNodes;
            const index = parentNodes === null || parentNodes === void 0 ? void 0 : parentNodes.indexOf(this);
            if (parentNodes && index > -1) {
                return parentNodes[index - 1];
            }
            return this.__previousSibling;
        },
    });
};
/**
 * Patches the `previousElementSibling` accessor of a non-shadow slotted node
 * @param ElementPrototype the slotted node to be patched
 */
const patchPreviousElementSibling = (ElementPrototype, DescriptorPrototype) => {
    if (!ElementPrototype || ElementPrototype.__previousElementSibling || !ElementPrototype.previousElementSibling)
        return;
    const descriptor = Object.getOwnPropertyDescriptor(DescriptorPrototype || Element.prototype, 'previousElementSibling');
    // MockNode won't have these
    if (descriptor)
        Object.defineProperty(ElementPrototype, '__previousElementSibling', descriptor);
    else {
        ElementPrototype.__previousElementSibling = ElementPrototype.previousSiblingElement || true;
    }
    Object.defineProperty(ElementPrototype, 'previousElementSibling', {
        get: function () {
            var _a;
            const parentNodes = (_a = this['s-ol']) === null || _a === void 0 ? void 0 : _a.parentNode.children;
            const index = parentNodes === null || parentNodes === void 0 ? void 0 : parentNodes.indexOf(this);
            if (parentNodes && index > -1) {
                return parentNodes[index - 1];
            }
            return this.__previousElementSibling;
        },
    });
};
/**
 * Patches the `remove` method of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
const patchRemove = (NodePrototype) => {
    if (!NodePrototype || NodePrototype.__remove)
        return;
    NodePrototype.__remove = NodePrototype.remove || true;
    patchRemoveChild(NodePrototype.parentNode);
    NodePrototype.remove = function () {
        if (this.parentNode) {
            return this.parentNode.removeChild(this);
        }
        return this.__remove();
    };
};
/**
 * Patches the `removeChild` method of a non-shadow slotted node
 * @param NodePrototype the slotted node to be patched
 */
const patchRemoveChild = (ElementPrototype) => {
    if (!ElementPrototype || ElementPrototype.__removeChild)
        return;
    ElementPrototype.__removeChild = ElementPrototype.removeChild;
    ElementPrototype.removeChild = function (toRemove) {
        if (toRemove && typeof toRemove['s-sn'] !== 'undefined') {
            const slotNode = getHostSlotNode(this.__childNodes || this.childNodes, toRemove['s-sn']);
            toRemove.parentElement.__removeChild(toRemove);
            if (slotNode && slotNode['s-hsf']) {
                updateFallbackSlotVisibility(slotNode.parentElement);
            }
            return;
        }
        return this.__removeChild(toRemove);
    };
};
////// Utils
/**
 * Creates an empty text node to act as a forwarding address to a slotted node:
 * 1) When non-shadow components re-render, they need a place to temporarily put 'lightDOM' elements.
 * 2) Patched dom methods and accessors use this node to calculate what 'lightDOM' nodes are in the host.
 * @param newChild - A node that's going to be added to the component
 * @param slotNode - The slot node that the node will be added to
 */
const addSlotRelocateNode = (newChild, slotNode, order) => {
    if (newChild['s-ol'] && newChild['s-ol'].isConnected)
        return;
    const slottedNodeLocation = document.createTextNode('');
    slottedNodeLocation['s-nr'] = newChild;
    if (slotNode['s-cr'] && slotNode['s-cr'].parentNode) {
        const parent = slotNode['s-cr'].parentNode;
        const appendChild = parent.__appendChild || parent.appendChild;
        if (typeof order !== 'undefined') {
            slottedNodeLocation['s-oo'] = order;
            const childNodes = (parent.__childNodes || parent.childNodes);
            const slotRelocateNodes = [slottedNodeLocation];
            childNodes.forEach((n) => {
                if (n['s-nr'])
                    slotRelocateNodes.push(n);
            });
            slotRelocateNodes.sort((a, b) => {
                if (!a['s-oo'] || a['s-oo'] < b['s-oo'])
                    return -1;
                else if (!b['s-oo'] || b['s-oo'] < a['s-oo'])
                    return 1;
                return 0;
            });
            slotRelocateNodes.forEach((n) => appendChild.call(slotNode['s-cr'].parentNode, n));
        }
        else {
            appendChild.call(slotNode['s-cr'].parentNode, slottedNodeLocation);
        }
    }
    newChild['s-ol'] = slottedNodeLocation;
};
/**
 * Find the slot name of a given node
 * @param node
 * @returns the node's slot name
 */
const getSlotName = (node) => node['s-sn'] ||
    (node.nodeType === 1 /* NODE_TYPE.ElementNode */ && node.getAttribute('slot')) ||
    node.slot ||
    '';
/**
 * Recursively searches a series of child nodes for a slot with the provided name.
 * @param childNodes the nodes to search for a slot with a specific name.
 * @param slotName the name of the slot to match on.
 * @returns a reference to the slot node that matches the provided name, `null` otherwise
 */
const getHostSlotNode = (childNodes, slotName) => {
    let i = 0;
    let childNode;
    if (!childNodes)
        return null;
    for (; i < childNodes.length; i++) {
        childNode = childNodes[i];
        if (childNode['s-sr'] && childNode['s-sn'] === slotName) {
            return childNode;
        }
        childNode = getHostSlotNode(childNode.childNodes, slotName);
        if (childNode) {
            return childNode;
        }
    }
    return null;
};
/**
 * Get all nodes currently assigned to any given slot node
 * @param slotNode - the slot node to check
 * @returns - all child node 'within' the checked slot node
 */
const getHostSlotChildNodes = (slotNode) => {
    const childNodes = [slotNode];
    const slotName = slotNode['s-sn'] || '';
    while ((slotNode = slotNode.nextSibling) && slotNode['s-sn'] === slotName) {
        childNodes.push(slotNode);
    }
    return childNodes;
};
/**
 * Takes an SSR rendered document, as annotated by 'vdom-annotations.ts' and:
 * 1) Recreate an accurate VDOM tree to reconcile with during 'vdom-render.ts'
 *    (a failure to do so will result in DOM nodes being duplicated when rendering)
 * 2) Add `shadow: true` DOM trees to their document-fragment
 * 3) Move slotted nodes out of shadowDOMs
 * 4) Add meta nodes to non-shadow DOMs and their 'slotted' nodes
 *
 * @param hostElm - the current custom element being hydrated
 * @param tagName - the custom element's tag
 * @param hostId - a unique custom element id
 * @param hostRef - the VNode representing this custom element
 */
const initializeClientHydrate = (hostElm, tagName, hostId, hostRef) => {
    const endHydrate = createTime('hydrateClient', tagName);
    const shadowRoot = hostElm.shadowRoot;
    const childRenderNodes = [];
    const slotNodes = [];
    const slottedNodes = [];
    const shadowRootNodes = BUILD.shadowDom && shadowRoot ? [] : null;
    let vnode = client_newVNode(tagName, null);
    vnode.$elm$ = hostElm;
    if (!plt.$orgLocNodes$) {
        // this is the first pass over of this whole document
        // does a quick scrape to construct a 'bare-bones' tree of
        // what elements we have and where content has been moved from
        initializeDocumentHydrate(doc.body, (plt.$orgLocNodes$ = new Map()));
    }
    hostElm[HYDRATE_ID] = hostId;
    hostElm.removeAttribute(HYDRATE_ID);
    hostRef.$vnode$ = clientHydrate(vnode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, hostElm, hostId, slottedNodes);
    let crIndex = 0;
    const crLength = childRenderNodes.length;
    let childRenderNode;
    // Steps through childNodes we found.
    // If moved from an original location (by nature of being rendered in SSR markup)
    // we might be able to move it back there now,
    // so slotted nodes don't get added to internal shadowDOMs
    for (crIndex; crIndex < crLength; crIndex++) {
        childRenderNode = childRenderNodes[crIndex];
        const orgLocationId = childRenderNode.$hostId$ + '.' + childRenderNode.$nodeId$;
        const orgLocationNode = plt.$orgLocNodes$.get(orgLocationId);
        const node = childRenderNode.$elm$;
        if (!shadowRoot) {
            node['s-hn'] = tagName.toUpperCase();
            if (childRenderNode.$tag$ === 'slot') {
                // if this is a 'mock slot'
                // add it's content position reference now.
                // otherwise vdom-render will try to add nodes to it
                // (it's a comment node so will error)
                node['s-cr'] = hostElm['s-cr'];
            }
        }
        if (orgLocationNode && orgLocationNode.isConnected) {
            if (shadowRoot && orgLocationNode['s-en'] === '') {
                // if this node is within a shadowDOM, with an original location home
                // we're safe to move it now
                orgLocationNode.parentNode.insertBefore(node, orgLocationNode.nextSibling);
            }
            // Remove original location / slot reference comment now regardless:
            // 1) Stops SSR frameworks complaining about mismatches
            // 2) is un-required for non-shadow, slotted nodes as
            //    we'll add all the meta nodes we need when we deal with *all* slotted nodes ↓↓↓
            orgLocationNode.parentNode.removeChild(orgLocationNode);
            if (!shadowRoot) {
                // Add the original order of this node.
                // we'll use it later to make sure slotted nodes
                // get added in the right, original order
                node['s-oo'] = parseInt(childRenderNode.$nodeId$);
            }
        }
        // remove the original location from the map
        plt.$orgLocNodes$.delete(orgLocationId);
    }
    const hosts = [];
    let snIndex = 0;
    const snLen = slottedNodes.length;
    let slotGroup;
    let snGroupIdx;
    let snGroupLen;
    let slottedItem;
    // Loops through all the slotted nodes we found while
    // stepping through this component
    for (snIndex; snIndex < snLen; snIndex++) {
        slotGroup = slottedNodes[snIndex];
        if (!slotGroup || !slotGroup.length)
            continue;
        snGroupLen = slotGroup.length;
        snGroupIdx = 0;
        for (snGroupIdx; snGroupIdx < snGroupLen; snGroupIdx++) {
            slottedItem = slotGroup[snGroupIdx];
            if (!hosts[slottedItem.hostId]) {
                // cache this host for other grouped slotted nodes
                hosts[slottedItem.hostId] = plt.$orgLocNodes$.get(slottedItem.hostId);
            }
            // this shouldn't happen
            // as we collect all the custom elements first in `initializeDocumentHydrate`
            if (!hosts[slottedItem.hostId])
                continue;
            const hostEle = hosts[slottedItem.hostId];
            // this node is either slotted in a non-shadow host, OR
            // *that* host is nested in a non-shadow host
            if (!hostEle.shadowRoot || !shadowRoot) {
                // try to set an appropriate content position reference
                // (CR) node for this host element
                // a CR already set on the host?
                slottedItem.slot['s-cr'] = hostEle['s-cr'];
                if (!slottedItem.slot['s-cr'] && hostEle.shadowRoot) {
                    // host is shadowDOM - just use the host itself as the CR for native slotting
                    slottedItem.slot['s-cr'] = hostEle;
                }
                else {
                    // if all else fails - just set the CR as the first child
                    // (9/10 if node['s-cr'] hasn't been set, the node will be at the element root)
                    const hostChildren = hostEle.__childNodes || hostEle.childNodes;
                    slottedItem.slot['s-cr'] = hostChildren[0];
                }
                // create our original location node
                addSlotRelocateNode(slottedItem.node, slottedItem.slot, slottedItem.node['s-oo']);
                // patch this node for accessors like `nextSibling` (et al)
                patchNextPrev(slottedItem.node);
            }
            if (hostEle.shadowRoot && slottedItem.node.parentElement !== hostEle) {
                // shadowDOM - move the item to the element root for
                // native slotting
                hostEle.appendChild(slottedItem.node);
            }
        }
    }
    if (BUILD.shadowDom && shadowRoot) {
        // add all the root nodes in the shadowDOM
        // (a root node can have a whole nested DOM tree)
        let rnIdex = 0;
        const rnLen = shadowRootNodes.length;
        for (rnIdex; rnIdex < rnLen; rnIdex++) {
            shadowRoot.appendChild(shadowRootNodes[rnIdex]);
        }
    }
    hostRef.$hostElement$ = hostElm;
    endHydrate();
};
/**
 * Recursively step through a nodes' SSR DOM.
 * Constructs a VDOM. Finds and adds nodes to master arrays
 * (`childRenderNodes`, `shadowRootNodes` and `slottedNodes`)
 * these are used later for special consideration:
 * - Add `shadow: true` DOM trees to their document-fragment
 * - Move slotted nodes out of shadowDOMs
 * - Add meta nodes to non-shadow DOMs and their 'slotted' nodes
 * @param parentVNode - this nodes current parent vnode
 * @param childRenderNodes - flat array of all child vnodes
 * @param slotNodes - nodes that represent an element's `<slot />`s
 * @param shadowRootNodes - nodes that are at the root of this hydrating element
 * @param hostElm - the root, hydrating element
 * @param node - the node currently being iterated over
 * @param hostId - the root, hydrating element id
 * @param slottedNodes - nodes that have been slotted
 * @returns - the constructed VNode
 */
const clientHydrate = (parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node, hostId, slottedNodes = []) => {
    let childNodeType;
    let childIdSplt;
    let childVNode;
    let i;
    const scopeId = hostElm['s-sc'];
    if (node.nodeType === 1 /* NODE_TYPE.ElementNode */) {
        childNodeType = node.getAttribute(HYDRATE_CHILD_ID);
        if (childNodeType) {
            // got the node data from the element's attribute
            // `${hostId}.${nodeId}.${depth}.${index}`
            childIdSplt = childNodeType.split('.');
            if (childIdSplt[0] === hostId || childIdSplt[0] === '0') {
                childVNode = createSimpleVNode({
                    $hostId$: childIdSplt[0],
                    $nodeId$: childIdSplt[1],
                    $depth$: childIdSplt[2],
                    $index$: childIdSplt[3],
                    $tag$: node.tagName.toLowerCase(),
                    $elm$: node,
                    // if we don't add the initial classes to the VNode,
                    // the first vdom-render patch / reconciliation will fail;
                    // any client side change before componentDidLoad will be ignored,
                    // `setAccessor` will just take the element's initial classes
                    $attrs$: { class: node.className },
                });
                childRenderNodes.push(childVNode);
                node.removeAttribute(HYDRATE_CHILD_ID);
                // this is a new child vnode
                // so ensure it's parent vnode has the vchildren array
                if (!parentVNode.$children$) {
                    parentVNode.$children$ = [];
                }
                // test if this element was 'slotted'
                // recreate node attributes
                const slotName = childVNode.$elm$.getAttribute('s-sn');
                if (typeof slotName === 'string') {
                    childVNode.$elm$['s-sn'] = slotName;
                    childVNode.$elm$.removeAttribute('s-sn');
                }
                // test if this node is the child (a slot fallback node) of a slot
                const slotFbId = childVNode.$elm$.getAttribute(HYDRATED_SLOT_FALLBACK_ID);
                if (slotFbId) {
                    childVNode.$elm$.removeAttribute(HYDRATED_SLOT_FALLBACK_ID);
                    // find the relevant slot node
                    const slotNode = slotNodes.find((slot) => slot.$elm$['s-sn'] === childVNode.$elm$['s-sn'] || slot.$name$ === childVNode.$elm$['s-sn']);
                    // add the relationship to the VDOM to stop re-renders
                    if (slotNode) {
                        childVNode.$elm$['s-sf'] = true;
                        childVNode.$elm$['s-hn'] = hostElm.tagName;
                        slotNode.$children$ = slotNode.$children$ || [];
                        slotNode.$children$[childVNode.$index$] = childVNode;
                        // if the slot is an actual `<slot>`
                        // that's a newly created node (↓↓↓)
                        // move this element there now
                        if (slotNode.$elm$.nodeType === 1 /* NODE_TYPE.ElementNode */) {
                            slotNode.$elm$.appendChild(childVNode.$elm$);
                        }
                    }
                }
                else if (childVNode.$index$ !== undefined) {
                    // add our child vnode to a specific index of the vnode's children
                    parentVNode.$children$[childVNode.$index$] = childVNode;
                }
                // host is `scoped: true` - add that flag to child.
                // used in 'setAccessor' to make sure our scoped class is present
                if (scopeId)
                    node['s-si'] = scopeId;
                // this is now the new parent vnode for all the next child checks
                parentVNode = childVNode;
                if (shadowRootNodes &&
                    childVNode.$depth$ === '0' &&
                    // don't move slot fallback node into the root nodes array
                    // they'll be moved into a new slot element ↓↓↓
                    !slotFbId) {
                    shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
                }
            }
        }
        // recursively drill down, end to start so we can
        // construct a VDOM and add meta to nodes
        const nonShadowChildNodes = node.__childNodes || node.childNodes;
        for (i = nonShadowChildNodes.length - 1; i >= 0; i--) {
            clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, nonShadowChildNodes[i], hostId, slottedNodes);
        }
        if (node.shadowRoot) {
            // keep drilling down through the shadow root nodes
            for (i = node.shadowRoot.childNodes.length - 1; i >= 0; i--) {
                clientHydrate(parentVNode, childRenderNodes, slotNodes, shadowRootNodes, hostElm, node.shadowRoot.childNodes[i], hostId, slottedNodes);
            }
        }
    }
    else if (node.nodeType === 8 /* NODE_TYPE.CommentNode */) {
        // `${COMMENT_TYPE}.${hostId}.${nodeId}.${depth}.${index}.${isSlotFallbackText}.${slotName}`
        childIdSplt = node.nodeValue.split('.');
        if (childIdSplt[1] === hostId || childIdSplt[1] === '0') {
            // comment node for either the host id or a 0 host id
            childNodeType = childIdSplt[0];
            childVNode = createSimpleVNode({
                $hostId$: childIdSplt[1],
                $nodeId$: childIdSplt[2],
                $depth$: childIdSplt[3],
                $index$: childIdSplt[4] || '0',
                $elm$: node,
            });
            if (childNodeType === TEXT_NODE_ID) {
                let textNode = (childVNode.$elm$ = node.nextSibling);
                if (childVNode.$elm$ && childVNode.$elm$.nodeType === 3 /* NODE_TYPE.TextNode */) {
                    childVNode.$text$ = childVNode.$elm$.textContent;
                    childRenderNodes.push(childVNode);
                    // remove the text comment since it's no longer needed
                    node.remove();
                    // test to see if this is slot fallback text
                    if (childIdSplt[5] === '1') {
                        textNode['s-sf'] = true;
                        textNode['s-sn'] = childIdSplt[6] || '';
                        textNode['s-sfc'] = textNode.textContent;
                        textNode['s-hn'] = hostElm.tagName;
                        // find the relevant slot node
                        const slotNode = slotNodes.find((slot) => slot.$elm$['s-sn'] === textNode['s-sn'] || slot.$name$ === textNode['s-sn']);
                        // add the relationship to the VDOM to stop re-renders
                        if (slotNode) {
                            slotNode.$children$ = slotNode.$children$ || [];
                            slotNode.$children$[childVNode.$index$] = childVNode;
                            // if the slot is an actual `<slot>`
                            // that's a newly created node (↓↓↓)
                            // move this text node there now
                            if (slotNode.$elm$.nodeType === 1 /* NODE_TYPE.ElementNode */) {
                                slotNode.$elm$.appendChild(textNode);
                            }
                        }
                    }
                    else {
                        // check to make sure this node actually belongs to this host.
                        // If it was slotted from another component, we don't want to add it
                        // to this host's vdom; it can be removed on render reconciliation.
                        // We want slotting logic to take care of it
                        if (hostId === childVNode.$hostId$) {
                            if (!parentVNode.$children$) {
                                parentVNode.$children$ = [];
                            }
                            parentVNode.$children$[childVNode.$index$] = childVNode;
                        }
                        if (shadowRootNodes && childVNode.$depth$ === '0') {
                            shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
                        }
                    }
                }
            }
            else if (childNodeType === COMMENT_NODE_ID) {
                childVNode.$elm$ = node.nextSibling;
                if (childVNode.$elm$ && childVNode.$elm$.nodeType === 8 /* NODE_TYPE.CommentNode */) {
                    childRenderNodes.push(childVNode);
                    // remove the comment comment since it's no longer needed
                    node.remove();
                }
            }
            else if (childVNode.$hostId$ === hostId) {
                // this comment node is specifically for this host id
                if (childNodeType === SLOT_NODE_ID) {
                    // `${SLOT_NODE_ID}.${hostId}.${nodeId}.${depth}.${index}.${slotName}.${hasSlotFallback}.${slotFallbackText}`;
                    childVNode.$tag$ = 'slot';
                    // TODO: this is clunky.
                    // Clear out parent VNode attrs so the initial element state is used as a reference.
                    // The reason: this is a slot container element and requires special scope classes
                    // This does mean any class changes client-side before 'componentDidLoad',
                    // will not be respected.
                    parentVNode.$attrs$ = undefined;
                    // add slot name
                    const slotName = (node['s-sn'] = childVNode.$name$ = childIdSplt[5] || '');
                    node['s-sr'] = true;
                    // this slot node has fallback nodes?
                    if (childIdSplt[6] === '1') {
                        node['s-hsf'] = true;
                    }
                    if (childIdSplt[7] === '1') {
                        // this slot has fallback text
                        // it should be held in the previous comment node
                        // (white-space depending)
                        let foundFallbackText = node.previousSibling;
                        while (!!foundFallbackText && foundFallbackText.nodeType !== 8 /* NODE_TYPE.CommentNode */) {
                            foundFallbackText = foundFallbackText.previousSibling;
                        }
                        // this slot node has fallback text?
                        // (if so, the previous node comment will have that text)
                        node['s-sfc'] = foundFallbackText.nodeValue;
                    }
                    // find this slots' current host parent as dictated by the vdom tree.
                    // this is important because where it is now in the constructed SSR markup
                    // might be different to where to should be
                    const parentNodeId = (parentVNode === null || parentVNode === void 0 ? void 0 : parentVNode.$elm$)
                        ? parentVNode.$elm$['s-id'] || parentVNode.$elm$.getAttribute('s-id')
                        : '';
                    if (BUILD.shadowDom && shadowRootNodes) {
                        /* SHADOW */
                        // browser supports shadowRoot and this is a shadow dom component
                        // create an actual slot element
                        const slot = (childVNode.$elm$ = doc.createElement(childVNode.$tag$));
                        if (childVNode.$name$) {
                            // add the slot name attribute
                            childVNode.$elm$.setAttribute('name', slotName);
                        }
                        if (parentNodeId && parentNodeId !== childVNode.$hostId$) {
                            // shadow component's slot is placed inside a nested component's shadowDOM;
                            // it doesn't belong to this host - it was forwarded by the SSR markup.
                            // Insert it in the root of this host; it's lightDOM.
                            // It doesn't really matter where in the host root; the component will take care of it.
                            parentVNode.$elm$.insertBefore(slot, parentVNode.$elm$.children[0]);
                        }
                        else {
                            // insert the new slot element before the slot comment
                            node.parentNode.insertBefore(childVNode.$elm$, node);
                        }
                        addSlottedNodes(slottedNodes, childIdSplt[2], slotName, node, childVNode.$hostId$);
                        // remove the slot comment since it's not needed for shadow
                        node.remove();
                        if (childVNode.$depth$ === '0') {
                            shadowRootNodes[childVNode.$index$] = childVNode.$elm$;
                        }
                    }
                    else {
                        /* NON-SHADOW */
                        const slot = childVNode.$elm$;
                        // test to see if this non-shadow component's mock 'slot' is placed
                        // inside a nested component's shadowDOM. If so, it doesn't belong here;
                        // it was forwarded by the SSR markup. So we'll insert it into the root of this host;
                        // it's lightDOM with accompanying 'slotted' nodes
                        const shouldMove = parentNodeId && parentNodeId !== childVNode.$hostId$ && parentVNode.$elm$.shadowRoot;
                        // attempt to find any mock slotted nodes which we'll move later
                        addSlottedNodes(slottedNodes, childIdSplt[2], slotName, node, shouldMove ? parentNodeId : childVNode.$hostId$);
                        if (shouldMove) {
                            // move slot comment node (to after any other comment nodes)
                            parentVNode.$elm$.insertBefore(slot, parentVNode.$elm$.children[0]);
                        }
                        childRenderNodes.push(childVNode);
                    }
                    slotNodes.push(childVNode);
                    if (!parentVNode.$children$) {
                        parentVNode.$children$ = [];
                    }
                    parentVNode.$children$[childVNode.$index$] = childVNode;
                }
                else if (childNodeType === CONTENT_REF_ID) {
                    // `${CONTENT_REF_ID}.${hostId}`;
                    if (BUILD.shadowDom && shadowRootNodes) {
                        // remove the content ref comment since it's not needed for shadow
                        node.remove();
                    }
                    else if (BUILD.slotRelocation) {
                        hostElm['s-cr'] = node;
                        node['s-cn'] = true;
                    }
                }
            }
        }
    }
    else if (parentVNode && parentVNode.$tag$ === 'style') {
        const vnode = client_newVNode(null, node.textContent);
        vnode.$elm$ = node;
        vnode.$index$ = '0';
        parentVNode.$children$ = [vnode];
    }
    return parentVNode;
};
/**
 * Skims whole SSR document to create
 * a map of component IDs and 'original location ID's.
 * original location ID's are derived from comment nodes placed by 'vdom-annotations.ts'.
 * They relate to lightDOM nodes that were moved deeper into the SSR markup.
 * e.g. `<!--o.1-->` maps to `<div c-id="0.1">`
 *
 * @param node - a node in the document. If an element, will recursively drill down
 * @param orgLocNodes - a master map to add component ids and original location ids to
 */
const initializeDocumentHydrate = (node, orgLocNodes) => {
    if (node.nodeType === 1 /* NODE_TYPE.ElementNode */) {
        // add all the loaded component IDs in this document
        // they're required to find nodes later
        // when deciding where slotted nodes should live
        const componentId = node[HYDRATE_ID] || node.getAttribute(HYDRATE_ID);
        if (componentId) {
            orgLocNodes.set(componentId, node);
        }
        let i = 0;
        const nonShadowChildNodes = node.__childNodes || node.childNodes;
        for (; i < nonShadowChildNodes.length; i++) {
            initializeDocumentHydrate(nonShadowChildNodes[i], orgLocNodes);
        }
        if (node.shadowRoot) {
            for (i = 0; i < node.shadowRoot.childNodes.length; i++) {
                initializeDocumentHydrate(node.shadowRoot.childNodes[i], orgLocNodes);
            }
        }
    }
    else if (node.nodeType === 8 /* NODE_TYPE.CommentNode */) {
        const childIdSplt = node.nodeValue.split('.');
        if (childIdSplt[0] === ORG_LOCATION_ID) {
            orgLocNodes.set(childIdSplt[1] + '.' + childIdSplt[2], node);
            // useful to know if the original location is
            // the root light-dom of a shadow dom component
            node['s-en'] = childIdSplt[3];
        }
    }
};
/**
 * Creates a vnode to add to a hydrated component vdom
 * @param vnode - a vnode partial which will be augmented
 * @returns an complete vnode
 */
const createSimpleVNode = (vnode) => {
    const defaultVNode = {
        $flags$: 0,
        $hostId$: null,
        $nodeId$: null,
        $depth$: null,
        $index$: '0',
        $elm$: null,
        $attrs$: null,
        $children$: null,
        $key$: null,
        $name$: null,
        $tag$: null,
        $text$: null,
    };
    return Object.assign(Object.assign({}, defaultVNode), vnode);
};
/**
 * Adds groups of slotted nodes (grouped by slot ID)
 * to this host element's 'master' array. We'll use this after
 * the host element's VDOM is completely constructed to
 * finally position or / and add meta information required by non-shadow slotted nodes
 * @param slottedNodes - the main host element 'master' array to add to
 * @param slotNodeId - the slot node unique ID
 * @param slotName - the slot node name (can be '')
 * @param slotNode - the slot node
 * @param hostId - the host element id where this node should be slotted
 */
const addSlottedNodes = (slottedNodes, slotNodeId, slotName, slotNode, hostId) => {
    let slottedNode = slotNode.nextSibling;
    slottedNodes[slotNodeId] = slottedNodes[slotNodeId] || [];
    // looking for nodes that match this slot's name,
    // OR are text / comment nodes and the slot is a default slot (no name)
    // (text / comments cannot be direct descendants of named slots)
    // also ignore slot fallback nodes
    while (slottedNode &&
        (slottedNode['s-sn'] === slotName ||
            (slotName === '' &&
                !slottedNode['s-sn'] &&
                ((slottedNode.nodeType === 8 /* NODE_TYPE.CommentNode */ && slottedNode.nodeValue.indexOf('.') !== 1) ||
                    slottedNode.nodeType === 3 /* NODE_TYPE.TextNode */))) &&
        !slottedNode['s-sf']) {
        slottedNode['s-sn'] = slotName;
        slottedNodes[slotNodeId].push({ slot: slotNode, node: slottedNode, hostId });
        slottedNode = slottedNode.nextSibling;
    }
};
// Private
const computeMode = (elm) => modeResolutionChain.map((h) => h(elm)).find((m) => !!m);
// Public
const setMode = (handler) => modeResolutionChain.push(handler);
const getMode = (ref) => getHostRef(ref).$modeName$;
/**
 * Parse a new property value for a given property type.
 *
 * While the prop value can reasonably be expected to be of `any` type as far as TypeScript's type checker is concerned,
 * it is not safe to assume that the string returned by evaluating `typeof propValue` matches:
 *   1. `any`, the type given to `propValue` in the function signature
 *   2. the type stored from `propType`.
 *
 * This function provides the capability to parse/coerce a property's value to potentially any other JavaScript type.
 *
 * Property values represented in TSX preserve their type information. In the example below, the number 0 is passed to
 * a component. This `propValue` will preserve its type information (`typeof propValue === 'number'`). Note that is
 * based on the type of the value being passed in, not the type declared of the class member decorated with `@Prop`.
 * ```tsx
 * <my-cmp prop-val={0}></my-cmp>
 * ```
 *
 * HTML prop values on the other hand, will always a string
 *
 * @param propValue the new value to coerce to some type
 * @param propType the type of the prop, expressed as a binary number
 * @returns the parsed/coerced value
 */
const parsePropertyValue = (propValue, propType) => {
    // ensure this value is of the correct prop type
    if (propValue != null && !isComplexType(propValue)) {
        if (BUILD.propBoolean && propType & 4 /* MEMBER_FLAGS.Boolean */) {
            // per the HTML spec, any string value means it is a boolean true value
            // but we'll cheat here and say that the string "false" is the boolean false
            return propValue === 'false' ? false : propValue === '' || !!propValue;
        }
        if (BUILD.propNumber && propType & 2 /* MEMBER_FLAGS.Number */) {
            // force it to be a number
            return parseFloat(propValue);
        }
        if (BUILD.propString && propType & 1 /* MEMBER_FLAGS.String */) {
            // could have been passed as a number or boolean
            // but we still want it as a string
            return String(propValue);
        }
        // redundant return here for better minification
        return propValue;
    }
    // not sure exactly what type we want
    // so no need to change to a different type
    return propValue;
};
const getElement = (ref) => (BUILD.lazyLoad ? getHostRef(ref).$hostElement$ : ref);
const createEvent = (ref, name, flags) => {
    const elm = getElement(ref);
    return {
        emit: (detail) => {
            if (BUILD.isDev && !elm.isConnected) {
                consoleDevWarn(`The "${name}" event was emitted, but the dispatcher node is no longer connected to the dom.`);
            }
            return emitEvent(elm, name, {
                bubbles: !!(flags & 4 /* EVENT_FLAGS.Bubbles */),
                composed: !!(flags & 2 /* EVENT_FLAGS.Composed */),
                cancelable: !!(flags & 1 /* EVENT_FLAGS.Cancellable */),
                detail,
            });
        },
    };
};
/**
 * Helper function to create & dispatch a custom Event on a provided target
 * @param elm the target of the Event
 * @param name the name to give the custom Event
 * @param opts options for configuring a custom Event
 * @returns the custom Event
 */
const emitEvent = (elm, name, opts) => {
    const ev = plt.ce(name, opts);
    elm.dispatchEvent(ev);
    return ev;
};
const rootAppliedStyles = /*@__PURE__*/ new WeakMap();
const registerStyle = (scopeId, cssText, allowCS) => {
    let style = client_styles.get(scopeId);
    if (supportsConstructableStylesheets && allowCS) {
        style = (style || new CSSStyleSheet());
        if (typeof style === 'string') {
            style = cssText;
        }
        else {
            style.replaceSync(cssText);
        }
    }
    else {
        style = cssText;
    }
    client_styles.set(scopeId, style);
};
const addStyle = (styleContainerNode, cmpMeta, mode, hostElm) => {
    var _a;
    let scopeId = getScopeId(cmpMeta, mode);
    const style = client_styles.get(scopeId);
    if (!BUILD.attachStyles) {
        return scopeId;
    }
    // if an element is NOT connected then getRootNode() will return the wrong root node
    // so the fallback is to always use the document for the root node in those cases
    styleContainerNode = styleContainerNode.nodeType === 11 /* NODE_TYPE.DocumentFragment */ ? styleContainerNode : doc;
    if (style) {
        if (typeof style === 'string') {
            styleContainerNode = styleContainerNode.head || styleContainerNode;
            let appliedStyles = rootAppliedStyles.get(styleContainerNode);
            let styleElm;
            if (!appliedStyles) {
                rootAppliedStyles.set(styleContainerNode, (appliedStyles = new Set()));
            }
            if (!appliedStyles.has(scopeId)) {
                if (BUILD.hydrateClientSide &&
                    styleContainerNode.host &&
                    (styleElm = styleContainerNode.querySelector(`[${HYDRATED_STYLE_ID}="${scopeId}"]`))) {
                    // This is only happening on native shadow-dom, do not needs CSS var shim
                    styleElm.innerHTML = style;
                }
                else {
                    if (BUILD.cssVarShim && plt.$cssShim$) {
                        styleElm = plt.$cssShim$.createHostStyle(hostElm, scopeId, style, !!(cmpMeta.$flags$ & 10 /* CMP_FLAGS.needsScopedEncapsulation */));
                        const newScopeId = styleElm['s-sc'];
                        if (newScopeId) {
                            scopeId = newScopeId;
                            // we don't want to add this styleID to the appliedStyles Set
                            // since the cssVarShim might need to apply several different
                            // stylesheets for the same component
                            appliedStyles = null;
                        }
                    }
                    else {
                        styleElm = doc.createElement('style');
                        styleElm.innerHTML = style;
                    }
                    // Apply CSP nonce to the style tag if it exists
                    const nonce = (_a = plt.$nonce$) !== null && _a !== void 0 ? _a : queryNonceMetaTagContent(doc);
                    if (nonce != null) {
                        styleElm.setAttribute('nonce', nonce);
                    }
                    if (BUILD.hydrateServerSide || BUILD.hotModuleReplacement) {
                        styleElm.setAttribute(HYDRATED_STYLE_ID, scopeId);
                    }
                    styleContainerNode.insertBefore(styleElm, styleContainerNode.querySelector('link'));
                }
                if (appliedStyles) {
                    appliedStyles.add(scopeId);
                }
            }
        }
        else if (BUILD.constructableCSS && !styleContainerNode.adoptedStyleSheets.includes(style)) {
            styleContainerNode.adoptedStyleSheets = [...styleContainerNode.adoptedStyleSheets, style];
        }
    }
    return scopeId;
};
const attachStyles = (hostRef) => {
    const cmpMeta = hostRef.$cmpMeta$;
    const elm = hostRef.$hostElement$;
    const flags = cmpMeta.$flags$;
    const endAttachStyles = createTime('attachStyles', cmpMeta.$tagName$);
    const scopeId = addStyle(BUILD.shadowDom && supportsShadow && elm.shadowRoot ? elm.shadowRoot : elm.getRootNode(), cmpMeta, hostRef.$modeName$, elm);
    if ((BUILD.shadowDom || BUILD.scoped) && BUILD.cssAnnotations && flags & 10 /* CMP_FLAGS.needsScopedEncapsulation */) {
        // only required when we're NOT using native shadow dom (slot)
        // or this browser doesn't support native shadow dom
        // and this host element was NOT created with SSR
        // let's pick out the inner content for slot projection
        // create a node to represent where the original
        // content was first placed, which is useful later on
        // DOM WRITE!!
        elm['s-sc'] = scopeId;
        elm.classList.add(scopeId + '-h');
        if (BUILD.scoped && flags & 2 /* CMP_FLAGS.scopedCssEncapsulation */) {
            elm.classList.add(scopeId + '-s');
        }
    }
    endAttachStyles();
};
const getScopeId = (cmp, mode) => 'sc-' + (BUILD.mode && mode && cmp.$flags$ & 32 /* CMP_FLAGS.hasMode */ ? cmp.$tagName$ + '-' + mode : cmp.$tagName$);
const convertScopedToShadow = (css) => css.replace(/\/\*!@([^\/]+)\*\/[^\{]+\{/g, '$1{');
/**
 * Production setAccessor() function based on Preact by
 * Jason Miller (@developit)
 * Licensed under the MIT License
 * https://github.com/developit/preact/blob/master/LICENSE
 *
 * Modified for Stencil's compiler and vdom
 */
const setAccessor = (elm, memberName, oldValue, newValue, isSvg, flags) => {
    if (oldValue !== newValue) {
        let isProp = isMemberInElement(elm, memberName);
        let ln = memberName.toLowerCase();
        if (BUILD.vdomClass && memberName === 'class') {
            const classList = elm.classList;
            const oldClasses = parseClassList(oldValue);
            const newClasses = parseClassList(newValue);
            // for `scoped: true` components, new nodes after initial hydration
            // from SSR don't have the slotted class added. Let's add that now
            if (elm['s-si'] && newClasses.indexOf(elm['s-si']) < 0) {
                newClasses.push(elm['s-si']);
            }
            classList.remove(...oldClasses.filter((c) => c && !newClasses.includes(c)));
            classList.add(...newClasses.filter((c) => c && !oldClasses.includes(c)));
        }
        else if (BUILD.vdomStyle && memberName === 'style') {
            // update style attribute, css properties and values
            if (BUILD.updatable) {
                for (const prop in oldValue) {
                    if (!newValue || newValue[prop] == null) {
                        if (!BUILD.hydrateServerSide && prop.includes('-')) {
                            elm.style.removeProperty(prop);
                        }
                        else {
                            elm.style[prop] = '';
                        }
                    }
                }
            }
            for (const prop in newValue) {
                if (!oldValue || newValue[prop] !== oldValue[prop]) {
                    if (!BUILD.hydrateServerSide && prop.includes('-')) {
                        elm.style.setProperty(prop, newValue[prop]);
                    }
                    else {
                        elm.style[prop] = newValue[prop];
                    }
                }
            }
        }
        else if (BUILD.vdomKey && memberName === 'key')
            ;
        else if (BUILD.vdomRef && memberName === 'ref') {
            // minifier will clean this up
            if (newValue) {
                newValue(elm);
            }
        }
        else if (BUILD.vdomListener &&
            (BUILD.lazyLoad ? !isProp : !elm.__lookupSetter__(memberName)) &&
            memberName[0] === 'o' &&
            memberName[1] === 'n') {
            // Event Handlers
            // so if the member name starts with "on" and the 3rd characters is
            // a capital letter, and it's not already a member on the element,
            // then we're assuming it's an event listener
            if (memberName[2] === '-') {
                // on- prefixed events
                // allows to be explicit about the dom event to listen without any magic
                // under the hood:
                // <my-cmp on-click> // listens for "click"
                // <my-cmp on-Click> // listens for "Click"
                // <my-cmp on-ionChange> // listens for "ionChange"
                // <my-cmp on-EVENTS> // listens for "EVENTS"
                memberName = memberName.slice(3);
            }
            else if (isMemberInElement(win, ln)) {
                // standard event
                // the JSX attribute could have been "onMouseOver" and the
                // member name "onmouseover" is on the window's prototype
                // so let's add the listener "mouseover", which is all lowercased
                memberName = ln.slice(2);
            }
            else {
                // custom event
                // the JSX attribute could have been "onMyCustomEvent"
                // so let's trim off the "on" prefix and lowercase the first character
                // and add the listener "myCustomEvent"
                // except for the first character, we keep the event name case
                memberName = ln[2] + memberName.slice(3);
            }
            if (oldValue) {
                plt.rel(elm, memberName, oldValue, false);
            }
            if (newValue) {
                plt.ael(elm, memberName, newValue, false);
            }
        }
        else if (BUILD.vdomPropOrAttr) {
            // Set property if it exists and it's not a SVG
            const isComplex = isComplexType(newValue);
            if ((isProp || (isComplex && newValue !== null)) && !isSvg) {
                try {
                    if (!elm.tagName.includes('-')) {
                        const n = newValue == null ? '' : newValue;
                        // Workaround for Safari, moving the <input> caret when re-assigning the same valued
                        if (memberName === 'list') {
                            isProp = false;
                        }
                        else if (oldValue == null || elm[memberName] != n) {
                            elm[memberName] = n;
                        }
                    }
                    else {
                        elm[memberName] = newValue;
                    }
                }
                catch (e) { }
            }
            /**
             * Need to manually update attribute if:
             * - memberName is not an attribute
             * - if we are rendering the host element in order to reflect attribute
             * - if it's a SVG, since properties might not work in <svg>
             * - if the newValue is null/undefined or 'false'.
             */
            let xlink = false;
            if (BUILD.vdomXlink) {
                if (ln !== (ln = ln.replace(/^xlink\:?/, ''))) {
                    memberName = ln;
                    xlink = true;
                }
            }
            if (newValue == null || newValue === false) {
                if (newValue !== false || elm.getAttribute(memberName) === '') {
                    if (BUILD.vdomXlink && xlink) {
                        elm.removeAttributeNS(XLINK_NS, memberName);
                    }
                    else {
                        elm.removeAttribute(memberName);
                    }
                }
            }
            else if ((!isProp || flags & 4 /* VNODE_FLAGS.isHost */ || isSvg) && !isComplex) {
                newValue = newValue === true ? '' : newValue;
                if (BUILD.vdomXlink && xlink) {
                    elm.setAttributeNS(XLINK_NS, memberName, newValue);
                }
                else {
                    elm.setAttribute(memberName, newValue);
                }
            }
        }
    }
};
const parseClassListRegex = /\s/;
const parseClassList = (value) => (!value ? [] : value.split(parseClassListRegex));
const updateElement = (oldVnode, newVnode, isSvgMode, memberName) => {
    // if the element passed in is a shadow root, which is a document fragment
    // then we want to be adding attrs/props to the shadow root's "host" element
    // if it's not a shadow root, then we add attrs/props to the same element
    const elm = newVnode.$elm$.nodeType === 11 /* NODE_TYPE.DocumentFragment */ && newVnode.$elm$.host
        ? newVnode.$elm$.host
        : newVnode.$elm$;
    const oldVnodeAttrs = (oldVnode && oldVnode.$attrs$) || EMPTY_OBJ;
    const newVnodeAttrs = newVnode.$attrs$ || EMPTY_OBJ;
    if (BUILD.updatable) {
        // remove attributes no longer present on the vnode by setting them to undefined
        for (memberName in oldVnodeAttrs) {
            if (!(memberName in newVnodeAttrs)) {
                setAccessor(elm, memberName, oldVnodeAttrs[memberName], undefined, isSvgMode, newVnode.$flags$);
            }
        }
    }
    // add new & update changed attributes
    for (memberName in newVnodeAttrs) {
        setAccessor(elm, memberName, oldVnodeAttrs[memberName], newVnodeAttrs[memberName], isSvgMode, newVnode.$flags$);
    }
};
/**
 * Create a DOM Node corresponding to one of the children of a given VNode.
 *
 * @param oldParentVNode the parent VNode from the previous render
 * @param newParentVNode the parent VNode from the current render
 * @param childIndex the index of the VNode, in the _new_ parent node's
 * children, for which we will create a new DOM node
 * @param parentElm the parent DOM node which our new node will be a child of
 * @returns the newly created node
 */
const createElm = (oldParentVNode, newParentVNode, childIndex, parentElm) => {
    // tslint:disable-next-line: prefer-const
    const newVNode = newParentVNode.$children$[childIndex];
    let i = 0;
    let elm;
    let childNode;
    let oldVNode;
    if (BUILD.slotRelocation && !useNativeShadowDom) {
        // remember for later we need to check to relocate nodes
        checkSlotRelocate = true;
        if (newVNode.$tag$ === 'slot') {
            if (client_scopeId) {
                // scoped css needs to add its scoped id to the parent element
                parentElm.classList.add(client_scopeId + '-s');
            }
            newVNode.$flags$ |= newVNode.$children$
                ? // slot element has fallback content
                    2 /* VNODE_FLAGS.isSlotFallback */
                : // slot element does not have fallback content
                    1 /* VNODE_FLAGS.isSlotReference */;
        }
    }
    if (BUILD.isDev && newVNode.$elm$) {
        consoleDevError(`The JSX ${newVNode.$text$ !== null ? `"${newVNode.$text$}" text` : `"${newVNode.$tag$}" element`} node should not be shared within the same renderer. The renderer caches element lookups in order to improve performance. However, a side effect from this is that the exact same JSX node should not be reused. For more information please see https://stenciljs.com/docs/templating-jsx#avoid-shared-jsx-nodes`);
    }
    if (BUILD.vdomText && newVNode.$text$ !== null) {
        // create text node
        elm = newVNode.$elm$ = doc.createTextNode(newVNode.$text$);
    }
    else if (BUILD.slotRelocation && newVNode.$flags$ & (1 /* VNODE_FLAGS.isSlotReference */ | 2 /* VNODE_FLAGS.isSlotFallback */)) {
        // create a slot reference node
        elm = newVNode.$elm$ =
            BUILD.isDebug || BUILD.hydrateServerSide ? slotReferenceDebugNode(newVNode) : doc.createTextNode('');
    }
    else {
        if (BUILD.svg && !client_isSvgMode) {
            client_isSvgMode = newVNode.$tag$ === 'svg';
        }
        // create element
        elm = newVNode.$elm$ = (BUILD.svg
            ? doc.createElementNS(client_isSvgMode ? SVG_NS : HTML_NS, newVNode.$tag$)
            : doc.createElement(newVNode.$tag$));
        if (BUILD.svg && client_isSvgMode && newVNode.$tag$ === 'foreignObject') {
            client_isSvgMode = false;
        }
        // add css classes, attrs, props, listeners, etc.
        if (BUILD.vdomAttribute) {
            updateElement(null, newVNode, client_isSvgMode);
        }
        if ((BUILD.shadowDom || BUILD.scoped) && isDef(client_scopeId) && elm['s-si'] !== client_scopeId) {
            // if there is a scopeId and this is the initial render
            // then let's add the scopeId as a css class
            elm.classList.add((elm['s-si'] = client_scopeId));
        }
        if (newVNode.$children$) {
            for (i = 0; i < newVNode.$children$.length; ++i) {
                // create the node
                childNode = createElm(oldParentVNode, newVNode, i, elm);
                // return node could have been null
                if (childNode) {
                    // append our new node
                    elm.__appendChild ? elm.__appendChild(childNode) : elm.appendChild(childNode);
                }
            }
        }
        if (BUILD.svg) {
            if (newVNode.$tag$ === 'svg') {
                // Only reset the SVG context when we're exiting <svg> element
                client_isSvgMode = false;
            }
            else if (elm.tagName === 'foreignObject') {
                // Reenter SVG context when we're exiting <foreignObject> element
                client_isSvgMode = true;
            }
        }
    }
    if (BUILD.slotRelocation) {
        elm['s-hn'] = hostTagName;
        if (newVNode.$flags$ & (2 /* VNODE_FLAGS.isSlotFallback */ | 1 /* VNODE_FLAGS.isSlotReference */)) {
            // this is a slot reference node
            elm['s-sr'] = true;
            // remember the content reference comment
            elm['s-cr'] = contentRef;
            // remember the slot name, or empty string for default slot
            elm['s-sn'] = newVNode.$name$ || '';
            // if this slot is nested within another parent slot, add that slot's name.
            // (used in 'renderSlotFallbackContent')
            if (newParentVNode.$name$) {
                elm['s-psn'] = newParentVNode.$name$;
            }
            if (newVNode.$flags$ & 2 /* VNODE_FLAGS.isSlotFallback */) {
                if (newVNode.$children$) {
                    // this slot has fallback nodes
                    for (i = 0; i < newVNode.$children$.length; ++i) {
                        // create the node
                        let containerElm = elm.nodeType === 1 /* NODE_TYPE.ElementNode */ ? elm : parentElm;
                        while (containerElm.nodeType !== 1 /* NODE_TYPE.ElementNode */) {
                            containerElm = containerElm.parentNode;
                        }
                        childNode = createElm(oldParentVNode, newVNode, i, containerElm);
                        // add new node meta.
                        // slot has fallback and childnode is slot fallback
                        childNode['s-sf'] = elm['s-hsf'] = true;
                        if (typeof childNode['s-sn'] === 'undefined') {
                            childNode['s-sn'] = newVNode.$name$ || '';
                        }
                        if (childNode.nodeType === 3 /* NODE_TYPE.TextNode */) {
                            childNode['s-sfc'] = childNode.textContent;
                        }
                        // make sure a node was created
                        // and we don't have a node already present
                        // (if a node is already attached, we'll just patch it)
                        if (childNode && (!oldParentVNode || !oldParentVNode.$children$)) {
                            // append our new node
                            containerElm.appendChild(childNode);
                        }
                    }
                }
                if (oldParentVNode && oldParentVNode.$children$)
                    patch(oldParentVNode, newVNode);
            }
            // check if we've got an old vnode for this slot
            oldVNode = oldParentVNode && oldParentVNode.$children$ && oldParentVNode.$children$[childIndex];
            if (oldVNode && oldVNode.$tag$ === newVNode.$tag$ && oldParentVNode.$elm$) {
                // we've got an old slot vnode and the wrapper is being replaced
                // so let's move the old slot content back to it's original location
                putBackInOriginalLocation(oldParentVNode.$elm$, false);
            }
        }
    }
    return elm;
};
const putBackInOriginalLocation = (parentElm, recursive) => {
    plt.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
    const oldSlotChildNodes = parentElm.__childNodes || parentElm.childNodes;
    for (let i = oldSlotChildNodes.length - 1; i >= 0; i--) {
        const childNode = oldSlotChildNodes[i];
        if (childNode['s-hn'] !== hostTagName && childNode['s-ol']) {
            // // this child node in the old element is from another component
            // // remove this node from the old slot's parent
            // childNode.remove();
            // and relocate it back to it's original location
            parentReferenceNode(childNode).insertBefore(childNode, referenceNode(childNode));
            // remove the old original location comment entirely
            // later on the patch function will know what to do
            // and move this to the correct spot in need be
            childNode['s-ol'].remove();
            childNode['s-ol'] = undefined;
            checkSlotRelocate = true;
        }
        if (recursive) {
            putBackInOriginalLocation(childNode, recursive);
        }
    }
    plt.$flags$ &= ~1 /* PLATFORM_FLAGS.isTmpDisconnected */;
};
const addVnodes = (parentElm, before, parentVNode, vnodes, startIdx, endIdx) => {
    let containerElm = ((BUILD.slotRelocation && parentElm['s-cr'] && parentElm['s-cr'].parentNode) || parentElm);
    let childNode;
    if (BUILD.shadowDom && containerElm.shadowRoot && containerElm.tagName === hostTagName) {
        containerElm = containerElm.shadowRoot;
    }
    for (; startIdx <= endIdx; ++startIdx) {
        if (vnodes[startIdx]) {
            childNode = createElm(null, parentVNode, startIdx, parentElm);
            if (childNode) {
                vnodes[startIdx].$elm$ = childNode;
                containerElm.insertBefore(childNode, BUILD.slotRelocation ? referenceNode(before) : before);
            }
        }
    }
};
const saveSlottedNodes = (elm) => {
    // by removing the hostname reference
    // any current slotted elements will be 'reset' and re-slotted
    const childNodes = elm.__childNodes || elm.childNodes;
    let childNode;
    let i;
    let ilen;
    for (i = 0, ilen = childNodes.length; i < ilen; i++) {
        childNode = childNodes[i];
        if (childNode['s-ol']) {
            if (childNode['s-hn'])
                childNode['s-hn'] = undefined;
        }
        else {
            saveSlottedNodes(childNode);
        }
    }
};
const removeVnodes = (vnodes, startIdx, endIdx, vnode, elm) => {
    for (; startIdx <= endIdx; ++startIdx) {
        if ((vnode = vnodes[startIdx])) {
            elm = vnode.$elm$;
            callNodeRefs(vnode);
            if (BUILD.slotRelocation) {
                // we're removing this element
                // so it's possible we need to show slot fallback content now
                checkSlotFallbackVisibility = true;
                saveSlottedNodes(elm);
                if (elm['s-ol']) {
                    // remove the original location comment
                    elm['s-ol'].remove();
                }
                else {
                    // it's possible that child nodes of the node
                    // that's being removed are slot nodes
                    putBackInOriginalLocation(elm, true);
                }
            }
            // remove the vnode's element from the dom
            elm.remove();
        }
    }
};
/**
 * Reconcile the children of a new VNode with the children of an old VNode by
 * traversing the two collections of children, identifying nodes that are
 * conserved or changed, calling out to `patch` to make any necessary
 * updates to the DOM, and rearranging DOM nodes as needed.
 *
 * The algorithm for reconciling children works by analyzing two 'windows' onto
 * the two arrays of children (`oldCh` and `newCh`). We keep track of the
 * 'windows' by storing start and end indices and references to the
 * corresponding array entries. Initially the two 'windows' are basically equal
 * to the entire array, but we progressively narrow the windows until there are
 * no children left to update by doing the following:
 *
 * 1. Skip any `null` entries at the beginning or end of the two arrays, so
 *    that if we have an initial array like the following we'll end up dealing
 *    only with a window bounded by the highlighted elements:
 *
 *    [null, null, VNode1 , ... , VNode2, null, null]
 *                 ^^^^^^         ^^^^^^
 *
 * 2. Check to see if the elements at the head and tail positions are equal
 *    across the windows. This will basically detect elements which haven't
 *    been added, removed, or changed position, i.e. if you had the following
 *    VNode elements (represented as HTML):
 *
 *    oldVNode: `<div><p><span>HEY</span></p></div>`
 *    newVNode: `<div><p><span>THERE</span></p></div>`
 *
 *    Then when comparing the children of the `<div>` tag we check the equality
 *    of the VNodes corresponding to the `<p>` tags and, since they are the
 *    same tag in the same position, we'd be able to avoid completely
 *    re-rendering the subtree under them with a new DOM element and would just
 *    call out to `patch` to handle reconciling their children and so on.
 *
 * 3. Check, for both windows, to see if the element at the beginning of the
 *    window corresponds to the element at the end of the other window. This is
 *    a heuristic which will let us identify _some_ situations in which
 *    elements have changed position, for instance it _should_ detect that the
 *    children nodes themselves have not changed but merely moved in the
 *    following example:
 *
 *    oldVNode: `<div><element-one /><element-two /></div>`
 *    newVNode: `<div><element-two /><element-one /></div>`
 *
 *    If we find cases like this then we also need to move the concrete DOM
 *    elements corresponding to the moved children to write the re-order to the
 *    DOM.
 *
 * 4. Finally, if VNodes have the `key` attribute set on them we check for any
 *    nodes in the old children which have the same key as the first element in
 *    our window on the new children. If we find such a node we handle calling
 *    out to `patch`, moving relevant DOM nodes, and so on, in accordance with
 *    what we find.
 *
 * Finally, once we've narrowed our 'windows' to the point that either of them
 * collapse (i.e. they have length 0) we then handle any remaining VNode
 * insertion or deletion that needs to happen to get a DOM state that correctly
 * reflects the new child VNodes. If, for instance, after our window on the old
 * children has collapsed we still have more nodes on the new children that
 * we haven't dealt with yet then we need to add them, or if the new children
 * collapse but we still have unhandled _old_ children then we need to make
 * sure the corresponding DOM nodes are removed.
 *
 * @param parentElm the node into which the parent VNode is rendered
 * @param oldCh the old children of the parent node
 * @param newVNode the new VNode which will replace the parent
 * @param newCh the new children of the parent node
 */
const updateChildren = (parentElm, oldCh, newVNode, newCh) => {
    const fbSlots = [];
    const fbNodes = {};
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let idxInOld = 0;
    let i = 0;
    let j = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let node;
    let elmToMove;
    let fbParentNodes;
    let fbParentNodesIdx;
    let fbSlotsIdx;
    let fbNodesIdx;
    let fbChildNode;
    let fbSlot;
    let fbNode;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
            // VNode might have been moved left
            oldStartVnode = oldCh[++oldStartIdx];
        }
        else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            // if the start nodes are the same then we should patch the new VNode
            // onto the old one, and increment our `newStartIdx` and `oldStartIdx`
            // indices to reflect that. We don't need to move any DOM Nodes around
            // since things are matched up in order.
            patch(oldStartVnode, newStartVnode);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            // likewise, if the end nodes are the same we patch new onto old and
            // decrement our end indices, and also likewise in this case we don't
            // need to move any DOM Nodes.
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            // case: "Vnode moved right"
            //
            // We've found that the last node in our window on the new children is
            // the same VNode as the _first_ node in our window on the old children
            // we're dealing with now. Visually, this is the layout of these two
            // nodes:
            //
            // newCh: [..., newStartVnode , ... , newEndVnode , ...]
            //                                    ^^^^^^^^^^^
            // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
            //              ^^^^^^^^^^^^^
            //
            // In this situation we need to patch `newEndVnode` onto `oldStartVnode`
            // and move the DOM element for `oldStartVnode`.
            if (BUILD.slotRelocation && (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldStartVnode.$elm$.parentNode, false);
            }
            patch(oldStartVnode, newEndVnode);
            // We need to move the element for `oldStartVnode` into a position which
            // will be appropriate for `newEndVnode`. For this we can use
            // `.insertBefore` and `oldEndVnode.$elm$.nextSibling`. If there is a
            // sibling for `oldEndVnode.$elm$` then we want to move the DOM node for
            // `oldStartVnode` between `oldEndVnode` and it's sibling, like so:
            //
            // <old-start-node />
            // <some-intervening-node />
            // <old-end-node />
            // <!-- ->              <-- `oldStartVnode.$elm$` should be inserted here
            // <next-sibling />
            //
            // If instead `oldEndVnode.$elm$` has no sibling then we just want to put
            // the node for `oldStartVnode` at the end of the children of
            // `parentElm`. Luckily, `Node.nextSibling` will return `null` if there
            // aren't any siblings, and passing `null` to `Node.insertBefore` will
            // append it to the children of the parent element.
            parentElm.insertBefore(oldStartVnode.$elm$, oldEndVnode.$elm$.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            // case: "Vnode moved left"
            //
            // We've found that the first node in our window on the new children is
            // the same VNode as the _last_ node in our window on the old children.
            // Visually, this is the layout of these two nodes:
            //
            // newCh: [..., newStartVnode , ... , newEndVnode , ...]
            //              ^^^^^^^^^^^^^
            // oldCh: [..., oldStartVnode , ... , oldEndVnode , ...]
            //                                    ^^^^^^^^^^^
            //
            // In this situation we need to patch `newStartVnode` onto `oldEndVnode`
            // (which will handle updating any changed attributes, reconciling their
            // children etc) but we also need to move the DOM node to which
            // `oldEndVnode` corresponds.
            if (BUILD.slotRelocation && (oldStartVnode.$tag$ === 'slot' || newEndVnode.$tag$ === 'slot')) {
                putBackInOriginalLocation(oldEndVnode.$elm$.parentNode, false);
            }
            patch(oldEndVnode, newStartVnode);
            // We've already checked above if `oldStartVnode` and `newStartVnode` are
            // the same node, so since we're here we know that they are not. Thus we
            // can move the element for `oldEndVnode` _before_ the element for
            // `oldStartVnode`, leaving `oldStartVnode` to be reconciled in the
            // future.
            parentElm.insertBefore(oldEndVnode.$elm$, oldStartVnode.$elm$);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            // Here we do some checks to match up old and new nodes based on the
            // `$key$` attribute, which is set by putting a `key="my-key"` attribute
            // in the JSX for a DOM element in the implementation of a Stencil
            // component.
            //
            // First we check to see if there are any nodes in the array of old
            // children which have the same key as the first node in the new
            // children.
            idxInOld = -1;
            if (BUILD.vdomKey) {
                for (i = oldStartIdx; i <= oldEndIdx; ++i) {
                    if (oldCh[i] && oldCh[i].$key$ !== null && oldCh[i].$key$ === newStartVnode.$key$) {
                        idxInOld = i;
                        break;
                    }
                }
            }
            if (BUILD.vdomKey && idxInOld >= 0) {
                // We found a node in the old children which matches up with the first
                // node in the new children! So let's deal with that
                elmToMove = oldCh[idxInOld];
                if (elmToMove.$tag$ !== newStartVnode.$tag$) {
                    // the tag doesn't match so we'll need a new DOM element
                    node = createElm(oldCh && oldCh[newStartIdx], newVNode, idxInOld, parentElm);
                }
                else {
                    patch(elmToMove, newStartVnode);
                    // invalidate the matching old node so that we won't try to update it
                    // again later on
                    oldCh[idxInOld] = undefined;
                    node = elmToMove.$elm$;
                }
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                // We either didn't find an element in the old children that matches
                // the key of the first new child OR the build is not using `key`
                // attributes at all. In either case we need to create a new element
                // for the new node.
                node = createElm(oldCh && oldCh[newStartIdx], newVNode, newStartIdx, parentElm);
                newStartVnode = newCh[++newStartIdx];
            }
            if (node) {
                // if we created a new node then handle inserting it to the DOM
                if (BUILD.slotRelocation) {
                    parentReferenceNode(oldStartVnode.$elm$).insertBefore(node, referenceNode(oldStartVnode.$elm$));
                }
                else {
                    oldStartVnode.$elm$.parentNode.insertBefore(node, oldStartVnode.$elm$);
                }
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        // we have some more new nodes to add which don't match up with old nodes
        addVnodes(parentElm, newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].$elm$, newVNode, newCh, newStartIdx, newEndIdx);
    }
    else if (BUILD.updatable && newStartIdx > newEndIdx) {
        // there are nodes in the `oldCh` array which no longer correspond to nodes
        // in the new array, so lets remove them (which entails cleaning up the
        // relevant DOM nodes)
        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
    // reorder fallback slot nodes
    if (parentElm.parentNode && newVNode.$elm$['s-hsf']) {
        fbParentNodes = parentElm.parentNode.__childNodes || parentElm.parentNode.childNodes;
        fbParentNodesIdx = fbParentNodes.length - 1;
        for (i = 0; i <= fbParentNodesIdx; ++i) {
            fbChildNode = fbParentNodes[i];
            if (fbChildNode['s-hsf']) {
                fbSlots.push(fbChildNode);
                continue;
            }
            if (fbChildNode['s-sf']) {
                if (!fbNodes[fbChildNode['s-sn']])
                    fbNodes[fbChildNode['s-sn']] = [];
                fbNodes[fbChildNode['s-sn']].push(fbChildNode);
            }
        }
        fbSlotsIdx = fbSlots.length - 1;
        for (i = 0; i <= fbSlotsIdx; ++i) {
            fbSlot = fbSlots[i];
            if (typeof fbNodes[fbSlot['s-sn']] === 'undefined')
                continue;
            fbNodesIdx = fbNodes[fbSlot['s-sn']].length - 1;
            for (j = 0; j <= fbNodesIdx; ++j) {
                fbNode = fbNodes[fbSlot['s-sn']][j];
                fbSlot.parentNode.insertBefore(fbNode, fbSlot);
            }
        }
        checkSlotFallbackVisibility = true;
    }
};
/**
 * Compare two VNodes to determine if they are the same
 *
 * **NB**: This function is an equality _heuristic_ based on the available
 * information set on the two VNodes and can be misleading under certain
 * circumstances. In particular, if the two nodes do not have `key` attrs
 * (available under `$key$` on VNodes) then the function falls back on merely
 * checking that they have the same tag.
 *
 * So, in other words, if `key` attrs are not set on VNodes which may be
 * changing order within a `children` array or something along those lines then
 * we could obtain a false positive and then have to do needless re-rendering.
 *
 * @param leftVNode the first VNode to check
 * @param rightVNode the second VNode to check
 * @returns whether they're equal or not
 */
const isSameVnode = (leftVNode, rightVNode) => {
    // compare if two vnode to see if they're "technically" the same
    // need to have the same element tag, and same key to be the same
    if (leftVNode.$tag$ === rightVNode.$tag$) {
        if (BUILD.slotRelocation && leftVNode.$tag$ === 'slot') {
            return leftVNode.$name$ === rightVNode.$name$;
        }
        // this will be set if components in the build have `key` attrs set on them
        if (BUILD.vdomKey) {
            return leftVNode.$key$ === rightVNode.$key$;
        }
        return true;
    }
    return false;
};
const referenceNode = (node) => {
    // this node was relocated to a new location in the dom
    // because of some other component's slot
    // but we still have an html comment in place of where
    // it's original location was according to it's original vdom
    return (node && node['s-ol']) || node;
};
const parentReferenceNode = (node) => (node['s-ol'] ? node['s-ol'] : node).parentNode;
/**
 * Handle reconciling an outdated VNode with a new one which corresponds to
 * it. This function handles flushing updates to the DOM and reconciling the
 * children of the two nodes (if any).
 *
 * @param oldVNode an old VNode whose DOM element and children we want to update
 * @param newVNode a new VNode representing an updated version of the old one
 */
const patch = (oldVNode, newVNode) => {
    const elm = (newVNode.$elm$ = oldVNode.$elm$);
    const oldChildren = oldVNode.$children$;
    const newChildren = newVNode.$children$;
    const tag = newVNode.$tag$;
    const text = newVNode.$text$;
    let defaultHolder;
    if (!BUILD.vdomText || text === null) {
        if (BUILD.svg) {
            // test if we're rendering an svg element, or still rendering nodes inside of one
            // only add this to the when the compiler sees we're using an svg somewhere
            client_isSvgMode = tag === 'svg' ? true : tag === 'foreignObject' ? false : client_isSvgMode;
        }
        if (BUILD.vdomAttribute || BUILD.reflect) {
            if (BUILD.slot && tag === 'slot')
                ;
            else {
                // either this is the first render of an element OR it's an update
                // AND we already know it's possible it could have changed
                // this updates the element's css classes, attrs, props, listeners, etc.
                updateElement(oldVNode, newVNode, client_isSvgMode);
            }
        }
        if (BUILD.updatable && oldChildren !== null && newChildren !== null) {
            // looks like there's child vnodes for both the old and new vnodes
            // so we need to call `updateChildren` to reconcile them
            updateChildren(elm, oldChildren, newVNode, newChildren);
        }
        else if (newChildren !== null) {
            // no old child vnodes, but there are new child vnodes to add
            if (BUILD.updatable && BUILD.vdomText && oldVNode.$text$ !== null) {
                // the old vnode was text, so be sure to clear it out
                elm.textContent = '';
            }
            // add the new vnode children
            addVnodes(elm, null, newVNode, newChildren, 0, newChildren.length - 1);
        }
        else if (BUILD.updatable && oldChildren !== null) {
            // no new child vnodes, but there are old child vnodes to remove
            removeVnodes(oldChildren, 0, oldChildren.length - 1);
        }
        if (BUILD.svg && client_isSvgMode && tag === 'svg') {
            client_isSvgMode = false;
        }
    }
    else if (BUILD.vdomText && BUILD.slotRelocation && (defaultHolder = elm['s-cr'])) {
        // this element has slotted content
        defaultHolder.parentNode.textContent = text;
    }
    else if (BUILD.vdomText && oldVNode.$text$ !== text) {
        // update the text content for the text only vnode
        // and also only if the text is different than before
        elm.textContent = text;
        if (elm['s-sf']) {
            elm['s-sfc'] = text;
        }
    }
};
const relocateNodes = [];
const relocateSlotContent = (elm) => {
    // tslint:disable-next-line: prefer-const
    let childNode;
    let node;
    let hostContentNodes;
    let slotNameAttr;
    let relocateNodeData;
    let j;
    let i = 0;
    const childNodes = (elm.__childNodes || elm.childNodes);
    const ilen = childNodes.length;
    for (; i < ilen; i++) {
        childNode = childNodes[i];
        if (childNode['s-sr'] && (node = childNode['s-cr']) && node.parentNode) {
            if (childNode['s-hsf']) {
                checkSlotFallbackVisibility = true;
            }
            // first got the content reference comment node
            // then we got it's parent, which is where all the host content is in now
            hostContentNodes = node.parentNode.__childNodes || node.parentNode.childNodes;
            slotNameAttr = childNode['s-sn'];
            for (j = hostContentNodes.length - 1; j >= 0; j--) {
                node = hostContentNodes[j];
                if (!node['s-cn'] && !node['s-nr'] && node['s-hn'] !== childNode['s-hn']) {
                    // let's do some relocating to its new home
                    // but never relocate a content reference node
                    // that is suppose to always represent the original content location
                    if (isNodeLocatedInSlot(node, slotNameAttr)) {
                        // it's possible we've already decided to relocate this node
                        relocateNodeData = relocateNodes.find((r) => r.$nodeToRelocate$ === node);
                        // made some changes to slots
                        // let's make sure we also double check
                        // fallbacks are correctly hidden or shown
                        checkSlotFallbackVisibility = true;
                        node['s-sn'] = node['s-sn'] || slotNameAttr;
                        if (relocateNodeData) {
                            // previously we never found a slot home for this node
                            // but turns out we did, so let's remember it now
                            relocateNodeData.$slotRefNode$ = childNode;
                        }
                        else {
                            // add to our list of nodes to relocate
                            relocateNodes.push({
                                $slotRefNode$: childNode,
                                $nodeToRelocate$: node,
                            });
                        }
                        if (node['s-sr']) {
                            relocateNodes.map((relocateNode) => {
                                if (isNodeLocatedInSlot(relocateNode.$nodeToRelocate$, node['s-sn'])) {
                                    relocateNodeData = relocateNodes.find((r) => r.$nodeToRelocate$ === node);
                                    if (relocateNodeData && !relocateNode.$slotRefNode$) {
                                        relocateNode.$slotRefNode$ = relocateNodeData.$slotRefNode$;
                                    }
                                }
                            });
                        }
                    }
                    else if (!relocateNodes.some((r) => r.$nodeToRelocate$ === node)) {
                        // so far this element does not have a slot home, not setting slotRefNode on purpose
                        // if we never find a home for this element then we'll need to hide it
                        relocateNodes.push({
                            $nodeToRelocate$: node,
                        });
                    }
                }
            }
        }
        if (childNode.nodeType === 1 /* NODE_TYPE.ElementNode */) {
            relocateSlotContent(childNode);
        }
    }
};
const isNodeLocatedInSlot = (nodeToRelocate, slotNameAttr) => {
    if (nodeToRelocate.nodeType === 1 /* NODE_TYPE.ElementNode */) {
        if (nodeToRelocate.getAttribute('slot') === null && slotNameAttr === '') {
            return true;
        }
        if (nodeToRelocate.getAttribute('slot') === slotNameAttr) {
            return true;
        }
        return false;
    }
    if (nodeToRelocate['s-sn'] === slotNameAttr) {
        return true;
    }
    return slotNameAttr === '';
};
const callNodeRefs = (vNode) => {
    if (BUILD.vdomRef) {
        vNode.$attrs$ && vNode.$attrs$.ref && vNode.$attrs$.ref(null);
        vNode.$children$ && vNode.$children$.map(callNodeRefs);
    }
};
const renderVdom = (hostRef, renderFnResults) => {
    const hostElm = hostRef.$hostElement$;
    const cmpMeta = hostRef.$cmpMeta$;
    const oldVNode = hostRef.$vnode$ || client_newVNode(null, null);
    const rootVnode = isHost(renderFnResults) ? renderFnResults : h(null, null, renderFnResults);
    hostTagName = hostElm.tagName;
    // <Host> runtime check
    if (BUILD.isDev && Array.isArray(renderFnResults) && renderFnResults.some(isHost)) {
        throw new Error(`The <Host> must be the single root component.
Looks like the render() function of "${hostTagName.toLowerCase()}" is returning an array that contains the <Host>.

The render() function should look like this instead:

render() {
  // Do not return an array
  return (
    <Host>{content}</Host>
  );
}
  `);
    }
    if (BUILD.reflect && cmpMeta.$attrsToReflect$) {
        rootVnode.$attrs$ = rootVnode.$attrs$ || {};
        cmpMeta.$attrsToReflect$.map(([propName, attribute]) => (rootVnode.$attrs$[attribute] = hostElm[propName]));
    }
    rootVnode.$tag$ = null;
    rootVnode.$flags$ |= 4 /* VNODE_FLAGS.isHost */;
    hostRef.$vnode$ = rootVnode;
    rootVnode.$elm$ = oldVNode.$elm$ = (BUILD.shadowDom ? hostElm.shadowRoot || hostElm : hostElm);
    if (BUILD.scoped || BUILD.shadowDom) {
        client_scopeId = hostElm['s-sc'];
    }
    if (BUILD.slotRelocation) {
        contentRef = hostElm['s-cr'];
        useNativeShadowDom = supportsShadow && (cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) !== 0;
        // always reset
        checkSlotFallbackVisibility = false;
    }
    // synchronous patch
    patch(oldVNode, rootVnode);
    if (BUILD.slotRelocation) {
        // while we're moving nodes around existing nodes, temporarily disable
        // the disconnectCallback from working
        plt.$flags$ |= 1 /* PLATFORM_FLAGS.isTmpDisconnected */;
        if (checkSlotRelocate) {
            relocateSlotContent(rootVnode.$elm$);
            let relocateData;
            let nodeToRelocate;
            let orgLocationNode;
            let parentNodeRef;
            let insertBeforeNode;
            let refNode;
            let ogInsertBeforeNode;
            let i = 0;
            for (; i < relocateNodes.length; i++) {
                relocateData = relocateNodes[i];
                nodeToRelocate = relocateData.$nodeToRelocate$;
                if (!nodeToRelocate['s-ol']) {
                    // add a reference node marking this node's original location
                    // keep a reference to this node for later lookups
                    orgLocationNode =
                        BUILD.isDebug || BUILD.hydrateServerSide
                            ? originalLocationDebugNode(nodeToRelocate)
                            : doc.createTextNode('');
                    orgLocationNode['s-nr'] = nodeToRelocate;
                    nodeToRelocate.parentNode.insertBefore((nodeToRelocate['s-ol'] = orgLocationNode), nodeToRelocate);
                }
            }
            for (i = 0; i < relocateNodes.length; i++) {
                relocateData = relocateNodes[i];
                nodeToRelocate = relocateData.$nodeToRelocate$;
                if (relocateData.$slotRefNode$) {
                    // by default we're just going to insert it directly
                    // after the slot reference node
                    parentNodeRef = relocateData.$slotRefNode$.parentNode;
                    insertBeforeNode =
                        relocateData.$slotRefNode$.__nextSibling || relocateData.$slotRefNode$.nextSibling;
                    orgLocationNode = nodeToRelocate['s-ol'];
                    ogInsertBeforeNode = insertBeforeNode;
                    while ((orgLocationNode = (orgLocationNode.__previousSibling || orgLocationNode.previousSibling))) {
                        refNode = orgLocationNode['s-nr'];
                        if (refNode && refNode['s-sn'] === nodeToRelocate['s-sn'] && parentNodeRef === refNode.parentNode) {
                            refNode = refNode.__nextSibling || refNode.nextSibling;
                            if (!refNode || !refNode['s-nr']) {
                                insertBeforeNode = refNode;
                                break;
                            }
                        }
                    }
                    if ((!insertBeforeNode && parentNodeRef !== nodeToRelocate.parentNode) ||
                        (nodeToRelocate.__nextSibling || nodeToRelocate.nextSibling) !== insertBeforeNode) {
                        // we've checked that it's worth while to relocate
                        // since that the node to relocate
                        // has a different next sibling or parent relocated
                        if (nodeToRelocate !== insertBeforeNode) {
                            if (!nodeToRelocate['s-hn'] && nodeToRelocate['s-ol']) {
                                // probably a component in the index.html that doesn't have it's hostname set
                                nodeToRelocate['s-hn'] = nodeToRelocate['s-ol'].parentNode.nodeName;
                            }
                            // add it back to the dom but in its new home
                            parentNodeRef.insertBefore(nodeToRelocate, insertBeforeNode);
                            // the node may have been hidden from when it didn't have a home. Re-show.
                            nodeToRelocate.hidden = false;
                        }
                        else {
                            parentNodeRef.insertBefore(nodeToRelocate, ogInsertBeforeNode);
                        }
                    }
                }
                else {
                    // this node doesn't have a slot home to go to, so let's hide it
                    if (nodeToRelocate.nodeType === 1 /* NODE_TYPE.ElementNode */) {
                        nodeToRelocate.hidden = true;
                    }
                }
            }
        }
        if (checkSlotFallbackVisibility) {
            updateFallbackSlotVisibility(rootVnode.$elm$);
        }
        // done moving nodes around
        // allow the disconnect callback to work again
        plt.$flags$ &= ~1 /* PLATFORM_FLAGS.isTmpDisconnected */;
        // always reset
        relocateNodes.length = 0;
    }
    // Clear the content ref so we don't create a memory leak
    contentRef = undefined;
};
// slot comment debug nodes only created with the `--debug` flag
// otherwise these nodes are text nodes w/out content
const slotReferenceDebugNode = (slotVNode) => doc.createComment(`<slot${slotVNode.$name$ ? ' name="' + slotVNode.$name$ + '"' : ''}> (host=${hostTagName.toLowerCase()})`);
const originalLocationDebugNode = (nodeToRelocate) => doc.createComment(`org-location for ` +
    (nodeToRelocate.localName
        ? `<${nodeToRelocate.localName}> (host=${nodeToRelocate['s-hn']})`
        : `[${nodeToRelocate.textContent}]`));
const attachToAncestor = (hostRef, ancestorComponent) => {
    if (BUILD.asyncLoading && ancestorComponent && !hostRef.$onRenderResolve$ && ancestorComponent['s-p']) {
        ancestorComponent['s-p'].push(new Promise((r) => (hostRef.$onRenderResolve$ = r)));
    }
};
const scheduleUpdate = (hostRef, isInitialLoad) => {
    if (BUILD.taskQueue && BUILD.updatable) {
        hostRef.$flags$ |= 16 /* HOST_FLAGS.isQueuedForUpdate */;
    }
    if (BUILD.asyncLoading && hostRef.$flags$ & 4 /* HOST_FLAGS.isWaitingForChildren */) {
        hostRef.$flags$ |= 512 /* HOST_FLAGS.needsRerender */;
        return;
    }
    attachToAncestor(hostRef, hostRef.$ancestorComponent$);
    // there is no ancestor component or the ancestor component
    // has already fired off its lifecycle update then
    // fire off the initial update
    const dispatch = () => dispatchHooks(hostRef, isInitialLoad);
    return BUILD.taskQueue ? writeTask(dispatch) : dispatch();
};
const dispatchHooks = (hostRef, isInitialLoad) => {
    const elm = hostRef.$hostElement$;
    const endSchedule = createTime('scheduleUpdate', hostRef.$cmpMeta$.$tagName$);
    const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;
    let promise;
    if (isInitialLoad) {
        if (BUILD.lazyLoad && BUILD.hostListener) {
            hostRef.$flags$ |= 256 /* HOST_FLAGS.isListenReady */;
            if (hostRef.$queuedListeners$) {
                hostRef.$queuedListeners$.map(([methodName, event]) => safeCall(instance, methodName, event, elm));
                hostRef.$queuedListeners$ = null;
            }
        }
        emitLifecycleEvent(elm, 'componentWillLoad');
        if (BUILD.cmpWillLoad) {
            promise = safeCall(instance, 'componentWillLoad', undefined, elm);
        }
    }
    else {
        emitLifecycleEvent(elm, 'componentWillUpdate');
        if (BUILD.cmpWillUpdate) {
            promise = safeCall(instance, 'componentWillUpdate', undefined, elm);
        }
    }
    emitLifecycleEvent(elm, 'componentWillRender');
    if (BUILD.cmpWillRender) {
        promise = then(promise, () => safeCall(instance, 'componentWillRender', undefined, elm));
    }
    endSchedule();
    return then(promise, () => updateComponent(hostRef, instance, isInitialLoad));
};
const updateComponent = async (hostRef, instance, isInitialLoad) => {
    // updateComponent
    const elm = hostRef.$hostElement$;
    const endUpdate = createTime('update', hostRef.$cmpMeta$.$tagName$);
    const rc = elm['s-rc'];
    if (BUILD.style && isInitialLoad) {
        // DOM WRITE!
        attachStyles(hostRef);
    }
    const endRender = createTime('render', hostRef.$cmpMeta$.$tagName$);
    if (BUILD.isDev) {
        hostRef.$flags$ |= 1024 /* HOST_FLAGS.devOnRender */;
    }
    if (BUILD.hydrateServerSide) {
        await callRender(hostRef, instance, elm);
    }
    else {
        callRender(hostRef, instance, elm);
    }
    if (BUILD.cssVarShim && plt.$cssShim$) {
        plt.$cssShim$.updateHost(elm);
    }
    if (BUILD.isDev) {
        hostRef.$renderCount$++;
        hostRef.$flags$ &= ~1024 /* HOST_FLAGS.devOnRender */;
    }
    if (BUILD.hydrateServerSide) {
        try {
            // manually connected child components during server-side hydrate
            serverSideConnected(elm);
            if (isInitialLoad) {
                // using only during server-side hydrate
                if (hostRef.$cmpMeta$.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
                    elm['s-en'] = '';
                }
                else if (hostRef.$cmpMeta$.$flags$ & 2 /* CMP_FLAGS.scopedCssEncapsulation */) {
                    elm['s-en'] = 'c';
                }
            }
        }
        catch (e) {
            consoleError(e, elm);
        }
    }
    if (BUILD.asyncLoading && rc) {
        // ok, so turns out there are some child host elements
        // waiting on this parent element to load
        // let's fire off all update callbacks waiting
        rc.map((cb) => cb());
        elm['s-rc'] = undefined;
    }
    endRender();
    endUpdate();
    if (BUILD.asyncLoading) {
        const childrenPromises = elm['s-p'];
        const postUpdate = () => postUpdateComponent(hostRef);
        if (childrenPromises.length === 0) {
            postUpdate();
        }
        else {
            Promise.all(childrenPromises).then(postUpdate);
            hostRef.$flags$ |= 4 /* HOST_FLAGS.isWaitingForChildren */;
            childrenPromises.length = 0;
        }
    }
    else {
        postUpdateComponent(hostRef);
    }
};
const callRender = (hostRef, instance, elm) => {
    // in order for bundlers to correctly treeshake the BUILD object
    // we need to ensure BUILD is not deoptimized within a try/catch
    // https://rollupjs.org/guide/en/#treeshake tryCatchDeoptimization
    const allRenderFn = BUILD.allRenderFn ? true : false;
    const lazyLoad = BUILD.lazyLoad ? true : false;
    const taskQueue = BUILD.taskQueue ? true : false;
    const updatable = BUILD.updatable ? true : false;
    try {
        renderingRef = instance;
        instance = allRenderFn ? instance.render() : instance.render && instance.render();
        if (updatable && taskQueue) {
            hostRef.$flags$ &= ~16 /* HOST_FLAGS.isQueuedForUpdate */;
        }
        if (updatable || lazyLoad) {
            hostRef.$flags$ |= 2 /* HOST_FLAGS.hasRendered */;
        }
        if (BUILD.hasRenderFn || BUILD.reflect) {
            if (BUILD.vdomRender || BUILD.reflect) {
                // looks like we've got child nodes to render into this host element
                // or we need to update the css class/attrs on the host element
                // DOM WRITE!
                if (BUILD.hydrateServerSide) {
                    return Promise.resolve(instance).then((value) => renderVdom(hostRef, value));
                }
                else {
                    renderVdom(hostRef, instance);
                }
            }
            else {
                elm.textContent = instance;
            }
        }
    }
    catch (e) {
        consoleError(e, hostRef.$hostElement$);
    }
    renderingRef = null;
    return null;
};
const getRenderingRef = () => renderingRef;
const postUpdateComponent = (hostRef) => {
    const tagName = hostRef.$cmpMeta$.$tagName$;
    const elm = hostRef.$hostElement$;
    const endPostUpdate = createTime('postUpdate', tagName);
    const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;
    const ancestorComponent = hostRef.$ancestorComponent$;
    if (BUILD.cmpDidRender) {
        if (BUILD.isDev) {
            hostRef.$flags$ |= 1024 /* HOST_FLAGS.devOnRender */;
        }
        safeCall(instance, 'componentDidRender', undefined, elm);
        if (BUILD.isDev) {
            hostRef.$flags$ &= ~1024 /* HOST_FLAGS.devOnRender */;
        }
    }
    emitLifecycleEvent(elm, 'componentDidRender');
    if (!(hostRef.$flags$ & 64 /* HOST_FLAGS.hasLoadedComponent */)) {
        hostRef.$flags$ |= 64 /* HOST_FLAGS.hasLoadedComponent */;
        if (BUILD.asyncLoading && BUILD.cssAnnotations) {
            // DOM WRITE!
            addHydratedFlag(elm);
        }
        if (BUILD.cmpDidLoad) {
            if (BUILD.isDev) {
                hostRef.$flags$ |= 2048 /* HOST_FLAGS.devOnDidLoad */;
            }
            safeCall(instance, 'componentDidLoad', undefined, elm);
            if (BUILD.isDev) {
                hostRef.$flags$ &= ~2048 /* HOST_FLAGS.devOnDidLoad */;
            }
        }
        emitLifecycleEvent(elm, 'componentDidLoad');
        endPostUpdate();
        if (BUILD.asyncLoading) {
            hostRef.$onReadyResolve$(elm);
            if (!ancestorComponent) {
                appDidLoad(tagName);
            }
        }
    }
    else {
        if (BUILD.cmpDidUpdate) {
            // we've already loaded this component
            // fire off the user's componentDidUpdate method (if one was provided)
            // componentDidUpdate runs AFTER render() has been called
            // and all child components have finished updating
            if (BUILD.isDev) {
                hostRef.$flags$ |= 1024 /* HOST_FLAGS.devOnRender */;
            }
            safeCall(instance, 'componentDidUpdate', undefined, elm);
            if (BUILD.isDev) {
                hostRef.$flags$ &= ~1024 /* HOST_FLAGS.devOnRender */;
            }
        }
        emitLifecycleEvent(elm, 'componentDidUpdate');
        endPostUpdate();
    }
    if (BUILD.hotModuleReplacement) {
        elm['s-hmr-load'] && elm['s-hmr-load']();
    }
    if (BUILD.method && BUILD.lazyLoad) {
        hostRef.$onInstanceResolve$(elm);
    }
    // load events fire from bottom to top
    // the deepest elements load first then bubbles up
    if (BUILD.asyncLoading) {
        if (hostRef.$onRenderResolve$) {
            hostRef.$onRenderResolve$();
            hostRef.$onRenderResolve$ = undefined;
        }
        if (hostRef.$flags$ & 512 /* HOST_FLAGS.needsRerender */) {
            nextTick(() => scheduleUpdate(hostRef, false));
        }
        hostRef.$flags$ &= ~(4 /* HOST_FLAGS.isWaitingForChildren */ | 512 /* HOST_FLAGS.needsRerender */);
    }
    // ( •_•)
    // ( •_•)>⌐■-■
    // (⌐■_■)
};
const forceUpdate = (ref) => {
    if (BUILD.updatable) {
        const hostRef = getHostRef(ref);
        const isConnected = hostRef.$hostElement$.isConnected;
        if (isConnected &&
            (hostRef.$flags$ & (2 /* HOST_FLAGS.hasRendered */ | 16 /* HOST_FLAGS.isQueuedForUpdate */)) === 2 /* HOST_FLAGS.hasRendered */) {
            scheduleUpdate(hostRef, false);
        }
        // Returns "true" when the forced update was successfully scheduled
        return isConnected;
    }
    return false;
};
const appDidLoad = (who) => {
    // on appload
    // we have finish the first big initial render
    if (BUILD.cssAnnotations) {
        addHydratedFlag(doc.documentElement);
    }
    if (BUILD.asyncQueue) {
        plt.$flags$ |= 2 /* PLATFORM_FLAGS.appLoaded */;
    }
    nextTick(() => emitEvent(win, 'appload', { detail: { namespace: NAMESPACE } }));
    if (BUILD.profile && performance.measure) {
        performance.measure(`[Stencil] ${NAMESPACE} initial load (by ${who})`, 'st:app:start');
    }
};
const safeCall = (instance, method, arg, elm) => {
    if (instance && instance[method]) {
        try {
            return instance[method](arg);
        }
        catch (e) {
            consoleError(e, elm);
        }
    }
    return undefined;
};
const then = (promise, thenFn) => {
    return promise && promise.then ? promise.then(thenFn) : thenFn();
};
const emitLifecycleEvent = (elm, lifecycleName) => {
    if (BUILD.lifecycleDOMEvents) {
        emitEvent(elm, 'stencil_' + lifecycleName, {
            bubbles: true,
            composed: true,
            detail: {
                namespace: NAMESPACE,
            },
        });
    }
};
const addHydratedFlag = (elm) => BUILD.hydratedClass
    ? elm.classList.add('hydrated')
    : BUILD.hydratedAttribute
        ? elm.setAttribute('hydrated', '')
        : undefined;
const serverSideConnected = (elm) => {
    const children = elm.children;
    if (children != null) {
        for (let i = 0, ii = children.length; i < ii; i++) {
            const childElm = children[i];
            if (typeof childElm.connectedCallback === 'function') {
                childElm.connectedCallback();
            }
            serverSideConnected(childElm);
        }
    }
};
const getValue = (ref, propName) => getHostRef(ref).$instanceValues$.get(propName);
const setValue = (ref, propName, newVal, cmpMeta, fireWatchers = true) => {
    // check our new property value against our internal value
    const hostRef = getHostRef(ref);
    const elm = BUILD.lazyLoad ? hostRef.$hostElement$ : ref;
    const oldVal = hostRef.$instanceValues$.get(propName);
    const flags = hostRef.$flags$;
    const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;
    newVal = parsePropertyValue(newVal, cmpMeta.$members$[propName][0]);
    // explicitly check for NaN on both sides, as `NaN === NaN` is always false
    const areBothNaN = Number.isNaN(oldVal) && Number.isNaN(newVal);
    const didValueChange = newVal !== oldVal && !areBothNaN;
    if ((!BUILD.lazyLoad || !(flags & 8 /* HOST_FLAGS.isConstructingInstance */) || oldVal === undefined) && didValueChange) {
        // gadzooks! the property's value has changed!!
        // set our new value!
        hostRef.$instanceValues$.set(propName, newVal);
        if (BUILD.isDev) {
            if (hostRef.$flags$ & 1024 /* HOST_FLAGS.devOnRender */) {
                consoleDevWarn(`The state/prop "${propName}" changed during rendering. This can potentially lead to infinite-loops and other bugs.`, '\nElement', elm, '\nNew value', newVal, '\nOld value', oldVal);
            }
            else if (hostRef.$flags$ & 2048 /* HOST_FLAGS.devOnDidLoad */) {
                consoleDevWarn(`The state/prop "${propName}" changed during "componentDidLoad()", this triggers extra re-renders, try to setup on "componentWillLoad()"`, '\nElement', elm, '\nNew value', newVal, '\nOld value', oldVal);
            }
        }
        if (!BUILD.lazyLoad || instance) {
            // get an array of method names of watch functions to call
            if (BUILD.watchCallback && cmpMeta.$watchers$ && flags & 128 /* HOST_FLAGS.isWatchReady */ && fireWatchers) {
                const watchMethods = cmpMeta.$watchers$[propName];
                if (watchMethods) {
                    // this instance is watching for when this property changed
                    watchMethods.map((watchMethodName) => {
                        try {
                            // fire off each of the watch methods that are watching this property
                            instance[watchMethodName](newVal, oldVal, propName);
                        }
                        catch (e) {
                            consoleError(e, elm);
                        }
                    });
                }
            }
            if (BUILD.updatable &&
                (flags & (2 /* HOST_FLAGS.hasRendered */ | 16 /* HOST_FLAGS.isQueuedForUpdate */)) === 2 /* HOST_FLAGS.hasRendered */) {
                if (BUILD.cmpShouldUpdate && instance.componentShouldUpdate) {
                    if (instance.componentShouldUpdate(newVal, oldVal, propName) === false) {
                        return;
                    }
                }
                // looks like this value actually changed, so we've got work to do!
                // but only if we've already rendered, otherwise just chill out
                // queue that we need to do an update, but don't worry about queuing
                // up millions cuz this function ensures it only runs once
                scheduleUpdate(hostRef, false);
            }
        }
    }
};
/**
 * Attach a series of runtime constructs to a compiled Stencil component
 * constructor, including getters and setters for the `@Prop` and `@State`
 * decorators, callbacks for when attributes change, and so on.
 *
 * @param Cstr the constructor for a component that we need to process
 * @param cmpMeta metadata collected previously about the component
 * @param flags a number used to store a series of bit flags
 * @returns a reference to the same constructor passed in (but now mutated)
 */
const proxyComponent = (Cstr, cmpMeta, flags) => {
    if (BUILD.member && cmpMeta.$members$) {
        if (BUILD.watchCallback && Cstr.watchers) {
            cmpMeta.$watchers$ = Cstr.watchers;
        }
        // It's better to have a const than two Object.entries()
        const members = Object.entries(cmpMeta.$members$);
        const prototype = Cstr.prototype;
        members.map(([memberName, [memberFlags]]) => {
            if ((BUILD.prop || BUILD.state) &&
                (memberFlags & 31 /* MEMBER_FLAGS.Prop */ ||
                    ((!BUILD.lazyLoad || flags & 2 /* PROXY_FLAGS.proxyState */) && memberFlags & 32 /* MEMBER_FLAGS.State */))) {
                if ((memberFlags & 2048 /* MEMBER_FLAGS.Getter */) === 0) {
                    // proxyComponent - prop
                    Object.defineProperty(prototype, memberName, {
                        get() {
                            // proxyComponent, get value
                            return getValue(this, memberName);
                        },
                        set(newValue) {
                            // only during dev time
                            if (BUILD.isDev) {
                                const ref = getHostRef(this);
                                if (
                                // we are proxying the instance (not element)
                                (flags & 1 /* PROXY_FLAGS.isElementConstructor */) === 0 &&
                                    // the element is not constructing
                                    (ref.$flags$ & 8 /* HOST_FLAGS.isConstructingInstance */) === 0 &&
                                    // the member is a prop
                                    (memberFlags & 31 /* MEMBER_FLAGS.Prop */) !== 0 &&
                                    // the member is not mutable
                                    (memberFlags & 1024 /* MEMBER_FLAGS.Mutable */) === 0) {
                                    consoleDevWarn(`@Prop() "${memberName}" on <${cmpMeta.$tagName$}> is immutable but was modified from within the component.\nMore information: https://stenciljs.com/docs/properties#prop-mutability`);
                                }
                            }
                            // proxyComponent, set value
                            setValue(this, memberName, newValue, cmpMeta);
                        },
                        configurable: true,
                        enumerable: true,
                    });
                }
                else if (flags & 1 /* PROXY_FLAGS.isElementConstructor */ && memberFlags & 2048 /* MEMBER_FLAGS.Getter */) {
                    if (BUILD.lazyLoad) {
                        // lazy maps the element get / set to the class get / set
                        // proxyComponent - lazy prop getter
                        Object.defineProperty(prototype, memberName, {
                            get() {
                                const ref = getHostRef(this);
                                const instance = BUILD.lazyLoad && ref ? ref.$lazyInstance$ : prototype;
                                if (!instance)
                                    return;
                                return instance[memberName];
                            },
                            configurable: true,
                            enumerable: true,
                        });
                    }
                }
                if (memberFlags & 4096 /* MEMBER_FLAGS.Setter */) {
                    // proxyComponent - lazy and non-lazy. Catches original set to fire updates (for @Watch)
                    const origSetter = Object.getOwnPropertyDescriptor(prototype, memberName).set;
                    Object.defineProperty(prototype, memberName, {
                        set(newValue) {
                            const ref = getHostRef(this);
                            // non-lazy setter - amends original set to fire update
                            if (origSetter) {
                                origSetter.apply(this, [newValue]);
                                setValue(this, memberName, ref.$hostElement$[memberName], cmpMeta);
                                return;
                            }
                            if (!ref)
                                return;
                            // lazy setter maps the element set to the class set
                            const setVal = (init = false) => {
                                ref.$lazyInstance$[memberName] = newValue;
                                setValue(this, memberName, ref.$lazyInstance$[memberName], cmpMeta, !init);
                            };
                            // If there's a value from an attribute, (before the class is defined), queue & set async
                            if (ref.$lazyInstance$) {
                                setVal();
                            }
                            else {
                                ref.$onInstancePromise$.then(() => setVal(true));
                            }
                        },
                    });
                }
            }
            else if (BUILD.lazyLoad &&
                BUILD.method &&
                flags & 1 /* PROXY_FLAGS.isElementConstructor */ &&
                memberFlags & 64 /* MEMBER_FLAGS.Method */) {
                // proxyComponent - method
                Object.defineProperty(prototype, memberName, {
                    value(...args) {
                        const ref = getHostRef(this);
                        return ref.$onInstancePromise$.then(() => ref.$lazyInstance$[memberName](...args));
                    },
                });
            }
        });
        if (BUILD.observeAttribute && (!BUILD.lazyLoad || flags & 1 /* PROXY_FLAGS.isElementConstructor */)) {
            const attrNameToPropName = new Map();
            prototype.attributeChangedCallback = function (attrName, _oldValue, newValue) {
                plt.jmp(() => {
                    const propName = attrNameToPropName.get(attrName);
                    //  In a web component lifecycle the attributeChangedCallback runs prior to connectedCallback
                    //  in the case where an attribute was set inline.
                    //  ```html
                    //    <my-component some-attribute="some-value"></my-component>
                    //  ```
                    //
                    //  There is an edge case where a developer sets the attribute inline on a custom element and then
                    //  programmatically changes it before it has been upgraded as shown below:
                    //
                    //  ```html
                    //    <!-- this component has _not_ been upgraded yet -->
                    //    <my-component id="test" some-attribute="some-value"></my-component>
                    //    <script>
                    //      // grab non-upgraded component
                    //      el = document.querySelector("#test");
                    //      el.someAttribute = "another-value";
                    //      // upgrade component
                    //      customElements.define('my-component', MyComponent);
                    //    </script>
                    //  ```
                    //  In this case if we do not unshadow here and use the value of the shadowing property, attributeChangedCallback
                    //  will be called with `newValue = "some-value"` and will set the shadowed property (this.someAttribute = "another-value")
                    //  to the value that was set inline i.e. "some-value" from above example. When
                    //  the connectedCallback attempts to unshadow it will use "some-value" as the initial value rather than "another-value"
                    //
                    //  The case where the attribute was NOT set inline but was not set programmatically shall be handled/unshadowed
                    //  by connectedCallback as this attributeChangedCallback will not fire.
                    //
                    //  https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
                    //
                    //  TODO(STENCIL-16) we should think about whether or not we actually want to be reflecting the attributes to
                    //  properties here given that this goes against best practices outlined here
                    //  https://developers.google.com/web/fundamentals/web-components/best-practices#avoid-reentrancy
                    if (this.hasOwnProperty(propName)) {
                        newValue = this[propName];
                        delete this[propName];
                    }
                    else if (prototype.hasOwnProperty(propName) &&
                        typeof this[propName] === 'number' &&
                        this[propName] == newValue) {
                        // if the propName exists on the prototype of `Cstr`, this update may be a result of Stencil using native
                        // APIs to reflect props as attributes. Calls to `setAttribute(someElement, propName)` will result in
                        // `propName` to be converted to a `DOMString`, which may not be what we want for other primitive props.
                        return;
                    }
                    const propDesc = Object.getOwnPropertyDescriptor(prototype, propName);
                    // test whether this property either has no 'getter' or if it does, has a 'setter'
                    // before attempting to write back to component props
                    if (!propDesc.get || !!propDesc.set) {
                        this[propName] = newValue === null && typeof this[propName] === 'boolean' ? false : newValue;
                    }
                });
            };
            // create an array of attributes to observe
            // and also create a map of html attribute name to js property name
            Cstr.observedAttributes = members
                .filter(([_, m]) => m[0] & 15 /* MEMBER_FLAGS.HasAttribute */) // filter to only keep props that should match attributes
                .map(([propName, m]) => {
                const attrName = m[1] || propName;
                attrNameToPropName.set(attrName, propName);
                if (BUILD.reflect && m[0] & 512 /* MEMBER_FLAGS.ReflectAttr */) {
                    cmpMeta.$attrsToReflect$.push([propName, attrName]);
                }
                return attrName;
            });
        }
    }
    return Cstr;
};
const initializeComponent = async (elm, hostRef, cmpMeta, hmrVersionId, Cstr) => {
    // initializeComponent
    if ((BUILD.lazyLoad || BUILD.hydrateServerSide || BUILD.style) &&
        (hostRef.$flags$ & 32 /* HOST_FLAGS.hasInitializedComponent */) === 0) {
        if (BUILD.lazyLoad || BUILD.hydrateClientSide) {
            // we haven't initialized this element yet
            hostRef.$flags$ |= 32 /* HOST_FLAGS.hasInitializedComponent */;
            // lazy loaded components
            // request the component's implementation to be
            // wired up with the host element
            Cstr = loadModule(cmpMeta, hostRef, hmrVersionId);
            if (Cstr.then) {
                // Await creates a micro-task avoid if possible
                const endLoad = uniqueTime(`st:load:${cmpMeta.$tagName$}:${hostRef.$modeName$}`, `[Stencil] Load module for <${cmpMeta.$tagName$}>`);
                Cstr = await Cstr;
                endLoad();
            }
            if ((BUILD.isDev || BUILD.isDebug) && !Cstr) {
                throw new Error(`Constructor for "${cmpMeta.$tagName$}#${hostRef.$modeName$}" was not found`);
            }
            if (BUILD.member && !Cstr.isProxied) {
                // we've never proxied this Constructor before
                // let's add the getters/setters to its prototype before
                // the first time we create an instance of the implementation
                if (BUILD.watchCallback) {
                    cmpMeta.$watchers$ = Cstr.watchers;
                }
                proxyComponent(Cstr, cmpMeta, 2 /* PROXY_FLAGS.proxyState */);
                Cstr.isProxied = true;
            }
            const endNewInstance = createTime('createInstance', cmpMeta.$tagName$);
            // ok, time to construct the instance
            // but let's keep track of when we start and stop
            // so that the getters/setters don't incorrectly step on data
            if (BUILD.member) {
                hostRef.$flags$ |= 8 /* HOST_FLAGS.isConstructingInstance */;
            }
            // construct the lazy-loaded component implementation
            // passing the hostRef is very important during
            // construction in order to directly wire together the
            // host element and the lazy-loaded instance
            try {
                new Cstr(hostRef);
            }
            catch (e) {
                consoleError(e, elm);
            }
            if (BUILD.member) {
                hostRef.$flags$ &= ~8 /* HOST_FLAGS.isConstructingInstance */;
            }
            if (BUILD.watchCallback) {
                hostRef.$flags$ |= 128 /* HOST_FLAGS.isWatchReady */;
            }
            endNewInstance();
            fireConnectedCallback(hostRef.$lazyInstance$, elm);
        }
        else {
            // sync constructor component
            Cstr = elm.constructor;
            hostRef.$flags$ |= 32 /* HOST_FLAGS.hasInitializedComponent */;
            // wait for the CustomElementRegistry to mark the component as ready before setting `isWatchReady`. Otherwise,
            // watchers may fire prematurely if `customElements.get()`/`customElements.whenDefined()` resolves _before_
            // Stencil has completed instantiating the component.
            customElements.whenDefined(cmpMeta.$tagName$).then(() => (hostRef.$flags$ |= 128 /* HOST_FLAGS.isWatchReady */));
        }
        if (BUILD.style && Cstr.style) {
            // this component has styles but we haven't registered them yet
            let style = Cstr.style;
            if (BUILD.mode && typeof style !== 'string') {
                style = style[(hostRef.$modeName$ = computeMode(elm))];
                if (BUILD.hydrateServerSide && hostRef.$modeName$) {
                    elm.setAttribute('s-mode', hostRef.$modeName$);
                }
            }
            const scopeId = getScopeId(cmpMeta, hostRef.$modeName$);
            if (!client_styles.has(scopeId)) {
                const endRegisterStyles = createTime('registerStyles', cmpMeta.$tagName$);
                if (!BUILD.hydrateServerSide &&
                    BUILD.shadowDom &&
                    BUILD.shadowDomShim &&
                    cmpMeta.$flags$ & 8 /* CMP_FLAGS.needsShadowDomShim */) {
                    style = await __webpack_require__.e(/* import() */ 1).then(__webpack_require__.bind(null, 2)).then((m) => m.scopeCss(style, scopeId, false));
                }
                registerStyle(scopeId, style, !!(cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */));
                endRegisterStyles();
            }
        }
    }
    // we've successfully created a lazy instance
    const ancestorComponent = hostRef.$ancestorComponent$;
    const schedule = () => scheduleUpdate(hostRef, true);
    if (BUILD.asyncLoading && ancestorComponent && ancestorComponent['s-rc']) {
        // this is the initial load and this component it has an ancestor component
        // but the ancestor component has NOT fired its will update lifecycle yet
        // so let's just cool our jets and wait for the ancestor to continue first
        // this will get fired off when the ancestor component
        // finally gets around to rendering its lazy self
        // fire off the initial update
        ancestorComponent['s-rc'].push(schedule);
    }
    else {
        schedule();
    }
};
const fireConnectedCallback = (instance, elm) => {
    if (BUILD.lazyLoad && BUILD.connectedCallback) {
        safeCall(instance, 'connectedCallback', undefined, elm);
    }
};
const connectedCallback = (elm) => {
    if ((plt.$flags$ & 1 /* PLATFORM_FLAGS.isTmpDisconnected */) === 0) {
        const hostRef = getHostRef(elm);
        const cmpMeta = hostRef.$cmpMeta$;
        const endConnected = createTime('connectedCallback', cmpMeta.$tagName$);
        if (BUILD.hostListenerTargetParent) {
            // only run if we have listeners being attached to a parent
            addHostEventListeners(elm, hostRef, cmpMeta.$listeners$, true);
        }
        if (!(hostRef.$flags$ & 1 /* HOST_FLAGS.hasConnected */)) {
            // first time this component has connected
            hostRef.$flags$ |= 1 /* HOST_FLAGS.hasConnected */;
            let hostId;
            if (BUILD.hydrateClientSide) {
                hostId = elm.getAttribute(HYDRATE_ID);
                if (hostId) {
                    if (BUILD.shadowDom && supportsShadow && cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
                        const scopeId = BUILD.mode
                            ? addStyle(elm.shadowRoot, cmpMeta, elm.getAttribute('s-mode'))
                            : addStyle(elm.shadowRoot, cmpMeta);
                        elm.classList.remove(scopeId + '-h', scopeId + '-s');
                    }
                    else if (BUILD.scoped && cmpMeta.$flags$ & 2 /* CMP_FLAGS.scopedCssEncapsulation */) {
                        let scopeId = getScopeId(cmpMeta, BUILD.mode ? elm.getAttribute('s-mode') : undefined);
                        elm['s-sc'] = scopeId;
                    }
                    initializeClientHydrate(elm, cmpMeta.$tagName$, hostId, hostRef);
                }
            }
            if (BUILD.slotRelocation && !hostId) {
                // initUpdate
                // if the slot polyfill is required we'll need to put some nodes
                // in here to act as original content anchors as we move nodes around
                // host element has been connected to the DOM
                if (BUILD.hydrateServerSide ||
                    ((BUILD.slot || BUILD.shadowDom) &&
                        cmpMeta.$flags$ & (4 /* CMP_FLAGS.hasSlotRelocation */ | 8 /* CMP_FLAGS.needsShadowDomShim */))) {
                    setContentReference(elm);
                }
            }
            if (BUILD.asyncLoading) {
                // find the first ancestor component (if there is one) and register
                // this component as one of the actively loading child components for its ancestor
                let ancestorComponent = elm;
                while ((ancestorComponent = ancestorComponent.parentNode || ancestorComponent.host)) {
                    // climb up the ancestors looking for the first
                    // component that hasn't finished its lifecycle update yet
                    if ((BUILD.hydrateClientSide &&
                        ancestorComponent.nodeType === 1 /* NODE_TYPE.ElementNode */ &&
                        ancestorComponent.hasAttribute('s-id') &&
                        ancestorComponent['s-p']) ||
                        ancestorComponent['s-p']) {
                        // we found this components first ancestor component
                        // keep a reference to this component's ancestor component
                        attachToAncestor(hostRef, (hostRef.$ancestorComponent$ = ancestorComponent));
                        break;
                    }
                }
            }
            // Lazy properties
            // https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
            if (BUILD.prop && !BUILD.hydrateServerSide && cmpMeta.$members$) {
                Object.entries(cmpMeta.$members$).map(([memberName, [memberFlags]]) => {
                    if (memberFlags & 31 /* MEMBER_FLAGS.Prop */ && elm.hasOwnProperty(memberName)) {
                        const value = elm[memberName];
                        delete elm[memberName];
                        elm[memberName] = value;
                    }
                });
            }
            if (BUILD.initializeNextTick) {
                // connectedCallback, taskQueue, initialLoad
                // angular sets attribute AFTER connectCallback
                // https://github.com/angular/angular/issues/18909
                // https://github.com/angular/angular/issues/19940
                nextTick(() => initializeComponent(elm, hostRef, cmpMeta));
            }
            else {
                initializeComponent(elm, hostRef, cmpMeta);
            }
        }
        else if (hostRef) {
            // not the first time this has connected
            // reattach any event listeners to the host
            // since they would have been removed when disconnected
            addHostEventListeners(elm, hostRef, cmpMeta.$listeners$, false);
            // fire off connectedCallback() on component instance
            fireConnectedCallback(hostRef.$lazyInstance$);
        }
        endConnected();
    }
};
const setContentReference = (elm) => {
    // only required when we're NOT using native shadow dom (slot)
    // or this browser doesn't support native shadow dom
    // and this host element was NOT created with SSR
    // let's pick out the inner content for slot projection
    // create a node to represent where the original
    // content was first placed, which is useful later on
    const contentRefElm = (elm['s-cr'] = doc.createComment(BUILD.isDebug ? `content-ref (host=${elm.localName})` : ''));
    contentRefElm['s-cn'] = true;
    const firstChild = elm.__firstChild || elm.firstChild;
    if (!!firstChild) {
        elm.__insertBefore ? elm.__insertBefore(contentRefElm, firstChild) : elm.insertBefore(contentRefElm, firstChild);
    }
    else {
        elm.__appendChild ? elm.__appendChild(contentRefElm) : elm.appendChild(contentRefElm);
    }
};
const disconnectedCallback = (elm) => {
    if ((plt.$flags$ & 1 /* PLATFORM_FLAGS.isTmpDisconnected */) === 0) {
        const hostRef = getHostRef(elm);
        const instance = BUILD.lazyLoad ? hostRef.$lazyInstance$ : elm;
        if (BUILD.hostListener) {
            if (hostRef.$rmListeners$) {
                hostRef.$rmListeners$.map((rmListener) => rmListener());
                hostRef.$rmListeners$ = undefined;
            }
        }
        // clear CSS var-shim tracking
        if (BUILD.cssVarShim && plt.$cssShim$) {
            plt.$cssShim$.removeHost(elm);
        }
        if (BUILD.lazyLoad && BUILD.disconnectedCallback) {
            safeCall(instance, 'disconnectedCallback', undefined, elm);
        }
        if (BUILD.cmpDidUnload) {
            safeCall(instance, 'componentDidUnload', undefined, elm);
        }
    }
};
const defineCustomElement = (Cstr, compactMeta) => {
    customElements.define(compactMeta[1], proxyCustomElement(Cstr, compactMeta));
};
const proxyCustomElement = (Cstr, compactMeta) => {
    const cmpMeta = {
        $flags$: compactMeta[0],
        $tagName$: compactMeta[1],
    };
    if (BUILD.member) {
        cmpMeta.$members$ = compactMeta[2];
    }
    if (BUILD.hostListener) {
        cmpMeta.$listeners$ = compactMeta[3];
    }
    if (BUILD.watchCallback) {
        cmpMeta.$watchers$ = Cstr.$watchers$;
    }
    if (BUILD.reflect) {
        cmpMeta.$attrsToReflect$ = [];
    }
    if (BUILD.shadowDom && !supportsShadow && cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
        cmpMeta.$flags$ |= 8 /* CMP_FLAGS.needsShadowDomShim */;
    }
    if (cmpMeta.$flags$ & 4 /* CMP_FLAGS.hasSlotRelocation */ ||
        (cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */ && 8 /* CMP_FLAGS.needsShadowDomShim */)) {
        patchPseudoShadowDom(Cstr.prototype);
        if (BUILD.cloneNodeFix) {
            patchCloneNode(Cstr.prototype);
        }
    }
    const originalConnectedCallback = Cstr.prototype.connectedCallback;
    const originalDisconnectedCallback = Cstr.prototype.disconnectedCallback;
    Object.assign(Cstr.prototype, {
        __registerHost() {
            registerHost(this, cmpMeta);
        },
        connectedCallback() {
            connectedCallback(this);
            if (BUILD.connectedCallback && originalConnectedCallback) {
                originalConnectedCallback.call(this);
            }
        },
        disconnectedCallback() {
            disconnectedCallback(this);
            if (BUILD.disconnectedCallback && originalDisconnectedCallback) {
                originalDisconnectedCallback.call(this);
            }
        },
        __attachShadow() {
            if (supportsShadow) {
                if (BUILD.shadowDelegatesFocus) {
                    this.attachShadow({
                        mode: 'open',
                        delegatesFocus: !!(cmpMeta.$flags$ & 16 /* CMP_FLAGS.shadowDelegatesFocus */),
                    });
                }
                else {
                    this.attachShadow({ mode: 'open' });
                }
            }
            else {
                this.shadowRoot = this;
            }
        },
    });
    Cstr.is = cmpMeta.$tagName$;
    return proxyComponent(Cstr, cmpMeta, 1 /* PROXY_FLAGS.isElementConstructor */ | 2 /* PROXY_FLAGS.proxyState */);
};
const forceModeUpdate = (elm) => {
    if (BUILD.style && BUILD.mode && !BUILD.lazyLoad) {
        const mode = computeMode(elm);
        const hostRef = getHostRef(elm);
        if (hostRef && hostRef.$modeName$ !== mode) {
            const cmpMeta = hostRef.$cmpMeta$;
            const oldScopeId = elm['s-sc'];
            const scopeId = getScopeId(cmpMeta, mode);
            const style = elm.constructor.style[mode];
            const flags = cmpMeta.$flags$;
            if (style) {
                if (!client_styles.has(scopeId)) {
                    registerStyle(scopeId, style, !!(flags & 1 /* CMP_FLAGS.shadowDomEncapsulation */));
                }
                hostRef.$modeName$ = mode;
                elm.classList.remove(oldScopeId + '-h', oldScopeId + '-s');
                attachStyles(hostRef);
                forceUpdate(elm);
            }
        }
    }
};
const hmrStart = (elm, cmpMeta, hmrVersionId) => {
    // ¯\_(ツ)_/¯
    const hostRef = getHostRef(elm);
    // reset state flags to only have been connected
    hostRef.$flags$ = 1 /* HOST_FLAGS.hasConnected */;
    // TODO
    // detatch any event listeners that may have been added
    // because we're not passing an exact event name it'll
    // remove all of this element's event, which is good
    // create a callback for when this component finishes hmr
    elm['s-hmr-load'] = () => {
        // finished hmr for this element
        delete elm['s-hmr-load'];
    };
    // re-initialize the component
    initializeComponent(elm, hostRef, cmpMeta, hmrVersionId);
};
const bootstrapLazy = (lazyBundles, options = {}) => {
    var _a;
    if (BUILD.profile && performance.mark) {
        performance.mark('st:app:start');
    }
    installDevTools();
    const endBootstrap = createTime('bootstrapLazy');
    const cmpTags = [];
    const exclude = options.exclude || [];
    const customElements = win.customElements;
    const head = doc.head;
    const metaCharset = /*@__PURE__*/ head.querySelector('meta[charset]');
    const visibilityStyle = /*@__PURE__*/ doc.createElement('style');
    const deferredConnectedCallbacks = [];
    const styles = /*@__PURE__*/ doc.querySelectorAll(`[${HYDRATED_STYLE_ID}]`);
    let appLoadFallback;
    let isBootstrapping = true;
    Object.assign(plt, options);
    plt.$resourcesUrl$ = new URL(options.resourcesUrl || './', doc.baseURI).href;
    if (BUILD.asyncQueue) {
        if (options.syncQueue) {
            plt.$flags$ |= 4 /* PLATFORM_FLAGS.queueSync */;
        }
    }
    if (BUILD.hydrateClientSide) {
        // If the app is already hydrated there is not point to disable the
        // async queue. This will improve the first input delay
        plt.$flags$ |= 2 /* PLATFORM_FLAGS.appLoaded */;
    }
    lazyBundles.map((lazyBundle) => {
        lazyBundle[1].map((compactMeta) => {
            const cmpMeta = {
                $flags$: compactMeta[0],
                $tagName$: compactMeta[1],
                $members$: compactMeta[2],
                $listeners$: compactMeta[3],
            };
            if (BUILD.member) {
                cmpMeta.$members$ = compactMeta[2];
            }
            if (BUILD.hostListener) {
                cmpMeta.$listeners$ = compactMeta[3];
            }
            if (BUILD.reflect) {
                cmpMeta.$attrsToReflect$ = [];
            }
            if (BUILD.watchCallback) {
                cmpMeta.$watchers$ = {};
            }
            if (BUILD.shadowDom && !supportsShadow && cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
                cmpMeta.$flags$ |= 8 /* CMP_FLAGS.needsShadowDomShim */;
            }
            const tagName = BUILD.transformTagName && options.transformTagName
                ? options.transformTagName(cmpMeta.$tagName$)
                : cmpMeta.$tagName$;
            const HostElement = class extends HTMLElement {
                // StencilLazyHost
                constructor(self) {
                    // @ts-ignore
                    super(self);
                    self = this;
                    if (BUILD.hydrateClientSide && BUILD.shadowDom) {
                        const scopeId = getScopeId(cmpMeta, computeMode(self));
                        const style = Array.from(styles).find((style) => style.getAttribute(HYDRATED_STYLE_ID) === scopeId);
                        if (style) {
                            if (cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
                                registerStyle(scopeId, convertScopedToShadow(style.innerHTML), true);
                            }
                            else {
                                registerStyle(scopeId, style.innerHTML, false);
                            }
                        }
                    }
                    registerHost(self, cmpMeta);
                    if (BUILD.shadowDom && cmpMeta.$flags$ & 1 /* CMP_FLAGS.shadowDomEncapsulation */) {
                        // this component is using shadow dom
                        // and this browser supports shadow dom
                        // add the read-only property "shadowRoot" to the host element
                        // adding the shadow root build conditionals to minimize runtime
                        if (supportsShadow) {
                            if (BUILD.shadowDelegatesFocus) {
                                self.attachShadow({
                                    mode: 'open',
                                    delegatesFocus: !!(cmpMeta.$flags$ & 16 /* CMP_FLAGS.shadowDelegatesFocus */),
                                });
                            }
                            else {
                                self.attachShadow({ mode: 'open' });
                            }
                        }
                        else if (!BUILD.hydrateServerSide && !('shadowRoot' in self)) {
                            self.shadowRoot = self;
                        }
                    }
                }
                connectedCallback() {
                    if (appLoadFallback) {
                        clearTimeout(appLoadFallback);
                        appLoadFallback = null;
                    }
                    if (isBootstrapping) {
                        // connectedCallback will be processed once all components have been registered
                        deferredConnectedCallbacks.push(this);
                    }
                    else {
                        plt.jmp(() => connectedCallback(this));
                    }
                }
                disconnectedCallback() {
                    plt.jmp(() => disconnectedCallback(this));
                }
                componentOnReady() {
                    return getHostRef(this).$onReadyPromise$;
                }
            };
            if (!BUILD.hydrateServerSide &&
                (cmpMeta.$flags$ & 4 /* CMP_FLAGS.hasSlotRelocation */ ||
                    cmpMeta.$flags$ & (8 /* CMP_FLAGS.needsShadowDomShim */))) {
                patchPseudoShadowDom(HostElement.prototype);
                if (BUILD.cloneNodeFix) {
                    patchCloneNode(HostElement.prototype);
                }
            }
            if (BUILD.hotModuleReplacement) {
                HostElement.prototype['s-hmr'] = function (hmrVersionId) {
                    hmrStart(this, cmpMeta, hmrVersionId);
                };
            }
            cmpMeta.$lazyBundleId$ = lazyBundle[0];
            if (!exclude.includes(tagName) && !customElements.get(tagName)) {
                cmpTags.push(tagName);
                customElements.define(tagName, proxyComponent(HostElement, cmpMeta, 1 /* PROXY_FLAGS.isElementConstructor */));
            }
        });
    });
    if (BUILD.invisiblePrehydration && (BUILD.hydratedClass || BUILD.hydratedAttribute)) {
        visibilityStyle.innerHTML = cmpTags + HYDRATED_CSS;
        visibilityStyle.setAttribute('data-styles', '');
        // Apply CSP nonce to the style tag if it exists
        const nonce = (_a = plt.$nonce$) !== null && _a !== void 0 ? _a : queryNonceMetaTagContent(doc);
        if (nonce != null) {
            visibilityStyle.setAttribute('nonce', nonce);
        }
        head.insertBefore(visibilityStyle, metaCharset ? metaCharset.nextSibling : head.firstChild);
    }
    // Process deferred connectedCallbacks now all components have been registered
    isBootstrapping = false;
    if (deferredConnectedCallbacks.length) {
        deferredConnectedCallbacks.map((host) => host.connectedCallback());
    }
    else {
        if (BUILD.profile) {
            plt.jmp(() => (appLoadFallback = setTimeout(appDidLoad, 30, 'timeout')));
        }
        else {
            plt.jmp(() => (appLoadFallback = setTimeout(appDidLoad, 30)));
        }
    }
    // Fallback appLoad event
    endBootstrap();
};
const getConnect = (_ref, tagName) => {
    const componentOnReady = () => {
        let elm = doc.querySelector(tagName);
        if (!elm) {
            elm = doc.createElement(tagName);
            doc.body.appendChild(elm);
        }
        return typeof elm.componentOnReady === 'function' ? elm.componentOnReady() : Promise.resolve(elm);
    };
    const create = (...args) => {
        return componentOnReady().then((el) => el.create(...args));
    };
    return {
        create,
        componentOnReady,
    };
};
const getContext = (_elm, context) => {
    if (context in Context) {
        return Context[context];
    }
    else if (context === 'window') {
        return win;
    }
    else if (context === 'document') {
        return doc;
    }
    else if (context === 'isServer' || context === 'isPrerender') {
        return BUILD.hydrateServerSide ? true : false;
    }
    else if (context === 'isClient') {
        return BUILD.hydrateServerSide ? false : true;
    }
    else if (context === 'resourcesUrl' || context === 'publicPath') {
        return getAssetPath('.');
    }
    else if (context === 'queue') {
        return {
            write: writeTask,
            read: readTask,
            tick: {
                then(cb) {
                    return nextTick(cb);
                },
            },
        };
    }
    return undefined;
};
const Fragment = (_, children) => children;
const addHostEventListeners = (elm, hostRef, listeners, attachParentListeners) => {
    if (BUILD.hostListener && listeners) {
        // this is called immediately within the element's constructor
        // initialize our event listeners on the host element
        // we do this now so that we can listen to events that may
        // have fired even before the instance is ready
        if (BUILD.hostListenerTargetParent) {
            // this component may have event listeners that should be attached to the parent
            if (attachParentListeners) {
                // this is being ran from within the connectedCallback
                // which is important so that we know the host element actually has a parent element
                // filter out the listeners to only have the ones that ARE being attached to the parent
                listeners = listeners.filter(([flags]) => flags & 32 /* LISTENER_FLAGS.TargetParent */);
            }
            else {
                // this is being ran from within the component constructor
                // everything BUT the parent element listeners should be attached at this time
                // filter out the listeners that are NOT being attached to the parent
                listeners = listeners.filter(([flags]) => !(flags & 32 /* LISTENER_FLAGS.TargetParent */));
            }
        }
        listeners.map(([flags, name, method]) => {
            const target = BUILD.hostListenerTarget ? getHostListenerTarget(elm, flags) : elm;
            const handler = hostListenerProxy(hostRef, method);
            const opts = hostListenerOpts(flags);
            plt.ael(target, name, handler, opts);
            (hostRef.$rmListeners$ = hostRef.$rmListeners$ || []).push(() => plt.rel(target, name, handler, opts));
        });
    }
};
const hostListenerProxy = (hostRef, methodName) => (ev) => {
    try {
        if (BUILD.lazyLoad) {
            if (hostRef.$flags$ & 256 /* HOST_FLAGS.isListenReady */) {
                // instance is ready, let's call it's member method for this event
                hostRef.$lazyInstance$[methodName](ev);
            }
            else {
                (hostRef.$queuedListeners$ = hostRef.$queuedListeners$ || []).push([methodName, ev]);
            }
        }
        else {
            hostRef.$hostElement$[methodName](ev);
        }
    }
    catch (e) {
        consoleError(e, hostRef.$hostElement$ || null);
    }
};
const getHostListenerTarget = (elm, flags) => {
    if (BUILD.hostListenerTargetDocument && flags & 4 /* LISTENER_FLAGS.TargetDocument */)
        return doc;
    if (BUILD.hostListenerTargetWindow && flags & 8 /* LISTENER_FLAGS.TargetWindow */)
        return win;
    if (BUILD.hostListenerTargetBody && flags & 16 /* LISTENER_FLAGS.TargetBody */)
        return doc.body;
    if (BUILD.hostListenerTargetParent && flags & 32 /* LISTENER_FLAGS.TargetParent */)
        return elm.parentElement;
    return elm;
};
// prettier-ignore
const hostListenerOpts = (flags) => supportsListenerOptions
    ? ({
        passive: (flags & 1 /* LISTENER_FLAGS.Passive */) !== 0,
        capture: (flags & 2 /* LISTENER_FLAGS.Capture */) !== 0,
    })
    : (flags & 2 /* LISTENER_FLAGS.Capture */) !== 0;
/**
 * Assigns the given value to the nonce property on the runtime platform object.
 * During runtime, this value is used to set the nonce attribute on all dynamically created script and style tags.
 * @param nonce The value to be assigned to the platform nonce property.
 * @returns void
 */
const setNonce = (nonce) => (plt.$nonce$ = nonce);
const setPlatformOptions = (opts) => Object.assign(plt, opts);
const insertVdomAnnotations = (doc, staticComponents) => {
    if (doc != null) {
        const docData = {
            hostIds: 0,
            rootLevelIds: 0,
            staticComponents: new Set(staticComponents),
        };
        const orgLocationNodes = [];
        parseVNodeAnnotations(doc, doc.body, docData, orgLocationNodes);
        orgLocationNodes.forEach((orgLocationNode) => {
            if (orgLocationNode != null) {
                const nodeRef = orgLocationNode['s-nr'];
                let hostId = nodeRef['s-host-id'];
                let nodeId = nodeRef['s-node-id'];
                let childId = `${hostId}.${nodeId}`;
                if (hostId == null) {
                    hostId = 0;
                    docData.rootLevelIds++;
                    nodeId = docData.rootLevelIds;
                    childId = `${hostId}.${nodeId}`;
                    if (nodeRef.nodeType === 1 /* NODE_TYPE.ElementNode */) {
                        nodeRef.setAttribute(HYDRATE_CHILD_ID, childId);
                        if (typeof nodeRef['s-sn'] === 'string')
                            nodeRef.setAttribute('s-sn', nodeRef['s-sn']);
                    }
                    else if (nodeRef.nodeType === 3 /* NODE_TYPE.TextNode */) {
                        if (hostId === 0) {
                            const textContent = nodeRef.nodeValue.trim();
                            if (textContent === '') {
                                // useless whitespace node at the document root
                                orgLocationNode.remove();
                                return;
                            }
                        }
                        const commentBeforeTextNode = doc.createComment(childId);
                        commentBeforeTextNode.nodeValue = `${TEXT_NODE_ID}.${childId}`;
                        nodeRef.parentNode.insertBefore(commentBeforeTextNode, nodeRef);
                    }
                    else if (nodeRef.nodeType === 8 /* NODE_TYPE.CommentNode */) {
                        const commentBeforeTextNode = doc.createComment(childId);
                        commentBeforeTextNode.nodeValue = `${COMMENT_NODE_ID}.${childId}`;
                        nodeRef.parentNode.insertBefore(commentBeforeTextNode, nodeRef);
                    }
                }
                let orgLocationNodeId = `${ORG_LOCATION_ID}.${childId}`;
                const orgLocationParentNode = orgLocationNode.parentElement;
                if (orgLocationParentNode) {
                    if (orgLocationParentNode['s-en'] === '') {
                        // ending with a "." means that the parent element
                        // of this node's original location is a SHADOW dom element
                        // and this node is a part of the root level light dom
                        orgLocationNodeId += `.`;
                    }
                    else if (orgLocationParentNode['s-en'] === 'c') {
                        // ending with a ".c" means that the parent element
                        // of this node's original location is a SCOPED element
                        // and this node is apart of the root level light dom
                        orgLocationNodeId += `.c`;
                    }
                }
                orgLocationNode.nodeValue = orgLocationNodeId;
            }
        });
    }
};
const parseVNodeAnnotations = (doc, node, docData, orgLocationNodes) => {
    if (node == null) {
        return;
    }
    if (node['s-nr'] != null) {
        orgLocationNodes.push(node);
    }
    if (node.nodeType === 1 /* NODE_TYPE.ElementNode */) {
        node.childNodes.forEach((childNode) => {
            const hostRef = getHostRef(childNode);
            if (hostRef != null && !docData.staticComponents.has(childNode.nodeName.toLowerCase())) {
                const cmpData = {
                    nodeIds: 0,
                };
                insertVNodeAnnotations(doc, childNode, hostRef.$vnode$, docData, cmpData);
            }
            parseVNodeAnnotations(doc, childNode, docData, orgLocationNodes);
        });
    }
};
const insertVNodeAnnotations = (doc, hostElm, vnode, docData, cmpData) => {
    if (vnode != null) {
        const hostId = ++docData.hostIds;
        hostElm.setAttribute(HYDRATE_ID, hostId);
        if (hostElm['s-cr'] != null) {
            hostElm['s-cr'].nodeValue = `${CONTENT_REF_ID}.${hostId}`;
        }
        if (vnode.$children$ != null) {
            const depth = 0;
            vnode.$children$.forEach((vnodeChild, index) => {
                insertChildVNodeAnnotations(doc, vnodeChild, cmpData, hostId, depth, index);
            });
        }
        if (hostElm && vnode && vnode.$elm$ && !hostElm.hasAttribute(HYDRATE_CHILD_ID)) {
            const parent = hostElm.parentElement;
            if (parent && parent.childNodes) {
                const parentChildNodes = Array.from(parent.childNodes);
                const comment = parentChildNodes.find((node) => node.nodeType === 8 /* NODE_TYPE.CommentNode */ && node['s-sr']);
                if (comment) {
                    const index = parentChildNodes.indexOf(hostElm) - 1;
                    vnode.$elm$.setAttribute(HYDRATE_CHILD_ID, `${comment['s-host-id']}.${comment['s-node-id']}.0.${index}`);
                }
            }
        }
    }
};
const insertChildVNodeAnnotations = (doc, vnodeChild, cmpData, hostId, depth, index) => {
    var _a;
    const childElm = vnodeChild.$elm$;
    if (childElm == null) {
        return;
    }
    const nodeId = cmpData.nodeIds++;
    const childId = `${hostId}.${nodeId}.${depth}.${index}`;
    childElm['s-host-id'] = hostId;
    childElm['s-node-id'] = nodeId;
    if (childElm.nodeType === 1 /* NODE_TYPE.ElementNode */) {
        childElm.setAttribute(HYDRATE_CHILD_ID, childId);
        if (typeof childElm['s-sn'] === 'string')
            childElm.setAttribute('s-sn', childElm['s-sn']);
    }
    else if (childElm.nodeType === 3 /* NODE_TYPE.TextNode */) {
        const parentNode = childElm.parentNode;
        const nodeName = parentNode.nodeName;
        if (nodeName !== 'STYLE' && nodeName !== 'SCRIPT') {
            const slotName = childElm['s-sn'] || '';
            const textNodeId = `${TEXT_NODE_ID}.${childId}.${childElm['s-sf'] ? '1' : '0'}.${slotName}`;
            const commentBeforeTextNode = doc.createComment(textNodeId);
            parentNode.insertBefore(commentBeforeTextNode, childElm);
        }
    }
    else if (childElm.nodeType === 8 /* NODE_TYPE.CommentNode */) {
        if (childElm['s-sr']) {
            const slotName = childElm['s-sn'] || '';
            const fallBackText = (_a = vnodeChild.$children$) === null || _a === void 0 ? void 0 : _a.filter((c) => { var _a; return ((_a = c.$elm$) === null || _a === void 0 ? void 0 : _a.nodeType) === 3 /* NODE_TYPE.TextNode */; }).map((ce) => {
                ce.$elm$['s-sf'] = true;
                return ce.$text$;
            }).join(' ');
            const slotNodeId = `${SLOT_NODE_ID}.${childId}.${slotName}.${childElm['s-hsf'] ? '1' : '0'}.${childElm['s-sfc'] || fallBackText ? '1' : '0'}`;
            childElm.nodeValue = slotNodeId;
            // this mock slot node has fallback text
            // add the content to a comment node
            if (childElm['s-sfc'] || fallBackText) {
                const parentNode = childElm.parentNode;
                const commentBeforeFallbackTextNode = doc.createComment(childElm['s-sfc'] || fallBackText);
                parentNode.insertBefore(commentBeforeFallbackTextNode, childElm);
            }
            // this mock slot node has fallback nodes
            // add the mock slot id as an serializable attribute
            if (childElm['s-hsf'] && vnodeChild.$children$ && vnodeChild.$children$.length) {
                vnodeChild.$children$.forEach((vNode) => {
                    if (vNode.$elm$.nodeType === 1 /* NODE_TYPE.ElementNode */) {
                        vNode.$elm$.setAttribute(HYDRATED_SLOT_FALLBACK_ID, slotNodeId);
                    }
                });
            }
            childElm.nodeValue = slotNodeId;
        }
    }
    if (vnodeChild.$children$ != null) {
        const childDepth = depth + 1;
        vnodeChild.$children$.forEach((vnode, index) => {
            insertChildVNodeAnnotations(doc, vnode, cmpData, hostId, childDepth, index);
        });
    }
};
const hostRefs = /*@__PURE__*/ new WeakMap();
const getHostRef = (ref) => hostRefs.get(ref);
const registerInstance = (lazyInstance, hostRef) => hostRefs.set((hostRef.$lazyInstance$ = lazyInstance), hostRef);
const registerHost = (elm, cmpMeta) => {
    const hostRef = {
        $flags$: 0,
        $hostElement$: elm,
        $cmpMeta$: cmpMeta,
        $instanceValues$: new Map(),
    };
    if (BUILD.isDev) {
        hostRef.$renderCount$ = 0;
    }
    if (BUILD.method && BUILD.lazyLoad) {
        hostRef.$onInstancePromise$ = new Promise((r) => (hostRef.$onInstanceResolve$ = r));
    }
    if (BUILD.asyncLoading) {
        hostRef.$onReadyPromise$ = new Promise((r) => (hostRef.$onReadyResolve$ = r));
        elm['s-p'] = [];
        elm['s-rc'] = [];
    }
    addHostEventListeners(elm, hostRef, cmpMeta.$listeners$, false);
    return hostRefs.set(elm, hostRef);
};
const isMemberInElement = (elm, memberName) => memberName in elm;
const consoleError = (e, el) => (customError || console.error)(e, el);
const STENCIL_DEV_MODE = BUILD.isTesting
    ? ['STENCIL:'] // E2E testing
    : [
        '%cstencil',
        'color: white;background:#4c47ff;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px',
    ];
const consoleDevError = (...m) => console.error(...STENCIL_DEV_MODE, ...m);
const consoleDevWarn = (...m) => console.warn(...STENCIL_DEV_MODE, ...m);
const consoleDevInfo = (...m) => console.info(...STENCIL_DEV_MODE, ...m);
const setErrorHandler = (handler) => (customError = handler);
const cmpModules = /*@__PURE__*/ new Map();
const loadModule = (cmpMeta, hostRef, hmrVersionId) => {
    // loadModuleImport
    const exportName = cmpMeta.$tagName$.replace(/-/g, '_');
    const bundleId = cmpMeta.$lazyBundleId$;
    if (BUILD.isDev && typeof bundleId !== 'string') {
        consoleDevError(`Trying to lazily load component <${cmpMeta.$tagName$}> with style mode "${hostRef.$modeName$}", but it does not exist.`);
        return undefined;
    }
    const module = !BUILD.hotModuleReplacement ? cmpModules.get(bundleId) : false;
    if (module) {
        return module[exportName];
    }
    /*!__STENCIL_STATIC_IMPORT_SWITCH__*/
    return __webpack_require__(0)(`./${bundleId}.entry.js${BUILD.hotModuleReplacement && hmrVersionId ? '?s-hmr=' + hmrVersionId : ''}`).then((importedModule) => {
        if (!BUILD.hotModuleReplacement && bundleId) {
            cmpModules.set(bundleId, importedModule);
        }
        return importedModule[exportName];
    }, (e) => {
        consoleError(e, hostRef.$hostElement$);
    });
};
const client_styles = /*@__PURE__*/ new Map();
const modeResolutionChain = [];
const win = typeof window !== 'undefined' ? window : {};
const CSS = BUILD.cssVarShim ? win.CSS : null;
const doc = win.document || { head: {} };
const H = (win.HTMLElement || class {
});
const plt = {
    $flags$: 0,
    $resourcesUrl$: '',
    jmp: (h) => h(),
    raf: (h) => requestAnimationFrame(h),
    ael: (el, eventName, listener, opts) => el.addEventListener(eventName, listener, opts),
    rel: (el, eventName, listener, opts) => el.removeEventListener(eventName, listener, opts),
    ce: (eventName, opts) => new CustomEvent(eventName, opts),
};
const setPlatformHelpers = (helpers) => {
    Object.assign(plt, helpers);
};
const supportsShadow = BUILD.shadowDomShim && BUILD.shadowDom
    ? /*@__PURE__*/ (() => (doc.head.attachShadow + '').indexOf('[native') > -1)()
    : true;
const supportsListenerOptions = /*@__PURE__*/ (() => {
    let supportsListenerOptions = false;
    try {
        doc.addEventListener('e', null, Object.defineProperty({}, 'passive', {
            get() {
                supportsListenerOptions = true;
            },
        }));
    }
    catch (e) { }
    return supportsListenerOptions;
})();
const promiseResolve = (v) => Promise.resolve(v);
const supportsConstructableStylesheets = BUILD.constructableCSS
    ? /*@__PURE__*/ (() => {
        try {
            new CSSStyleSheet();
            return typeof new CSSStyleSheet().replaceSync === 'function';
        }
        catch (e) { }
        return false;
    })()
    : false;
const queueDomReads = [];
const queueDomWrites = [];
const queueDomWritesLow = [];
const queueTask = (queue, write) => (cb) => {
    queue.push(cb);
    if (!queuePending) {
        queuePending = true;
        if (write && plt.$flags$ & 4 /* PLATFORM_FLAGS.queueSync */) {
            nextTick(flush);
        }
        else {
            plt.raf(flush);
        }
    }
};
const consume = (queue) => {
    for (let i = 0; i < queue.length; i++) {
        try {
            queue[i](performance.now());
        }
        catch (e) {
            consoleError(e);
        }
    }
    queue.length = 0;
};
const consumeTimeout = (queue, timeout) => {
    let i = 0;
    let ts = 0;
    while (i < queue.length && (ts = performance.now()) < timeout) {
        try {
            queue[i++](ts);
        }
        catch (e) {
            consoleError(e);
        }
    }
    if (i === queue.length) {
        queue.length = 0;
    }
    else if (i !== 0) {
        queue.splice(0, i);
    }
};
const flush = () => {
    if (BUILD.asyncQueue) {
        queueCongestion++;
    }
    // always force a bunch of medium callbacks to run, but still have
    // a throttle on how many can run in a certain time
    // DOM READS!!!
    consume(queueDomReads);
    // DOM WRITES!!!
    if (BUILD.asyncQueue) {
        const timeout = (plt.$flags$ & 6 /* PLATFORM_FLAGS.queueMask */) === 2 /* PLATFORM_FLAGS.appLoaded */
            ? performance.now() + 14 * Math.ceil(queueCongestion * (1.0 / 10.0))
            : Infinity;
        consumeTimeout(queueDomWrites, timeout);
        consumeTimeout(queueDomWritesLow, timeout);
        if (queueDomWrites.length > 0) {
            queueDomWritesLow.push(...queueDomWrites);
            queueDomWrites.length = 0;
        }
        if ((queuePending = queueDomReads.length + queueDomWrites.length + queueDomWritesLow.length > 0)) {
            // still more to do yet, but we've run out of time
            // let's let this thing cool off and try again in the next tick
            plt.raf(flush);
        }
        else {
            queueCongestion = 0;
        }
    }
    else {
        consume(queueDomWrites);
        if ((queuePending = queueDomReads.length > 0)) {
            // still more to do yet, but we've run out of time
            // let's let this thing cool off and try again in the next tick
            plt.raf(flush);
        }
    }
};
const nextTick = (cb) => promiseResolve().then(cb);
const readTask = /*@__PURE__*/ queueTask(queueDomReads, false);
const writeTask = /*@__PURE__*/ queueTask(queueDomWrites, true);



// CONCATENATED MODULE: ./test-output/test-custom-elements/custom-element-nested-child2.js


const CustomElementNestedChild = /*@__PURE__*/ proxyCustomElement(class extends H {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", null, h("strong", null, "Child Nested Component Loaded!")));
  }
}, [1, "custom-element-nested-child"]);
function custom_element_nested_child2_defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-element-nested-child"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-element-nested-child":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElementNestedChild);
      }
      break;
  } });
}



// CONCATENATED MODULE: ./test-output/test-custom-elements/custom-element-child2.js



const CustomElementChild = /*@__PURE__*/ proxyCustomElement(class extends H {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", null, h("strong", null, "Child Component Loaded!"), h("h3", null, "Child Nested Component?"), h("custom-element-nested-child", null)));
  }
}, [1, "custom-element-child"]);
function custom_element_child2_defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-element-child", "custom-element-nested-child"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-element-child":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElementChild);
      }
      break;
    case "custom-element-nested-child":
      if (!customElements.get(tagName)) {
        custom_element_nested_child2_defineCustomElement();
      }
      break;
  } });
}



// CONCATENATED MODULE: ./test-output/test-custom-elements/custom-element-root.js




const CustomElementRoot$1 = /*@__PURE__*/ proxyCustomElement(class extends H {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", null, h("h2", null, "Root Element Loaded"), h("h3", null, "Child Component Loaded?"), h("custom-element-child", null)));
  }
}, [1, "custom-element-root"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["custom-element-root", "custom-element-child", "custom-element-nested-child"];
  components.forEach(tagName => { switch (tagName) {
    case "custom-element-root":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElementRoot$1);
      }
      break;
    case "custom-element-child":
      if (!customElements.get(tagName)) {
        custom_element_child2_defineCustomElement();
      }
      break;
    case "custom-element-nested-child":
      if (!customElements.get(tagName)) {
        custom_element_nested_child2_defineCustomElement();
      }
      break;
  } });
}

const CustomElementRoot = CustomElementRoot$1;
const custom_element_root_defineCustomElement = defineCustomElement$1;



// CONCATENATED MODULE: ./test-app/custom-elements-output-webpack/index.esm.js


custom_element_root_defineCustomElement();


/***/ })
/******/ ]);