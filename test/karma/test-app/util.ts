

const activeRendering = new Set();
const onAppReadyCallbacks: Function[] = [];

function willRender(elm: any) {
  activeRendering.add(elm);
}

function didRender(elm: any) {
  activeRendering.delete(elm);
  if (onAppReadyCallbacks.length > 0 && activeRendering.size === 0) {
    // we've got some promises waiting on the entire app to be done processing
    // so it should have an empty queue and no longer rendering
    let cb: any;
    while ((cb = onAppReadyCallbacks.shift())) {
      cb();
    }
  }
}

function onReady(callback: Function) {
  if (activeRendering.size === 0) {
    callback();
  } else {
    onAppReadyCallbacks.push(callback);
  }
}

/**
 * Create setup methods for dom based tests.
 */
export function setupDomTests(document: Document) {
  let testBed = document.getElementById('test-app');
  if (!testBed) {
    testBed = document.createElement('div');
    testBed.id = 'test-bed';
    document.body.appendChild(testBed);
  }

  /**
   * Run this before each test
   */
  function setupDom(url?: string) {
    const app = document.createElement('div');
    activeRendering.clear();
    onAppReadyCallbacks.length = 0;
    app.addEventListener('stencil_componentWillRender', (ev) => willRender(ev.target));
    app.addEventListener('stencil_componentDidRender', (ev) => didRender(ev.target))

    app.className = 'test-spec';
    testBed.appendChild(app)

    if (url) {
      app.setAttribute('data-url', url);
      return renderTest(url, app);
    }

    return Promise.resolve(app);
  };

  /**
   * Run this after each test
   */
  function tearDownDom() {
    testBed.innerHTML = '';
  };

  /**
   * Create web component for executing tests against
   */
  function renderTest(url: string, app: HTMLElement) {
    url = '/base/www' + url;

    return new Promise<HTMLElement>((resolve, reject) => {
      try {
        const indexLoaded = function() {
          if (this.status !== 200) {
            reject(`404: ${url}`);
            return;
          }
          const frag = document.createDocumentFragment();
          const elm = document.createElement('div');
          elm.innerHTML = this.responseText;
          frag.appendChild(elm);
          app.innerHTML = elm.innerHTML;

          function appLoad() {
            window.removeEventListener('stencil_appload', appLoad);
            resolve(app);
          }

          window.addEventListener('stencil_appload', appLoad);

          function scriptErrored(ev: any) {
            console.error('script error', ev);
          }

          const tmpScripts = app.querySelectorAll('script') as NodeListOf<HTMLScriptElement>;
          for (let i = 0; i < tmpScripts.length; i++) {
            const script = document.createElement('script') as HTMLScriptElement;
            if (tmpScripts[i].src) {
              script.src = tmpScripts[i].src;
            }
            if (tmpScripts[i].hasAttribute('nomodule')) {
              script.setAttribute('nomodule', '');
            }
            if (tmpScripts[i].hasAttribute('type')) {
              script.setAttribute('type', tmpScripts[i].getAttribute('type'));
            }
            script.innerHTML = tmpScripts[i].innerHTML;

            script.addEventListener('error', scriptErrored);

            tmpScripts[i].parentNode.insertBefore(script, tmpScripts[i]);
            tmpScripts[i].parentNode.removeChild(tmpScripts[i]);
          }

          elm.innerHTML = '';
        }

        var oReq = new XMLHttpRequest();
        oReq.addEventListener('load', indexLoaded);
        oReq.addEventListener('error', (err) => {
          console.error('error oReq.addEventListener', err);
          reject(err);
        });
        oReq.open('GET', url);
        oReq.send();

      } catch (e) {
        console.error('catch error', e);
        reject(e);
      }
    });
  }

  return { setupDom, tearDownDom };
}

/**
 * Wait for the component to asynchronously update
 */
export function waitForChanges() {
  const win = window as any;

  return new Promise(resolve => {
    function pageLoaded() {
      setTimeout(() => {
        onReady(resolve);
      }, 100);
    }

    if (document.readyState === 'complete') {
      pageLoaded();
    } else {
      win.addEventListener('load', pageLoaded, false);
    }
  });
}
