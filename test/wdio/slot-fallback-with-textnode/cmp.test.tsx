import { h } from '@stencil/core';
import { render, waitForChanges } from '@wdio/browser-runner/stencil';

describe('slot-fallback-with-textnode', function () {
  beforeEach(() => {
    render({
      template: () => <my-component></my-component>,
    });
  });

  it('should hide fallback content when provided slot is text node', async () => {
    await expect($('.container')).toHaveText(expect.stringContaining('DEFAULT'))
    await $('#toggle-button').click();
    await waitForChanges();

    await expect($('.container')).not.toHaveText(expect.stringContaining('DEFAULT'));
    await expect($('.container')).toHaveText(expect.stringContaining('JD'));
  });
});
