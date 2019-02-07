import { transpileModule } from './transpile';


describe('parse listeners', () => {

  it('listeners', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Listen('click')
        onClick(ev: UIEvent) {
          console.log('click!');
        }
      }
    `);
    expect(t.listeners[0].name).toBe('click');
    expect(t.listeners[0].method).toBe('onClick');
  });

  it('target', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Listen('resize', { target: 'window' })
        windowResize(ev: UIEvent) {
          console.log('resize!');
        }
      }
    `);
    expect(t.listeners[0].name).toBe('resize');
    expect(t.listeners[0].method).toBe('windowResize');
    expect(t.listeners[0].target).toBe('window');
  });

  it('multiple listeners', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Listen('click')
        onClick(ev: UIEvent) {
          console.log('click!');
        }
        @Listen('mousedown')
        onMouseDown(ev: UIEvent) {
          console.log('mousedown!');
        }
      }
    `);

    expect(t.listeners[0].name).toBe('click');
    expect(t.listeners[0].method).toBe('onClick');

    expect(t.listeners[1].name).toBe('mousedown');
    expect(t.listeners[1].method).toBe('onMouseDown');
  });

  it('multiple listener decorators on same method', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Listen('touchend')
        @Listen('mouseup')
        onUp(ev: UIEvent) {
          console.log('up!');
        }
      }
    `);

    expect(t.listeners[0].name).toBe('touchend');
    expect(t.listeners[0].method).toBe('onUp');

    expect(t.listeners[1].name).toBe('mouseup');
    expect(t.listeners[1].method).toBe('onUp');
  });

});
