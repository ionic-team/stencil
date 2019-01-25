import { Component, State } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('lifecycle', () => {

  it('fire lifecycle methods', async () => {

    @Component({ tag: 'cmp-a'})
    class CmpA {
      @State() willLoad = '';
      @State() didLoad = '';
      @State() willUpdate = '';
      @State() didUpdate = '';
      @State() stateChangeInRender = '';

      componentWillLoad() {
        this.willLoad = 'componentWillLoad';
      }

      componentDidLoad() {
        this.didLoad = 'componentDidLoad';
      }

      componentWillUpdate() {
        this.willUpdate = 'componentWillUpdate';
      }

      componentDidUpdate() {
        this.didUpdate = 'componentDidUpdate';
      }

      render() {
        this.stateChangeInRender = 'stateChangeInRender';
        return `${this.willLoad} ${this.didLoad} ${this.willUpdate} ${this.didUpdate} ${this.stateChangeInRender}`;
      }
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root.textContent).toBe('componentWillLoad componentDidLoad componentWillUpdate componentDidUpdate stateChangeInRender');
  });

});
