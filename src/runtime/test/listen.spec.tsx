import { Component, Listen, State, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('listen', () => {

  it('listen to click on host, from elm.click()', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @State() clicks = 0;

      @Listen('click')
      buttonClick() {
        this.clicks++;
      }

      render() {
        return `${this.clicks}`;
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>0</cmp-a>
    `);

    root.click();
    await waitForChanges();

    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);

    root.click();
    await waitForChanges();

    expect(root).toEqualHtml(`
      <cmp-a>2</cmp-a>
    `);
  });

  it('should listen from parent', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {

      @State() selfClicks = 0;
      @State() parentClicks = 0;
      @State() bodyClicks = 0;
      @State() documentClicks = 0;
      @State() windowClicks = 0;

      @Listen('click')
      onClick() {
        this.selfClicks++;
      }

      @Listen('click', {target: 'parent'})
      onParentClick() {
        this.parentClicks++;
      }

      @Listen('click', {target: 'body'})
      onBodyClick() {
        this.bodyClicks++;
      }

      @Listen('click', {target: 'document'})
      onDocumentClick() {
        this.documentClicks++;
      }

      @Listen('click', {target: 'window'})
      onWindowClick() {
        this.windowClicks++;
      }

      render() {
        return `${this.selfClicks},${this.parentClicks},${this.bodyClicks},${this.documentClicks},${this.windowClicks}`;
      }
    }

    const { win, doc, body, root, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `<other><parent><cmp-a></cmp-a></parent></other>`,
    });

    const parent = doc.querySelector('parent') as any;
    const other = doc.querySelector('other') as any;

    expect(root).toEqualHtml(`
      <cmp-a>0,0,0,0,0</cmp-a>
    `);


    root.click();
    await waitForChanges();
    expect(root).toEqualHtml(`
      <cmp-a>1,1,1,1,1</cmp-a>
    `);


    parent.click();
    await waitForChanges();
    expect(root).toEqualHtml(`
      <cmp-a>1,2,2,2,2</cmp-a>
    `);


    other.click();
    await waitForChanges();
    expect(root).toEqualHtml(`
      <cmp-a>1,2,3,3,3</cmp-a>
    `);

    body.click();
    await waitForChanges();
    expect(root).toEqualHtml(`
      <cmp-a>1,2,4,4,4</cmp-a>
    `);

    doc.dispatchEvent(new CustomEvent('click', {bubbles: true}));
    await waitForChanges();
    expect(root).toEqualHtml(`
      <cmp-a>1,2,4,5,5</cmp-a>
    `);

    win.dispatchEvent(new CustomEvent('click', {bubbles: true}));
    await waitForChanges();
    expect(root).toEqualHtml(`
      <cmp-a>1,2,4,5,6</cmp-a>
    `);

  });
});
