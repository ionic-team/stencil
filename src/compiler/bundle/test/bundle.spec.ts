import { TestingCompiler } from '../../../testing/testing-compiler';
import { wroteFile } from '../../../testing/utils';
import * as path from 'path';
import * as ts from 'typescript';


describe('bundle', () => {

  let c: TestingCompiler;

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.commit();
  });


  it('should resolve directory index w/ exports', async () => {
    c.config.bundles = [ { components: ['x-bar']} ];
    await c.fs.writeFiles({
      [path.join('/src', 'components', 'bar', 'bar.tsx')]: `
        import { foo } from '../../utils';
        @Component({
          tag: 'x-bar'
        })
        export class Bar {
          render() {
            foo();
            return <div/>;
          }
        }
      `,
      [path.join('/src', 'utils', 'index.ts')]: `
        export * from './foo';
      `,
      [path.join('/src', 'utils', 'foo.ts')]: `
        export const foo = () => {
          console.log('foo');
        };
      `,
    }, { clearFileCache: true });

    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

  });

  it('wildcard imports should remain within component files', async () => {
    c.config.bundles = [ { components: ['cmp-a']}, { components: ['cmp-b'] } ];
    await c.fs.writeFiles({
      [path.join('/src', 'new-dir', 'cmp-a.tsx')]: `
        import * as file from './file';
        @Component({ tag: 'cmp-a' }) export class CmpA {
          render() {
            return file.file;
          }
        }
      `,
     [path.join('/src', 'new-dir', 'cmp-b.tsx')]: `
        import * as file from './file';
        @Component({ tag: 'cmp-b' }) export class CmpB {
          render() {
            return file.file;
          }
        }
      `,
      [path.join('/src', 'new-dir', 'file.ts')]: `export const file = 'filetext';`,
    }, { clearFileCache: true });

    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.bundleBuildCount).toEqual(3);
  });

  it('get component dependencies from imports', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFiles({
      [path.join('/src', 'new-dir', 'cmp-b.tsx')]: `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
      [path.join('/src', 'new-dir', 'cmp-c.tsx')]: `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
      [path.join('/src', 'new-dir', 'cmp-d.tsx')]: `@Component({ tag: 'cmp-d' }) export class CmpD {}`,
      [path.join('/src', 'new-dir', 'cmp-e.tsx')]: `@Component({ tag: 'cmp-e' }) export class CmpE {}`,
      [path.join('/src', 'util-1.tsx')]: `
        import { getImportedCmpC } from './util-2';
        export function getCmpB() {
          const el = document.createElement("cmp-b");
          return el;
        }
        export function getCmpC() {
          return getImportedCmpC();
        }
      `,
      [path.join('/src', 'util-2.tsx')]: `
        import { getJsxCmpD } from './util-3';
        export function getImportedCmpC() {
          return {
            cmpC: document.createElement("cmp-c"),
            cmpD: getJsxCmpD()
          };
        }
      `,
      [path.join('/src', 'util-3.tsx')]: `
        export function getJsxCmpD() {
          return <cmp-d/>;
        }
        export function getJsxCmpE() {
          return document.createElement('cmp-e');
        }
      `
    }, { clearFileCache: true });

    await c.fs.writeFile(path.join('/src', 'cmp-a.tsx'), `
      import { getCmpB, getCmpC } from './util-1';

      @Component({ tag: 'cmp-a' }) export class CmpA {
        componentWillLoad() {
          getCmpB();
        }
        componentDidLoad() {
          getCmpC();
        }
      }
    `, { clearFileCache: true });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c', 'cmp-d', 'cmp-e']);
  });


});
