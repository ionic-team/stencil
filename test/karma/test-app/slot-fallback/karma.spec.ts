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
    result = app.querySelector('.results1 div');
    expect(result.textContent).toBe('slot start fallback 0slot default fallback 0slot end fallback 0');

    result = app.querySelector('.results1 section');
    expect(result.textContent).toBe('slot default fallback 0');

    result = app.querySelector('.results1 article span');
    expect(result.textContent).toBe('slot end fallback 0');

    // update fallback content
    buttonChangeFallbackContent.click();
    await waitForChanges();

    result = app.querySelector('.results1 div');
    expect(result.textContent).toBe('slot start fallback 1slot default fallback 1slot end fallback 1');

    result = app.querySelector('.results1 section');
    expect(result.textContent).toBe('slot default fallback 1');

    result = app.querySelector('.results1 article span');
    expect(result.textContent).toBe('slot end fallback 1');

    // set light dom instead and hide fallback content
    buttonChangeLightDom.click();
    await waitForChanges();

    // light dom content rendered
    result = app.querySelector('.results1 content-start[slot="start"]');
    expect(result.textContent).toBe('slot light dom 0 : start');

    result = app.querySelector('.results1 section content-default');
    expect(result.textContent).toBe('slot light dom 0 : default');

    result = app.querySelector('.results1 article span content-end');
    expect(result.textContent).toBe('slot light dom 0 : end');

    buttonChangeFallbackContent.click();
    buttonChangeSlotContent.click();
    await waitForChanges();

    // fallback content is removed. Light dom is updated
    result = app.querySelector('.results1 div');
    expect(result.textContent).toBe('slot light dom 1 : startslot light dom 1 : defaultslot light dom 1 : end');

    result = app.querySelector('.results1 content-start[slot="start"]');
    expect(result.textContent).toBe('slot light dom 1 : start');

    result = app.querySelector('.results1 section');
    expect(result.textContent).toBe('slot light dom 1 : default');

    result = app.querySelector('.results1 article span');
    expect(result.textContent).toBe('slot light dom 1 : end');

    // change back to fallback content
    buttonChangeLightDom.click();
    await waitForChanges();

    // fallback content should not be hidden
    result = app.querySelector('.results1 div');
    expect(result.textContent).toBe('slot start fallback 2slot default fallback 2slot end fallback 2');

    result = app.querySelector('.results1 section');
    expect(result.textContent).toBe('slot default fallback 2');

    result = app.querySelector('.results1 article span');
    expect(result.textContent).toBe('slot end fallback 2');

    // light dom content should not exist
    result = app.querySelector('.results1 content-start[slot="start"]');
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
    result = app.querySelector('.results1 div');
    expect(result.textContent).toBe('slot start fallback 3slot default fallback 3slot end fallback 3');

    result = app.querySelector('.results1 section');
    expect(result.textContent).toBe('slot default fallback 3');

    result = app.querySelector('.results1 article span');
    expect(result.textContent).toBe('slot end fallback 3');

    // light dom content should not exist
    result = app.querySelector('.results1 content-start[slot="start"]');
    expect(result).toBe(null);

    result = app.querySelector('.results1 section content-default');
    expect(result).toBe(null);

    result = app.querySelector('.results1 article span content-end');
    expect(result).toBe(null);

    // change back to showing slot content
    buttonChangeLightDom.click();
    await waitForChanges();

    // fallback content is removed. Light dom is updated
    result = app.querySelector('.results1 div');
    expect(result.textContent).toBe('slot light dom 2 : startslot light dom 2 : defaultslot light dom 2 : end');

    result = app.querySelector('.results1 content-start[slot="start"]');
    expect(result.textContent).toBe('slot light dom 2 : start');

    result = app.querySelector('.results1 section content-default');
    expect(result.textContent).toBe('slot light dom 2 : default');

    result = app.querySelector('.results1 article span content-end');
    expect(result.textContent).toBe('slot light dom 2 : end');
  });

});
