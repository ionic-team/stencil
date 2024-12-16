import { render } from '@wdio/browser-runner/stencil';

import { renderToString } from '../hydrate/index.mjs';

describe('hydrated-sibling-accessors', () => {
  beforeEach(async () => {
    const { html } = await renderToString(
      `
      <hydrated-sibling-accessors>
        <p>First slot element</p>
        Default slot text node
        <p slot="second-slot">Second slot element</p>
        <!-- Default slot comment node  -->
      </hydrated-sibling-accessors>`,
      {
        fullDocument: true,
        serializeShadowRoot: true,
        constrainTimeouts: false,
      },
    );
    render({ html });
    await $('hydrated-sibling-accessors').waitForStable();
  });

  it('verifies slotted nodes next / previous sibling accessors are working', async () => {
    const root = document.querySelector('hydrated-sibling-accessors');
    expect(root.firstChild.nextSibling.textContent).toBe('First slot element');
    expect(root.firstChild.nextSibling.nextSibling.textContent).toBe(' Default slot text node ');
    expect(root.firstChild.nextSibling.nextSibling.nextSibling.textContent).toBe('Second slot element');
    expect(root.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.textContent).toBe(' ');
    expect(root.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nodeType).toBe(
      Node.COMMENT_NODE,
    );

    expect(root.lastChild.previousSibling.nodeType).toBe(Node.COMMENT_NODE);
    expect(root.lastChild.previousSibling.previousSibling.textContent).toBe(' ');
    expect(root.lastChild.previousSibling.previousSibling.previousSibling.textContent).toBe('Second slot element');
    expect(root.lastChild.previousSibling.previousSibling.previousSibling.previousSibling.textContent).toBe(
      ' Default slot text node ',
    );
    expect(
      root.lastChild.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.textContent,
    ).toBe('First slot element');
  });

  it('verifies slotted nodes next / previous sibling element accessors are working', async () => {
    const root = document.querySelector('hydrated-sibling-accessors');
    expect(root.children[0].textContent).toBe('First slot element');
    expect(root.children[0].nextElementSibling.textContent).toBe('Second slot element');
    expect(root.children[0].nextElementSibling.nextElementSibling).toBeFalsy();

    expect(root.children[0].nextElementSibling.previousElementSibling.textContent).toBe('First slot element');
  });
});
