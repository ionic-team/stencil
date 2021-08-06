import { setupDomTests, waitForChanges } from '../util';

describe('append-child', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/append-child/index.html');
  });
  afterEach(tearDownDom);

  it('appends to correct slot', async () => {
    const btnDefault = app.querySelector('#btnDefault') as HTMLButtonElement;
    btnDefault.click();
    btnDefault.click();

    const btnH1 = app.querySelector('#btnH1') as HTMLButtonElement;
    btnH1.click();
    btnH1.click();

    const btnH6 = app.querySelector('#btnH6') as HTMLButtonElement;
    btnH6.click();
    btnH6.click();

    await waitForChanges();

    expect(app.querySelector('h1').textContent).toBe('H1 TopH1 Middle 0H1 Middle 1H1 Bottom');
    expect(app.querySelector('article').textContent).toBe(
      'Default TopLightDomDefault Slot 0Default Slot 1Default Bottom'
    );
    expect(app.querySelector('section').textContent).toBe('H6 TopH6 Middle 0H6 Middle 1H6 Bottom');
  });
});
