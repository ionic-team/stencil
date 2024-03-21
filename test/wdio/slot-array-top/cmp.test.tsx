import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('slot array top', () => {
  beforeEach(async () => {
    render({
      template: () => (
        <slot-array-top>
          <p>Slotted content should be on bottom</p>
        </slot-array-top>
      ),
    });
  });

  it('renders slotted content in the right position', async () => {
    const root = $('slot-array-top')
    await expect(root).toHaveText(
      'Content should be on top\nSlotted content should be on bottom');
    await expect($('[hidden]')).not.toBeExisting();
  });
});
