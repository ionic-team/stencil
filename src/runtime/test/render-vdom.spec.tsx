import { Component, Prop, h, Host, Element } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('render-vdom', () => {

  it('Hello VDOM, re-render, flush', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() excitement = '';
      render() {
        return <div>Hello VDOM{this.excitement}</div>;
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a><div>Hello VDOM</div></cmp-a>
    `);

    root.excitement = `!`;
    await waitForChanges();

    expect(root).toEqualHtml(`
      <cmp-a><div>Hello VDOM!</div></cmp-a>
    `);

    root.excitement = `!!`;
    await waitForChanges();

    expect(root).toEqualHtml(`
      <cmp-a><div>Hello VDOM!!</div></cmp-a>
    `);
  });

  it('Hello VDOM, html option', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      render() {
        return <div>Hello VDOM</div>;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a><div>Hello VDOM</div></cmp-a>
    `);
  });

  it('Hello VDOM, body.innerHTML, await flush', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      render() {
        return <div>Hello VDOM</div>;
      }
    }

    const { body, waitForChanges } = await newSpecPage({
      components: [CmpA]
    });

    body.innerHTML = `<cmp-a></cmp-a>`;
    await waitForChanges();

    expect(body).toEqualHtml(`
      <cmp-a><div>Hello VDOM</div></cmp-a>
    `);
  });

  describe('ref property', () => {
    it('should set on Host', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {

        selfRef: HTMLElement;
        @Element() el: HTMLElement;

        render() {
          return <Host ref={el => this.selfRef = el}></Host>;
        }
      }

      const { root, rootInstance } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(rootInstance.el).toEqual(root);
      expect(rootInstance.el).toEqual(rootInstance.selfRef);
    });

    it('should set', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        divRef: HTMLElement;
        render() {
          return <div ref={el => this.divRef = el}>Hello VDOM</div>;
        }
      }

      const { root, rootInstance } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(rootInstance.divRef).toEqual(root.querySelector('div'));
    });

    it('should set once', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        divRef: HTMLElement;
        counter = 0;
        setRef = () => {
          this.counter++;
        }

        render() {
          return <div ref={this.setRef}>Hello VDOM</div>;
        }
      }

      const { root, rootInstance, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(rootInstance.counter).toEqual(1);
      root.forceUpdate();
      await waitForChanges();

      expect(rootInstance.counter).toEqual(1);
    });
  });
});
