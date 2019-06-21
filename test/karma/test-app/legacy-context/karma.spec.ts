import { setupDomTests } from '../util';


describe('legacy-context', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/legacy-context/index.html');
  });
  afterEach(tearDownDom);

  it('should have global context', async () => {
    const cmp = app.querySelector('legacy-context');
    const data = await cmp.getData();
    expect(data).toEqual({
      win: window,
      doc: document,
      hasQueue: true,
      myService: 12,
      isServer: false,
      unknown: undefined,
    })
  });

});
