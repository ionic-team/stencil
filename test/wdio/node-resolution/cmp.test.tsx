import { setupDomTests } from '../util';

describe('node-resolution', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/node-resolution/index.html');
  });
  afterEach(tearDownDom);

  it('should import from the right sources', async () => {
    expect(app.querySelector('#module-index').textContent).toEqual('module/index.js');
    expect(app.querySelector('#module').textContent).toEqual('module.js');
  });
});
