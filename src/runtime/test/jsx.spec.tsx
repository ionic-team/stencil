import { Component, Host, Prop, State, h } from '@stencil/core';
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

  describe('event', () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {
      @State() lastEvent: any;
      render() {
        return (
          <Host
            onClick={() => this.lastEvent = 'onClick'}
            on-Click={() => this.lastEvent = 'on-Click'}
            on-scroll={() => this.lastEvent = 'on-scroll'}
            onIonChange={() => this.lastEvent = 'onIonChange'}
            on-IonChange={() => this.lastEvent = 'on-IonChange'}
            on-ALLCAPS={() => this.lastEvent = 'on-ALLCAPS'}
          >{this.lastEvent}</Host>
        );
      }
    }

    it('click', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`
      });
      root.dispatchEvent(new CustomEvent('click'));
      await waitForChanges();
      expect(root.textContent).toBe('onClick');
    });

    it('Click', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`
      });
      root.dispatchEvent(new CustomEvent('Click'));
      await waitForChanges();
      expect(root.textContent).toBe('on-Click');
    });

    it('scroll', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`
      });
      root.dispatchEvent(new CustomEvent('scroll'));
      await waitForChanges();
      expect(root.textContent).toBe('on-scroll');
    });
    it('ionChange', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`
      });
      root.dispatchEvent(new CustomEvent('ionChange'));
      await waitForChanges();
      expect(root.textContent).toBe('onIonChange');
    });
    it('IonChange', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`
      });
      root.dispatchEvent(new CustomEvent('IonChange'));
      await waitForChanges();
      expect(root.textContent).toBe('on-IonChange');
    });
    it('ALLCAPS', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`
      });
      root.dispatchEvent(new CustomEvent('ALLCAPS'));
      await waitForChanges();
      expect(root.textContent).toBe('on-ALLCAPS');
    });
  });

});
