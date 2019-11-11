import { Component, Element, Host, Prop, Watch, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('lifecycle sync', () => {

  it('should fire connected/disconnected when removed', async () => {
    let connectedCallback = 0;
    let disconnectedCallback = 0;

    @Component({ tag: 'cmp-a'})
    class CmpA {
      connectedCallback() {
        connectedCallback++;
      }
      disconnectedCallback() {
        disconnectedCallback++;
      }
    }

    const { root, doc, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });
    expect(connectedCallback).toBe(1);
    expect(disconnectedCallback).toBe(0);

    root.remove();
    await waitForChanges();

    expect(connectedCallback).toBe(1);
    expect(disconnectedCallback).toBe(1);

    doc.body.appendChild(root);
    await waitForChanges();

    expect(connectedCallback).toBe(2);
    expect(disconnectedCallback).toBe(1);
  });

  it('should not fire connected/disconnected during recolocation', async () => {
    let connectedCallback = 0;
    let disconnectedCallback = 0;

    @Component({ tag: 'cmp-a'})
    class CmpA {
      connectedCallback() {
        connectedCallback++;
      }
      disconnectedCallback() {
        disconnectedCallback++;
      }
    }

    @Component({ tag: 'cmp-b'})
    class CmpB {
      render() {
        return (
          <div>
            <slot></slot>
          </div>
        );
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA, CmpB],
      includeAnnotations: true,
      html: `<cmp-b><cmp-a></cmp-a></cmp-b>`,
    });
    expect(root).toEqualHtml(`
      <cmp-b class="hydrated">
        <!---->
        <div>
          <cmp-a class="hydrated"></cmp-a>
        </div>
      </cmp-b>
    `);

    expect(connectedCallback).toBe(1);
    expect(disconnectedCallback).toBe(0);
  });

  it('fire lifecycle methods', async () => {

    let log = '';
    @Component({ tag: 'cmp-a'})
    class CmpA {

      @Prop() prop = 0;
      @Watch('prop')
      propDidChange() {
        log += ' propDidChange';
      }

      connectedCallback() {
        log += ' connectedCallback';
      }

      disconnectedCallback() {
        log += ' disconnectedCallback';
      }

      componentWillLoad() {
        log += ' componentWillLoad';
      }

      componentDidLoad() {
        log += ' componentDidLoad';
      }

      componentWillUpdate() {
        log += ' componentWillUpdate';
      }

      componentDidUpdate() {
        log += ' componentDidUpdate';
      }

      componentWillRender() {
        log += ' componentWillRender';
      }

      componentDidRender() {
        log += ' componentDidRender';
      }

      render() {
        log += ' render';
        return log.trim();
      }
    }

    const { root, waitForChanges } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root.textContent).toBe(
      'connectedCallback componentWillLoad componentWillRender render'
    );
    expect(log.trim()).toEqual(
      'connectedCallback componentWillLoad componentWillRender render componentDidRender componentDidLoad'
    );

    log = '';
    root.prop = 1;
    await waitForChanges();

    expect(root.textContent).toBe(
      'propDidChange componentWillUpdate componentWillRender render'
    );

    expect(log.trim()).toBe(
      'propDidChange componentWillUpdate componentWillRender render componentDidRender componentDidUpdate'
    );
  });

  it('implement deep equality', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      renders = 0;
      @Prop() complex: any;

      componentShouldUpdate(newValue: any, oldValue: any) {
        try {
          return JSON.stringify(newValue) !== JSON.stringify(oldValue);
        } catch {}
        return true;
      }

      render() {
        this.renders++;
      }
    }

    const { root, rootInstance, waitForChanges } = await newSpecPage({
      components: [CmpA],
      template: () => (
        <cmp-a complexObject={[1, 2, 3]}></cmp-a>
      )
    });

    expect(rootInstance.renders).toBe(1);

    root.complex = [3, 2, 1];
    await waitForChanges();
    expect(rootInstance.renders).toBe(2);

    // Second does not trigger re-render
    root.complex = [3, 2, 1];
    await waitForChanges();
    expect(rootInstance.renders).toBe(2);
  });

  describe('childrens', () => {
    it ('sync', async () => {

      const log: string[] = [];
      @Component({
        tag: 'cmp-a'
      })
      class CmpA {
        @Prop() prop: string;
        componentWillLoad() {
          log.push('componentWillLoad a');
        }
        componentDidLoad() {
          log.push('componentDidLoad a');
        }
        componentWillUpdate() {
          log.push('componentWillUpdate a');
        }
        componentDidUpdate() {
          log.push('componentDidUpdate a');
        }
        render() {
          return (
            <Host>
              <cmp-b id='b1' prop={this.prop}>
                <cmp-b id='b2' prop={this.prop}>
                  <cmp-b id='b3' prop={this.prop}></cmp-b>
                </cmp-b>
              </cmp-b>
            </Host>
          );
        }
      }
      @Component({
        tag: 'cmp-b'
      })
      class CmpB {
        @Element() el: HTMLElement;
        @Prop() prop: string;
        componentWillLoad() {
          log.push(`componentWillLoad ${this.el.id}`);
        }
        componentDidLoad() {
          log.push(`componentDidLoad ${this.el.id}`);
        }
        componentWillUpdate() {
          log.push(`componentWillUpdate ${this.el.id}`);
        }
        componentDidUpdate() {
          log.push(`componentDidUpdate ${this.el.id}`);
        }
      }
      const {root, waitForChanges} = await newSpecPage({
        components: [CmpA, CmpB],
        template: () => <cmp-a></cmp-a>
      });
      expect(log).toEqual([
        'componentWillLoad a',
        'componentWillLoad b1',
        'componentWillLoad b2',
        'componentWillLoad b3',
        'componentDidLoad b3',
        'componentDidLoad b2',
        'componentDidLoad b1',
        'componentDidLoad a',
      ]);
      log.length = 0;
      root.forceUpdate();
      await waitForChanges();
      expect(log).toEqual([
        'componentWillUpdate a',
        'componentDidUpdate a',
      ]);

      log.length = 0;
      root.prop = 'something else';
      await waitForChanges();
      expect(log).toEqual([
        'componentWillUpdate a',
        'componentWillUpdate b1',
        'componentWillUpdate b2',
        'componentWillUpdate b3',
        'componentDidUpdate b3',
        'componentDidUpdate b2',
        'componentDidUpdate b1',
        'componentDidUpdate a',
      ]);
    });
  });
});
