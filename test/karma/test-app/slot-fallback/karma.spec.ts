import { setupDomTests, waitForChanges } from '../util';

describe('slot-fallback', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-fallback/index.html');
  });
  afterEach(tearDownDom);

  it('renders fallback', async () => {
    let result: HTMLElement;
    let buttonChangeFallbackContent: HTMLButtonElement;
    let buttonChangeLightDom: HTMLButtonElement;
    let buttonChangeSlotContent: HTMLButtonElement;

    buttonChangeFallbackContent = app.querySelector('button.change-fallback-content');
    buttonChangeLightDom = app.querySelector('button.change-light-dom');
    buttonChangeSlotContent = app.querySelector('button.change-slot-content');

    // show fallback content
    result = app.querySelector('.results1 slot-fb[name="start"]:not([hidden])');
    expect(result.textContent).toBe('slot start fallback 0');

    result = app.querySelector('.results1 section slot-fb:not([hidden])');
    expect(result.textContent).toBe('slot default fallback 0');

    result = app.querySelector('.results1 article span slot-fb[name="end"]:not([hidden])');
    expect(result.textContent).toBe('slot end fallback 0');

    // update fallback content
    buttonChangeFallbackContent.click();
    await waitForChanges();

    result = app.querySelector('.results1 slot-fb[name="start"]:not([hidden])');
    expect(result.textContent).toBe('slot start fallback 1');

    result = app.querySelector('.results1 section slot-fb:not([hidden])');
    expect(result.textContent).toBe('slot default fallback 1');

    result = app.querySelector('.results1 article span slot-fb[name="end"]:not([hidden])');
    expect(result.textContent).toBe('slot end fallback 1');

    // set light dom instead and hide fallback content
    buttonChangeLightDom.click();
    await waitForChanges();

    // fallback content hidden but still the same
    result = app.querySelector('.results1 slot-fb[name="start"][hidden]');
    expect(result.textContent).toBe('slot start fallback 1');

    result = app.querySelector('.results1 section slot-fb[hidden]');
    expect(result.textContent).toBe('slot default fallback 1');

    result = app.querySelector('.results1 article span slot-fb[name="end"][hidden]');
    expect(result.textContent).toBe('slot end fallback 1');

    // light dom content rendered
    result = app.querySelector('.results1 content-start');
    expect(result.textContent).toBe('slot light dom 0 : start');

    result = app.querySelector('.results1 section content-default');
    expect(result.textContent).toBe('slot light dom 0 : default');

    result = app.querySelector('.results1 article span content-end');
    expect(result.textContent).toBe('slot light dom 0 : end');

    buttonChangeFallbackContent.click();
    buttonChangeSlotContent.click();
    await waitForChanges();

    // fallback content hidden and updated content
    result = app.querySelector('.results1 slot-fb[name="start"][hidden]');
    expect(result.textContent).toBe('slot start fallback 2');

    result = app.querySelector('.results1 section slot-fb[hidden]');
    expect(result.textContent).toBe('slot default fallback 2');

    result = app.querySelector('.results1 article span slot-fb[name="end"][hidden]');
    expect(result.textContent).toBe('slot end fallback 2');

    // light dom content updated
    result = app.querySelector('.results1 content-start');
    expect(result.textContent).toBe('slot light dom 1 : start');

    result = app.querySelector('.results1 section content-default');
    expect(result.textContent).toBe('slot light dom 1 : default');

    result = app.querySelector('.results1 article span content-end');
    expect(result.textContent).toBe('slot light dom 1 : end');

    // change back to fallback content
    buttonChangeLightDom.click();
    await waitForChanges();

    // fallback content should not be hidden
    result = app.querySelector('.results1 slot-fb[name="start"]:not([hidden])');
    expect(result.textContent).toBe('slot start fallback 2');

    result = app.querySelector('.results1 section slot-fb:not([hidden])');
    expect(result.textContent).toBe('slot default fallback 2');

    result = app.querySelector('.results1 article span slot-fb[name="end"]:not([hidden])');
    expect(result.textContent).toBe('slot end fallback 2');

    // light dom content should not exist
    result = app.querySelector('.results1 content-start');
    expect(result).toBe(null);

    result = app.querySelector('.results1 section content-default');
    expect(result).toBe(null);

    result = app.querySelector('.results1 article span content-end');
    expect(result).toBe(null);

    // update content
    buttonChangeFallbackContent.click();
    buttonChangeSlotContent.click();
    await waitForChanges();

    // fallback content should not be hidden
    result = app.querySelector('.results1 slot-fb[name="start"]:not([hidden])');
    expect(result.textContent).toBe('slot start fallback 3');

    result = app.querySelector('.results1 section slot-fb:not([hidden])');
    expect(result.textContent).toBe('slot default fallback 3');

    result = app.querySelector('.results1 article span slot-fb[name="end"]:not([hidden])');
    expect(result.textContent).toBe('slot end fallback 3');

    // light dom content should not exist
    result = app.querySelector('.results1 content-start');
    expect(result).toBe(null);

    result = app.querySelector('.results1 section content-default');
    expect(result).toBe(null);

    result = app.querySelector('.results1 article span content-end');
    expect(result).toBe(null);

    // change back to showing slot content
    buttonChangeLightDom.click();
    await waitForChanges();

    // fallback content hidden and updated content
    result = app.querySelector('.results1 slot-fb[name="start"][hidden]');
    expect(result.textContent).toBe('slot start fallback 3');

    result = app.querySelector('.results1 section slot-fb[hidden]');
    expect(result.textContent).toBe('slot default fallback 3');

    result = app.querySelector('.results1 article span slot-fb[name="end"][hidden]');
    expect(result.textContent).toBe('slot end fallback 3');

    // light dom content updated
    result = app.querySelector('.results1 content-start');
    expect(result.textContent).toBe('slot light dom 2 : start');

    result = app.querySelector('.results1 section content-default');
    expect(result.textContent).toBe('slot light dom 2 : default');

    result = app.querySelector('.results1 article span content-end');
    expect(result.textContent).toBe('slot light dom 2 : end');
  });

  it('should have correct display style on slot-fb element', () => {
    const slotFbElements = app.querySelectorAll<HTMLElement>('slot-fallback-root slot-fallback slot-fb');
    slotFbElements.forEach((slotFb) => expect(getComputedStyle(slotFb).display).toBe('contents'));
  });

  it('should hide slot-fb elements when slotted content exists', async () => {
    // Show slotted content
    const buttonChangeLightDom = app.querySelector<HTMLButtonElement>('button.change-light-dom');
    buttonChangeLightDom.click();
    await waitForChanges();

    const slotFbElements = app.querySelectorAll<HTMLElement>('slot-fallback-root slot-fallback slot-fb');
    slotFbElements.forEach((slotFb) => expect(getComputedStyle(slotFb).display).toBe('none'));
  });
});
