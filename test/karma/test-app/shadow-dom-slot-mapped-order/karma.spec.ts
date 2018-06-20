import { setupDomTests, flush } from "../util";

fdescribe("shadow-dom-slot-mapped-order", function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom("/shadow-dom-slot-mapped-order/index.html");
  });

  afterEach(tearDownDom);

  it("should render dynamically added elements in the same order", async () => {
    function getChildren(result: HTMLElement) {
      return "attachShadow" in HTMLElement.prototype
        ? result.children
        : result.querySelector(".mapped-content").children;
    }

    const result = app.querySelector(
      "shadow-dom-slot-mapped-order"
    ) as HTMLElement;
    // live list
    const children = getChildren(result);

    let index = -1;
    [].slice.call(children).forEach((child: HTMLElement) => {
      expect(child.textContent).toBe(`${++index}`);
    });
    expect(index).toBe(2);

    app.querySelector("button").click();
    await flush(app);

    index = -1;
    [].slice.call(children).forEach((child: HTMLElement) => {
      expect(child.textContent).toBe(`${++index}`);
    });
    expect(index).toBe(3);
  });
});
