export type AddComponentFn = <T extends Element>(childHtml: string) => T;

/**
 * Create setup methods for dom based tests.
 */
export function setupDomTests(document: Document, scratch: HTMLDivElement = null) {
  let app = document.body.appendChild(document.createElement('div'));

  /**
   * Run this before each test
   */
  function setupDom() {
    scratch = app.appendChild(document.createElement("div"));
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
  async function addComponent<T extends HTMLStencilElement>(childHtml: string): Promise<T> {
    scratch.innerHTML = childHtml;
    const component =  scratch.firstElementChild as T;
    await component.componentOnReady();

    return component;
  }

  return { setupDom, tearDownDom, addComponent };
}

/**
 * Wait for the component to asynchronously update
 */
export function onComponentUpdate(el: Element) {
  return new Promise((resolve) => {

    const observer = new MutationObserver(function(mutations: MutationRecord[]) {
      mutations;
      observer.disconnect();
      resolve();
    });

    observer.observe(el, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true
    });
  });
}
