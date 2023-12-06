import { globalScripts } from '@app-globals';
import { doc, getHostRef, loadModule, plt, registerHost } from '@platform';
import { connectedCallback, insertVdomAnnotations } from '@runtime';
import { proxyHostElement } from './proxy-host-element';
export function hydrateApp(win, opts, results, afterHydrate, resolve) {
    const connectedElements = new Set();
    const createdElements = new Set();
    const waitingElements = new Set();
    const orgDocumentCreateElement = win.document.createElement;
    const orgDocumentCreateElementNS = win.document.createElementNS;
    const resolved = Promise.resolve();
    let tmrId;
    let ranCompleted = false;
    function hydratedComplete() {
        global.clearTimeout(tmrId);
        createdElements.clear();
        connectedElements.clear();
        if (!ranCompleted) {
            ranCompleted = true;
            try {
                if (opts.clientHydrateAnnotations) {
                    insertVdomAnnotations(win.document, opts.staticComponents);
                }
                win.dispatchEvent(new win.Event('DOMContentLoaded'));
                win.document.createElement = orgDocumentCreateElement;
                win.document.createElementNS = orgDocumentCreateElementNS;
            }
            catch (e) {
                renderCatchError(opts, results, e);
            }
        }
        afterHydrate(win, opts, results, resolve);
    }
    function hydratedError(err) {
        renderCatchError(opts, results, err);
        hydratedComplete();
    }
    function timeoutExceeded() {
        hydratedError(`Hydrate exceeded timeout${waitingOnElementsMsg(waitingElements)}`);
    }
    try {
        function patchedConnectedCallback() {
            return connectElement(this);
        }
        function patchElement(elm) {
            if (isValidComponent(elm, opts)) {
                // this element is a valid component
                const hostRef = getHostRef(elm);
                if (!hostRef) {
                    // we haven't registered this component's host element yet
                    // get the component's constructor
                    const Cstr = loadModule({
                        $tagName$: elm.nodeName.toLowerCase(),
                        $flags$: null,
                    }, null);
                    if (Cstr != null && Cstr.cmpMeta != null) {
                        // we found valid component metadata
                        createdElements.add(elm);
                        elm.connectedCallback = patchedConnectedCallback;
                        // register the host element
                        registerHost(elm, Cstr.cmpMeta);
                        // proxy the host element with the component's metadata
                        proxyHostElement(elm, Cstr.cmpMeta);
                    }
                }
            }
        }
        function patchChild(elm) {
            if (elm != null && elm.nodeType === 1) {
                patchElement(elm);
                const children = elm.children;
                for (let i = 0, ii = children.length; i < ii; i++) {
                    patchChild(children[i]);
                }
            }
        }
        function connectElement(elm) {
            createdElements.delete(elm);
            if (isValidComponent(elm, opts) && results.hydratedCount < opts.maxHydrateCount) {
                // this is a valid component to hydrate
                // and we haven't hit our max hydrated count yet
                if (!connectedElements.has(elm) && shouldHydrate(elm)) {
                    // we haven't connected this component yet
                    // and all of its ancestor elements are valid too
                    // add it to our Set so we know it's already being connected
                    connectedElements.add(elm);
                    return hydrateComponent(win, results, elm.nodeName, elm, waitingElements);
                }
            }
            return resolved;
        }
        function waitLoop() {
            const toConnect = Array.from(createdElements).filter((elm) => elm.parentElement);
            if (toConnect.length > 0) {
                return Promise.all(toConnect.map(connectElement)).then(waitLoop);
            }
            return resolved;
        }
        win.document.createElement = function patchedCreateElement(tagName) {
            const elm = orgDocumentCreateElement.call(win.document, tagName);
            patchElement(elm);
            return elm;
        };
        win.document.createElementNS = function patchedCreateElement(namespaceURI, tagName) {
            const elm = orgDocumentCreateElementNS.call(win.document, namespaceURI, tagName);
            patchElement(elm);
            return elm;
        };
        // ensure we use NodeJS's native setTimeout, not the mocked hydrate app scoped one
        tmrId = global.setTimeout(timeoutExceeded, opts.timeout);
        plt.$resourcesUrl$ = new URL(opts.resourcesUrl || './', doc.baseURI).href;
        globalScripts();
        patchChild(win.document.body);
        waitLoop().then(hydratedComplete).catch(hydratedError);
    }
    catch (e) {
        hydratedError(e);
    }
}
async function hydrateComponent(win, results, tagName, elm, waitingElements) {
    tagName = tagName.toLowerCase();
    const Cstr = loadModule({
        $tagName$: tagName,
        $flags$: null,
    }, null);
    if (Cstr != null) {
        const cmpMeta = Cstr.cmpMeta;
        if (cmpMeta != null) {
            waitingElements.add(elm);
            try {
                connectedCallback(elm);
                await elm.componentOnReady();
                results.hydratedCount++;
                const ref = getHostRef(elm);
                const modeName = !ref.$modeName$ ? '$' : ref.$modeName$;
                if (!results.components.some((c) => c.tag === tagName && c.mode === modeName)) {
                    results.components.push({
                        tag: tagName,
                        mode: modeName,
                        count: 0,
                        depth: -1,
                    });
                }
            }
            catch (e) {
                win.console.error(e);
            }
            waitingElements.delete(elm);
        }
    }
}
function isValidComponent(elm, opts) {
    if (elm != null && elm.nodeType === 1) {
        // playing it safe and not using elm.tagName or elm.localName on purpose
        const tagName = elm.nodeName;
        if (typeof tagName === 'string' && tagName.includes('-')) {
            if (opts.excludeComponents.includes(tagName.toLowerCase())) {
                // this tagName we DO NOT want to hydrate
                return false;
            }
            // all good, this is a valid component
            return true;
        }
    }
    return false;
}
function shouldHydrate(elm) {
    if (elm.nodeType === 9) {
        return true;
    }
    if (NO_HYDRATE_TAGS.has(elm.nodeName)) {
        return false;
    }
    if (elm.hasAttribute('no-prerender')) {
        return false;
    }
    const parentNode = elm.parentNode;
    if (parentNode == null) {
        return true;
    }
    return shouldHydrate(parentNode);
}
const NO_HYDRATE_TAGS = new Set([
    'CODE',
    'HEAD',
    'IFRAME',
    'INPUT',
    'OBJECT',
    'OUTPUT',
    'NOSCRIPT',
    'PRE',
    'SCRIPT',
    'SELECT',
    'STYLE',
    'TEMPLATE',
    'TEXTAREA',
]);
function renderCatchError(opts, results, err) {
    const diagnostic = {
        level: 'error',
        type: 'build',
        header: 'Hydrate Error',
        messageText: '',
        relFilePath: undefined,
        absFilePath: undefined,
        lines: [],
    };
    if (opts.url) {
        try {
            const u = new URL(opts.url);
            if (u.pathname !== '/') {
                diagnostic.header += ': ' + u.pathname;
            }
        }
        catch (e) { }
    }
    if (err != null) {
        if (err.stack != null) {
            diagnostic.messageText = err.stack.toString();
        }
        else if (err.message != null) {
            diagnostic.messageText = err.message.toString();
        }
        else {
            diagnostic.messageText = err.toString();
        }
    }
    results.diagnostics.push(diagnostic);
}
function printTag(elm) {
    let tag = `<${elm.nodeName.toLowerCase()}`;
    if (Array.isArray(elm.attributes)) {
        for (let i = 0; i < elm.attributes.length; i++) {
            const attr = elm.attributes[i];
            tag += ` ${attr.name}`;
            if (attr.value !== '') {
                tag += `="${attr.value}"`;
            }
        }
    }
    tag += `>`;
    return tag;
}
function waitingOnElementMsg(waitingElement) {
    let msg = '';
    if (waitingElement) {
        const lines = [];
        msg = ' - waiting on:';
        let elm = waitingElement;
        while (elm && elm.nodeType !== 9 && elm.nodeName !== 'BODY') {
            lines.unshift(printTag(elm));
            elm = elm.parentElement;
        }
        let indent = '';
        for (const ln of lines) {
            indent += '  ';
            msg += `\n${indent}${ln}`;
        }
    }
    return msg;
}
function waitingOnElementsMsg(waitingElements) {
    return Array.from(waitingElements).map(waitingOnElementMsg);
}
//# sourceMappingURL=hydrate-app.js.map