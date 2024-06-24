import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('slot-ref', () => {
  beforeEach(async () => {
    render({
      template: () => (
        <slot-ref>
          <span slot="title" id="slotted-element-id">
            Hello World!
          </span>
        </slot-ref>
      ),
    });

    await $('slot-ref').waitForExist();
  });

  it('ref callback of slot is called', async () => {
    await expect($('slot-ref')).toHaveAttribute('data-ref-id', 'slotted-element-id');
    await expect($('slot-ref')).toHaveAttribute('data-ref-tagname', 'SPAN');
  });
});
