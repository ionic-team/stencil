import { setupDomTests, flush } from "../util";

describe("shadow-dom-slot-mapped", function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom("/shadow-dom-slot-mapped/index.html");
  });

  afterEach(tearDownDom);

  it("should render dynamically added elements in the same 'slot' location", async () => {
    function getChildren(result: HTMLElement) {
      if ("attachShadow" in HTMLElement.prototype) {
        return result.children;
      } else {
        return result.querySelector(".mapped-content").children;
      }
    }

    const result = app.querySelector("shadow-dom-slot-mapped") as HTMLElement;
    // live list
    const children = getChildren(result);

    expect(children.length).toBe(3);
    [].slice.call(children).forEach((child: HTMLElement) => {
      expect(child.nodeName).toBe("LABEL");
    });

    app.querySelector("button").click();
    await flush(app);

    expect(children.length).toBe(4);
    [].slice.call(children).forEach((child: HTMLElement) => {
      expect(child.nodeName).toBe("LABEL");
    });
  });
});
