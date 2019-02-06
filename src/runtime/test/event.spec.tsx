import { Component, Event, EventEmitter, Listen, Method, State } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';


describe('event', () => {

  it('event normal ionChange event', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {

      @Event() ionChange: EventEmitter;

      @State() counter = 0;

      @Listen('ionChange')
      onIonChange() {
        console.log(this, 'HEYYYY', this.counter);
        this.counter++;
        console.log(this.counter);
      }

      @Method()
      emitEvent() {
        console.log('METHOD');
        this.ionChange.emit();
      }

      render() {
        console.log('render()');
        return `${this.counter}`;
      }
    }

    const { root, flush } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>0</cmp-a>
    `);

    await root.emitEvent();
    await flush();

    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);

    let called = false;
    root.addEventListener('ionChange', (ev: CustomEvent) => {
      expect(ev.bubbles).toBe(true);
      expect(ev.cancelable).toBe(true);
      expect(ev.composed).toBe(true);
      called = true;
    });

    await root.emitEvent();
    await flush();

    expect(called).toBe(true);
    expect(root).toEqualHtml(`
      <cmp-a>2</cmp-a>
    `);
  });

  it('should have custom name', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {

      @Event({eventName: 'ionStyle'}) style: EventEmitter;
      @State() counter = 0;

      @Listen('ionStyle')
      onIonStyle() {
        this.counter++;
      }

      @Method()
      emitEvent() {
        this.style.emit();
      }

      render() {
        return `${this.counter}`;
      }
    }

    const { root, flush } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>0</cmp-a>
    `);

    let called = false;
    root.addEventListener('ionStyle', (ev: CustomEvent) => {
      expect(ev.bubbles).toBe(true);
      expect(ev.cancelable).toBe(true);
      expect(ev.composed).toBe(true);
      called = true;
    });
    await root.emitEvent();
    await flush();

    expect(called).toBe(true);
    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);
  });

  it('should have different default settings', async () => {
    @Component({ tag: 'cmp-a'})
    class CmpA {

      @Event({
        eventName: 'ionStyle',
        bubbles: false,
        composed: false,
        cancelable: false,
      }) style: EventEmitter;

      @State() counter = 0;

      @Listen('ionStyle')
      onIonStyle() {
        this.counter++;
      }

      @Method()
      emitEvent() {
        this.style.emit();
      }

      render() {
        return `${this.counter}`;
      }
    }

    const { root, flush } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a>0</cmp-a>
    `);

    let called = false;
    root.addEventListener('ionStyle', (ev: CustomEvent) => {
      expect(ev.bubbles).toBe(false);
      expect(ev.cancelable).toBe(false);
      expect(ev.composed).toBe(false);
      called = true;
    });
    await root.emitEvent();
    await flush();

    expect(called).toBe(true);

    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);
  });
});
