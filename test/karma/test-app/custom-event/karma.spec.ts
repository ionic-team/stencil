import { setupDomTests, waitForChanges } from '../util';

describe('custom event', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/custom-event/index.html');
  });
  afterEach(tearDownDom);

  it('should fire raw custom event', async () => {
    const btnNoDetail = app.querySelector('#btnNoDetail') as HTMLButtonElement;
    const btnWithDetail = app.querySelector('#btnWithDetail') as HTMLButtonElement;
    const output = app.querySelector('#output') as HTMLDivElement;

    btnNoDetail.click();
    await waitForChanges();

    expect(output.textContent.trim()).toBe('eventNoDetail');

    btnWithDetail.click();
    await waitForChanges();

    expect(output.textContent.trim()).toBe('eventWithDetail 88');
  });
});
