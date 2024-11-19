"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForChanges = exports.setupDomTests = void 0;
var path = require("path");
var WWW_OUT_DIR = require('../constants').WWW_OUT_DIR;
/**
 * Record keeping for components that have fired the `componentWillRender` lifecycle event, but have not fired the
 * `componentDidRender` lifecycle event
 */
var activeRendering = new Set();
/**
 * Record keeping for callback to run after an application has rendered
 */
var onAppReadyCallbacks = [];
/**
 * Helper function that keeps track of Stencil components who have fired the `componentWillRender` lifecycle event, but
 * have not fired the `componentDidRender` lifecycle event
 * @param elm the Stencil component that emitted the event
 */
function markWillRender(elm) {
    activeRendering.add(elm);
}
/**
 * Helper function that keeps track of Stencil components who have fired the `componentDidRender` lifecycle event.
 * @param elm the Stencil component that emitted the event
 */
function didRender(elm) {
    activeRendering.delete(elm);
    if (onAppReadyCallbacks.length > 0 && activeRendering.size === 0) {
        // we've got some promises waiting on the entire app to be done processing,
        // so it should have an empty queue and no longer rendering
        var cb = void 0;
        while ((cb = onAppReadyCallbacks.shift())) {
            cb();
        }
    }
}
/**
 * A helper method to collect callbacks to run once an application has finished rendering. If the application has
 * rendered, the callback will be immediately invoked
 * @param callback the callback to run once rendering is complete
 */
function onReady(callback) {
    if (activeRendering.size === 0) {
        callback();
    }
    else {
        onAppReadyCallbacks.push(callback);
    }
}
/**
 * Helper function that wraps an RAF call in a promise. Used to trigger a new paint for tests that asynchronously
 * update.
 */
function waitFrame() {
    return new Promise(function (resolve) {
        requestAnimationFrame(resolve);
    });
}
/**
 * Create setup and teardown methods for DOM based tests. All DOM based tests are created within an application
 * 'test bed' that is managed by this function.
 * @param document a `Document` compliant entity where tests may be rendered
 * @returns utilities to set up the DOM and tear it down within the test bed
 */
