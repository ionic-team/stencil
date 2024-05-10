import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('scope-id-in-nested-classname', function () {
  it('should have root scope id in the nested element as classname', async () => {
    render({
      template: () => <cmp-level-1></cmp-level-1>,
    });
    await expect($('cmp-level-3')).toHaveElementClass('sc-cmp-level-1');

    const appliedCss = await (await $('cmp-level-3')).getCSSProperty('padding');
    await expect(appliedCss.parsed.value).toBe(32);
  });

  it('should have root scope id in the user provided nested element as classname', async () => {
    render({
      template: () => (
        <cmp-level-1>
          <span id="test-element">Test</span>
        </cmp-level-1>
      ),
    });
    await expect($('#test-element')).toHaveElementClass('sc-cmp-level-1');

    const appliedCss = await (await $('#test-element')).getCSSProperty('padding');
    await expect(appliedCss.parsed.value).toBe(24);
  });
});
