import type { HTMLStencilElement } from '../../../../internal';
import { setupDomTests } from '../util';

describe('slot array basic', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-array-basic/index.html');
  });
  afterEach(tearDownDom);

  it('renders slotted content between header/footer', async () => {
    let elm = app.querySelector('.results1') as HTMLStencilElement;
    expect(elm.__children[0].nodeName.toLowerCase()).toContain('header');
    expect(elm.__children[0].textContent.trim()).toBe('Header');
    expect(elm.__children[1].nodeName.toLowerCase()).toContain('footer');
    expect(elm.__children[1].textContent.trim()).toBe('Footer');

    elm = app.querySelector('.results2') as HTMLStencilElement;
    expect(elm.__children[0].nodeName.toLowerCase()).toContain('header');
    expect(elm.__children[0].textContent.trim()).toBe('Header');
    expect(elm.__children[1].nodeName.toLowerCase()).toContain('content-top');
    expect(elm.__children[1].textContent.trim()).toBe('Content');
    expect(elm.__children[2].nodeName.toLowerCase()).toContain('footer');
    expect(elm.__children[2].textContent.trim()).toBe('Footer');

    elm = app.querySelector('.results3') as HTMLStencilElement;
    expect(elm.__children[0].nodeName.toLowerCase()).toContain('header');
    expect(elm.__children[0].textContent.trim()).toBe('Header');
    expect(elm.__children[1].nodeName.toLowerCase()).toContain('content-top');
    expect(elm.__children[1].textContent.trim()).toBe('Content Top');
    expect(elm.__children[2].nodeName.toLowerCase()).toContain('content-bottom');
    expect(elm.__children[2].textContent.trim()).toBe('Content Bottom');
    expect(elm.__children[3].nodeName.toLowerCase()).toContain('footer');
    expect(elm.__children[3].textContent.trim()).toBe('Footer');

    elm = app.querySelector('.results4') as HTMLStencilElement;
    expect(elm.__children[0].nodeName.toLowerCase()).toContain('header');
    expect(elm.__children[0].textContent.trim()).toBe('Header');
    expect(elm.__children[1].nodeName.toLowerCase()).toContain('content-top');
    expect(elm.__children[1].textContent.trim()).toBe('Content Top');
    expect(elm.__children[2].nodeName.toLowerCase()).toContain('content-middle');
    expect(elm.__children[2].textContent.trim()).toBe('Content Middle');
    expect(elm.__children[3].nodeName.toLowerCase()).toContain('content-bottom');
    expect(elm.__children[3].textContent.trim()).toBe('Content Bottom');
    expect(elm.__children[4].nodeName.toLowerCase()).toContain('footer');
    expect(elm.__children[4].textContent.trim()).toBe('Footer');

    const hiddenCmp = app.querySelector('[hidden]');
    expect(hiddenCmp).toBe(null);
  });
});
