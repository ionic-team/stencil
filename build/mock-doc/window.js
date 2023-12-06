import { createConsole } from './console';
import { MockCustomElementRegistry } from './custom-element-registry';
import { MockDocument, resetDocument } from './document';
import { MockDocumentFragment } from './document-fragment';
import { addEventListener, dispatchEvent, removeEventListener, resetEventListeners, } from './event';
import { addGlobalsToWindowPrototype } from './global';
import { MockHistory } from './history';
import { MockIntersectionObserver } from './intersection-observer';
import { MockLocation } from './location';
import { MockNavigator } from './navigator';
import { MockElement, MockHTMLElement, MockNode, MockNodeList } from './node';
import { MockPerformance, resetPerformance } from './performance';
import { MockStorage } from './storage';
const nativeClearInterval = clearInterval;
const nativeClearTimeout = clearTimeout;
const nativeSetInterval = setInterval;
const nativeSetTimeout = setTimeout;
const nativeURL = URL;
export class MockWindow {
    constructor(html = null) {
        if (html !== false) {
            this.document = new MockDocument(html, this);
        }
        else {
            this.document = null;
        }
        this.performance = new MockPerformance();
        this.customElements = new MockCustomElementRegistry(this);
        this.console = createConsole();
        resetWindowDefaults(this);
        resetWindowDimensions(this);
    }
    addEventListener(type, handler) {
        addEventListener(this, type, handler);
    }
    alert(msg) {
        if (this.console) {
            this.console.debug(msg);
        }
        else {
            console.debug(msg);
        }
    }
    blur() {
        /**/
    }
    cancelAnimationFrame(id) {
        this.__clearTimeout(id);
    }
    cancelIdleCallback(id) {
        this.__clearTimeout(id);
    }
    get CharacterData() {
        if (this.__charDataCstr == null) {
            const ownerDocument = this.document;
            this.__charDataCstr = class extends MockNode {
                constructor() {
                    super(ownerDocument, 0, 'test', '');
                    throw new Error('Illegal constructor: cannot construct CharacterData');
                }
            };
        }
        return this.__charDataCstr;
    }
    set CharacterData(charDataCstr) {
        this.__charDataCstr = charDataCstr;
    }
    clearInterval(id) {
        this.__clearInterval(id);
    }
    clearTimeout(id) {
        this.__clearTimeout(id);
    }
    close() {
        resetWindow(this);
    }
    confirm() {
        return false;
    }
    get CSS() {
        return {
            supports: () => true,
        };
    }
    get Document() {
        if (this.__docCstr == null) {
            const win = this;
            this.__docCstr = class extends MockDocument {
                constructor() {
                    super(false, win);
                    throw new Error('Illegal constructor: cannot construct Document');
                }
            };
        }
        return this.__docCstr;
    }
    set Document(docCstr) {
        this.__docCstr = docCstr;
    }
    get DocumentFragment() {
        if (this.__docFragCstr == null) {
            const ownerDocument = this.document;
            this.__docFragCstr = class extends MockDocumentFragment {
                constructor() {
                    super(ownerDocument);
                    throw new Error('Illegal constructor: cannot construct DocumentFragment');
                }
            };
        }
        return this.__docFragCstr;
    }
    set DocumentFragment(docFragCstr) {
        this.__docFragCstr = docFragCstr;
    }
    get DocumentType() {
        if (this.__docTypeCstr == null) {
            const ownerDocument = this.document;
            this.__docTypeCstr = class extends MockNode {
                constructor() {
                    super(ownerDocument, 0, 'test', '');
                    throw new Error('Illegal constructor: cannot construct DocumentType');
                }
            };
        }
        return this.__docTypeCstr;
    }
    set DocumentType(docTypeCstr) {
        this.__docTypeCstr = docTypeCstr;
    }
    get DOMTokenList() {
        if (this.__domTokenListCstr == null) {
            this.__domTokenListCstr = class MockDOMTokenList {
            };
        }
        return this.__domTokenListCstr;
    }
    set DOMTokenList(domTokenListCstr) {
        this.__domTokenListCstr = domTokenListCstr;
    }
    dispatchEvent(ev) {
        return dispatchEvent(this, ev);
    }
    get Element() {
        if (this.__elementCstr == null) {
            const ownerDocument = this.document;
            this.__elementCstr = class extends MockElement {
                constructor() {
                    super(ownerDocument, '');
                    throw new Error('Illegal constructor: cannot construct Element');
                }
            };
        }
        return this.__elementCstr;
    }
    fetch(input, init) {
        if (typeof fetch === 'function') {
            return fetch(input, init);
        }
        throw new Error(`fetch() not implemented`);
    }
    focus() {
        /**/
    }
    getComputedStyle(_) {
        return {
            cssText: '',
            length: 0,
            parentRule: null,
            getPropertyPriority() {
                return null;
            },
            getPropertyValue() {
                return '';
            },
            item() {
                return null;
            },
            removeProperty() {
                return null;
            },
            setProperty() {
                return null;
            },
        };
    }
    get globalThis() {
        return this;
    }
    get history() {
        if (this.__history == null) {
            this.__history = new MockHistory();
        }
        return this.__history;
    }
    set history(hsty) {
        this.__history = hsty;
    }
    get JSON() {
        return JSON;
    }
    get HTMLElement() {
        if (this.__htmlElementCstr == null) {
            const ownerDocument = this.document;
            this.__htmlElementCstr = class extends MockHTMLElement {
                constructor() {
                    super(ownerDocument, '');
                    const observedAttributes = this.constructor.observedAttributes;
                    if (Array.isArray(observedAttributes) && typeof this.attributeChangedCallback === 'function') {
                        observedAttributes.forEach((attrName) => {
                            const attrValue = this.getAttribute(attrName);
                            if (attrValue != null) {
                                this.attributeChangedCallback(attrName, null, attrValue);
                            }
                        });
                    }
                }
            };
        }
        return this.__htmlElementCstr;
    }
    set HTMLElement(htmlElementCstr) {
        this.__htmlElementCstr = htmlElementCstr;
    }
    get IntersectionObserver() {
        return MockIntersectionObserver;
    }
    get localStorage() {
        if (this.__localStorage == null) {
            this.__localStorage = new MockStorage();
        }
        return this.__localStorage;
    }
    set localStorage(locStorage) {
        this.__localStorage = locStorage;
    }
    get location() {
        if (this.__location == null) {
            this.__location = new MockLocation();
        }
        return this.__location;
    }
    set location(val) {
        if (typeof val === 'string') {
            if (this.__location == null) {
                this.__location = new MockLocation();
            }
            this.__location.href = val;
        }
        else {
            this.__location = val;
        }
    }
    matchMedia(media) {
        return {
            media,
            matches: false,
            addListener: (_handler) => { },
            removeListener: (_handler) => { },
            addEventListener: (_type, _handler) => { },
            removeEventListener: (_type, _handler) => { },
            dispatchEvent: (_ev) => { },
            onchange: null,
        };
    }
    get Node() {
        if (this.__nodeCstr == null) {
            const ownerDocument = this.document;
            this.__nodeCstr = class extends MockNode {
                constructor() {
                    super(ownerDocument, 0, 'test', '');
                    throw new Error('Illegal constructor: cannot construct Node');
                }
            };
        }
        return this.__nodeCstr;
    }
    get NodeList() {
        if (this.__nodeListCstr == null) {
            const ownerDocument = this.document;
            this.__nodeListCstr = class extends MockNodeList {
                constructor() {
                    super(ownerDocument, [], 0);
                    throw new Error('Illegal constructor: cannot construct NodeList');
                }
            };
        }
        return this.__nodeListCstr;
    }
    get navigator() {
        if (this.__navigator == null) {
            this.__navigator = new MockNavigator();
        }
        return this.__navigator;
    }
    set navigator(nav) {
        this.__navigator = nav;
    }
    get parent() {
        return null;
    }
    prompt() {
        return '';
    }
    open() {
        return null;
    }
    get origin() {
        return this.location.origin;
    }
    removeEventListener(type, handler) {
        removeEventListener(this, type, handler);
    }
    requestAnimationFrame(callback) {
        return this.setTimeout(() => {
            callback(Date.now());
        }, 0);
    }
    requestIdleCallback(callback) {
        return this.setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => 0,
            });
        }, 0);
    }
    scroll(_x, _y) {
        /**/
    }
    scrollBy(_x, _y) {
        /**/
    }
    scrollTo(_x, _y) {
        /**/
    }
    get self() {
        return this;
    }
    get sessionStorage() {
        if (this.__sessionStorage == null) {
            this.__sessionStorage = new MockStorage();
        }
        return this.__sessionStorage;
    }
    set sessionStorage(locStorage) {
        this.__sessionStorage = locStorage;
    }
    setInterval(callback, ms, ...args) {
        if (this.__timeouts == null) {
            this.__timeouts = new Set();
        }
        ms = Math.min(ms, this.__maxTimeout);
        if (this.__allowInterval) {
            const intervalId = this.__setInterval(() => {
                if (this.__timeouts) {
                    this.__timeouts.delete(intervalId);
                    try {
                        callback(...args);
                    }
                    catch (e) {
                        if (this.console) {
                            this.console.error(e);
                        }
                        else {
                            console.error(e);
                        }
                    }
                }
            }, ms);
            if (this.__timeouts) {
                this.__timeouts.add(intervalId);
            }
            return intervalId;
        }
        const timeoutId = this.__setTimeout(() => {
            if (this.__timeouts) {
                this.__timeouts.delete(timeoutId);
                try {
                    callback(...args);
                }
                catch (e) {
                    if (this.console) {
                        this.console.error(e);
                    }
                    else {
                        console.error(e);
                    }
                }
            }
        }, ms);
        if (this.__timeouts) {
            this.__timeouts.add(timeoutId);
        }
        return timeoutId;
    }
    setTimeout(callback, ms, ...args) {
        if (this.__timeouts == null) {
            this.__timeouts = new Set();
        }
        ms = Math.min(ms, this.__maxTimeout);
        const timeoutId = this.__setTimeout(() => {
            if (this.__timeouts) {
                this.__timeouts.delete(timeoutId);
                try {
                    callback(...args);
                }
                catch (e) {
                    if (this.console) {
                        this.console.error(e);
                    }
                    else {
                        console.error(e);
                    }
                }
            }
        }, ms);
        if (this.__timeouts) {
            this.__timeouts.add(timeoutId);
        }
        return timeoutId;
    }
    get top() {
        return this;
    }
    get window() {
        return this;
    }
    onanimationstart() {
        /**/
    }
    onanimationend() {
        /**/
    }
    onanimationiteration() {
        /**/
    }
    onabort() {
        /**/
    }
    onauxclick() {
        /**/
    }
    onbeforecopy() {
        /**/
    }
    onbeforecut() {
        /**/
    }
    onbeforepaste() {
        /**/
    }
    onblur() {
        /**/
    }
    oncancel() {
        /**/
    }
    oncanplay() {
        /**/
    }
    oncanplaythrough() {
        /**/
    }
    onchange() {
        /**/
    }
    onclick() {
        /**/
    }
    onclose() {
        /**/
    }
    oncontextmenu() {
        /**/
    }
    oncopy() {
        /**/
    }
    oncuechange() {
        /**/
    }
    oncut() {
        /**/
    }
    ondblclick() {
        /**/
    }
    ondrag() {
        /**/
    }
    ondragend() {
        /**/
    }
    ondragenter() {
        /**/
    }
    ondragleave() {
        /**/
    }
    ondragover() {
        /**/
    }
    ondragstart() {
        /**/
    }
    ondrop() {
        /**/
    }
    ondurationchange() {
        /**/
    }
    onemptied() {
        /**/
    }
    onended() {
        /**/
    }
    onerror() {
        /**/
    }
    onfocus() {
        /**/
    }
    onfocusin() {
        /**/
    }
    onfocusout() {
        /**/
    }
    onformdata() {
        /**/
    }
    onfullscreenchange() {
        /**/
    }
    onfullscreenerror() {
        /**/
    }
    ongotpointercapture() {
        /**/
    }
    oninput() {
        /**/
    }
    oninvalid() {
        /**/
    }
    onkeydown() {
        /**/
    }
    onkeypress() {
        /**/
    }
    onkeyup() {
        /**/
    }
    onload() {
        /**/
    }
    onloadeddata() {
        /**/
    }
    onloadedmetadata() {
        /**/
    }
    onloadstart() {
        /**/
    }
    onlostpointercapture() {
        /**/
    }
    onmousedown() {
        /**/
    }
    onmouseenter() {
        /**/
    }
    onmouseleave() {
        /**/
    }
    onmousemove() {
        /**/
    }
    onmouseout() {
        /**/
    }
    onmouseover() {
        /**/
    }
    onmouseup() {
        /**/
    }
    onmousewheel() {
        /**/
    }
    onpaste() {
        /**/
    }
    onpause() {
        /**/
    }
    onplay() {
        /**/
    }
    onplaying() {
        /**/
    }
    onpointercancel() {
        /**/
    }
    onpointerdown() {
        /**/
    }
    onpointerenter() {
        /**/
    }
    onpointerleave() {
        /**/
    }
    onpointermove() {
        /**/
    }
    onpointerout() {
        /**/
    }
    onpointerover() {
        /**/
    }
    onpointerup() {
        /**/
    }
    onprogress() {
        /**/
    }
    onratechange() {
        /**/
    }
    onreset() {
        /**/
    }
    onresize() {
        /**/
    }
    onscroll() {
        /**/
    }
    onsearch() {
        /**/
    }
    onseeked() {
        /**/
    }
    onseeking() {
        /**/
    }
    onselect() {
        /**/
    }
    onselectstart() {
        /**/
    }
    onstalled() {
        /**/
    }
    onsubmit() {
        /**/
    }
    onsuspend() {
        /**/
    }
    ontimeupdate() {
        /**/
    }
    ontoggle() {
        /**/
    }
    onvolumechange() {
        /**/
    }
    onwaiting() {
        /**/
    }
    onwebkitfullscreenchange() {
        /**/
    }
    onwebkitfullscreenerror() {
        /**/
    }
    onwheel() {
        /**/
    }
}
addGlobalsToWindowPrototype(MockWindow.prototype);
function resetWindowDefaults(win) {
    win.__clearInterval = nativeClearInterval;
    win.__clearTimeout = nativeClearTimeout;
    win.__setInterval = nativeSetInterval;
    win.__setTimeout = nativeSetTimeout;
    win.__maxTimeout = 30000;
    win.__allowInterval = true;
    win.URL = nativeURL;
}
export function createWindow(html = null) {
    return new MockWindow(html);
}
export function cloneWindow(srcWin, opts = {}) {
    if (srcWin == null) {
        return null;
    }
    const clonedWin = new MockWindow(false);
    if (!opts.customElementProxy) {
        // TODO(STENCIL-345) - Evaluate reconciling MockWindow, Window differences
        // @ts-ignore
        srcWin.customElements = null;
    }
    if (srcWin.document != null) {
        const clonedDoc = new MockDocument(false, clonedWin);
        clonedWin.document = clonedDoc;
        clonedDoc.documentElement = srcWin.document.documentElement.cloneNode(true);
    }
    else {
        clonedWin.document = new MockDocument(null, clonedWin);
    }
    return clonedWin;
}
export function cloneDocument(srcDoc) {
    if (srcDoc == null) {
        return null;
    }
    const dstWin = cloneWindow(srcDoc.defaultView);
    return dstWin.document;
}
// TODO(STENCIL-345) - Evaluate reconciling MockWindow, Window differences
/**
 * Constrain setTimeout() to 1ms, but still async. Also
 * only allow setInterval() to fire once, also constrained to 1ms.
 * @param win the mock window instance to update
 */
