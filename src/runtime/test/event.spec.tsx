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
        this.counter++;
      }

      @Method()
      emitEvent() {
        this.ionChange.emit();
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

    root.emitEvent();
    await flush();

    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);

    root.emitEvent();
    await flush();

    expect(root).toEqualHtml(`
      <cmp-a>2</cmp-a>
    `);
  });

});
