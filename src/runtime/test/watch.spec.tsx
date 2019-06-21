import { Component, Prop, State, Watch } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('watch', () => {

  it('watch is called each time a prop changes', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      method1Called = 0;
      method2Called = 0;

      @Prop() prop1 = 1;
      @State() someState = 'hello';

      @Watch('prop1')
      @Watch('someState')
      method1() {
        this.method1Called++;
      }

      @Watch('prop1')
      method2() {
        this.method2Called++;
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

  it('should Watch correctly', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      watchCalled = 0;

      @Prop() prop = 10;
      @Prop() value = 10;
      @State() someState = 'default';

      @Watch('prop')
      @Watch('value')
      @Watch('someState')
      method() {
        this.watchCalled++;
      }

      componentWillLoad() {
        expect(this.watchCalled).toBe(0);
        this.prop = 1;
        expect(this.watchCalled).toBe(1);
        this.value = 1;
        expect(this.watchCalled).toBe(2);
        this.someState = 'hello';
        expect(this.watchCalled).toBe(3);
      }

      componentDidLoad() {
        expect(this.watchCalled).toBe(3);
        this.prop = 1;
        this.value = 1;
        this.someState = 'hello';
        expect(this.watchCalled).toBe(3);
        this.prop = 20;
        this.value = 30;
        this.someState = 'bye';
        expect(this.watchCalled).toBe(6);
      }
    }

    const { root, rootInstance } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a prop="123"></cmp-a>`,
    });
    expect(rootInstance.watchCalled).toBe(6);
    spyOn(rootInstance, 'method');

    // trigger updates in element
    root.prop = 1000;
    expect(rootInstance.method).toHaveBeenLastCalledWith(1000, 20, 'prop');

    root.value = 1300;
    expect(rootInstance.method).toHaveBeenLastCalledWith(1300, 30, 'value');
  });
});
