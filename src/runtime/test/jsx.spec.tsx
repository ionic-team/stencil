import { Component, Prop, h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('jsx', () => {

  it('render template', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @Prop() complexProp: any;
      render() {
        return <div>The answer is: {this.complexProp.value}</div>;
      }
    }

    const OBJECT = { value: 42 };
    const MyFunctionalCmp = () => (
      <cmp-a complexProp={OBJECT}></cmp-a>
    );

    const { root } = await newSpecPage({
      components: [CmpA],
      template: () => (
        <MyFunctionalCmp />
      )
    });

    expect(root).toEqualHtml(`
      <cmp-a>
        <div>
          The answer is: 42
        </div>
      </cmp-a>
    `);
  });
});
