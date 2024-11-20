// @ts-expect-error will be resolved by WDIO
import { defineCustomElement } from '/test-components/event-re-register.js';

defineCustomElement();

describe('event-listener-capture using lazy load components', function () {
  const eventListenerCaptureCmp = () => $('event-re-register');

  afterEach(() => {
    const elem = document.querySelector('event-re-register') as HTMLElement;
    if (elem) {
      elem.remove();
    }
  });

  it('should only attach keydown event listener once', async () => {
    const elem = document.createElement('event-re-register') as HTMLElement;
    document.body.appendChild(elem);

    const reattach = eventListenerCaptureCmp();
    await expect(reattach).toBePresent();

    // focus on element
    await reattach.click();
    await browser.action('key').down('a').pause(100).up('a').perform();
    await browser.action('key').down('a').pause(100).up('a').perform();
    await browser.action('key').down('a').pause(100).up('a').perform();

    // check if event fired 3 times
    await expect(reattach).toHaveText(expect.stringContaining('Event fired times: 3'));

    // remove node from DOM
    elem.remove();

    // reattach node to DOM
    document.body.appendChild(elem);

    // retrigger event
    await reattach.click();
    await browser.action('key').down('a').pause(100).up('a').perform();
    await browser.action('key').down('a').pause(100).up('a').perform();
    await browser.action('key').down('a').pause(100).up('a').perform();

    // check if event fired 6 times
    await expect(reattach).toHaveText(expect.stringContaining('Event fired times: 6'));
  });
});
