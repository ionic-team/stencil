import { setupDomTests } from '../util';

describe('dom-reattach', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/dom-reattach/index.html');
  });
  afterEach(tearDownDom);

  it('should have proper values', async () => {
    app;
  });
});
