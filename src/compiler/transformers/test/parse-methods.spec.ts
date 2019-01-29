import { getStaticGetter, transpileModule } from './transpile';


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

    expect(getStaticGetter(t.outputText, 'methods')).toEqual({ 'someMethod': {
      'complexType': {
        'parameters': [],
        'returns': {
          'docs': '',
          'type': 'void',
        },
        'signature': '() => void',
      },
      'docs': {
        'text': '',
        'tags': []
      }
    } });
    expect(t.method.name).toBe('someMethod');
  });

});
