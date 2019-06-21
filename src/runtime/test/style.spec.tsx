import { Component } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('style', () => {

  it('get style string', async () => {
    @Component({
      tag: 'cmp-a',
      styles: `div { color: red; }`
    })
    class CmpA {
      render() {
        return `innertext`;
      }
    }

    const { root, styles } = await newSpecPage({
      components: [CmpA],
      includeAnnotations: true,
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toHaveClass('hydrated');
    expect(styles.get('CMP-A')).toBe(`div { color: red; }`);
  });

});
