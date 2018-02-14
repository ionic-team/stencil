import { TestingCompiler } from '../../../testing';
import { wroteFile } from '../../../testing/utils';
import * as path from 'path';
import * as ts from 'typescript';


describe('transpile', () => {

  let c: TestingCompiler;

  beforeEach(async () => {
    c = new TestingCompiler();

    await c.fs.writeFile('/src/index.html', `<cmp-a></cmp-a>`);
    await c.fs.commit();
  });

  describe('rebuild', () => {

    it('should rebuild transpile for deleted directory', async () => {
      c.config.watch = true;
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
        '/src/some-dir/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        '/src/some-dir/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`
      });
      await c.fs.commit();

      // kick off the initial build, wait for it to finish
      let r = await c.build();
      expect(r.diagnostics).toEqual([]);

      // create a rebuild listener
      const rebuildListener = c.once('rebuild');

      await c.fs.remove('/src/some-dir');
      await c.fs.commit();

      // kick off a rebuild
      c.trigger('dirDelete', '/src/some-dir');

      // wait for the rebuild to finish
      // get the rebuild results
      r = await rebuildListener;
      expect(r.diagnostics).toEqual([]);

      expect(wroteFile(r, '/www/build/app/cmp-a.js')).toBe(false);
      expect(wroteFile(r, '/www/build/app/cmp-b.js')).toBe(false);
      expect(wroteFile(r, '/www/build/app/cmp-c.js')).toBe(false);

      expect(r.entries[0].components[0].tag).toEqual('cmp-a');
    });

    it('should rebuild transpile for added directory', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.watch = true;
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`
      }, { clearFileCache: true });
      await c.fs.commit();

      // kick off the initial build, wait for it to finish
      let r = await c.build();
      expect(r.diagnostics).toEqual([]);

      // create a rebuild listener
      const rebuildListener = c.once('rebuild');

      // add directory
      await c.fs.writeFiles({
        '/src/new-dir/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        '/src/new-dir/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`
      }, { clearFileCache: true });
      await c.fs.commit();

      // kick off a rebuild
      c.trigger('dirAdd', '/src/new-dir');

      // wait for the rebuild to finish
      // get the rebuild results
      r = await rebuildListener;
      expect(r.diagnostics).toEqual([]);

      expect(wroteFile(r, '/www/build/app/cmp-a.js')).toBe(false);
      expect(wroteFile(r, '/www/build/app/cmp-b.js')).toBe(true);
      expect(wroteFile(r, '/www/build/app/cmp-c.js')).toBe(true);
      expect(r.entries[0].components[0].tag).toEqual('cmp-a');
      expect(r.entries[1].components[0].tag).toEqual('cmp-b');
      expect(r.entries[2].components[0].tag).toEqual('cmp-c');
      expect(r.hasChangedJsText).toBe(true);
    });

    it('should rebuild transpile for changed typescript file', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.watch = true;
      await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`, { clearFileCache: true });
      await c.fs.commit();

      // kick off the initial build, wait for it to finish
      let r = await c.build();
      expect(r.diagnostics).toEqual([]);

      // create a rebuild listener
      const rebuildListener = c.once('rebuild');

      // write an actual change
      await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA { constructor() { console.log('changed!!'); } }`, { clearFileCache: true });
      await c.fs.commit();

      // kick off a rebuild
      c.trigger('fileUpdate', '/src/cmp-a.tsx');

      // wait for the rebuild to finish
      // get the rebuild results
      r = await rebuildListener;
      expect(r.diagnostics).toEqual([]);

      expect(wroteFile(r, '/www/build/app/cmp-a.js')).toBe(true);
      expect(r.entries[0].components[0].tag).toEqual('cmp-a');
      expect(r.transpileBuildCount).toBe(1);
      expect(r.hasChangedJsText).toBe(true);
    });

    it('should not rebuild transpile for unchanged typescript file', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.watch = true;
      await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`, { clearFileCache: true });
      await c.fs.commit();

      // kick off the build, wait for it to finish
      let r = await c.build();

      // initial build finished
      expect(r.diagnostics).toEqual([]);
      expect(r.buildId).toBe(0);
      expect(r.isRebuild).toBe(false);

      // create a rebuild listener
      const rebuildListener = c.once('rebuild');

      // write the same darn thing, no actual change
      await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`, { clearFileCache: true });
      await c.fs.commit();

      // kick off a rebuild
      c.trigger('fileUpdate', '/src/cmp-a.tsx');

      // wait for the rebuild to finish
      // get the rebuild results
      r = await rebuildListener;
      expect(r.diagnostics).toEqual([]);
      expect(r.buildId).toBe(1);
      expect(r.isRebuild).toBe(true);
      expect(r.entries[0].components[0].tag).toEqual('cmp-a');
      expect(r.transpileBuildCount).toBe(1);
      expect(r.transpileBuildCount).toBe(1);
      expect(r.hasChangedJsText).toBe(false);
    });

    it('should transpile attr in componet static property', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFile('/src/cmp-a.tsx', `
        @Component({ tag: 'cmp-a' }) export class CmpA {
          @Prop() str: string;
          @Prop() myStr: string;
          @Prop() myNum: number;
          @Prop() myBool: boolean;
          @Prop() myAny: any;
          @Prop() myPromise: Promise<void>;
          @Prop() arr: string[];
          @Prop() obj: Object;
        }
      `, { clearFileCache: true });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile('/www/build/app/cmp-a.js');
      expect(content).toContain(`"arr": { "type": "Any", "attr": "arr" }`);
      expect(content).toContain(`"myAny": { "type": "Any", "attr": "my-any"`);
      expect(content).toContain(`"myBool": { "type": Boolean, "attr": "my-bool" }`);
      expect(content).toContain(`"myNum": { "type": Number, "attr": "my-num" }`);
      expect(content).toContain(`"myPromise": { "type": "Any", "attr": "my-promise" }`);
      expect(content).toContain(`"myStr": { "type": String, "attr": "my-str" }`);
      expect(content).toContain(`"obj": { "type": "Any", "attr": "obj" }`);
      expect(content).toContain(`"str": { "type": String, "attr": "str" }`);
    });

    it('get component dependencies from imports w/ circular dependencies', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        '/src/new-dir/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        '/src/new-dir/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
        '/src/util-1.tsx': `
          import { getImportedCmpC } from './util-2';
          export function getCmpB() {
            return {
              'b': document.createElement("cmp-b"),
              'c': getImportedCmpC()
            }
          }
        `,
        '/src/util-2.tsx': `
          import { getCmpB } from './util-1';
          export function derpCircular() {
            return getCmpB();
          }
          export function getImportedCmpC() {
            return {
              'b': document.createElement("cmp-b"),
              'c': document.createElement("cmp-c")
            };
          }
        `
      }, { clearFileCache: true });

      await c.fs.writeFile('/src/cmp-a.tsx', `
        import { getCmpB } from './util-1';

        @Component({ tag: 'cmp-a' }) export class CmpA {
          componentWillLoad() {
            getCmpB();
          }
        }
      `, { clearFileCache: true });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c']);
    });

    it('get component dependencies from imports', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        '/src/new-dir/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        '/src/new-dir/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
        '/src/new-dir/cmp-d.tsx': `@Component({ tag: 'cmp-d' }) export class CmpD {}`,
        '/src/new-dir/cmp-e.tsx': `@Component({ tag: 'cmp-e' }) export class CmpE {}`,
        '/src/util-1.tsx': `
          import { getImportedCmpC } from './util-2';
          export function getCmpB() {
            const el = document.createElement("cmp-b");
            return el;
          }
          export function getCmpC() {
            return getImportedCmpC();
          }
        `,
        '/src/util-2.tsx': `
          import { getJsxCmpD } from './util-3';
          export function getImportedCmpC() {
            return {
              cmpC: document.createElement("cmp-c"),
              cmpD: getJsxCmpD()
            };
          }
        `,
        '/src/util-3.tsx': `
          export function getJsxCmpD() {
            return <cmp-d/>;
          }
          export function getJsxCmpE() {
            return document.createElement('cmp-e');
          }
        `
      }, { clearFileCache: true });

      await c.fs.writeFile('/src/cmp-a.tsx', `
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

    it('get CallExpression component dependencies', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        '/src/new-dir/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        '/src/new-dir/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
        '/src/new-dir/no-find.tsx': `@Component({ tag: 'no-find' }) export class NoFind {}`
      }, { clearFileCache: true });

      await c.fs.writeFile('/src/cmp-a.tsx', `
        @Component({ tag: 'cmp-a' }) export class CmpA {
          render() {
            someFunction('no-find');
            if (true) {
              return (
                h('cmp-b')
              );
            }
            return (
              h('cmp-c')
            );
          }
        }
      `, { clearFileCache: true });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      expect(r.components[0].tag).toBe('cmp-a');
      expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c']);
    });

    it('get CallExpression PropertyAccessExpression component dependencies', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        '/src/new-dir/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        '/src/new-dir/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
        '/src/new-dir/no-find.tsx': `@Component({ tag: 'no-find' }) export class NoFind {}`
      }, { clearFileCache: true });

      await c.fs.writeFile('/src/cmp-a.tsx', `
        @Component({ tag: 'cmp-a' }) export class CmpA {
          constructor() {
            document.createElement('cmp-b');
            var doc = document;
            doc.createElementNS('cMp-C');
            document.createElement('   no-find   ');
            doc.someFunction('no-find');
          }
        }
      `, { clearFileCache: true });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      expect(r.components[0].tag).toBe('cmp-a');
      expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c']);
    });

    it('get component dependencies from html string literals', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        '/src/new-dir/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        '/src/new-dir/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`,
        '/src/new-dir/no-find.tsx': `@Component({ tag: 'no-find' }) export class NoFind {}`
      }, { clearFileCache: true });

      await c.fs.writeFile('/src/cmp-a.tsx', `
        @Component({ tag: 'cmp-a' }) export class CmpA {
          // no-find
          //no-find
          /* no-find */
          /*no-find*/
          constructor() {
            this.el.innerHTML = '<cmp-b></cmp-b>';
            $.append('<cmp-c></cmp-c>');
          }
        }
      `, { clearFileCache: true });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      expect(r.components[0].tag).toBe('cmp-a');
      expect(r.components[0].dependencies).toEqual(['cmp-b', 'cmp-c']);
    });

    it('wildcard imports should remain within component files', async () => {
      c.config.bundles = [ { components: ['cmp-a']}, { components: ['cmp-b'] } ];
      await c.fs.writeFiles({
        '/src/new-dir/cmp-a.tsx': `
          import * as file from './file';
          @Component({ tag: 'cmp-a' }) export class CmpA {
            render() {
              return file.file;
            }
          }
        `,
        '/src/new-dir/cmp-b.tsx': `
          import * as file from './file';
          @Component({ tag: 'cmp-b' }) export class CmpB {
            render() {
              return file.file;
            }
          }
        `,
        '/src/new-dir/file.ts': `export const file = 'filetext';`,
      }, { clearFileCache: true });

      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);
      expect(r.bundleBuildCount).toEqual(3);
    });

  });

});
