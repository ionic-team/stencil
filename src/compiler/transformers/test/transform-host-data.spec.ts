import { getStaticGetter, transpileModule } from './transpile';


describe('transform hostData', () => {

  it('should auto generate render for hostData', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        hostData() {
          return {
            'role': 'alert'
          };
        }
      }
    `);

    expect(t.outputText).toEqual('export class CmpA { hostData() { return { \'role\': \'alert\' }; } render() { return h("host", this.hostData()); } static get is() { return "cmp-a"; }}');
  });

  it('should rename render()', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        hostData() {
          return {
            'role': 'alert'
          };
        }
        render() {
          return <h1>Hola</h1>;
        }
      }
    `);

    expect(t.outputText).toEqual('export class CmpA { hostData() { return { \'role\': \'alert\' }; } __internalRender_() { return h("h1", null, "Hola"); } render() { return h("host", this.hostData(), this.__internalRender_()); } static get is() { return "cmp-a"; }}');
  });

  it('should not renamed render()', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <h1>Hola</h1>;
        }
      }
    `);

    expect(t.outputText).toEqual('export class CmpA { render() { return h("h1", null, "Hola"); } static get is() { return "cmp-a"; }}');
  });
});
