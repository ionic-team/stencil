import { setupDomTests } from '../util';

describe('tag-names', () => {
  const { app, setupDom, tearDownDom, renderTest } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);

  it('should load tags with numbers in them', async function() {
    await renderTest('/tag-names/index.html');

    const tag3d = app.querySelector('tag-3d-component');
    expect(tag3d.textContent.trim()).toBe('tag-3d-component');

    const tag88 = app.querySelector('tag-88');
    expect(tag88.textContent.trim()).toBe('tag-88');
  });

});
