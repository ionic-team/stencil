import { transpileModule } from './transpile';


describe('parse component tags', () => {

  it('innerHTML', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      connectedCallback() {
        this.elm.innerHTML = '<some-cmp></some-cmp>';
      }
      export class CmpA {
        render() {
          return <div/>
        }
      }
    `);

    expect(t.moduleFile.potentialCmpRefs).toHaveLength(1);
    expect(t.moduleFile.potentialCmpRefs[0].html).toContain('<some-cmp');
  });

  it('createElement', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      connectedCallback() {
        const elm = document.createElement('some-cmp');
      }
      export class CmpA {
        render() {
          return <div/>
        }
      }
    `);

    expect(t.moduleFile.potentialCmpRefs).toHaveLength(1);
    expect(t.moduleFile.potentialCmpRefs[0].tag).toBe('some-cmp');
  });

  it('createElement', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      connectedCallback() {
        const elm = document.createElementNS('http://www.w3.org/2000/svg', 'some-cmp');
      }
      export class CmpA {
        render() {
          return <div/>
        }
      }
    `);

    expect(t.moduleFile.potentialCmpRefs).toHaveLength(1);
    expect(t.moduleFile.potentialCmpRefs[0].tag).toBe('some-cmp');
  });

  it('jsx tagged component', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <some-cmp/>
        }
      }
    `);

    expect(t.moduleFile.potentialCmpRefs).toHaveLength(1);
    expect(t.moduleFile.potentialCmpRefs[0].tag).toBe('some-cmp');
  });

});
