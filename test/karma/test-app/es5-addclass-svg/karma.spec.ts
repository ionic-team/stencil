import { setupDomTests } from '../util';

describe('es5 $addClass svg', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let element: HTMLElement;

  beforeEach(async () => {
    const app = await setupDom('/es5-addclass-svg/index.html');
    element = app.querySelector('es5-addclass-svg');
  });
  afterEach(tearDownDom);

  it('should add a class', async () => {
    if ('attachShadow' in HTMLElement.prototype) {
      testNativeShadow(element);
    } else {
      testPolyfilledShadow(element);
    }
  });

  function testNativeShadow(result: HTMLElement) {
    const svg = result.shadowRoot.querySelector('svg');
    expect(svg.getAttribute('class')).toContain('existing-css-class');
    expect(svg.getAttribute('class')).not.toContain('sc-es5-addclass-svg');
  }

  function testPolyfilledShadow(result: HTMLElement) {
    const svg = result.querySelector('svg');
    expect(svg.getAttribute('class')).toBe('existing-css-class sc-es5-addclass-svg');
  }
});
