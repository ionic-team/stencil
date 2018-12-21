import { transpileModule } from './transpile';


describe('parse states', () => {

  it('state', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @State() val = null;
      }
    `);

    expect(t.outputText).toContain(`{ 'val': {} }`);
    expect(t.state.name).toBe('val');
  });

});
