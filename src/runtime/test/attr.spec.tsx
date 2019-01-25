import { Component, Prop } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('attribute', () => {

  it('multi-word attribute', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() multiWord: string;
      render() {
        return `${this.multiWord}`;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a multi-word="multi-word"></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a multi-word="multi-word">multi-word</cmp-a>
    `);

    expect(root.textContent).toBe('multi-word');
    expect(root.multiWord).toBe('multi-word');
  });

  it('custom attribute name', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop({ attribute: 'some-customName' }) customAttr: string;
      render() {
        return `${this.customAttr}`;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a some-customName="some-customName"></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a some-customName="some-customName">some-customName</cmp-a>
    `);

    expect(root.textContent).toBe('some-customName');
    expect(root.customAttr).toBe('some-customName');
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

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a bool="false"></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a bool="false">false</cmp-a>
      `);

      expect(root.textContent).toBe('false');
      expect(root.bool).toBe(false);
    });

    it('set boolean, undefined when missing attribute', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() bool: boolean;
        render() {
          return `${this.bool}`;
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a>undefined</cmp-a>
      `);

      expect(root.textContent).toBe('undefined');
      expect(root.bool).toBe(undefined);
    });

    it('set boolean, "true"', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() bool: boolean;
        render() {
          return `${this.bool}`;
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a bool="true"></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a bool="true">true</cmp-a>
      `);

      expect(root.textContent).toBe('true');
      expect(root.bool).toBe(true);
    });

    it('set boolean true from no attribute value', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() bool: boolean;
        render() {
          return `${this.bool}`;
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a bool></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a bool>true</cmp-a>
      `);

      expect(root.textContent).toBe('true');
      expect(root.bool).toBe(true);
    });

    it('set boolean true from empty string', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() bool: boolean;
        render() {
          return `${this.bool}`;
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a bool=""></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a bool="">true</cmp-a>
      `);

      expect(root.textContent).toBe('true');
      expect(root.bool).toBe(true);
    });

    it('set zero', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() num: number;
        render() {
          return `${this.num}`;
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a num="0"></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a num="0">0</cmp-a>
      `);

      expect(root.textContent).toBe('0');
      expect(root.num).toBe(0);
    });

    it('set number', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() num: number;
        render() {
          return `${this.num}`;
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a num="88"></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a num="88">88</cmp-a>
      `);

      expect(root.textContent).toBe('88');
      expect(root.num).toBe(88);
    });

    it('set string', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() str: string;
        render() {
          return `${this.str}`;
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a str="string"></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a str="string">string</cmp-a>
      `);

      expect(root.textContent).toBe('string');
      expect(root.str).toBe('string');
    });

    it('set empty string', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        @Prop() str: string;
        render() {
          return `${this.str}`;
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a str=""></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a str=""></cmp-a>
      `);

      expect(root.textContent).toBe('');
      expect(root.str).toBe('');
    });

  });

});
