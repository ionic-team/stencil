import { transpileModule } from './transpile';


describe('parse element', () => {

  it('element', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Element() val: HTMLElement
      }
    `);

    expect(t.outputText).toContain(`static get elementRef() { return 'val'; }`);
    expect(t.elementRef).toBe('val');
  });

});
