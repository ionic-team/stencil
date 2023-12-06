import { BUILD } from '@app-data';
import { bootstrapLazy, flushAll, flushLoadModule, flushQueue, getHostRef, insertVdomAnnotations, registerComponents, registerModule, renderVdom, resetPlatform, setSupportsShadowDom, startAutoApplyChanges, styles, win, writeTask, } from '@stencil/core/internal/testing';
import { formatLazyBundleRuntimeMeta } from '@utils';
import { getBuildFeatures } from '../compiler/app-core/app-data';
import { resetBuildConditionals } from './reset-build-conditionals';
/**
 * Creates a new spec page for unit testing
 * @param opts the options to apply to the spec page that influence its configuration and operation
 * @returns the created spec page
 */
export async function newSpecPage(opts) {
    var _a;
    if (opts == null) {
        throw new Error(`NewSpecPageOptions required`);
    }
    // reset the platform for this new test
    resetPlatform((_a = opts.platform) !== null && _a !== void 0 ? _a : {});
    resetBuildConditionals(BUILD);
    if (Array.isArray(opts.components)) {
        registerComponents(opts.components);
    }
    if (opts.hydrateClientSide) {
        opts.includeAnnotations = true;
    }
    if (opts.hydrateServerSide) {
        opts.includeAnnotations = true;
        setSupportsShadowDom(false);
    }
    else {
        opts.includeAnnotations = !!opts.includeAnnotations;
        if (opts.supportsShadowDom === false) {
            setSupportsShadowDom(false);
        }
        else {
            setSupportsShadowDom(true);
        }
    }
    BUILD.cssAnnotations = opts.includeAnnotations;
    const cmpTags = new Set();
    win['__stencil_spec_options'] = opts;
    const doc = win.document;
    const page = {
        win: win,
        doc: doc,
        body: doc.body,
        build: BUILD,
        styles: styles,
        setContent: (html) => {
            doc.body.innerHTML = html;
            return flushAll();
        },
        waitForChanges: flushAll,
        flushLoadModule: flushLoadModule,
        flushQueue: flushQueue,
    };
    const lazyBundles = opts.components.map((Cstr) => {
        if (Cstr.COMPILER_META == null) {
            throw new Error(`Invalid component class: Missing static "COMPILER_META" property.`);
        }
        cmpTags.add(Cstr.COMPILER_META.tagName);
        Cstr.isProxied = false;
        proxyComponentLifeCycles(Cstr);
        const bundleId = `${Cstr.COMPILER_META.tagName}.${Math.round(Math.random() * 899999) + 100000}`;
        const stylesMeta = Cstr.COMPILER_META.styles;
        if (Array.isArray(stylesMeta)) {
            if (stylesMeta.length > 1) {
                const styles = {};
                stylesMeta.forEach((style) => {
                    styles[style.modeName] = style.styleStr;
                });
                Cstr.style = styles;
            }
            else if (stylesMeta.length === 1) {
                Cstr.style = stylesMeta[0].styleStr;
            }
        }
        registerModule(bundleId, Cstr);
        const lazyBundleRuntimeMeta = formatLazyBundleRuntimeMeta(bundleId, [Cstr.COMPILER_META]);
        return lazyBundleRuntimeMeta;
    });
    const cmpCompilerMeta = opts.components.map((Cstr) => Cstr.COMPILER_META);
    const cmpBuild = getBuildFeatures(cmpCompilerMeta);
    if (opts.strictBuild) {
        Object.assign(BUILD, cmpBuild);
    }
    else {
        Object.keys(cmpBuild).forEach((key) => {
            if (cmpBuild[key] === true) {
                BUILD[key] = true;
            }
        });
    }
    BUILD.asyncLoading = true;
    if (opts.hydrateClientSide) {
        BUILD.hydrateClientSide = true;
        BUILD.hydrateServerSide = false;
    }
    else if (opts.hydrateServerSide) {
        BUILD.hydrateServerSide = true;
        BUILD.hydrateClientSide = false;
    }
    BUILD.cloneNodeFix = false;
    // TODO(STENCIL-854): Remove code related to legacy shadowDomShim field
    BUILD.shadowDomShim = false;
    BUILD.attachStyles = !!opts.attachStyles;
    if (typeof opts.url === 'string') {
        page.win.location.href = opts.url;
    }
    if (typeof opts.direction === 'string') {
        page.doc.documentElement.setAttribute('dir', opts.direction);
    }
    if (typeof opts.language === 'string') {
        page.doc.documentElement.setAttribute('lang', opts.language);
    }
    if (typeof opts.cookie === 'string') {
        try {
            page.doc.cookie = opts.cookie;
        }
        catch (e) { }
    }
    if (typeof opts.referrer === 'string') {
        try {
            page.doc.referrer = opts.referrer;
        }
        catch (e) { }
    }
    if (typeof opts.userAgent === 'string') {
        try {
            page.win.navigator.userAgent = opts.userAgent;
        }
        catch (e) { }
    }
    bootstrapLazy(lazyBundles);
    if (typeof opts.template === 'function') {
        const cmpMeta = {
            $flags$: 0,
            $tagName$: 'body',
        };
        const ref = {
            $ancestorComponent$: undefined,
            $flags$: 0,
            $modeName$: undefined,
            $cmpMeta$: cmpMeta,
            $hostElement$: page.body,
        };
        renderVdom(ref, opts.template());
    }
    else if (typeof opts.html === 'string') {
        page.body.innerHTML = opts.html;
    }
    if (opts.flushQueue !== false) {
        await page.waitForChanges();
    }
    let rootComponent = null;
    Object.defineProperty(page, 'root', {
        get() {
            if (rootComponent == null) {
                rootComponent = findRootComponent(cmpTags, page.body);
            }
            if (rootComponent != null) {
                return rootComponent;
            }
            const firstElementChild = page.body.firstElementChild;
            if (firstElementChild != null) {
                return firstElementChild;
            }
            return null;
        },
    });
    Object.defineProperty(page, 'rootInstance', {
        get() {
            const hostRef = getHostRef(page.root);
            if (hostRef != null) {
                return hostRef.$lazyInstance$;
            }
            return null;
        },
    });
    if (opts.hydrateServerSide) {
        insertVdomAnnotations(doc, []);
    }
    if (opts.autoApplyChanges) {
        startAutoApplyChanges();
        page.waitForChanges = () => {
            console.error('waitForChanges() cannot be used manually if the "startAutoApplyChanges" option is enabled');
            return Promise.resolve();
        };
    }
    return page;
}
/**
 * A helper method that proxies Stencil lifecycle methods by mutating the provided component class
 * @param Cstr the component class whose lifecycle methods will be proxied
 */
