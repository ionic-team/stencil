function addComponentFactory(scratch: Element) {
  let addComponent = function<T extends Element>(childHtml: string): T {
    scratch.innerHTML = childHtml;
    return scratch.firstChild as T;
  }

  return addComponent;
}

function onComponentUpdate(el: Element) {
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

describe("basic support", function() {
  let app = document.createElement("div");
  document.body.appendChild(app);
  let scratch: HTMLDivElement;
  let addComponent: <T extends Element>(childHtml: string) => T;

  beforeEach(function() {
    scratch = document.createElement("div");
    app.appendChild(scratch);
    addComponent = addComponentFactory(scratch);
  });

  afterEach(function() {
    app.innerHTML = "";
    scratch = null;
  });

  describe("simple test", function() {
    it("contains a button as a child", async function() {

      const component = addComponent<HTMLConditionalBasicElement>(
        '<conditional-basic></conditional-basic>'
      );
      await component.componentOnReady();
      let button = component.querySelector('button');

      expect(button).toBeDefined();
    });

    it("button click rerenders", async function() {

      const component = addComponent<HTMLConditionalBasicElement>(
        '<conditional-basic></conditional-basic>'
      );
      await component.componentOnReady();

      let button = component.querySelector('button');
      let results = component.querySelector('div.results');


      expect(results.textContent).toEqual('');

      button.click();
      await onComponentUpdate(component);

      expect(results.textContent).toEqual('Content');
    });
  });
});
