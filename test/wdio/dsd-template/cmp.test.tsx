import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('dsd-template', () => {
  beforeEach(async () => {
    render({
      template: () => (
        <dsd-template>
          <template shadowrootmode="open">
            <div>Hello, World! I'm rendered from the DSD!</div>
          </template>
        </dsd-template>
      ),
    });
  });

  it('should render', async () => {
    await expect($('dsd-template')).toHaveText("Hello, World! I'm rendering!");
  });
});
