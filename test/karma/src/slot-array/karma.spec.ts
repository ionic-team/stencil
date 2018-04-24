import { setupDomTests } from '../util';

describe('slot array', () => {
  const { setupDom, tearDownDom, renderTest } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('renders slotted content in the right position for polyfilled elements', async function() {
    if (!('attachShadow' in HTMLElement.prototype)) {
      const component = await renderTest('/slot-array/index.html');
      const children = component.childNodes;
      const firstNode = children.item(1);
      expect(firstNode.nodeName).toEqual('SPAN');

      const secondNode = children.item(2);
      expect(secondNode.nodeName).toEqual('P');
    }
  });
});
