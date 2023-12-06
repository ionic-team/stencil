import { cloneAttributes, MockHTMLElement, parseHtmlToFragment } from '@stencil/core/mock-doc';
import { addE2EListener, EventSpy, waitForEvent } from './puppeteer-events';
export class E2EElement extends MockHTMLElement {
    _queueAction(action) {
        this._queuedActions.push(action);
    }
    constructor(_page, _elmHandle) {
        super(null, null);
        this._page = _page;
        this._elmHandle = _elmHandle;
        this._queuedActions = [];
        _page._e2eElements.push(this);
    }
    find(selector) {
        return find(this._page, this._elmHandle, selector);
    }
    findAll(selector) {
        return findAll(this._page, this._elmHandle, selector);
    }
    callMethod(methodName, ...methodArgs) {
        this._queueAction({
            methodName: methodName,
            methodArgs: methodArgs,
        });
        return this.e2eRunActions();
    }
    triggerEvent(eventName, eventInitDict) {
        this._queueAction({
            eventName: eventName,
            eventInitDict: eventInitDict,
        });
    }
    async spyOnEvent(eventName) {
        const eventSpy = new EventSpy(eventName);
        await addE2EListener(this._page, this._elmHandle, eventName, (ev) => {
            eventSpy.push(ev);
        });
        return eventSpy;
    }
    async click(options) {
        await this._elmHandle.click(options);
        await this._page.waitForChanges();
    }
    async focus() {
        await this._elmHandle.focus();
        await this._page.waitForChanges();
    }
    async hover() {
        await this._elmHandle.hover();
        await this._page.waitForChanges();
    }
    async isVisible() {
        this._validate();
        let isVisible = false;
        try {
            const executionContext = getPuppeteerExecution(this._elmHandle);
            isVisible = await executionContext.evaluate((elm) => {
                return new Promise((resolve) => {
                    window.requestAnimationFrame(() => {
                        if (elm.isConnected) {
                            const style = window.getComputedStyle(elm);
                            const isVisible = !!style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                            if (isVisible) {
                                window.requestAnimationFrame(() => {
                                    elm.clientWidth;
                                    resolve(true);
                                });
                            }
                            else {
                                resolve(false);
                            }
                        }
                        else {
                            resolve(false);
                        }
                    });
                });
            }, this._elmHandle);
        }
        catch (e) { }
        return isVisible;
    }
    waitForEvent(eventName) {
        return waitForEvent(this._page, eventName, this._elmHandle);
    }
    waitForVisible() {
        return new Promise((resolve, reject) => {
            const checkVisible = async () => {
                const isVisible = await this.isVisible();
                if (isVisible) {
                    clearInterval(resolveTmr);
                    clearTimeout(rejectTmr);
                    resolve();
                }
            };
            const resolveTmr = setInterval(checkVisible, 10);
            /**
             * When using screenshot functionality in a runner that is not Jasmine (e.g. Jest Circus), we need to set a
             * default value for timeouts. There are runtime errors that occur if we attempt to use optional chaining +
             * nullish coalescing with the `jasmine` global stating it's not defined. As a result, we use a ternary here.
             *
             * The '2500' value that we default to is the value of `jasmine.DEFAULT_TIMEOUT_INTERVAL` (5000) divided by 2.
             */
            const timeout = typeof jasmine !== 'undefined' && jasmine.DEFAULT_TIMEOUT_INTERVAL
                ? jasmine.DEFAULT_TIMEOUT_INTERVAL * 0.5
                : 2500;
            const timeoutError = new Error(`waitForVisible timed out: ${timeout}ms`);
            const rejectTmr = setTimeout(() => {
                clearTimeout(resolveTmr);
                reject(timeoutError);
            }, timeout);
        });
    }
    waitForNotVisible() {
        return new Promise((resolve, reject) => {
            const checkVisible = async () => {
                const isVisible = await this.isVisible();
                if (!isVisible) {
                    clearInterval(resolveTmr);
                    clearTimeout(rejectTmr);
                    resolve();
                }
            };
            const resolveTmr = setInterval(checkVisible, 10);
            /**
             * When using screenshot functionality in a runner that is not Jasmine (e.g. Jest Circus), we need to set a
             * default value for timeouts. There are runtime errors that occur if we attempt to use optional chaining +
             * nullish coalescing with the `jasmine` global stating it's not defined. As a result, we use a ternary here.
             *
             * The '2500' value that we default to is the value of `jasmine.DEFAULT_TIMEOUT_INTERVAL` (5000) divided by 2.
             */
            const timeout = typeof jasmine !== 'undefined' && jasmine.DEFAULT_TIMEOUT_INTERVAL
                ? jasmine.DEFAULT_TIMEOUT_INTERVAL * 0.5
                : 2500;
            const timeoutError = new Error(`waitForNotVisible timed out: ${timeout}ms`);
            const rejectTmr = setTimeout(() => {
                clearTimeout(resolveTmr);
                reject(timeoutError);
            }, timeout);
        });
    }
    isIntersectingViewport() {
        return this._elmHandle.isIntersectingViewport();
    }
    async press(key, options) {
        await this._elmHandle.press(key, options);
        await this._page.waitForChanges();
    }
    async tap() {
        await this._elmHandle.tap();
        await this._page.waitForChanges();
    }
    async type(text, options) {
        await this._elmHandle.type(text, options);
        await this._page.waitForChanges();
    }
    async getProperty(propertyName) {
        this._validate();
        const executionContext = getPuppeteerExecution(this._elmHandle);
        const propValue = await executionContext.evaluate((elm, propertyName) => {
            return elm[propertyName];
        }, this._elmHandle, propertyName);
        return propValue;
    }
    setProperty(propertyName, value) {
        this._queueAction({
            setPropertyName: propertyName,
            setPropertyValue: value,
        });
    }
    getAttribute(name) {
        this._validate();
        return super.getAttribute(name);
    }
    setAttribute(name, value) {
        this._queueAction({
            setAttributeName: name,
            setAttributeValue: value,
        });
    }
    removeAttribute(name) {
        this._queueAction({
            removeAttribute: name,
        });
    }
    toggleAttribute(name, force) {
        this._queueAction({
            toggleAttributeName: name,
            toggleAttributeForce: force,
        });
    }
    get classList() {
        const api = {
            add: (...classNames) => {
                classNames.forEach((className) => {
                    this._queueAction({
                        classAdd: className,
                    });
                });
            },
            remove: (...classNames) => {
                classNames.forEach((className) => {
                    this._queueAction({
                        classRemove: className,
                    });
                });
            },
            toggle: (className) => {
                this._queueAction({
                    classToggle: className,
                });
            },
            contains: (className) => {
                this._validate();
                return super.className.split(' ').includes(className);
            },
        };
        return api;
    }
    get className() {
        this._validate();
        return super.className;
    }
    set className(value) {
        this._queueAction({
            setPropertyName: 'className',
            setPropertyValue: value,
        });
    }
    get id() {
        this._validate();
        return super.id;
    }
    set id(value) {
        this._queueAction({
            setPropertyName: 'id',
            setPropertyValue: value,
        });
    }
    get innerHTML() {
        this._validate();
        return super.innerHTML;
    }
    set innerHTML(value) {
        this._queueAction({
            setPropertyName: 'innerHTML',
            setPropertyValue: value,
        });
    }
    get innerText() {
        this._validate();
        return super.innerText;
    }
    set innerText(value) {
        this._queueAction({
            setPropertyName: 'innerText',
            setPropertyValue: value,
        });
    }
    get nodeValue() {
        this._validate();
        return super.nodeValue;
    }
    set nodeValue(value) {
        if (typeof value === 'string') {
            this._queueAction({
                setPropertyName: 'nodeValue',
                setPropertyValue: value,
            });
        }
    }
    get outerHTML() {
        this._validate();
        return super.outerHTML;
    }
    set outerHTML(_) {
        throw new Error(`outerHTML is read-only`);
    }
    get shadowRoot() {
        this._validate();
        return super.shadowRoot;
    }
    set shadowRoot(value) {
        super.shadowRoot = value;
    }
    get tabIndex() {
        this._validate();
        return super.tabIndex;
    }
    set tabIndex(value) {
        this._queueAction({
            setPropertyName: 'tabIndex',
            setPropertyValue: value,
        });
    }
    get textContent() {
        this._validate();
        return super.textContent;
    }
    set textContent(value) {
        this._queueAction({
            setPropertyName: 'textContent',
            setPropertyValue: value,
        });
    }
    get title() {
        this._validate();
        return super.title;
    }
    set title(value) {
        this._queueAction({
            setPropertyName: 'title',
            setPropertyValue: value,
        });
    }
    async getComputedStyle(pseudoElt) {
        const style = await this._page.evaluate((elm, pseudoElt) => {
            const rtn = {};
            const computedStyle = window.getComputedStyle(elm, pseudoElt);
            const keys = Object.keys(computedStyle);
            keys.forEach((key) => {
                if (isNaN(key)) {
                    const value = computedStyle[key];
                    if (value != null) {
                        rtn[key] = value;
                    }
                }
                else {
                    const dashProp = computedStyle[key];
                    if (dashProp.includes('-')) {
                        const value = computedStyle.getPropertyValue(dashProp);
                        if (value != null) {
                            rtn[dashProp] = value;
                        }
                    }
                }
            });
            return rtn;
        }, this._elmHandle, pseudoElt);
        style.getPropertyValue = (propName) => {
            return style[propName];
        };
        return style;
    }
    async e2eRunActions() {
        if (this._queuedActions.length === 0) {
            return;
        }
        const executionContext = getPuppeteerExecution(this._elmHandle);
        const rtn = await executionContext.evaluate((elm, queuedActions) => {
            // BROWSER CONTEXT
            // cannot use async/await in here cuz typescript transpiles it in the node context
            return elm.componentOnReady().then(() => {
                let rtn = null;
                queuedActions.forEach((queuedAction) => {
                    if (queuedAction.methodName) {
                        rtn = elm[queuedAction.methodName].apply(elm, queuedAction.methodArgs);
                    }
                    else if (queuedAction.setPropertyName) {
                        elm[queuedAction.setPropertyName] = queuedAction.setPropertyValue;
                    }
                    else if (queuedAction.setAttributeName) {
                        elm.setAttribute(queuedAction.setAttributeName, queuedAction.setAttributeValue);
                    }
                    else if (queuedAction.removeAttribute) {
                        elm.removeAttribute(queuedAction.removeAttribute);
                    }
                    else if (queuedAction.toggleAttributeName) {
                        if (typeof queuedAction.toggleAttributeForce === 'boolean') {
                            elm.toggleAttribute(queuedAction.toggleAttributeName, queuedAction.toggleAttributeForce);
                        }
                        else {
                            elm.toggleAttribute(queuedAction.toggleAttributeName);
                        }
                    }
                    else if (queuedAction.classAdd) {
                        elm.classList.add(queuedAction.classAdd);
                    }
                    else if (queuedAction.classRemove) {
                        elm.classList.remove(queuedAction.classRemove);
                    }
                    else if (queuedAction.classToggle) {
                        elm.classList.toggle(queuedAction.classToggle);
                    }
                    else if (queuedAction.eventName) {
                        const eventInitDict = queuedAction.eventInitDict || {};
                        if (typeof eventInitDict.bubbles !== 'boolean') {
                            eventInitDict.bubbles = true;
                        }
                        if (typeof eventInitDict.cancelable !== 'boolean') {
                            eventInitDict.cancelable = true;
                        }
                        if (typeof eventInitDict.composed !== 'boolean') {
                            eventInitDict.composed = true;
                        }
                        const ev = new CustomEvent(queuedAction.eventName, eventInitDict);
                        elm.dispatchEvent(ev);
                    }
                });
                if (rtn && typeof rtn.then === 'function') {
                    return rtn.then((value) => {
                        return value;
                    });
                }
                return rtn;
            });
        }, this._elmHandle, this._queuedActions);
        this._queuedActions.length = 0;
        return rtn;
    }
    async e2eSync() {
        const executionContext = getPuppeteerExecution(this._elmHandle);
        const { outerHTML, shadowRootHTML } = await executionContext.evaluate((elm) => {
            return {
                outerHTML: elm.outerHTML,
                shadowRootHTML: elm.shadowRoot ? elm.shadowRoot.innerHTML : null,
            };
        }, this._elmHandle);
        if (typeof shadowRootHTML === 'string') {
            this.shadowRoot = parseHtmlToFragment(shadowRootHTML);
            this.shadowRoot.host = this;
        }
        else {
            this.shadowRoot = null;
        }
        const frag = parseHtmlToFragment(outerHTML);
        const rootElm = frag.firstElementChild;
        this.nodeName = rootElm.nodeName;
        this.attributes = cloneAttributes(rootElm.attributes);
        while (this.childNodes.length > 0) {
            this.removeChild(this.childNodes[0]);
        }
        while (rootElm.childNodes.length > 0) {
            this.appendChild(rootElm.childNodes[0]);
        }
    }
    _validate() {
        if (this._queuedActions.length > 0) {
            throw new Error(`await page.waitForChanges() must be called before reading element information`);
        }
    }
    async e2eDispose() {
        if (this._elmHandle) {
            await this._elmHandle.dispose();
            this._elmHandle = null;
        }
        const index = this._page._e2eElements.indexOf(this);
        if (index > -1) {
            this._page._e2eElements.splice(index, 1);
        }
        this._page = null;
    }
}
export async function find(page, rootHandle, selector) {
    const { lightSelector, shadowSelector, text, contains } = getSelector(selector);
    let elmHandle;
    if (typeof lightSelector === 'string') {
        elmHandle = await findWithCssSelector(page, rootHandle, lightSelector, shadowSelector);
    }
    else {
        elmHandle = await findWithText(page, rootHandle, text, contains);
    }
    if (!elmHandle) {
        return null;
    }
    const elm = new E2EElement(page, elmHandle);
    await elm.e2eSync();
    return elm;
}
async function findWithCssSelector(page, rootHandle, lightSelector, shadowSelector) {
    let elmHandle = await rootHandle.$(lightSelector);
    if (!elmHandle) {
        return null;
    }
    if (shadowSelector) {
        const shadowHandle = await page.evaluateHandle((elm, shadowSelector) => {
            if (!elm.shadowRoot) {
                throw new Error(`shadow root does not exist for element: ${elm.tagName.toLowerCase()}`);
            }
            return elm.shadowRoot.querySelector(shadowSelector);
        }, elmHandle, shadowSelector);
        await elmHandle.dispose();
        if (!shadowHandle) {
            return null;
        }
        elmHandle = shadowHandle.asElement();
    }
    return elmHandle;
}
async function findWithText(page, rootHandle, text, contains) {
    const jsHandle = await page.evaluateHandle((rootElm, text, contains) => {
        let foundElm = null;
        function checkContent(elm) {
            if (!elm || foundElm) {
                return;
            }
            if (elm.nodeType === 3) {
                if (typeof text === 'string' && elm.textContent.trim() === text) {
                    foundElm = elm.parentElement;
                    return;
                }
                if (typeof contains === 'string' && elm.textContent.includes(contains)) {
                    foundElm = elm.parentElement;
                    return;
                }
            }
            else {
                if (elm.nodeName === 'SCRIPT' || elm.nodeName === 'STYLE') {
                    return;
                }
                checkContent(elm.shadowRoot);
                if (elm.childNodes) {
                    for (let i = 0; i < elm.childNodes.length; i++) {
                        checkContent(elm.childNodes[i]);
                    }
                }
            }
        }
        checkContent(rootElm);
        return foundElm;
    }, rootHandle, text, contains);
    if (jsHandle) {
        return jsHandle.asElement();
    }
    return null;
}
export async function findAll(page, rootHandle, selector) {
    const foundElms = [];
    const { lightSelector, shadowSelector } = getSelector(selector);
    const lightElmHandles = await rootHandle.$$(lightSelector);
    if (lightElmHandles.length === 0) {
        return foundElms;
    }
    if (shadowSelector) {
        // light dom selected, then shadow dom selected inside of light dom elements
        for (let i = 0; i < lightElmHandles.length; i++) {
            const executionContext = getPuppeteerExecution(lightElmHandles[i]);
            const shadowJsHandle = await executionContext.evaluateHandle((elm, shadowSelector) => {
                if (!elm.shadowRoot) {
                    throw new Error(`shadow root does not exist for element: ${elm.tagName.toLowerCase()}`);
                }
                return elm.shadowRoot.querySelectorAll(shadowSelector);
            }, lightElmHandles[i], shadowSelector);
            await lightElmHandles[i].dispose();
            const shadowJsProperties = await shadowJsHandle.getProperties();
            await shadowJsHandle.dispose();
            for (const shadowJsProperty of shadowJsProperties.values()) {
                const shadowElmHandle = shadowJsProperty.asElement();
                if (shadowElmHandle) {
                    const elm = new E2EElement(page, shadowElmHandle);
                    await elm.e2eSync();
                    foundElms.push(elm);
                }
            }
        }
    }
    else {
        // light dom only
        for (let i = 0; i < lightElmHandles.length; i++) {
            const elm = new E2EElement(page, lightElmHandles[i]);
            await elm.e2eSync();
            foundElms.push(elm);
        }
    }
    return foundElms;
}
function getSelector(selector) {
    const rtn = {
        lightSelector: null,
        shadowSelector: null,
        text: null,
        contains: null,
    };
    if (typeof selector === 'string') {
        const splt = selector.split('>>>');
        rtn.lightSelector = splt[0].trim();
        rtn.shadowSelector = splt.length > 1 ? splt[1].trim() : null;
    }
    else if (typeof selector.text === 'string') {
        rtn.text = selector.text.trim();
    }
    else if (typeof selector.contains === 'string') {
        rtn.contains = selector.contains.trim();
    }
    else {
        throw new Error(`invalid find selector: ${selector}`);
    }
    return rtn;
}
/**
 * A helper function for retrieving an execution context from a Puppeteer handle entity. The way that these objects can
 * be retrieved changed in Puppeteer v17, requiring a check of the version of the library that is installed at runtime.
 *
 * This function expects that the {@link E2EProcessEnv#__STENCIL_PUPPETEER_VERSION__} be set prior to invocation. If
 * it is not set, the function assumes an older version of Puppeteer is used.
 *
 * @param elmHandle the Puppeteer handle to an element
 * @returns the execution context from the handle
 */
function getPuppeteerExecution(elmHandle) {
    const puppeteerMajorVersion = parseInt(process.env.__STENCIL_PUPPETEER_VERSION__, 10);
    if (puppeteerMajorVersion >= 17) {
        // in puppeteer v17, a context for executing JS can be retrieved from a frame
        // the `any` type assertion is necessary for backwards compatibility with the type checker
        return elmHandle.frame;
    }
    else {
        // in puppeteer v16 and lower, an execution context could be retrieved from a handle to execute JS
        // the `any` type assertion is necessary for backwards compatibility with the type checker
        //
        // if the result of `parseInt` on the puppeteer version is NaN, assume that the user is on a lower version of
        // puppeteer
        return elmHandle.executionContext();
    }
}
//# sourceMappingURL=puppeteer-element.js.map