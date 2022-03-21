import { setupDomTests, waitForChanges } from '../util';

describe('event-basic', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/event-custom-type/index.html');
  });
  afterEach(tearDownDom);

  it('should dispatch an event on load', () => {
    expect(app.querySelector('#counter').textContent).toBe('1');
  });

  it('should emit a complex type', async () => {
    await waitForChanges();
    expect(app.querySelector('#lastValue').textContent).toBe('{"value":"Test value"}');
  });
});
