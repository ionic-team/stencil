import { bundledComponentContainsChangedFile, } from '../bundle-module';
import { Bundle, Config, CompilerCtx, Diagnostic, ModuleFile } from '../../../util/interfaces';
import { expectFilesWritten } from '../../../testing/utils';
import { mockStencilSystem } from '../../../testing/mocks';
import { TestingCompiler } from '../../../testing/index';


describe('bundle-module', () => {

  describe('build', () => {

    it('should not rebuild without js changes', async () => {
      c.config.watch = true;
      c.config.bundles = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c'] }
      ];
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
        '/src/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        '/src/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`
      });
      await c.fs.commit();

      // initial build
      let r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const firstBuildText = await c.fs.readFile('/www/build/app/cmp-a.js');

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
      expect(r.stats.components.length).toBe(3);
      expect(r.stats.components[0]).toBe('cmp-a');
      expect(r.stats.components[1]).toBe('cmp-b');
      expect(r.stats.components[2]).toBe('cmp-c');

      const secondBuildText = await c.fs.readFile('/www/build/app/cmp-a.js');
      expect(firstBuildText).toBe(secondBuildText);
    });

    it('should build 2 bundles of 3 components', async () => {
      c.config.bundles = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c'] }
      ];
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
        '/src/cmp-b.tsx': `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        '/src/cmp-c.tsx': `@Component({ tag: 'cmp-c' }) export class CmpC {}`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);
      expect(r.stats.components.length).toBe(3);
      expect(r.stats.components[0]).toBe('cmp-a');
      expect(r.stats.components[1]).toBe('cmp-b');
      expect(r.stats.components[2]).toBe('cmp-c');
      expect(r.stats.bundleBuildCount).toBe(2);

      expectFilesWritten(r,
        '/www/build/app/cmp-a.js',
        '/www/build/app/cmp-c.js'
      );
    });

    var c: TestingCompiler;

    beforeEach(async () => {
      c = new TestingCompiler();
      await c.fs.writeFile('/src/index.html', `<cmp-a></cmp-a>`);
      await c.fs.commit();
    });

  });

  describe('bundledComponentContainsChangedFile', () => {
    const config: Config = {
      sys: mockStencilSystem()
    };
    const moduleFiles: ModuleFile[] = [
      { jsFilePath: '/tmp/build/cmp-a.js' },
      { jsFilePath: '/tmp/build/cmp-b.js' },
      { jsFilePath: '/tmp/build/cmp-c.js' }
    ];

    it('should not contain changed files', () => {
      const changedFiles = [
        '/User/app/build/cmp-x.ts',
        '/User/app/build/cmp-y.tsx'
      ];
      const hasChanged = bundledComponentContainsChangedFile(config, moduleFiles, changedFiles);
      expect(hasChanged).toBe(false);
    });

    it('should contain changed files', () => {
      const changedFiles = [
        '/User/app/build/cmp-a.ts',
        '/User/app/build/cmp-b.tsx'
      ];
      const hasChanged = bundledComponentContainsChangedFile(config, moduleFiles, changedFiles);
      expect(hasChanged).toBe(true);
    });

  });

});
