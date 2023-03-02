import { Component, h, Host } from '@stencil/core';
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { patchPseudoShadowDom } from '../../runtime/dom-extras';

describe('dom-extras - patches for non-shadow dom methods and accessors', () => {
  let specPage: SpecPage;

  const nodeOrEle = (node: Node | Element) => {
    return (node as Element)?.outerHTML || node?.nodeValue.trim();
  };

  beforeAll(async () => {
    @Component({
      tag: 'cmp-a',
      shadow: false,
    })
    class CmpA {
      render() {
        return (
          <Host>
            first shadow node
            <article>
              <div>
                <slot name="second-slot">fallback text</slot>
              </div>
              <div>
                <slot>fallback text</slot>
              </div>
            </article>
            last shadow node
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
    });

    patchPseudoShadowDom(specPage.root, specPage.root);
  });

  it('childNodes', async () => {
    const childNodes = specPage.root.childNodes;

    expect(nodeOrEle(childNodes[0])).toBe(`Some default slot, slotted text`);
    expect(nodeOrEle(childNodes[1])).toBe(`<span>a default slot, slotted element</span>`);
    expect(nodeOrEle(childNodes[2])).toBe(``);
    expect(nodeOrEle(childNodes[3])).toBe(
      `<div slot="second-slot"> a second slot, slotted element <span>nested element in the second slot<span></span></span></div>`
    );

    const innerChildNodes = specPage.root.__childNodes;

    expect(nodeOrEle(innerChildNodes[0])).toBe(``);
    expect(nodeOrEle(innerChildNodes[1])).toBe(``);
    expect(nodeOrEle(innerChildNodes[2])).toBe(``);
    expect(nodeOrEle(innerChildNodes[3])).toBe(``);
    expect(nodeOrEle(innerChildNodes[4])).toBe(``);
    expect(nodeOrEle(innerChildNodes[5])).toBe(`first shadow node`);
  });

  it('children', async () => {
    const children = specPage.root.children;

    expect(nodeOrEle(children[0])).toBe(`<span>a default slot, slotted element</span>`);
    expect(nodeOrEle(children[1])).toBe(
      `<div slot="second-slot"> a second slot, slotted element <span>nested element in the second slot<span></span></span></div>`
    );
    expect(nodeOrEle(children[2])).toBe(undefined);
  });

  it('firstChild', async () => {
    expect(nodeOrEle(specPage.root.firstChild)).toBe(`Some default slot, slotted text`);
  });

  it('lastChild', async () => {
    expect(nodeOrEle(specPage.root.lastChild)).toBe(
      `<div slot=\"second-slot\"> a second slot, slotted element <span>nested element in the second slot<span></span></span></div>`
    );
  });

  it('childElementCount', async () => {
    expect(specPage.root.childElementCount).toBe(2);
  });

  it('innerHTML', async () => {
    expect(specPage.root.innerHTML.trim()).toBe(`Some default slot, slotted text
          <span>a default slot, slotted element</span>
          <div slot=\"second-slot\"> a second slot, slotted element <span>nested element in the second slot<span></span></span></div>`);
  });

  it('innerText', async () => {
    expect(specPage.root.innerText.trim()).toBe(`Some default slot, slotted texta default slot, slotted element
            a second slot, slotted element
            nested element in the second slot`);
  });

  it('textContent', async () => {
    expect(specPage.root.textContent.replace(/\s+/g, ' ').trim()).toBe(
      `Some default slot, slotted text a default slot, slotted element a second slot, slotted element nested element in the second slot`
    );
  });
});
