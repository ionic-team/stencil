import { Component } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('globals', () => {
  @Component({
    tag: 'cmp-a',
  })
  class CmpA {}

  it('should add hydrated to <html> if no component is used', async () => {
    const page = await newSpecPage({
      components: [CmpA],
      html: `<p>No component used</p>`,
      includeAnnotations: true,
    });
    const html = page.doc.documentElement;
    expect(html.classList.contains('hydrated')).toBe(false);
    await new Promise((resolve) => {
      setTimeout(() => {
        expect(html.classList.contains('hydrated')).toBe(true);
        resolve();
      }, 100);
    });
  });

  it('should add hydrated to <html> if component is used', async () => {
    const page = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
      includeAnnotations: true,
    });
    const html = page.doc.documentElement;
    expect(html.classList.contains('hydrated')).toBe(true);
  });

  it('should hide non hydrated components', async () => {
    @Component({
      tag: 'cmp-b',
    })
    class CmpB {}

    const { doc } = await newSpecPage({
      components: [CmpA, CmpB],
      includeAnnotations: true,
    });
    expect(doc.head.children[0]).toEqualHtml(`
      <style data-styles>
        cmp-a,cmp-b{visibility:hidden}.hydrated{visibility:inherit}
      </style>
    `);
  });
});
