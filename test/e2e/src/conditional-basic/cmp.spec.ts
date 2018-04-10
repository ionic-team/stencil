import { setupDomTests, onComponentUpdate } from '../util';

describe("basic support", function() {
  const { setupDom, tearDownDom, addComponent } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  describe("simple test", function() {
    it("contains a button as a child", async function() {

      const component = await addComponent<HTMLConditionalBasicElement>(`
        <conditional-basic></conditional-basic>
      `);
      let button = component.querySelector('button');

      expect(button).toBeDefined();
    });

    it("button click rerenders", async function() {

      const component = await addComponent<HTMLConditionalBasicElement>(`
        <conditional-basic></conditional-basic>
      `);
      let button = component.querySelector('button');
      let results = component.querySelector('div.results');

      expect(results.textContent).toEqual('');

      button.click();
      await onComponentUpdate(component);

      expect(results.textContent).toEqual('Content');
    });
  });
});