export function constrainTimeouts(win) {
    win.__allowInterval = false;
    win.__maxTimeout = 0;
}
function resetWindow(win) {
    if (win != null) {
        if (win.__timeouts) {
            win.__timeouts.forEach((timeoutId) => {
                nativeClearInterval(timeoutId);
                nativeClearTimeout(timeoutId);
            });
            win.__timeouts.clear();
        }
        if (win.customElements && win.customElements.clear) {
            win.customElements.clear();
        }
        resetDocument(win.document);
        resetPerformance(win.performance);
        for (const key in win) {
            if (win.hasOwnProperty(key) && key !== 'document' && key !== 'performance' && key !== 'customElements') {
                delete win[key];
            }
        }
        resetWindowDefaults(win);
        resetWindowDimensions(win);
        resetEventListeners(win);
        if (win.document != null) {
            try {
                win.document.defaultView = win;
            }
            catch (e) { }
        }
        // ensure we don't hold onto nodeFetch values
        win.fetch = null;
        win.Headers = null;
        win.Request = null;
        win.Response = null;
        win.FetchError = null;
    }
}
function resetWindowDimensions(win) {
    try {
        win.devicePixelRatio = 1;
        win.innerHeight = 768;
        win.innerWidth = 1366;
        win.pageXOffset = 0;
        win.pageYOffset = 0;
        win.screenLeft = 0;
        win.screenTop = 0;
        win.screenX = 0;
        win.screenY = 0;
        win.scrollX = 0;
        win.scrollY = 0;
        win.screen = {
            availHeight: win.innerHeight,
            availLeft: 0,
            availTop: 0,
            availWidth: win.innerWidth,
            colorDepth: 24,
            height: win.innerHeight,
            keepAwake: false,
            orientation: {
                angle: 0,
                type: 'portrait-primary',
            },
            pixelDepth: 24,
            width: win.innerWidth,
        };
    }
    catch (e) { }
}
//# sourceMappingURL=window.js.map