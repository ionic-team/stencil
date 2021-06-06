import { getStaticGetter, transpileModule } from './transpile';

describe('parse component', () => {
  it('"is" for "tag"', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a'
      })
      export class CmpA {}
    `);

    expect(getStaticGetter(t.outputText, 'is')).toEqual('cmp-a');
    expect(t.tagName).toBe('cmp-a');
  });

  it('componentClassName', () => {
    const t = transpileModule(`
      @Component({
        tag: 'cmp-a'
      })
      export class CmpA {}
    `);

    expect(t.componentClassName).toBe('CmpA');
  });
});
