import * as path from 'path';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { wroteFile } from '../../../testing/utils';
import { pathExists } from 'fs-extra';


describe('build conditionals', () => {
  const root = path.resolve('/');
  let c: TestingCompiler;

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
    await c.fs.commit();
  });


  it('svg in import', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFiles({
      [path.join(root, 'src', 'new-tab-icon.tsx')]: `
        const NewTabIcon = () => [
          <svg class="new-tab" viewBox="0 0 43 42">
            <rect class="new-tab__box" y="8" width="34" height="34" rx="6"/>
            <path class="new-tab__arrow" d="M37.078 3.268H23.617V.243h18.626v18.625h-3.026V5.407L16.13 28.494l-2.14-2.139z"/>
          </svg>,
          <slot/>
        ];
        export default NewTabIcon;
      `,

      [path.join(root, 'src', 'cmp-a.tsx')]: `
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

    expect(r.hasSlot).toBe(true);
    expect(r.hasSvg).toBe(true);
  });

  it('svg and slot in innerHTML', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
      @Component({ tag: 'cmp-a' }) export class CmpA {

        constructor() {
          this.elm.innerHTML = '<svg></svg><slot></slot>';
        }

        render() {
          return <p/>;
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.hasSlot).toBe(true);
    expect(r.hasSvg).toBe(true);
  });

  it('svg and slot in render()', async () => {
    c.config.watch = true;
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
      @Component({ tag: 'cmp-a' }) export class CmpA {

        render() {
          return [<svg/>, <slot/>];
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    let r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.hasSlot).toBe(true);
    expect(r.hasSvg).toBe(true);

    // create a rebuild listener
    const rebuildListener = c.once('rebuild');

    await c.fs.writeFile(path.join(root, 'src', 'global.css'), '/**css**/');
    await c.fs.commit();

    // kick off a rebuild
    c.trigger('fileAdd', path.join(root, 'src', 'global.css'));

    // wait for the rebuild to finish
    // get the rebuild results
    r = await rebuildListener;
    expect(r.diagnostics).toEqual([]);

    expect(r.hasSlot).toBe(true);
    expect(r.hasSvg).toBe(true);
  });

  it('svg not in build', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
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
