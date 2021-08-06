import { setupDomTests } from '../util';

describe('external-imports', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/external-imports/index.html');
  });
  afterEach(tearDownDom);

  it('render all components without errors', async () => {
    let elm = app.querySelector('external-import-a');
    expect(elm.textContent.trim()).toBe('Marty McFly');

    elm = app.querySelector('external-import-b');
    expect(elm.textContent.trim()).toBe('Marty McFly');

    elm = app.querySelector('external-import-c');
    expect(elm.textContent.trim()).toBe('Marty McFly');
  });
});
