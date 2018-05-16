import { setupDomTests } from '../util';
import { testEsmImport } from '../esm-import/karma.spec';

describe('esm-webpack', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/esm-webpack/index.html');
  });
  afterEach(tearDownDom);

  it('webpack', async () => {
    await testEsmImport(app);
  });

});
