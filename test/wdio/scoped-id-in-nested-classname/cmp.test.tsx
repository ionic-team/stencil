import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('scope-id-in-nested-classname', function () {
  beforeEach(() => {
    render({
      template: () => <cmp-level-1></cmp-level-1>,
    });
  });

  it('should have root scope id in the nested element as classname', async () => {
    await expect($('cmp-level-3')).toHaveElementClass('sc-cmp-level-1');

    const appliedCss = await (await $('cmp-level-3')).getCSSProperty('padding');
    await expect(appliedCss.parsed.value).toBe(32);
  });
});
