import { h } from '@stencil/core';
import { render, waitForChanges } from '@wdio/browser-runner/stencil';

describe('slot-fallback-with-textnode', function () {
  beforeEach(() => {
    render({
      template: () => <my-component></my-component>,
    });
  });

  it('should hide fallback content when provided slot is text node', async () => {
    await $('#toggle-button').click();
    await waitForChanges();

    await expect((await $('.container').getText()).includes('DEFAULT')).toBe(false);
    await expect((await $('.container').getText()).includes('JD')).toBe(true);
  });
});
