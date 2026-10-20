import { h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

import { defineCustomElement } from '../test-components/custom-elements-boolean-string.js';

describe('custom-elements-boolean-string', () => {
  before(() => {
    render({
      template: () => <custom-elements-boolean-string bool="" union="" />,
    });
  });

  it('sets boolean and boolean|string props from empty attributes (#6963)', async () => {
    defineCustomElement();

    const element = document.querySelector('custom-elements-boolean-string') as HTMLElement & {
      bool: boolean;
      union: boolean | string;
    };

    await browser.waitUntil(() => element.bool === true);

    expect(element.bool).toBe(true);
    expect(element.union).toBe('');
  });
});
