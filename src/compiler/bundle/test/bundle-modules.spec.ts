import * as path from 'path';
import { expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';


describe('bundle-module', () => {

  describe('build', () => {

    let c: TestingCompiler;
    const root = path.resolve('/');

    beforeEach(async () => {
      c = new TestingCompiler();
      await c.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
      await c.fs.commit();
    });


    it('should not rebuild without js changes', async () => {
      c.config.watch = true;
      c.config.bundles = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c'] }
      ];
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
        [path.join(root, 'src', 'cmp-b.tsx')]: `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        [path.join(root, 'src', 'cmp-c.tsx')]: `@Component({ tag: 'cmp-c' }) export class CmpC {}`
      });
      await c.fs.commit();

      // initial build
      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const firstBuildText = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));

      // create a rebuild listener
      const noChangeListener = c.once('buildNoChange');

      // write the same darn thing, no actual change
      await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `@Component({ tag: 'cmp-a' }) export class CmpA {}`, { clearFileCache: true });
      await c.fs.commit();

      // kick off a rebuild
      c.trigger('fileUpdate', path.join(root, 'src', 'cmp-a.tsx'));

      // wait for the rebuild to finish
      // get the rebuild results
      const nc = await noChangeListener;
      expect(nc.noChange).toEqual(true);
    });

    it('should build 2 bundles of 3 components', async () => {
      c.config.bundles = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c'] }
      ];
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
        [path.join(root, 'src', 'cmp-b.tsx')]: `@Component({ tag: 'cmp-b' }) export class CmpB {}`,
        [path.join(root, 'src', 'cmp-c.tsx')]: `@Component({ tag: 'cmp-c' }) export class CmpC {}`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);
      expect(r.components.length).toBe(3);
      expect(r.components[0].tag).toBe('cmp-a');
      expect(r.components[1].tag).toBe('cmp-b');
      expect(r.components[2].tag).toBe('cmp-c');
      expect(r.bundleBuildCount).toBe(2);

      expectFiles(c.fs, [
        path.join(root, 'www', 'build', 'app', 'cmp-a.js'),
        path.join(root, 'www', 'build', 'app', 'cmp-c.js')
      ]);
    });

    it('should include json files', async () => {
      c.config.bundles = [
        { components: ['cmp-a'] },
        { components: ['cmp-b'] }
      ];
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.tsx')]: `
          import json from './package.json';
          console.log(json.thename);
          @Component({ tag: 'cmp-a' }) export class CmpA {}
        `,
        [path.join(root, 'src', 'cmp-b.tsx')]: `
          import json from './package.json';
          console.log(json.thename);
          @Component({ tag: 'cmp-b' }) export class CmpB {}
        `,
        [path.join(root, 'src', 'package.json')]: `
          {
            "thename": "test"
          }
        `
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      expectFiles(c.fs, [
        path.join(root, 'www', 'build', 'app', 'cmp-a.js'),
        path.join(root, 'www', 'build', 'app', 'cmp-b.js'),
        path.join(root, 'www', 'build', 'app', 'chunk-304ba7c3.js')
      ]);
    });

  });

});
