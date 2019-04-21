import { Component, Prop, Watch } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('lifecycle async', () => {

  it('wait for componentWillLoad', async () => {

    @Component({ tag: 'cmp-a'})
    class CmpA {
      componentWillLoad() {
        return new Promise(resolve => {
          setTimeout(resolve);
        });
      }

      render() {
        return 'Loaded';
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root.textContent).toBe(
      'Loaded'
    );
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
        return new Promise(resolve => {
          setTimeout(() => {
            log += ' componentWillLoad';
            resolve();
          });
        });
      }

      componentDidLoad() {
        log += ' componentDidLoad';
      }

      componentWillUpdate() {
        return new Promise(resolve => {
          setTimeout(() => {
            log += ' componentWillUpdate';
            resolve();
          });
        });
      }

      componentDidUpdate() {
        log += ' componentDidUpdate';
      }

      componentWillRender() {
        return new Promise(resolve => {
          setTimeout(() => {
            log += ' componentWillRender';
            resolve();
          });
        });
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

    expect(log.trim()).toBe(
      'propDidChange componentWillUpdate componentWillRender render componentDidRender componentDidUpdate'
    );
  });

});
