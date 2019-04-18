import { Component, Prop, Watch, State } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('lifecycle', () => {

  it('wait for willLoad', async () => {

    @Component({ tag: 'cmp-a'})
    class CmpA {

      componentWillLoad() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 10);
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

    const { root, flush } = await newSpecPage({
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
    await flush();

    expect(log.trim()).toBe(
      'propDidChange componentWillUpdate componentWillRender render componentDidRender componentDidUpdate'
    );
  });

});
