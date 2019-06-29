import { Component, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('SVG element', () => {
  @Component({ tag: 'cmp-a' })
  class CmpA {
    render() {
      return (
        <div>
          <a href="#">Dude!!</a>
          <svg id="my-svg" viewBox="0 0 100 4" preserveAspectRatio="none">
            <path id="my-svg-path" d="M 0,2 L 100,2" stroke="#FFEA82" stroke-width="4" fill-opacity="0" />
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
