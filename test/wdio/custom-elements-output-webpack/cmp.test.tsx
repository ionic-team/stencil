import { Fragment, h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('custom-elements-output-webpack', () => {
  before(() => {
    render({
      template: () => (
        <>
          <custom-element-root></custom-element-root>
        </>
      ),
    });
  });

  it('defines components and their dependencies', async () => {
    expect(customElements.get('custom-element-root')).toBeDefined();
    expect(customElements.get('custom-element-child')).toBeDefined();
    expect(customElements.get('custom-element-nested-child')).toBeDefined();

    const elm = document.querySelector('custom-element-root');
    await browser.waitUntil(() => Boolean(elm.shadowRoot.querySelector('custom-element-child')))
    const childElm = elm.shadowRoot.querySelector('custom-element-child');
    const childNestedElm = childElm.shadowRoot.querySelector('custom-element-nested-child');

    expect(elm.shadowRoot).toBeDefined();
    expect(childElm.shadowRoot).toBeDefined();
    expect(childNestedElm.shadowRoot).toBeDefined();
  });
});
