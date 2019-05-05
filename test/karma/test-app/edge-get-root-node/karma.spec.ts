import {setupDomTests, waitForChanges} from '../util';


describe('edge-get-root-node', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/edge-get-root-node/index.html');
  });
  afterEach(tearDownDom);


  it('should not require the edge-get-root-node polyfill', async () => {
    const cmp = app.querySelector('edge-get-root-node') as any;
    await waitForChanges();
    expect(cmp).not.toBeUndefined();
  })

});

