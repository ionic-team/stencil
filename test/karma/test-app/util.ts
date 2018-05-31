

export type AddComponentFn = <T extends Element>(childHtml: string) => T;

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
  async function setupDom(url?: string) {
    const app = document.createElement('div');
    app.className = 'test-spec';
    testBed.appendChild(app)

    if (url) {
      app.setAttribute('data-url', url);
      await renderTest(url, app);
    }

    return app;
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

          const tmpScripts = app.querySelectorAll('script') as NodeListOf<HTMLScriptElement>;
          for (let i = 0; i < tmpScripts.length; i++) {
            const script = document.createElement('script') as HTMLScriptElement;
            if (tmpScripts[i].src) {
              script.src = tmpScripts[i].src;
            }
            script.innerHTML = tmpScripts[i].innerHTML;
            tmpScripts[i].parentNode.insertBefore(script, tmpScripts[i]);
            tmpScripts[i].parentNode.removeChild(tmpScripts[i]);
          }

          elm.innerHTML = '';

          const promises: Promise<any>[] = [];
          loadPromises(promises, app);

          Promise.all(promises).then(() => {
            resolve(app);

          }).catch(err => {
            console.error('Promise.all error', err);
            reject(err);
          });
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

  function loadPromises(promises: Promise<any>[], component: any) {
    if (component.componentOnReady) {
      promises.push(component.componentOnReady());
    }

    for (let i = 0; i < component.childNodes.length; i++) {
      loadPromises(promises, component.childNodes[i]);
    }
  }

  return { setupDom, tearDownDom };
}

/**
 * Wait for the component to asynchronously update
 */
export function flush(app: HTMLElement) {
  return new Promise(resolve => {

    function done() {
      observer && observer.disconnect();
      clearTimeout(tmr);
      resolve();
    }

    let tmr = setTimeout(done, 750);

    var observer = new MutationObserver(() => {
      setTimeout(() => {
        (window as any).TestApp.Context.queue.write(done);
      }, 100);
    });

    observer.observe(app, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true
    });
  });
}
