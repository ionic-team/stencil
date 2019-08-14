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
      includeAnnotations: true,
      html: `<cmp-a>Hello</cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a class="hydrated">
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

  it('should add classes', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      render() {
        return <div class={
          ` class1
              class2
              class3 `}
        >Hello VDOM</div>;
      }
    }

    const { body, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`
    });

    expect(body).toEqualHtml(`
      <cmp-a><div class="class1 class2 class3">Hello VDOM</div></cmp-a>
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

  it('should render nested arrays', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() excitement = '';
      render() {
        const jsx = [
          <h1>H1</h1>,
          <h2>h2</h2>,
          [
            'Outside',
            <h3>h3</h3>,
          ]
        ];
        return <div>
          Text0
          {jsx}
        </div>;
      }
    }
    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });
    expect(root).toEqualHtml(`
      <cmp-a>
        <div>
          Text0
          <h1>H1</h1>
          <h2>h2</h2>
          Outside
          <h3>h3</h3>
        </div>
      </cmp-a>
    `);
  });

  it('should not render booleans ', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() excitement = '';
      render() {
        return <div>
          {false}
          hola
          {true}
        </div>;
      }
    }
    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });
    expect(root).toEqualHtml(`
      <cmp-a>
        <div>
          hola
        </div>
      </cmp-a>
    `);
  });

  describe('svg', () => {
    it('should not override classes', async () => {
      @Component({
        tag: 'cmp-a',
        styles: ':host{}',
        scoped: true
      })
      class CmpA {
        @Prop() addClass = false;
        render() {
          return (
            <svg class={{'hello': this.addClass}}></svg>
          );
        }
      }

      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
        includeAnnotations: true
      });
      expect(root).toEqualHtml(`
    <cmp-a class="hydrated sc-cmp-a-h sc-cmp-a-s">
      <svg class="sc-cmp-a"></svg>
    </cmp-a>
    `);

      root.querySelector('svg').classList.add('manual');
      root.addClass = true;
      await waitForChanges();

      expect(root).toEqualHtml(`
      <cmp-a class="hydrated sc-cmp-a-h sc-cmp-a-s">
        <svg class="manual hello sc-cmp-a"></svg>
      </cmp-a>
      `);
    });

    it('should update attributes', async () => {
      @Component({
        tag: 'svg-attr'
      })
      class SvgAttr {

        @Prop() isOpen = false;

        render() {
          return (
            <div>
              <div>
              { this.isOpen ? (
                  <svg viewBox='0 0 54 54'>
                    <rect transform='rotate(45 27 27)' y='22' width='54' height='10' rx='2'/>
                  </svg>
                ) : (
                  <svg viewBox='0 0 54 54'>
                    <rect y='0' width='54' height='10' rx='2'/>
                  </svg>
                )}
              </div>
            </div>
          );
        }
      }

      const { root, waitForChanges } = await newSpecPage({
        components: [SvgAttr],
        html: `<svg-attr></svg-attr>`,
      });

      const rect = root.querySelector('rect');
      expect(rect.getAttribute('transform')).toBe(null);

      root.isOpen = true;
      await waitForChanges();
      expect(rect.getAttribute('transform')).toBe('rotate(45 27 27)');

      root.isOpen = false;
      await waitForChanges();
      expect(rect.getAttribute('transform')).toBe(null);
    });

    it('should render foreignObject properly', async () => {
      @Component({
        tag: 'cmp-a'
      })
      class CmpA {

        render() {
          return (
            <svg class='is-svg'>
              <foreignObject class='is-svg'>
                <div class='is-html'>hello</div>
                <svg class='is-svg'>
                  <feGaussianBlur class='is-svg'></feGaussianBlur>
                  <foreignObject class='is-svg'>
                    <foreignObject class='is-html'></foreignObject>
                    <div class='is-html'>Still outside svg</div>
                  </foreignObject>
                </svg>
                <feGaussianBlur class='is-html'>bye</feGaussianBlur>
              </foreignObject>
              <feGaussianBlur class='is-svg'></feGaussianBlur>
            </svg>
          );
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      for (const el of Array.from(root.querySelectorAll('.is-html'))) {
        expect(el.namespaceURI).toEqual('http://www.w3.org/1999/xhtml');
      }
      for (const el of Array.from(root.querySelectorAll('.is-svg'))) {
        expect(el.namespaceURI).toEqual('http://www.w3.org/2000/svg');
      }

      expect(root).toEqualHtml(`
      <cmp-a>
        <svg class=\"is-svg\">
          <foreignObject class=\"is-svg\">
            <div class=\"is-html\">
              hello
            </div>
            <svg class=\"is-svg\">
              <feGaussianBlur class=\"is-svg\"></feGaussianBlur>
              <foreignObject class=\"is-svg\">
                <foreignobject class=\"is-html\"></foreignobject>
                <div class=\"is-html\">
                  Still outside svg
                </div>
              </foreignObject>
            </svg>
            <fegaussianblur class=\"is-html\">
              bye
            </fegaussianblur>
          </foreignObject>
          <feGaussianBlur class=\"is-svg\"></feGaussianBlur>
        </svg>
      </cmp-a>`);
    });
  });

  describe('native elements', () => {
    it('should render <input> correctly', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        render() {
          return <input min={0} max={10} value={5}/>;
        }
      }

      const { root } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a>
          <input max=\"10\" min=\"0\" value=\"5\">
        </cmp-a>`);
    });
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

    it('should set once', async () => {
      @Component({ tag: 'cmp-a'})
      class CmpA {
        counter = 0;
        setRef = () => {
          this.counter++;
        }
        @Prop() state = true;

        render() {
          return (this.state
            ? <div ref={this.setRef}>Hello VDOM</div>
            : <div>Hello VDOM</div>
          );
        }
      }

      const { root, rootInstance, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(rootInstance.counter).toEqual(1);

      root.state = false;
      await waitForChanges();
      expect(rootInstance.counter).toEqual(1);

      root.state = true;
      await waitForChanges();
      expect(rootInstance.counter).toEqual(2);
    });

  });
});
