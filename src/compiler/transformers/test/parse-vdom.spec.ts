import { transpileModule } from './transpile';


describe('parse vdom', () => {

  it('hasVdomAttribute', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <some-cmp checked="true"/>
        }
      }
    `);

    expect(t.moduleFile.hasVdomAttribute).toBe(true);
  });

  it('hasVdomClass', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <some-cmp class="some-class"/>
        }
      }
    `);

    expect(t.moduleFile.hasVdomClass).toBe(true);
  });

  it('hasVdomFunctional', () => {
    const t = transpileModule(`
      const FnCmp = <fn-cmp/>;
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <FnCmp/>
        }
      }
    `);

    expect(t.moduleFile.hasVdomFunctional).toBe(true);
  });

  it('hasVdomKey', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <some-cmp key="k"/>
        }
      }
    `);

    expect(t.moduleFile.hasVdomKey).toBe(true);
  });

  it('hasVdomListener', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <some-cmp onClick="()=>{}"/>
        }
      }
    `);

    expect(t.moduleFile.hasVdomListener).toBe(true);
  });

  it('hasVdomRef', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <some-cmp ref="()=>{}"/>
        }
      }
    `);

    expect(t.moduleFile.hasVdomRef).toBe(true);
  });

  it('hasVdomRender', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <some-cmp/>
        }
      }
    `);

    expect(t.moduleFile.hasVdomRender).toBe(true);
  });

  it('hasVdomStyle', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <some-cmp style={{color:red}}/>
        }
      }
    `);

    expect(t.moduleFile.hasVdomStyle).toBe(true);
  });

  it('hasVdomText', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <some-cmp>text</some-cmp>
        }
      }
    `);

    expect(t.moduleFile.hasVdomText).toBe(true);
  });

  it('hasSlot', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <slot/>
        }
      }
    `);

    expect(t.moduleFile.hasSlot).toBe(true);
  });

  it('hasSvg', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        render() {
          return <svg/>
        }
      }
    `);

    expect(t.moduleFile.hasSvg).toBe(true);
  });

});