function setupDomTests(document) {
    /**
     * All HTML will be rendered as a child of the test bed - get it from the current document (and create it, if it
     * doesn't exist) so that it is available for all future tests.
     */
    var testBed = document.getElementById('test-app');
    if (!testBed) {
        testBed = document.createElement('div');
        testBed.id = 'test-app';
        document.body.appendChild(testBed);
    }
    else {
        testBed.innerHTML = '';
    }
    /**
     * @see {@link DomTestUtilities#setupDom}
     */
    function setupDom(url, waitForStencilReady) {
        if (!url || !url.endsWith('.html')) {
            console.error("A valid URL to an HTML page is required. Received '".concat(url, "'"));
            process.exit(1);
        }
        var testElement = document.createElement('div');
        activeRendering.clear();
        // empty the array while maintaining the reference to it
        onAppReadyCallbacks.length = 0;
        testElement.addEventListener('stencil_componentWillRender', function (ev) { return markWillRender(ev.target); });
        testElement.addEventListener('stencil_componentDidRender', function (ev) { return didRender(ev.target); });
        testElement.className = 'test-spec';
        if (!testBed) {
            console.error('The Stencil/Karma test bed could not be found.');
            process.exit(1);
        }
        testBed.appendChild(testElement);
        testElement.setAttribute('data-url', url);
        return renderTest(url, testElement, waitForStencilReady);
    }
    /**
     * @see {@link DomTestUtilities#tearDownDom}
     */
    function tearDownDom() {
        if (testBed) {
            testBed.innerHTML = '';
        }
    }
    /**
     * @see {@link DomTestUtilities#tearDownStylesScripts}
     */
    function tearDownStylesScripts() {
        document.head.querySelectorAll('style[data-styles]').forEach(function (e) { return e.remove(); });
        [
            '/build/testinvisibleprehydration.esm.js',
            '/build/testinvisibleprehydration.js',
            '/build/testprehydratedtruestyles.esm.js',
            '/build/testprehydratedtruestyles.js',
            '/build/testprehydratedfalsestyles.esm.js',
            '/build/testprehydratedfalsestyles.js',
            '/build/testapp.esm.js',
            '/build/testapp.js',
        ].forEach(function (src) {
            document.querySelectorAll("script[src=\"".concat(src, "\"]")).forEach(function (e) { return e.remove(); });
        });
    }
    /**
     * Render HTML for executing tests against.
     * @param url the location on disk containing the HTML to load
     * @param testElement a parent HTML element to place test code in
     * @param waitForStencilReady the amount of time to wait (in milliseconds) to wait for an application to load
     * @returns the fully rendered HTML to test against
     */
    function renderTest(url, testElement, waitForStencilReady) {
        url = path.join('base', WWW_OUT_DIR, url);
        return new Promise(function (resolve, reject) {
            try {
                /**
                 * Ensure that all `onComponentReady` functions on Stencil elements in the DOM have been called before rendering
                 * @returns an array of promises, one for each `onComponentReady` found on a Stencil component
                 */
                var allReady_1 = function () {
                    var promises = [];
                    /**
                     * Function that recursively traverses the DOM, looking for Stencil components. Any `componentOnReady`
                     * functions found on Stencil components are pushed to a buffer to be run after traversing the entire DOM.
                     * @param elm the current element being inspected
                     */
                    var waitForDidLoad = function (elm) {
                        if (elm != null && elm.nodeType === 1) {
                            // the element exists and is an `ELEMENT_NODE`
                            for (var i = 0; i < elm.children.length; i++) {
                                var childElm = elm.children[i];
                                if (childElm.tagName.includes('-') && isHtmlStencilElement(childElm)) {
                                    promises.push(childElm.componentOnReady());
                                }
                                waitForDidLoad(childElm);
                            }
                        }
                    };
                    // recursively walk the DOM to find all `onComponentReady` functions
                    waitForDidLoad(window.document.documentElement);
                    return Promise.all(promises).catch(function (e) { return console.error(e); });
                };
                /**
                 * Ensure that all `onComponentReady` functions on Stencil elements in the DOM have been called before rendering
                 * @returns an array of promises, one for each `onComponentReady` found on a Stencil component
                 */
                var stencilReady_1 = function () {
                    return allReady_1()
                        .then(function () { return waitFrame(); })
                        .then(function () { return allReady_1(); });
                };
                /**
                 * Callback to be invoked following the retrieval of the file containing the HTML to load
                 * @param this the `XMLHttpRequest` instance that requested the HTML
                 */
                var onIndexHtmlLoaded = function () {
                    if (this.status !== 200) {
                        reject("404: ".concat(url));
                        return;
                    }
                    var frag = document.createDocumentFragment();
                    var elm = document.createElement('div');
                    elm.innerHTML = this.responseText;
                    frag.appendChild(elm);
                    testElement.innerHTML = elm.innerHTML;
                    /**
                     * Re-generate script tags that are embedded in the loaded HTML file.
                     *
                     * Doing so allows JS files to be loaded (via script tags), when the HTML is served, without having to configure
                     * Karma to load the JS explicitly. This is done by adding the host/port combination to existing `src`
                     * attributes.
                     *
                     * Before:
                     * ```html
                     * <script type="module" src="/index.6127a5ed.js"></script>
                     * ```
                     *
                     * After:
                     * ```html
                     * <script src="http://localhost:9876/index.547a265b.js" type="module"></script>
                     * ```
                     */
                    var parseAndRebuildScriptTags = function () {
                        var tempScripts = testElement.querySelectorAll('script');
                        for (var i = 0; i < tempScripts.length; i++) {
                            var script = document.createElement('script');
                            if (tempScripts[i].src) {
                                script.src = tempScripts[i].src;
                            }
                            if (tempScripts[i].hasAttribute('nomodule')) {
                                script.setAttribute('nomodule', '');
                            }
                            if (tempScripts[i].hasAttribute('type')) {
                                var typeAttribute = tempScripts[i].getAttribute('type');
                                if (typeof typeAttribute === 'string') {
                                    // older DOM implementations would return an empty string to designate `null`
                                    // here, we interpret the empty string to be a valid value
                                    script.setAttribute('type', typeAttribute);
                                }
                            }
                            script.innerHTML = tempScripts[i].innerHTML;
                            if (tempScripts[i].parentNode) {
                                // the scripts were found by querying a common parent node, which _should_ still exist
                                tempScripts[i].parentNode.insertBefore(script, tempScripts[i]);
                                tempScripts[i].parentNode.removeChild(tempScripts[i]);
                            }
                            else {
                                // if for some reason the parent node no longer exists, something's manipulated it while we were parsing
                                // the script tags. this can lead to undesirable & hard to debug behavior, fail.
                                reject('the parent node for script tags no longer exists. exiting.');
                            }
                        }
                    };
                    parseAndRebuildScriptTags();
                    elm.innerHTML = '';
                    if (typeof waitForStencilReady === 'number') {
                        setTimeout(function () {
                            resolve(testElement);
                        }, waitForStencilReady);
                    }
                    else {
                        /**
                         * Create a listener for Stencil's "appload" event to signal to the test framework the application and its
                         * children have finished loading
                         */
                        var onAppLoad_1 = function () {
                            window.removeEventListener('appload', onAppLoad_1);
                            stencilReady_1().then(function () {
                                resolve(testElement);
                            });
                        };
                        window.addEventListener('appload', onAppLoad_1);
                    }
                };
                var testHtmlRequest = new XMLHttpRequest();
                testHtmlRequest.addEventListener('load', onIndexHtmlLoaded);
                testHtmlRequest.addEventListener('error', function (err) {
                    console.error('error testHtmlRequest.addEventListener', err);
                    reject(err);
                });
                testHtmlRequest.addEventListener('abort', function (err) {
                    console.error('abort testHtmlRequest.addEventListener', err);
                    reject(err);
                });
                testHtmlRequest.open('GET', url);
                testHtmlRequest.send();
            }
            catch (e) {
                console.error('catch error', e);
                reject(e);
            }
        });
    }
    return { setupDom: setupDom, tearDownDom: tearDownDom, tearDownStylesScripts: tearDownStylesScripts };
}
exports.setupDomTests = setupDomTests;
/**
 * Wait for the component to asynchronously update
 * @param timeoutMs the time (in milliseconds) to wait for the component to update
 */
function waitForChanges(timeoutMs) {
    if (timeoutMs === void 0) { timeoutMs = 250; }
    var win = window;
    return new Promise(function (resolve) {
        function pageLoaded() {
            setTimeout(function () {
                onReady(resolve);
            }, timeoutMs);
        }
        if (document.readyState === 'complete') {
            pageLoaded();
        }
        else {
            win.addEventListener('load', pageLoaded, false);
        }
    });
}
exports.waitForChanges = waitForChanges;
/**
 * Type guard to verify some entity is an instance of Stencil HTML Element
 * @param elm the entity to test
 * @returns `true` if the entity is a Stencil HTML Element, `false` otherwise
 */
function isHtmlStencilElement(elm) {
    return typeof elm.componentOnReady === 'function';
}
