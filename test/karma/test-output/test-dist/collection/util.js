import * as path from 'path';
const { WWW_OUT_DIR } = require('../constants');
/**
 * Record keeping for components that have fired the `componentWillRender` lifecycle event, but have not fired the
 * `componentDidRender` lifecycle event
 */
const activeRendering = new Set();
/**
 * Record keeping for callback to run after an application has rendered
 */
const onAppReadyCallbacks = [];
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
    let cb;
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
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}
/**
 * Create setup and teardown methods for DOM based tests. All DOM based tests are created within an application
 * 'test bed' that is managed by this function.
 * @param document a `Document` compliant entity where tests may be rendered
 * @returns utilities to set up the DOM and tear it down within the test bed
 */
export function setupDomTests(document) {
  /**
   * All HTML will be rendered as a child of the test bed - get it from the current document (and create it, if it
   * doesn't exist) so that it is available for all future tests.
   */
  let testBed = document.getElementById('test-app');
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
      console.error(`A valid URL to an HTML page is required. Received '${url}'`);
      process.exit(1);
    }
    const testElement = document.createElement('div');
    activeRendering.clear();
    // empty the array while maintaining the reference to it
    onAppReadyCallbacks.length = 0;
    testElement.addEventListener('stencil_componentWillRender', (ev) => markWillRender(ev.target));
    testElement.addEventListener('stencil_componentDidRender', (ev) => didRender(ev.target));
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
    document.head.querySelectorAll('style[data-styles]').forEach((e) => e.remove());
    [
      '/build/testinvisibleprehydration.esm.js',
      '/build/testinvisibleprehydration.js',
      '/build/testprehydratedtruestyles.esm.js',
      '/build/testprehydratedtruestyles.js',
      '/build/testprehydratedfalsestyles.esm.js',
      '/build/testprehydratedfalsestyles.js',
      '/build/testapp.esm.js',
      '/build/testapp.js',
    ].forEach((src) => {
      document.querySelectorAll(`script[src="${src}"]`).forEach((e) => e.remove());
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
    return new Promise((resolve, reject) => {
      try {
        /**
         * Ensure that all `onComponentReady` functions on Stencil elements in the DOM have been called before rendering
         * @returns an array of promises, one for each `onComponentReady` found on a Stencil component
         */
        const allReady = () => {
          const promises = [];
          /**
           * Function that recursively traverses the DOM, looking for Stencil components. Any `componentOnReady`
           * functions found on Stencil components are pushed to a buffer to be run after traversing the entire DOM.
           * @param elm the current element being inspected
           */
          const waitForDidLoad = (elm) => {
            if (elm != null && elm.nodeType === 1) {
              // the element exists and is an `ELEMENT_NODE`
              for (let i = 0; i < elm.children.length; i++) {
                const childElm = elm.children[i];
                if (childElm.tagName.includes('-') && isHtmlStencilElement(childElm)) {
                  promises.push(childElm.componentOnReady());
                }
                waitForDidLoad(childElm);
              }
            }
          };
          // recursively walk the DOM to find all `onComponentReady` functions
          waitForDidLoad(window.document.documentElement);
          return Promise.all(promises).catch((e) => console.error(e));
        };
        /**
         * Ensure that all `onComponentReady` functions on Stencil elements in the DOM have been called before rendering
         * @returns an array of promises, one for each `onComponentReady` found on a Stencil component
         */
        const stencilReady = () => {
          return allReady()
            .then(() => waitFrame())
            .then(() => allReady());
        };
        /**
         * Callback to be invoked following the retrieval of the file containing the HTML to load
         * @param this the `XMLHttpRequest` instance that requested the HTML
         */
        const onIndexHtmlLoaded = function () {
          if (this.status !== 200) {
            reject(`404: ${url}`);
            return;
          }
          const frag = document.createDocumentFragment();
          const elm = document.createElement('div');
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
          const parseAndRebuildScriptTags = () => {
            const tempScripts = testElement.querySelectorAll('script');
            for (let i = 0; i < tempScripts.length; i++) {
              const script = document.createElement('script');
              if (tempScripts[i].src) {
                script.src = tempScripts[i].src;
              }
              if (tempScripts[i].hasAttribute('nomodule')) {
                script.setAttribute('nomodule', '');
              }
              if (tempScripts[i].hasAttribute('type')) {
                const typeAttribute = tempScripts[i].getAttribute('type');
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
            setTimeout(() => {
              resolve(testElement);
            }, waitForStencilReady);
          }
          else {
            /**
             * Create a listener for Stencil's "appload" event to signal to the test framework the application and its
             * children have finished loading
             */
            const onAppLoad = () => {
              window.removeEventListener('appload', onAppLoad);
              stencilReady().then(() => {
                resolve(testElement);
              });
            };
            window.addEventListener('appload', onAppLoad);
          }
        };
        const testHtmlRequest = new XMLHttpRequest();
        testHtmlRequest.addEventListener('load', onIndexHtmlLoaded);
        testHtmlRequest.addEventListener('error', (err) => {
          console.error('error testHtmlRequest.addEventListener', err);
          reject(err);
        });
        testHtmlRequest.addEventListener('abort', (err) => {
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
  return { setupDom, tearDownDom, tearDownStylesScripts };
}
/**
 * Wait for the component to asynchronously update
 * @param timeoutMs the time (in milliseconds) to wait for the component to update
 */
export function waitForChanges(timeoutMs = 250) {
  const win = window;
  return new Promise((resolve) => {
    function pageLoaded() {
      setTimeout(() => {
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
/**
 * Type guard to verify some entity is an instance of Stencil HTML Element
 * @param elm the entity to test
 * @returns `true` if the entity is a Stencil HTML Element, `false` otherwise
 */
function isHtmlStencilElement(elm) {
  return typeof elm.componentOnReady === 'function';
}
