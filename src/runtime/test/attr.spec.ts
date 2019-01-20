import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('attr', () => {

  it('set true', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() bool: boolean;
      render() {
        return `${this.bool}`;
      }
    }

    const { body } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a bool="true"></cmp-a>`,
    });

    expect(body).toEqualHtml(`
      <cmp-a bool="true">true</cmp-a>
    `);
  });

  it('set number', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() num: number;
      render() {
        return `${this.num}`;
      }
    }

    const { body } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a num="88"></cmp-a>`,
    });

    expect(body).toEqualHtml(`
      <cmp-a num="88">88</cmp-a>
    `);

    const elm = body.querySelector('cmp-a') as any;
    expect(elm.textContent).toBe('88');
    expect(elm.num).toBe(88);
  });

  it('set string', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() txt: string;
      render() {
        return `${this.txt}`;
      }
    }

    const { body } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a txt="value"></cmp-a>`,
    });

    expect(body).toEqualHtml(`
      <cmp-a txt="value">value</cmp-a>
    `);

    const elm = body.querySelector('cmp-a') as any;
    expect(elm.textContent).toBe('value');
    expect(elm.txt).toBe('value');
  });

});
