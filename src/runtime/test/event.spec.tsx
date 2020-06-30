import { Component, Event, EventEmitter, Listen, Method, State } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

describe('event', () => {
  it('event normal ionChange event', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      @Event() ionChange: EventEmitter;

      @State() counter = 0;

      @Listen('ionChange')
      onIonChange() {
        this.counter++;
      }

      @Method()
      emitEvent() {
        const event = this.ionChange.emit();
        expect(event.type).toEqual('ionChange');
      }

      render() {
        return `${this.counter}`;
      }
    }

    const page = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(page.root).toEqualHtml(`
      <cmp-a>0</cmp-a>
    `);

    await page.root.emitEvent();
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);

    let called = false;
    page.root.addEventListener('ionChange', (ev: CustomEvent) => {
      expect(ev.bubbles).toBe(true);
      expect(ev.cancelable).toBe(true);
      expect(ev.composed).toBe(true);
      called = true;
    });

    await page.root.emitEvent();
    await page.waitForChanges();

    expect(called).toBe(true);
    expect(page.root).toEqualHtml(`
      <cmp-a>2</cmp-a>
    `);
  });

  it('should set Event in constructor before users constructor statements', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      constructor() {
        this.style.emit();
      }
      @Event() style: EventEmitter;
    }

    const { root } = await newSpecPage({
      components: [CmpA],
      html: `<cmp-a></cmp-a>`,
    });

    expect(root).toEqualHtml(`
      <cmp-a></cmp-a>
    `);
  });

  it('should have custom name', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      @Event({ eventName: 'ionStyle' }) style: EventEmitter;
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

    const { root, waitForChanges } = await newSpecPage({
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
    await waitForChanges();

    expect(called).toBe(true);
    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);
  });

  it('should have different default settings', async () => {
    @Component({ tag: 'cmp-a' })
    class CmpA {
      @Event({
        eventName: 'ionStyle',
        bubbles: false,
        composed: false,
        cancelable: false,
      })
      style: EventEmitter;

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

    const { root, waitForChanges } = await newSpecPage({
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
    await waitForChanges();

    expect(called).toBe(true);

    expect(root).toEqualHtml(`
      <cmp-a>1</cmp-a>
    `);
  });

  describe('KeyboardEvent', () => {
    it('can be dispatched', async () => {
      @Component({ tag: 'cmp-a' })
      class CmpA {
        @State() counter = 0;

        @Listen('keydown')
        onKeyDown() {
          this.counter++;
        }

        render() {
          return `${this.counter}`;
        }
      }

      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a>0</cmp-a>
      `);

      const ev = new KeyboardEvent('keydown');
      root.dispatchEvent(ev);
      await waitForChanges();

      expect(root).toEqualHtml(`
        <cmp-a>1</cmp-a>
      `);
    });

    it('can be dispatched with custom data', async () => {
      @Component({ tag: 'cmp-a' })
      class CmpA {
        @State() key: string;
        @State() shift: string;

        @Listen('keydown')
        onKeyDown(ev: KeyboardEvent) {
          this.key = ev.key;
          this.shift = ev.shiftKey ? 'Yes' : 'No';
        }

        render() {
          return `${this.key || ''} - ${this.shift || ''}`;
        }
      }

      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a> - </cmp-a>
      `);

      const ev = new KeyboardEvent('keydown', { key: 'A', shiftKey: true });
      root.dispatchEvent(ev);
      await waitForChanges();

      expect(root).toEqualHtml(`
        <cmp-a>A - Yes</cmp-a>
      `);
    });
  });

  describe('MouseEvent', () => {
    it('can be dispatched', async () => {
      @Component({ tag: 'cmp-a' })
      class CmpA {
        @State() counter = 0;

        @Listen('onclick')
        onClick() {
          this.counter++;
        }

        render() {
          return `${this.counter}`;
        }
      }

      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a>0</cmp-a>
      `);

      const ev = new MouseEvent('onclick');
      root.dispatchEvent(ev);
      await waitForChanges();

      expect(root).toEqualHtml(`
        <cmp-a>1</cmp-a>
      `);
    });

    it('can be dispatched with custom data', async () => {
      @Component({ tag: 'cmp-a' })
      class CmpA {
        @State() screenX: string;
        @State() shift: string;

        @Listen('onclick')
        onClick(ev: MouseEvent) {
          this.screenX = ev.screenX.toString();
          this.shift = ev.shiftKey ? 'Yes' : 'No';
        }

        render() {
          return `${this.screenX || ''} - ${this.shift || ''}`;
        }
      }

      const { root, waitForChanges } = await newSpecPage({
        components: [CmpA],
        html: `<cmp-a></cmp-a>`,
      });

      expect(root).toEqualHtml(`
        <cmp-a> - </cmp-a>
      `);

      const ev = new MouseEvent('onclick', { screenX: 99, shiftKey: true });
      root.dispatchEvent(ev);
      await waitForChanges();

      expect(root).toEqualHtml(`
        <cmp-a>99 - Yes</cmp-a>
      `);
    });
  });
});
