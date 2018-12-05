import * as path from 'path';
import { expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';


describe('bundle-module', () => {

  describe('build', () => {

    let c: TestingCompiler;
    const root = path.resolve('/');

    beforeEach(async () => {
      c = new TestingCompiler();
      c.config.devMode = false;
      await c.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
      await c.fs.commit();
    });

    it('should build 3 bundles of 3 components in dev mode', async () => {
      c.config.devMode = true;
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
      expect(r.bundleBuildCount).toBe(3);

      expectFiles(c.fs, [
        path.join(root, 'www', 'build', 'app', 'cmp-a.entry.js'),
        path.join(root, 'www', 'build', 'app', 'cmp-b.entry.js'),
        path.join(root, 'www', 'build', 'app', 'cmp-c.entry.js')
      ]);
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
        path.join(root, 'www', 'build', 'app', 'cmp-a.entry.js'),
        path.join(root, 'www', 'build', 'app', 'cmp-c.entry.js')
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
        path.join(root, 'www', 'build', 'app', 'cmp-a.entry.js'),
        path.join(root, 'www', 'build', 'app', 'cmp-b.entry.js'),
        path.join(root, 'www', 'build', 'app', 'cmp-a.sc.entry.js'),
        path.join(root, 'www', 'build', 'app', 'cmp-b.sc.entry.js'),
        path.join(root, 'www', 'build', 'app', 'chunk-304ba7c3.js'),
      ]);
    });

  });

});
