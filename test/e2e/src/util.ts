export type AddComponentFn = <T extends Element>(childHtml: string) => T;

export function setupDomTests(document: Document, scratch: HTMLDivElement = null) {
  let app = document.body.appendChild(document.createElement('div'));

  function setupDom() {
    scratch = app.appendChild(document.createElement("div"));
  };

  function tearDownDom() {
    scratch.remove();
    scratch = null;
  };

  async function addComponent<T extends HTMLStencilElement>(childHtml: string): Promise<T> {
    scratch.innerHTML = childHtml;
    const component =  scratch.firstElementChild as T;
    await component.componentOnReady();

    return component;
  }

  return { setupDom, tearDownDom, addComponent };
}

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
