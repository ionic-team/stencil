import { setupDomTests, waitForChanges } from '../util';

describe('slot-conditional-rendering', function () {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;
  const getHeaderVisibilityToggle = () => app.querySelector<HTMLButtonElement>('#header-visibility-toggle');
  const getContentVisibilityToggle = () => app.querySelector<HTMLButtonElement>('#content-visibility-toggle');
  const getHeaderElementInLightDOM = () => app.querySelector('#slotted-header-element-id');
  const getContentElementInLightDOM = () => app.querySelector('#slotted-content-element-id');

  beforeEach(async () => {
    app = await setupDom('/slot-conditional-rendering/index.html');
  });
  afterEach(tearDownDom);

  it('slots are not hidden', async () => {
    await waitForChanges();
    expect(getHeaderElementInLightDOM().getAttribute('hidden')).toBeNull();
    expect(getContentElementInLightDOM().getAttribute('hidden')).toBeNull();
  });

  it('header slot becomes hidden after hit the toggle button', async () => {
    await waitForChanges();
    expect(getHeaderElementInLightDOM().getAttribute('hidden')).toBeNull();

    getHeaderVisibilityToggle()?.click();
    await waitForChanges();
    expect(getHeaderElementInLightDOM().getAttribute('hidden')).not.toBeNull();
  });

  it('content slot becomes hidden after hit the toggle button', async () => {
    await waitForChanges();
    expect(getContentElementInLightDOM().getAttribute('hidden')).toBeNull();

    getContentVisibilityToggle()?.click();
    await waitForChanges();
    expect(getContentElementInLightDOM().getAttribute('hidden')).not.toBeNull();
  });
});
