import { transpileModule } from './transpile';


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

    expect(t.outputText).toContain(`static get methods() { return { 'someMethod': {} }; }`);
    expect(t.method.name).toBe('someMethod');
  });

});
