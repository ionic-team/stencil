import { Component, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('SVG element', () => {
  it('should render camelCase attributes', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      render() {
        const A = 'a' as any;
        return (
          <svg id='my-svg' viewBox='0 0 100 4' preserveAspectRatio='none'>
            <A xlinkHref='/path'></A>
            <a href='/path'></a>
          </svg>
        );
      }
    }
    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`
    });
    expect(root).toEqualHtml(`
      <cmp-a>
        <svg id=\"my-svg\" preserveAspectRatio=\"none\" viewBox=\"0 0 100 4\">
          <a xlink:href="/path"></a>
          <a href="/path"></a>
        </svg>
      </cmp-a>
    `);
  });

  describe('path', () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      render() {
        return (
          <div>
            <a href='#'>Dude!!</a>
            <svg id='my-svg' viewBox='0 0 100 4' preserveAspectRatio='none'>
              <path id='my-svg-path' d='M 0,2 L 100,2' stroke='#FFEA82' stroke-width='4' fill-opacity='0' />
            </svg>
          </div>
        );
      }
    }

    let path: SVGGeometryElement;
    beforeEach(async () => {
      const page = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`
      });
      path = page.root.querySelector('#my-svg-path');
    });

    it('path namespace is SVG', () => {
      expect(path.namespaceURI).toEqual('http://www.w3.org/2000/svg');
    });

    it('allows read access to the ownerSVGElement property', () => {
      expect(path.ownerSVGElement).toEqual(null);
    });

    it('allows read access to the viewportElement property', () => {
      expect(path.viewportElement).toEqual(null);
    });

    it('allows access to the getTotalLength() method', () => {
      expect(path.getTotalLength()).toEqual(0);
    });

    it('allows access to the isPointInFill() method', () => {
      expect(path.isPointInFill()).toEqual(false);
    });

    it('allows access to the isPointInStroke() method', () => {
      expect(path.isPointInStroke()).toEqual(false);
    });
  });
});
