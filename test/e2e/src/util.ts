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

  function addComponent<T extends Element>(childHtml: string): T {
    scratch.innerHTML = childHtml;
    return scratch.firstElementChild as T;
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
