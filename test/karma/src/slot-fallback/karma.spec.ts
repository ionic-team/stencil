import { setupDomTests } from '../util';


describe('slot-fallback', () => {
  const { setupDom, tearDownDom, renderTest, flush } = setupDomTests(document);

  beforeEach(setupDom);
  afterEach(tearDownDom);


  it('renders fallback', async () => {
    const component = await renderTest('/slot-fallback/index.html');
    let result: HTMLElement;
    let buttonChangeFallbackContent: HTMLButtonElement;
    let buttonChangeLightDom: HTMLButtonElement;
    let buttonChangeSlotContent: HTMLButtonElement;

    buttonChangeFallbackContent = component.querySelector('button.change-fallback-content');
    buttonChangeLightDom = component.querySelector('button.change-light-dom');
    buttonChangeSlotContent = component.querySelector('button.change-slot-content');

    // show fallback content
    result = component.querySelector('.results1 slot-fb[name="start"]:not([hidden])');
    expect(result.textContent).toBe('slot start fallback 0');

    result = component.querySelector('.results1 section slot-fb:not([hidden])');
    expect(result.textContent).toBe('slot default fallback 0');

    result = component.querySelector('.results1 article span slot-fb[name="end"]:not([hidden])');
    expect(result.textContent).toBe('slot end fallback 0');

    // update fallback content
    buttonChangeFallbackContent.click();
    await flush();

    result = component.querySelector('.results1 slot-fb[name="start"]:not([hidden])');
    expect(result.textContent).toBe('slot start fallback 1');

    result = component.querySelector('.results1 section slot-fb:not([hidden])');
    expect(result.textContent).toBe('slot default fallback 1');

    result = component.querySelector('.results1 article span slot-fb[name="end"]:not([hidden])');
    expect(result.textContent).toBe('slot end fallback 1');

    // set light dom instead and hide fallback content
    buttonChangeLightDom.click();
    await flush();

    // fallback content hidden but still the same
    result = component.querySelector('.results1 slot-fb[name="start"][hidden]');
    expect(result.textContent).toBe('slot start fallback 1');

    result = component.querySelector('.results1 section slot-fb[hidden]');
    expect(result.textContent).toBe('slot default fallback 1');

    result = component.querySelector('.results1 article span slot-fb[name="end"][hidden]');
    expect(result.textContent).toBe('slot end fallback 1');

    // light dom content rendered
    result = component.querySelector('.results1 content-start[slot="start"]');
    expect(result.textContent).toBe('slot light dom 0 : start');

    result = component.querySelector('.results1 section content-default');
    expect(result.textContent).toBe('slot light dom 0 : default');

    result = component.querySelector('.results1 article span content-end');
    expect(result.textContent).toBe('slot light dom 0 : end');

    buttonChangeFallbackContent.click();
    buttonChangeSlotContent.click();
    await flush();

    // fallback content hidden and updated content
    result = component.querySelector('.results1 slot-fb[name="start"][hidden]');
    expect(result.textContent).toBe('slot start fallback 2');

    result = component.querySelector('.results1 section slot-fb[hidden]');
    expect(result.textContent).toBe('slot default fallback 2');

    result = component.querySelector('.results1 article span slot-fb[name="end"][hidden]');
    expect(result.textContent).toBe('slot end fallback 2');

    // light dom content updated
    result = component.querySelector('.results1 content-start[slot="start"]');
    expect(result.textContent).toBe('slot light dom 1 : start');

    result = component.querySelector('.results1 section content-default');
    expect(result.textContent).toBe('slot light dom 1 : default');

    result = component.querySelector('.results1 article span content-end');
    expect(result.textContent).toBe('slot light dom 1 : end');

    // change back to fallback content
    buttonChangeLightDom.click();
    await flush();

    // fallback content should not be hidden
    result = component.querySelector('.results1 slot-fb[name="start"]:not([hidden])');
    expect(result.textContent).toBe('slot start fallback 2');

    result = component.querySelector('.results1 section slot-fb:not([hidden])');
    expect(result.textContent).toBe('slot default fallback 2');

    result = component.querySelector('.results1 article span slot-fb[name="end"]:not([hidden])');
    expect(result.textContent).toBe('slot end fallback 2');

    // light dom content should not exist
    result = component.querySelector('.results1 content-start[slot="start"]');
    expect(result).toBe(null);

    result = component.querySelector('.results1 section content-default');
    expect(result).toBe(null);

    result = component.querySelector('.results1 article span content-end');
    expect(result).toBe(null);

    // update content
    buttonChangeFallbackContent.click();
    buttonChangeSlotContent.click();
    await flush();

    // fallback content should not be hidden
    result = component.querySelector('.results1 slot-fb[name="start"]:not([hidden])');
    expect(result.textContent).toBe('slot start fallback 3');

    result = component.querySelector('.results1 section slot-fb:not([hidden])');
    expect(result.textContent).toBe('slot default fallback 3');

    result = component.querySelector('.results1 article span slot-fb[name="end"]:not([hidden])');
    expect(result.textContent).toBe('slot end fallback 3');

    // light dom content should not exist
    result = component.querySelector('.results1 content-start[slot="start"]');
    expect(result).toBe(null);

    result = component.querySelector('.results1 section content-default');
    expect(result).toBe(null);

    result = component.querySelector('.results1 article span content-end');
    expect(result).toBe(null);

    // change back to showing slot content
    buttonChangeLightDom.click();
    await flush();

    // fallback content hidden and updated content
    result = component.querySelector('.results1 slot-fb[name="start"][hidden]');
    expect(result.textContent).toBe('slot start fallback 3');

    result = component.querySelector('.results1 section slot-fb[hidden]');
    expect(result.textContent).toBe('slot default fallback 3');

    result = component.querySelector('.results1 article span slot-fb[name="end"][hidden]');
    expect(result.textContent).toBe('slot end fallback 3');

    // light dom content updated
    result = component.querySelector('.results1 content-start[slot="start"]');
    expect(result.textContent).toBe('slot light dom 2 : start');

    result = component.querySelector('.results1 section content-default');
    expect(result.textContent).toBe('slot light dom 2 : default');

    result = component.querySelector('.results1 article span content-end');
    expect(result.textContent).toBe('slot light dom 2 : end');
  });

});
