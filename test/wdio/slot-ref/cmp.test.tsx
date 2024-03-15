import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('slot-ref', function () {
  beforeEach(() => {
    render({
      flushQueue: true,
      template: () => (
        <slot-ref>
          <span slot="title" id="slotted-element-id">
            Hello World!
          </span>
        </slot-ref>
      ),
    });
  });

  it('ref callback of slot is called', async () => {
    const host = $('slot-ref');
    await expect(await host.getAttribute('data-ref-id')).toBe('slotted-element-id');
    await expect(await host.getAttribute('data-ref-tagname')).toBe('SPAN');
  });
});
