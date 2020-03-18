import { getStaticGetter, transpileModule } from './transpile';

describe('parse states', () => {
  it('state', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @State() val = null;
      }
    `);

    expect(getStaticGetter(t.outputText, 'states')).toEqual({ val: {} });
    expect(t.state).toEqual({
      name: 'val',
    });
  });
});
