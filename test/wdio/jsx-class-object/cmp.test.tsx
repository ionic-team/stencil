import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';
import { $, expect } from '@wdio/globals';

describe('jsx-class-object', function () {
  beforeEach(() => {
    render({
      components: [],
      template: () => <jsx-class-object></jsx-class-object>,
    });
  });

  it('read json content', async () => {
    await expect($('jsx-class-object')).toHaveText(`Hello World!How are you?
Answer: good`);
  });
});
