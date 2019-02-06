import { Component, Prop, State, Watch } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';


describe('watch', () => {

  it('watch is called each time a prop changes', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      method1Called = 0;
      method2Called = 0;

      @Prop() prop1 = 42;
      @State() someState = 'default';

      @Watch('prop1')
      @Watch('someState')
      method1() {
        this.method1Called++;
      }

      @Watch('prop1')
      method2() {
        this.method2Called++;
      }

      componentWillLoad() {
        this.prop1 = 1;
        this.someState = 'hello';
      }

      componentDidLoad() {
        expect(this.method1Called).toBe(0);
        expect(this.method2Called).toBe(0);
        expect(this.prop1).toBe(1);
        expect(this.someState).toBe('hello');
      }
    }

    const { root, rootInstance } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });
    console.log(rootInstance);
    spyOn(rootInstance, 'method1');
    spyOn(rootInstance, 'method2');

    // set same values, watch should not be called
    root.prop1 = 1;
    rootInstance.someState = 'hello';
    expect(rootInstance.method1).toHaveBeenCalledTimes(0);
    expect(rootInstance.method2).toHaveBeenCalledTimes(0);

    // set different values
    root.prop1 = 100;
    expect(rootInstance.method1).toHaveBeenCalledTimes(1);
    expect(rootInstance.method1).toHaveBeenLastCalledWith(100, 1, 'prop1');
    expect(rootInstance.method2).toHaveBeenCalledTimes(1);
    expect(rootInstance.method2).toHaveBeenLastCalledWith(100, 1, 'prop1');

    rootInstance.someState = 'bye';
    expect(rootInstance.method2).toHaveBeenCalledTimes(1);
    expect(rootInstance.method1).toHaveBeenLastCalledWith('bye', 'hello', 'someState');
  });

});
