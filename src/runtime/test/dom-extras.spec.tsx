import { Component, h, Host } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';

import { patchPseudoShadowDom } from '../../runtime/dom-extras';

describe('dom-extras - patches for non-shadow dom methods and accessors', () => {
  let specPage: SpecPage;

  const nodeOrEleContent = (node: Node | Element) => {
    return (node as Element)?.outerHTML || node?.nodeValue.trim();
  };

  beforeAll(async () => {
    @Component({
      tag: 'cmp-a',
      scoped: true,
    })
    class CmpA {
      render() {
        return (
          <Host>
            'Shadow' first text node
            <article>
              <div>
                <slot name="second-slot">Second slot fallback text</slot>
              </div>
              <div>
                <slot>Default slot fallback text</slot>
              </div>
            </article>
            'Shadow' last text node
          </Host>
        );
      }
    }

    specPage = await newSpecPage({
      components: [CmpA],
      html: `
        <cmp-a>
          Some default slot, slotted text
          <span>a default slot, slotted element</span>
          <div slot="second-slot">
            a second slot, slotted element
            <span>nested element in the second slot<span>
          </div></cmp-a>
      `,
      hydrateClientSide: true,
    });

    patchPseudoShadowDom(specPage.root);
  });

  it('patches `childNodes` to return only nodes that have been slotted', async () => {
    const childNodes = specPage.root.childNodes;

    expect(nodeOrEleContent(childNodes[0])).toBe(`Some default slot, slotted text`);
    expect(nodeOrEleContent(childNodes[1])).toBe(`<span>a default slot, slotted element</span>`);
    expect(nodeOrEleContent(childNodes[2])).toBe(``);
    expect(nodeOrEleContent(childNodes[3])).toBe(
      `<div slot="second-slot"> a second slot, slotted element <span>nested element in the second slot<span></span></span></div>`,
    );

    const innerChildNodes = specPage.root.__childNodes;

    expect(nodeOrEleContent(innerChildNodes[0])).toBe(``);
    expect(nodeOrEleContent(innerChildNodes[1])).toBe(``);
    expect(nodeOrEleContent(innerChildNodes[2])).toBe(``);
    expect(nodeOrEleContent(innerChildNodes[3])).toBe(``);
    expect(nodeOrEleContent(innerChildNodes[4])).toBe(``);
    expect(nodeOrEleContent(innerChildNodes[5])).toBe(`'Shadow' first text node`);
  });

  it('patches `children` to return only elements that have been slotted', async () => {
    const children = specPage.root.children;

    expect(nodeOrEleContent(children[0])).toBe(`<span>a default slot, slotted element</span>`);
    expect(nodeOrEleContent(children[1])).toBe(
      `<div slot="second-slot"> a second slot, slotted element <span>nested element in the second slot<span></span></span></div>`,
    );
    expect(nodeOrEleContent(children[2])).toBe(undefined);
  });

  it('patches `childElementCount` to only count elements that have been slotted', async () => {
    expect(specPage.root.childElementCount).toBe(2);
  });

  it('patches `textContent` to only return slotted node text', async () => {
    expect(specPage.root.textContent.replace(/\s+/g, ' ').trim()).toBe(
      `Some default slot, slotted text a default slot, slotted element a second slot, slotted element nested element in the second slot`,
    );
  });
});
