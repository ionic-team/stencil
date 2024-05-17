import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('scope-id-in-nested-classname', function () {
  it('should have root scope id in the nested element as classname', async () => {
    render({
      template: () => <cmp-level-1></cmp-level-1>,
    });
    await expect($('cmp-level-3')).toHaveElementClass('sc-cmp-level-1');
    await expect($('cmp-level-3')).toHaveElementClass('sc-cmp-level-2');

    const padding = await (await $('cmp-level-3')).getCSSProperty('padding');
    await expect(padding.parsed.value).toBe(32);

    const fontWeight = await (await $('cmp-level-3')).getCSSProperty('font-weight');
    await expect(fontWeight.parsed.value).toBe(800);
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
    await expect($('#test-element')).toHaveElementClass('sc-cmp-level-2');

    const padding = await (await $('#test-element')).getCSSProperty('padding');
    await expect(padding.parsed.value).toBe(24);

    const fontWeight = await (await $('#test-element')).getCSSProperty('font-weight');
    await expect(fontWeight.parsed.value).toBe(600);
  });
});
