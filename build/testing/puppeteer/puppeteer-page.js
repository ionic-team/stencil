import { find, findAll } from './puppeteer-element';
import { initPageEvents, waitForEvent } from './puppeteer-events';
import { initPageScreenshot } from './puppeteer-screenshot';
// during E2E tests, we can safely assume that the current environment is a `E2EProcessEnv`
const env = process.env;
export async function newE2EPage(opts = {}) {
    if (!global.__NEW_TEST_PAGE__) {
        throw new Error(`newE2EPage() is only available from E2E tests, and ran with the --e2e cmd line flag.`);
    }
    const page = await global.__NEW_TEST_PAGE__();
    const diagnostics = [];
    try {
        page._e2eElements = [];
        page._e2eGoto = page.goto;
        page._e2eClose = page.close;
        await page.setCacheEnabled(false);
        await initPageEvents(page);
        initPageScreenshot(page);
        let docPromise = null;
        page.close = async (options) => {
            try {
                if (Array.isArray(page._e2eElements)) {
                    const disposes = page._e2eElements.map(async (elmHande) => {
                        if (typeof elmHande.e2eDispose === 'function') {
                            await elmHande.e2eDispose();
                        }
                    });
                    await Promise.all(disposes);
                }
            }
            catch (e) { }
            const noop = () => {
                throw new Error('The page was already closed');
            };
            page._e2eElements = noop;
            page._e2eEvents = noop;
            page._e2eGoto = noop;
            page.find = noop;
            page.debugger = noop;
            page.findAll = noop;
            page.compareScreenshot = noop;
            page.setContent = noop;
            page.spyOnEvent = noop;
            page.waitForChanges = noop;
            page.waitForEvent = noop;
            try {
                if (!page.isClosed()) {
                    await page._e2eClose(options);
                }
            }
            catch (e) { }
        };
        const getDocHandle = async () => {
            if (!docPromise) {
                docPromise = page.evaluateHandle(() => document);
            }
            const documentJsHandle = await docPromise;
            return documentJsHandle.asElement();
        };
        page.find = async (selector) => {
            const docHandle = await getDocHandle();
            return find(page, docHandle, selector);
        };
        page.findAll = async (selector) => {
            const docHandle = await getDocHandle();
            return findAll(page, docHandle, selector);
        };
        page.waitForEvent = async (eventName) => {
            const docHandle = await getDocHandle();
            return waitForEvent(page, eventName, docHandle);
        };
        page.getDiagnostics = () => {
            return diagnostics;
        };
        page.waitForChanges = waitForChanges.bind(null, page);
        page.debugger = () => {
            if (env.__STENCIL_E2E_DEVTOOLS__ !== 'true') {
                throw new Error('Set the --devtools flag in order to use E2EPage.debugger()');
            }
            return page.evaluate(() => {
                return new Promise((resolve) => {
                    // tslint:disable-next-line: no-debugger
                    debugger;
                    resolve();
                });
            });
        };
        const failOnConsoleError = opts.failOnConsoleError === true;
        const failOnNetworkError = opts.failOnNetworkError === true;
        page.on('console', (ev) => {
            if (ev.type() === 'error') {
                diagnostics.push({
                    type: 'error',
                    message: ev.text(),
                    location: ev.location().url,
                });
                if (failOnConsoleError) {
                    throw new Error(serializeConsoleMessage(ev));
                }
            }
            consoleMessage(ev);
        });
        page.on('pageerror', (err) => {
            diagnostics.push({
                type: 'pageerror',
                message: err.message,
                location: err.stack,
            });
            throw err;
        });
        page.on('requestfailed', (req) => {
            diagnostics.push({
                type: 'requestfailed',
                message: req.failure().errorText,
                location: req.url(),
            });
            if (failOnNetworkError) {
                throw new Error(req.failure().errorText);
            }
            else {
                console.error('requestfailed', req.url());
            }
        });
        if (typeof opts.html === 'string') {
            await e2eSetContent(page, opts.html, { waitUntil: opts.waitUntil });
        }
        else if (typeof opts.url === 'string') {
            await e2eGoTo(page, opts.url, { waitUntil: opts.waitUntil });
        }
        else {
            page.goto = e2eGoTo.bind(null, page);
            page.setContent = e2eSetContent.bind(null, page);
        }
    }
    catch (e) {
        if (page) {
            if (!page.isClosed()) {
                await page.close();
            }
        }
        throw e;
    }
    return page;
}
async function e2eGoTo(page, url, options = {}) {
    if (page.isClosed()) {
        throw new Error('e2eGoTo unavailable: page already closed');
    }
    if (typeof url !== 'string') {
        throw new Error('invalid gotoTest() url');
    }
    if (!url.startsWith('/')) {
        throw new Error('gotoTest() url must start with /');
    }
    const browserUrl = env.__STENCIL_BROWSER_URL__;
    if (typeof browserUrl !== 'string') {
        throw new Error('invalid gotoTest() browser url');
    }
    const fullUrl = browserUrl + url.substring(1);
    if (!options.waitUntil) {
        options.waitUntil = env.__STENCIL_BROWSER_WAIT_UNTIL;
    }
    const rsp = await page._e2eGoto(fullUrl, options);
    if (!rsp.ok()) {
        throw new Error(`Testing unable to load ${url}, HTTP status: ${rsp.status()}`);
    }
    await waitForStencil(page, options);
    return rsp;
}
async function e2eSetContent(page, html, options = {}) {
    if (page.isClosed()) {
        throw new Error('e2eSetContent unavailable: page already closed');
    }
    if (typeof html !== 'string') {
        throw new Error('invalid e2eSetContent() html');
    }
    const output = [];
    const appScriptUrl = env.__STENCIL_APP_SCRIPT_URL__;
    if (typeof appScriptUrl !== 'string') {
        throw new Error('invalid e2eSetContent() app script url');
    }
    output.push(`<!doctype html>`);
    output.push(`<html>`);
    output.push(`<head>`);
    const appStyleUrl = env.__STENCIL_APP_STYLE_URL__;
    if (typeof appStyleUrl === 'string') {
        output.push(`<link rel="stylesheet" href="${appStyleUrl}">`);
    }
    output.push(`<script type="module" src="${appScriptUrl}"></script>`);
    output.push(`</head>`);
    output.push(`<body>`);
    output.push(html);
    output.push(`</body>`);
    output.push(`</html>`);
    const pageUrl = env.__STENCIL_BROWSER_URL__;
    await page.setRequestInterception(true);
    const interceptedReqCallback = (interceptedRequest) => {
        if (pageUrl === interceptedRequest.url()) {
            interceptedRequest.respond({
                status: 200,
                contentType: 'text/html',
                body: output.join('\n'),
            });
        }
        else {
            interceptedRequest.continue();
        }
    };
    page.on('request', interceptedReqCallback);
    if (!options.waitUntil) {
        options.waitUntil = env.__STENCIL_BROWSER_WAIT_UNTIL;
    }
    const rsp = await page._e2eGoto(pageUrl, options);
    if (!rsp.ok()) {
        throw new Error(`Testing unable to load content`);
    }
    await waitForStencil(page, options);
}
async function waitForStencil(page, options) {
    try {
        const timeout = typeof options.timeout === 'number' ? options.timeout : 4750;
        await page.waitForFunction('window.stencilAppLoaded', { timeout });
    }
    catch (e) {
        throw new Error(`App did not load in allowed time. Please ensure the content loads a stencil application.`);
    }
}
async function waitForChanges(page) {
    try {
        if (page.isClosed()) {
            return;
        }
        await Promise.all(page._e2eElements.map((elm) => elm.e2eRunActions()));
        if (page.isClosed()) {
            return;
        }
        await page.evaluate(() => {
            // BROWSER CONTEXT
            return new Promise((resolve) => {
                requestAnimationFrame(() => {
                    const promises = [];
                    const waitComponentOnReady = (elm, promises) => {
                        if (elm != null) {
                            if ('shadowRoot' in elm && elm.shadowRoot instanceof ShadowRoot) {
                                waitComponentOnReady(elm.shadowRoot, promises);
                            }
                            const children = elm.children;
                            const len = children.length;
                            for (let i = 0; i < len; i++) {
                                const childElm = children[i];
                                if (childElm != null) {
                                    if (childElm.tagName.includes('-') &&
                                        typeof childElm.componentOnReady === 'function') {
                                        promises.push(childElm.componentOnReady());
                                    }
                                    waitComponentOnReady(childElm, promises);
                                }
                            }
                        }
                    };
                    waitComponentOnReady(document.documentElement, promises);
                    Promise.all(promises)
                        .then(() => {
                        resolve();
                    })
                        .catch(() => {
                        resolve();
                    });
                });
            });
        });
        if (page.isClosed()) {
            return;
        }
        if (typeof page.waitForTimeout === 'function') {
            await page.waitForTimeout(100);
        }
        else {
            // in puppeteer v15, `waitFor` has been removed. this is kept only for puppeteer v14 and below support
            await page.waitFor(100);
        }
        await Promise.all(page._e2eElements.map((elm) => elm.e2eSync()));
    }
    catch (e) { }
}
function consoleMessage(c) {
    const msg = serializeConsoleMessage(c);
    const type = c.type();
    const normalizedType = type === 'warning' ? 'warn' : type;
    if (normalizedType === 'debug') {
        // Skip debug messages
        return;
    }
    if (typeof console[normalizedType] === 'function') {
        console[normalizedType](msg);
    }
    else {
        console.log(type, msg);
    }
}
function serializeConsoleMessage(c) {
    return `${c.text()} ${serializeLocation(c.location())}`;
}
function serializeLocation(loc) {
    let locStr = '';
    if (loc && loc.url) {
        locStr = `\nLocation: ${loc.url}`;
        if (loc.lineNumber) {
            locStr += `:${loc.lineNumber}`;
        }
        if (loc.columnNumber) {
            locStr += `:${loc.columnNumber}`;
        }
    }
    return locStr;
}
//# sourceMappingURL=puppeteer-page.js.map