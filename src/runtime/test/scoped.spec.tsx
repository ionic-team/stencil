import { Component, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('scoped', () => {
  it('should add scoped classes', async () => {
    @Component({
      tag: 'cmp-a',
      styles: ':host { color: inherit }',
      scoped: true,
    })
    class CmpA {
      render() {
        return (
          <cmp-b>
            <span>Hola</span>
          </cmp-b>
        );
      }
    }

    @Component({
      tag: 'cmp-b',
      styles: ':host { color: inherit }',
      scoped: true,
    })
    class CmpB {
      render() {
        return (
          <div>
            <slot></slot>
          </div>
        );
      }
    }
    const page = await newSpecPage({
      components: [CmpA, CmpB],
      includeAnnotations: true,
      html: `<cmp-a></cmp-a>`,
    });

    expect(page.root).toEqualHtml(`
    <cmp-a class="hydrated sc-cmp-a-h sc-cmp-a-s">
      <cmp-b class="hydrated sc-cmp-a sc-cmp-b-h sc-cmp-b-s">
        <!---->
        <div class="sc-cmp-b sc-cmp-b-s">
          <span class="sc-cmp-a">
            Hola
          </span>
        </div>
      </cmp-b>
    </cmp-a>
    `);
  });
});
