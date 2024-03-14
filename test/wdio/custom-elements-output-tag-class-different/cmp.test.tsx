import { Fragment, h } from '@stencil/core';
import { render } from '@wdio/browser-runner/stencil';

describe('custom-elements-output-tag-class-different', () => {
  before(() => {
    render({
      template: () => (
        <>
          <custom-element-root-different-name-than-class></custom-element-root-different-name-than-class>
        </>
      )
    });
  });

  it('defines components and their dependencies', async () => {
    expect(customElements.get('custom-element-root-different-name-than-class')).toBeDefined();

    const elm = document.querySelector('custom-element-root-different-name-than-class');
    expect(elm.shadowRoot).toBeDefined();

    const childElm = elm.shadowRoot.querySelector('custom-element-child-different-name-than-class');
    expect(childElm.shadowRoot).toBeDefined();
  });
});
