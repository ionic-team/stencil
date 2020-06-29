import { setupDomTests } from '../util';

describe('slot-children', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-children/index.html');
  });
  afterEach(tearDownDom);

  it('get shadow child nodes', async () => {
    const elm = app.querySelector('slot-children-root');
    expect(elm.childElementCount).toBe(3);
  });
});
