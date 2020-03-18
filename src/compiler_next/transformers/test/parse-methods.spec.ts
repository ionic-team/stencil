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

    expect(getStaticGetter(t.outputText, 'methods')).toEqual({
      someMethod: {
        complexType: {
          parameters: [],
          return: 'void',
          references: {},
          signature: '() => void',
        },
        docs: {
          text: '',
          tags: [],
        },
      },
    });

    expect(t.method).toEqual({
      complexType: {
        parameters: [],
        return: 'void',
        references: {},
        signature: '() => void',
      },
      docs: {
        tags: [],
        text: '',
      },
      internal: false,
      name: 'someMethod',
    });
  });
});
