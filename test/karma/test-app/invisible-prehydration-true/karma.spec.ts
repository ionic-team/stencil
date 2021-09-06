import { setupDomTests } from '../util';

describe('invisible-prehydration-true', () => {
  const { setupDom, tearDownDom, tearDownStylesScripts } = setupDomTests(document);

  afterEach(tearDownDom);

  it('the style element will not be placed in the head', async () => {
    tearDownStylesScripts();
    await setupDom('/invisible-prehydration-true/index.html', 1000);

    // Is the component hydrated?
    expect(document.querySelector('prehydrated-styles').innerHTML).toEqual('<div>prehydrated-styles</div>');

    expect(document.head.querySelectorAll('style[data-styles]').length).toEqual(1);
  });
});
