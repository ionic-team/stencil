const activeRendering = new Set();
const onAppReadyCallbacks: Function[] = [];

export declare namespace SomeTypes {
  type Number = number;
  type String = string;
}

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

function waitFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}

/**
 * Create setup methods for dom based tests.
 */
export function setupDomTests(document: Document) {
  let testBed = document.getElementById('test-app');
  if (!testBed) {
    testBed = document.createElement('div');
    testBed.id = 'test-app';
    document.body.appendChild(testBed);
  }

  /**
   * Run this before each test
   */
  function setupDom(url?: string, waitForStencilReady?: number) {
    const app = document.createElement('div');
    activeRendering.clear();
    onAppReadyCallbacks.length = 0;
    app.addEventListener('stencil_componentWillRender', (ev) => willRender(ev.target));
    app.addEventListener('stencil_componentDidRender', (ev) => didRender(ev.target));

    app.className = 'test-spec';
    testBed!.appendChild(app);

    if (url) {
      app.setAttribute('data-url', url);
      return renderTest(url, app, waitForStencilReady);
    }

    return Promise.resolve(app);
  }

  /**
   * Run this after each test
   */
  function tearDownDom() {
    testBed!.innerHTML = '';
  }

  /**
   * Create web component for executing tests against
   */
  function renderTest(url: string, app: HTMLElement, waitForStencilReady: number) {
    url = '/base/www' + url;

    return new Promise<HTMLElement>((resolve, reject) => {
      try {
        const allReady = () => {
          const promises: Promise<any>[] = [];
          const waitForDidLoad = (promises: Promise<any>[], elm: Element) => {
            if (elm != null && elm.nodeType === 1) {
              for (let i = 0; i < elm.children.length; i++) {
                const childElm = elm.children[i];
                if (childElm.tagName.includes('-') && typeof (childElm as any).componentOnReady === 'function') {
                  promises.push((childElm as any).componentOnReady());
                }
                waitForDidLoad(promises, childElm);
              }
            }
          };

          waitForDidLoad(promises, window.document.documentElement);

          return Promise.all(promises).catch((e) => console.error(e));
        };

        const stencilReady = (): Promise<any> => {
          return allReady()
            .then(() => waitFrame())
            .then(() => allReady());
        };

        const indexLoaded = function (this: XMLHttpRequest) {
          if (this.status !== 200) {
            reject(`404: ${url}`);
            return;
          }
          const frag = document.createDocumentFragment();
          const elm = document.createElement('div');
          elm.innerHTML = this.responseText;
          frag.appendChild(elm);
          app.innerHTML = elm.innerHTML;

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
              script.setAttribute('type', tmpScripts[i].getAttribute('type')!);
            }
            script.innerHTML = tmpScripts[i].innerHTML;

            tmpScripts[i].parentNode!.insertBefore(script, tmpScripts[i]);
            tmpScripts[i].parentNode!.removeChild(tmpScripts[i]);
          }

          elm.innerHTML = '';

          if (typeof waitForStencilReady === 'number') {
            setTimeout(() => {
              resolve(app);
            }, waitForStencilReady);
          } else {
            const appLoad = () => {
              window.removeEventListener('appload', appLoad);
              stencilReady().then(() => {
                resolve(app);
              });
            };
            window.addEventListener('appload', appLoad);
          }
        };

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
export function waitForChanges(timeout = 250) {
  const win = window as any;

  return new Promise((resolve) => {
    function pageLoaded() {
      setTimeout(() => {
        onReady(resolve);
      }, timeout);
    }

    if (document.readyState === 'complete') {
      pageLoaded();
    } else {
      win.addEventListener('load', pageLoaded, false);
    }
  });
}
