export type AddComponentFn = <T extends Element>(childHtml: string) => T;

/**
 * Create setup methods for dom based tests.
 */
export function setupDomTests(document: Document, scratch: HTMLDivElement = null) {
  const testDiv = document.createElement('div');
  testDiv.className = 'test-app';
  let app = document.body.appendChild(testDiv);

  /**
   * Run this before each test
   */
  function setupDom() {
    const div = document.createElement('div');
    div.className = 'scratch';
    scratch = app.appendChild(div);
  };

  /**
   * Run this after each test
   */
  function tearDownDom() {
    scratch.remove();
    scratch = null;
  };

  /**
   * Create web component for executing tests against
   */
  function renderTest(url: string) {

    url = '/base/www' + url;

    return new Promise<HTMLElement>(resolve => {

      async function indexLoaded() {
        const frag = document.createDocumentFragment();
        const elm = document.createElement('div');
        elm.innerHTML = this.responseText;
        frag.appendChild(elm);

        const scripts = frag.querySelectorAll('script');
        for (let i = 0; i < scripts.length; i++) {
          scripts[i].remove();
        }

        scratch.innerHTML = elm.innerHTML;

        const promises: Promise<any>[] = [];

        loadPromises(promises, scratch);

        Promise.all(promises).then(() => {
          const component = scratch.querySelector('.hydrated') as any;
          resolve(component);
        });
      }

      var oReq = new XMLHttpRequest();
      oReq.addEventListener('load', indexLoaded);
      oReq.open('GET', url);
      oReq.send();
    });
  }

  function loadPromises(promises: Promise<any>[], component: any) {
    promises.push((component as any).componentOnReady());

    for (let i = 0; i < component.children.length; i++) {
      loadPromises(promises, component.children[i]);
    }
  }

  /**
   * Wait for the component to asynchronously update
   */
  function flush() {
    return new Promise((resolve) => {

      const observer = new MutationObserver(function(mutations: MutationRecord[]) {
        mutations;
        observer.disconnect();
        setTimeout(() => {
          (window as any).App.Context.queue.write(() => {
            resolve();
          });
        }, 100);
      });

      observer.observe(scratch, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
      });
    });
  }

  return { setupDom, tearDownDom, renderTest, flush };
}
