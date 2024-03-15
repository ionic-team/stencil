import { setupDomTests, waitForChanges } from '../util';

describe('event-listener-capture', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);

  let app: HTMLElement | undefined;
  let host: HTMLElement | undefined;

  beforeEach(async () => {
    app = await setupDom('/event-listener-capture/index.html');
    host = app.querySelector('event-listener-capture');
  });

  afterEach(tearDownDom);

  it('should render', () => {
    expect(host).toBeDefined();
  });

  it('should increment counter on click', async () => {
    const counter = host.querySelector('#counter');
    expect(counter.textContent).toBe('0');

    const p = host.querySelector('#incrementer') as HTMLParagraphElement;
    expect(p).toBeDefined();
    p.click();
    await waitForChanges();

    expect(counter.textContent).toBe('1');
  });
});
