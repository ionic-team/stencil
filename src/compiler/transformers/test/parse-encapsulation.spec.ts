import { getStaticGetter, transpileModule } from './transpile';


describe('parse encapsulation', () => {

  it('shadow', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        shadow: true
      })
      export class CmpA {}
    `);

    expect(getStaticGetter(t.outputText, 'encapsulation')).toEqual('shadow');
    expect(t.cmp.encapsulation).toBe('shadow');
  });

  it('scoped', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        scoped: true
      })
      export class CmpA {}
    `);

    expect(getStaticGetter(t.outputText, 'encapsulation')).toEqual('scoped');
    expect(t.cmp.encapsulation).toBe('scoped');
  });

  it('no encapsulation', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a'
      })
      export class CmpA {}
    `);

    expect(t.outputText).not.toContain(`static get encapsulation()`);
    expect(t.cmp.encapsulation).toBe('none');
  });

});
