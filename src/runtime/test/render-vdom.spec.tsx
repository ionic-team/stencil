import { Component, Element, Host, Prop, h } from '@stencil/core';
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

  it('<slot> test', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      render() {
        return <a href='#'><slot></slot></a>;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a>Hello</cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>
        <!---->
        <a href="#">Hello</a>
      </cmp-a>
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

  it('should error when reusing vnodes', async () => {

    @Component({ tag: 'cmp-a' })
    class CmpA {

      @Prop() first = '';
      @Prop() middle = '';
      @Prop() last = '';

      private getText(): string {
        return `${this.first} ${this.middle} ${this.last}`;
      }

      render() {
        const name = <b>{this.getText()}</b>;

        return (
          <div>
            <div>Hello, World! I'm {name}</div>
            <div>I repeat, I'm {name}</div>
            <div>One last time, I'm {name}</div>
          </div>
        );
      }
    }

    let error;
    try {
      await newSpecPage({
        components: [CmpA],
        html: `<cmp-a first="Stencil" last="'Don't call me a framework' JS"></cmp-a>`,
      });
    } catch (e) {
      error = e;
    }
    expect(error.message).toContain('JSX');
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

    it('should set and reset', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        divRef: HTMLElement;
        @Prop() visible = true;
        render() {
          return this.visible && <div ref={el => this.divRef = el}>Hello VDOM</div>;
        }
      }

      const { root, rootInstance, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(rootInstance.divRef).toEqual(root.querySelector('div'));
      root.visible = false;
      await waitForChanges();

      expect(rootInstance.divRef).toEqual(null);
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
