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
    expect(t.listeners).toEqual([{
      name: 'click',
      method: 'onClick',
      capture: false,
      disabled: false,
      passive: false,
      target: undefined
    }]);
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
    expect(t.listeners).toEqual([{
      name: 'resize',
      method: 'windowResize',
      target: 'window',
      capture: false,
      disabled: false,
      passive: true,
    }]);
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
    expect(t.listeners).toEqual([
      {
        name: 'click',
        method: 'onClick',
        capture: false,
        disabled: false,
        passive: false,
        target: undefined
      },
      {
        name: 'mousedown',
        method: 'onMouseDown',
        capture: false,
        disabled: false,
        passive: true,
        target: undefined
      }
    ]);
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
    expect(t.listeners).toEqual([
      {
        name: 'touchend',
        method: 'onUp',
        capture: false,
        disabled: false,
        passive: true,
        target: undefined
      },
      {
        name: 'mouseup',
        method: 'onUp',
        capture: false,
        disabled: false,
        passive: true,
        target: undefined
      }
    ]);
  });

  it('different defaults', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Listen('touchend', {
          capture: true,
          passive: false,
          enabled: false,
        })
        @Listen('click', { passive: true, target: 'document' })
        onEvent(ev: UIEvent) {
          console.log('up!');
        }
      }
    `);
    expect(t.listeners).toEqual([
      {
        name: 'touchend',
        method: 'onEvent',
        capture: true,
        disabled: true,
        passive: false,
        target: undefined
      },
      {
        name: 'click',
        method: 'onEvent',
        capture: false,
        disabled: false,
        passive: true,
        target: 'document'
      }
    ]);
  });
});