function proxyComponentLifeCycles(Cstr) {
    var _a, _b, _c, _d, _e, _f;
    // we may have called this function on the class before, reset the state of the class
    if (typeof ((_a = Cstr.prototype) === null || _a === void 0 ? void 0 : _a.__componentWillLoad) === 'function') {
        Cstr.prototype.componentWillLoad = Cstr.prototype.__componentWillLoad;
        Cstr.prototype.__componentWillLoad = null;
    }
    if (typeof ((_b = Cstr.prototype) === null || _b === void 0 ? void 0 : _b.__componentWillUpdate) === 'function') {
        Cstr.prototype.componentWillUpdate = Cstr.prototype.__componentWillUpdate;
        Cstr.prototype.__componentWillUpdate = null;
    }
    if (typeof ((_c = Cstr.prototype) === null || _c === void 0 ? void 0 : _c.__componentWillRender) === 'function') {
        Cstr.prototype.componentWillRender = Cstr.prototype.__componentWillRender;
        Cstr.prototype.__componentWillRender = null;
    }
    // the class should be in a known 'good' state to proxy functions
    if (typeof ((_d = Cstr.prototype) === null || _d === void 0 ? void 0 : _d.componentWillLoad) === 'function') {
        Cstr.prototype.__componentWillLoad = Cstr.prototype.componentWillLoad;
        Cstr.prototype.componentWillLoad = function () {
            const result = this.__componentWillLoad();
            if (result != null && typeof result.then === 'function') {
                writeTask(() => result);
            }
            else {
                writeTask(() => Promise.resolve());
            }
            return result;
        };
    }
    if (typeof ((_e = Cstr.prototype) === null || _e === void 0 ? void 0 : _e.componentWillUpdate) === 'function') {
        Cstr.prototype.__componentWillUpdate = Cstr.prototype.componentWillUpdate;
        Cstr.prototype.componentWillUpdate = function () {
            const result = this.__componentWillUpdate();
            if (result != null && typeof result.then === 'function') {
                writeTask(() => result);
            }
            else {
                writeTask(() => Promise.resolve());
            }
            return result;
        };
    }
    if (typeof ((_f = Cstr.prototype) === null || _f === void 0 ? void 0 : _f.componentWillRender) === 'function') {
        Cstr.prototype.__componentWillRender = Cstr.prototype.componentWillRender;
        Cstr.prototype.componentWillRender = function () {
            const result = this.__componentWillRender();
            if (result != null && typeof result.then === 'function') {
                writeTask(() => result);
            }
            else {
                writeTask(() => Promise.resolve());
            }
            return result;
        };
    }
}
/**
 * Return the first Element whose {@link Element#nodeName} property matches a tag found in the provided `cmpTags`
 * argument.
 *
 * If the `nodeName` property on the element matches any of the names found in the provided `cmpTags` argument, that
 * element is returned. If no match is found on the current element, the children will be inspected in a depth-first
 * search manner. This process continues until either:
 * - an element is found (and execution ends)
 * - no element is found after an exhaustive search
 *
 * @param cmpTags component tag names to use in the match criteria
 * @param node the node whose children are to be inspected
 * @returns An element whose name matches one of the strings in the provided `cmpTags`. If no match is found, `null` is
 * returned
 */
function findRootComponent(cmpTags, node) {
    if (node != null) {
        const children = node.children;
        const childrenLength = children.length;
        for (let i = 0; i < childrenLength; i++) {
            const elm = children[i];
            if (cmpTags.has(elm.nodeName.toLowerCase())) {
                return elm;
            }
        }
        for (let i = 0; i < childrenLength; i++) {
            const r = findRootComponent(cmpTags, children[i]);
            if (r != null) {
                return r;
            }
        }
    }
    return null;
}
//# sourceMappingURL=spec-page.js.map