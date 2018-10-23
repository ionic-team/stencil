import { setupDomTests } from '../util';

describe('init-css-shim', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  const imageUrl = '/path/to/image.png';

  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/init-css-shim/index.html');
  });
  afterEach(tearDownDom);

  it('should not replace "relavive to root" paths', async () => {
    const root = app.querySelector('init-css-root #relativeToRoot');
    let imagePath = window.getComputedStyle(root).getPropertyValue('background-image');
    imagePath = imagePath.replace(/\"/g, '');
    imagePath = imagePath.replace(/\'/g, '');
    expect(imagePath).toBe(`url(${window.location.origin}${imageUrl})`);
  });

  it('should not replace "absolute" paths', async () => {
    const domain = 'http://domain';
    const root = app.querySelector('init-css-root #absolute');
    let imagePath = window.getComputedStyle(root).getPropertyValue('background-image');
    imagePath = imagePath.replace(/\"/g, '');
    imagePath = imagePath.replace(/\'/g, '');
    expect(imagePath).toBe(`url(${domain}${imageUrl})`);
  });

});
