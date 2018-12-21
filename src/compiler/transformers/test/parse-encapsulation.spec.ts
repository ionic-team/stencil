import { transpileModule } from './transpile';


describe('parse encapsulation', () => {

  it('shadow', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        shadow: true
      })
      export class CmpA {}
    `);

    expect(t.outputText).toContain(`static get encapsulation() { return 'shadow'; }`);
    expect(t.cmpCompilerMeta.encapsulation).toBe('shadow');
  });

  it('scoped', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a',
        scoped: true
      })
      export class CmpA {}
    `);

    expect(t.outputText).toContain(`static get encapsulation() { return 'scoped'; }`);
    expect(t.cmpCompilerMeta.encapsulation).toBe('scoped');
  });

  it('no encapsulation', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a'
      })
      export class CmpA {}
    `);

    expect(t.outputText).not.toContain(`static get encapsulation()`);
    expect(t.cmpCompilerMeta.encapsulation).toBe(null);
  });

});
