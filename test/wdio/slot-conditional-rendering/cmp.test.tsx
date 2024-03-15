import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('slot-conditional-rendering', function () {
  const getHeaderVisibilityToggle = () => $('#header-visibility-toggle');
  const getContentVisibilityToggle = () => $('#content-visibility-toggle');
  const getHeaderElementInLightDOM = () => $('#slotted-header-element-id');
  const getContentElementInLightDOM = () => $('#slotted-content-element-id');

  beforeEach(() => {
    render({
      template: () => (
        <slot-conditional-rendering>
          <span slot="header" id="slotted-header-element-id">
            Hello
          </span>
          <span id="slotted-content-element-id">World!</span>
        </slot-conditional-rendering>
      ),
    });
  });

  it('slots are not hidden', async () => {
    await expect(await getHeaderElementInLightDOM().getAttribute('hidden')).toBeNull();
    await expect(await getContentElementInLightDOM().getAttribute('hidden')).toBeNull();
  });

  it('header slot becomes hidden after hit the toggle button', async () => {
    await expect(await getHeaderElementInLightDOM().getAttribute('hidden')).toBeNull();

    await getHeaderVisibilityToggle()?.click();
    await expect(await getHeaderElementInLightDOM().getAttribute('hidden')).not.toBeNull();
  });

  it('content slot becomes hidden after hit the toggle button', async () => {
    await expect(await getContentElementInLightDOM().getAttribute('hidden')).toBeNull();

    await getContentVisibilityToggle()?.click();
    await expect(await getContentElementInLightDOM().getAttribute('hidden')).not.toBeNull();
  });
});
