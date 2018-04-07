
describe("basic support", function() {
  let app = document.createElement("div");
  document.body.appendChild(app);
  let scratch: HTMLDivElement;

  beforeEach(function() {
    scratch = document.createElement("div");
    app.appendChild(scratch);
  });

  afterEach(function() {
    app.innerHTML = "";
    scratch = null;
  });

  function addComponent<T extends Element>(childHtml: string): T {
    scratch.innerHTML = childHtml;
    return scratch.firstChild as T;
  }

  describe("simple test", function() {
    it("contains a button as a child", async function() {

      const component = addComponent<HTMLCmpAElement>(
        '<cmp-a></cmp-a>'
      );
      await component.componentOnReady();
      let button = component.querySelector('button');

      expect(button).toBeDefined();
    });

    it("button click rerenders", async function() {

      const component = addComponent<HTMLCmpAElement>(
        '<cmp-a></cmp-a>'
      );
      await component.componentOnReady();

      let button = component.querySelector('button');
      let results = component.querySelector('div.results');


      expect(results.textContent).toEqual('');
      button.click();
      // How do we wait for the rerender?
    });
  });
});
