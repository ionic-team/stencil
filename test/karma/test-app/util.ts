

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
    app.className = 'test-spec';
    testBed.appendChild(app)

    if (url) {
      app.setAttribute('data-url', url);
      console.log('render1')
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
    console.log('url', url)

    return new Promise<HTMLElement>((resolve, reject) => {
      try {
        const indexLoaded = function() {
          console.log('indexLoaded', this.status)
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
              script.setAttribute('type', tmpScripts[i].getAttribute('type'));
            }
            script.innerHTML = tmpScripts[i].innerHTML;
            tmpScripts[i].parentNode.insertBefore(script, tmpScripts[i]);
            tmpScripts[i].parentNode.removeChild(tmpScripts[i]);
          }

          console.log('app.innerHTML', app.innerHTML)
          elm.innerHTML = '';

          const promises: Promise<any>[] = [];
          loadPromises(promises, app);

          Promise.all(promises).then(() => {
            console.log('app promises', app)
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
        console.log('GET', url)
        oReq.open('GET', url);
        oReq.send();

      } catch (e) {
        console.error('catch error', e);
        reject(e);
      }
    });
  }

  function loadPromises(promises: Promise<any>[], component: any) {
    console.log('p', component.tagName, !!component.componentOnReady)
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
export function waitForChanges() {
  const win = window as any;

  return new Promise(resolve => {

    function waitForAppReady() {
      const promises = win['s-apps'].map((appNamespace: string) => {
        return win[appNamespace].onReady();
      });

      Promise.all(promises).then(() => {
        win.requestAnimationFrame(resolve);
      });
    }

    function pageLoaded() {
      setTimeout(() => {
        if (win['s-apps']) {
          waitForAppReady();
        } else {
          setTimeout(() => {
            if (win['s-apps']) {
              waitForAppReady();
            } else {
              console.error(`window['s-apps'] never loaded`);
            }
          }, 100)
        }
      }, 32);
    }

    if (document.readyState === 'complete') {
      pageLoaded();
    } else {
      win.addEventListener('load', pageLoaded, false);
    }
  });
}
