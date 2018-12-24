import { transpileModule, getStaticGetter } from './transpile';


describe('parse methods', () => {

  it('methods', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Method()
        someMethod() {

        }
      }
    `);

    expect(getStaticGetter(t.outputText, 'methods')).toEqual({ 'someMethod': {} });
    expect(t.method.name).toBe('someMethod');
  });

});
