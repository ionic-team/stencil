import { TestingCompiler } from '../../../testing';
import { wroteFile } from '../../../testing/utils';
import * as path from 'path';
import * as ts from 'typescript';


describe('build conditionals', () => {

  let c: TestingCompiler;

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFile('/src/index.html', `<cmp-a></cmp-a>`);
    await c.fs.commit();
  });


  it('svg in import', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFiles({
      '/src/new-tab-icon.tsx': `
        const NewTabIcon = () => (
          <svg class="new-tab" viewBox="0 0 43 42">
            <rect class="new-tab__box" y="8" width="34" height="34" rx="6"/>
            <path class="new-tab__arrow" d="M37.078 3.268H23.617V.243h18.626v18.625h-3.026V5.407L16.13 28.494l-2.14-2.139z"/>
          </svg>
        );
        export default NewTabIcon;
      `,

      '/src/cmp-a.tsx': `
        import NewTabIcon from './new-tab-icon';
        @Component({ tag: 'cmp-a' }) export class CmpA {

          render() {
            return NewTabIcon;
          }
        }
      `
    }, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.hasSvg).toBe(true);
  });

  it('svg in innerHTML', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFile('/src/cmp-a.tsx', `
      @Component({ tag: 'cmp-a' }) export class CmpA {

        constructor() {
          this.elm.innerHTML = '<svg></svg>';
        }

        render() {
          return <p/>;
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.hasSvg).toBe(true);
  });

  it('svg in render()', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFile('/src/cmp-a.tsx', `
      @Component({ tag: 'cmp-a' }) export class CmpA {

        render() {
          return <svg/>;
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.hasSvg).toBe(true);
  });

  it('svg not in build', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFile('/src/cmp-a.tsx', `
      @Component({ tag: 'cmp-a' }) export class CmpA {
        // i love svgs
        /* <svg> is the greatest */
        render() {
          return <p/>;
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.hasSvg).toBe(false);
  });

});
