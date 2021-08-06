import { setupDomTests } from '../util';

describe('node-globals', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/node-globals/index.html');
  });
  afterEach(tearDownDom);

  it('expect faked node globals', async () => {
    const ids = ['tmpdir', 'fs', 'Buffer', 'process'];
    ids.forEach((id) => {
      const tmpdir = app.querySelector(`#${id}`);
      expect(tmpdir.textContent.trim()).not.toBe('');
    });
    expect(app.querySelector(`#node_env`).textContent).toBe('production');
  });
});
