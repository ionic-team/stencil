import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('attr', () => {

  describe('already set', () => {

    it('set "true"', async () => {
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

    it('set "false"', async () => {
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
