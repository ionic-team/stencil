import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('global script', () => {
  beforeEach(() => {
    render({
      template: () => <global-script-test-cmp></global-script-test-cmp>,
    });
  });

  it('supports async execution', async () => {
    const cmp = await $('global-script-test-cmp');
    await cmp.waitForStable();
    const text = await cmp.$('div').getText();
    const renderedDelay = parseInt(text.slice('I am rendered after '.length));
    expect(renderedDelay).toBeGreaterThanOrEqual(1000);
  });
});
