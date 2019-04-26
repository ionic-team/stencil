import { Component, Prop, Watch, h } from '@stencil/core';
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
      html: `<cmp-b><cmp-a></cmp-a></cmp-b>`,
    });
    expect(root).toEqualHtml(`
      <cmp-b>
        <!---->
        <div>
          <cmp-a></cmp-a>
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

});
