import { transpileModule } from './transpile';

describe('parse static members', () => {
  it('places a static getter on the component', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        static myStatic = 'a value';

        render() {
          return <div>Hello, I have {CmpA.myStatic}</div>
        }
      }
    `);

    expect(t.outputText.includes('static get stencilHasStaticMembersWithInit() { return true; }')).toBe(true);
  });
});
