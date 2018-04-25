import { setupDomTests } from '../util';

describe('slot array', () => {
  const { setupDom, tearDownDom, renderTest } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('renders slotted content in the right position for polyfilled elements', async function() {
    if (!('attachShadow' in HTMLElement.prototype)) {
      const component = await renderTest('/slot-array/index.html');

      expect(component.firstElementChild.nodeName).toEqual('SPAN');
      expect(component.lastElementChild.nodeName).toEqual('P');
    }
  });
});
