import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('attr', () => {

  it('multi-word attribute', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() multiWord: string;
      render() {
        return `${this.multiWord}`;
      }
    }

    const { body } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a multi-word="multi-word"></cmp-a>`,
    });

    expect(body).toEqualHtml(`
      <cmp-a multi-word="multi-word">multi-word</cmp-a>
    `);

    const elm = body.querySelector('cmp-a') as any;
    expect(elm.textContent).toBe('multi-word');
    expect(elm.multiWord).toBe('multi-word');
  });

  it('custom attribute name', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop({ attr: 'some-customName' }) customAttr: string;
      render() {
        return `${this.customAttr}`;
      }
    }

    const { body } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a some-customName="some-customName"></cmp-a>`,
    });

    expect(body).toEqualHtml(`
      <cmp-a some-customName="some-customName">some-customName</cmp-a>
    `);

    const elm = body.querySelector('cmp-a') as any;
    expect(elm.textContent).toBe('some-customName');
    expect(elm.customAttr).toBe('some-customName');
  });

  describe('already set', () => {

    it('set boolean, "false"', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() bool: boolean;
        render() {
          return `${this.bool}`;
        }
      }

      const { body } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a bool="false"></cmp-a>`,
      });

      expect(body).toEqualHtml(`
        <cmp-a bool="false">false</cmp-a>
      `);

      const elm = body.querySelector('cmp-a') as any;
      expect(elm.textContent).toBe('false');
      expect(elm.bool).toBe(false);
    });

    it('set boolean, undefined when missing attribute', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() bool: boolean;
        render() {
          return `${this.bool}`;
        }
      }

      const { body } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(body).toEqualHtml(`
        <cmp-a>undefined</cmp-a>
      `);

      const elm = body.querySelector('cmp-a') as any;
      expect(elm.textContent).toBe('undefined');
      expect(elm.bool).toBe(undefined);
    });

    it('set boolean, "true"', async () => {
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

      const elm = body.querySelector('cmp-a') as any;
      expect(elm.textContent).toBe('true');
      expect(elm.bool).toBe(true);
    });

    it('set boolean true from no attribute value', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() bool: boolean;
        render() {
          return `${this.bool}`;
        }
      }

      const { body } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a bool></cmp-a>`,
      });

      expect(body).toEqualHtml(`
        <cmp-a bool>true</cmp-a>
      `);

      const elm = body.querySelector('cmp-a') as any;
      expect(elm.textContent).toBe('true');
      expect(elm.bool).toBe(true);
    });

    it('set boolean true from empty string', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() bool: boolean;
        render() {
          return `${this.bool}`;
        }
      }

      const { body } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a bool=""></cmp-a>`,
      });

      expect(body).toEqualHtml(`
        <cmp-a bool="">true</cmp-a>
      `);

      const elm = body.querySelector('cmp-a') as any;
      expect(elm.textContent).toBe('true');
      expect(elm.bool).toBe(true);
    });

    it('set zero', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() num: number;
        render() {
          return `${this.num}`;
        }
      }

      const { body } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a num="0"></cmp-a>`,
      });

      expect(body).toEqualHtml(`
        <cmp-a num="0">0</cmp-a>
      `);

      const elm = body.querySelector('cmp-a') as any;
      expect(elm.textContent).toBe('0');
      expect(elm.num).toBe(0);
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
        @Prop() str: string;
        render() {
          return `${this.str}`;
        }
      }

      const { body } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a str="string"></cmp-a>`,
      });

      expect(body).toEqualHtml(`
        <cmp-a str="string">string</cmp-a>
      `);

      const elm = body.querySelector('cmp-a') as any;
      expect(elm.textContent).toBe('string');
      expect(elm.str).toBe('string');
    });

    it('set empty string', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() str: string;
        render() {
          return `${this.str}`;
        }
      }

      const { body } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a str=""></cmp-a>`,
      });

      expect(body).toEqualHtml(`
        <cmp-a str=""></cmp-a>
      `);

      const elm = body.querySelector('cmp-a') as any;
      expect(elm.textContent).toBe('');
      expect(elm.str).toBe('');
    });

  });

});
