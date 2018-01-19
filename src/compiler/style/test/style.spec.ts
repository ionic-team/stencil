import { cleanStyle } from '../style';
import { expectFilesWritten } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/index';


describe('component-styles', () => {

  describe('build', () => {

    it('should build 2 bundles w/ 3 components w/ styleUrls and scss variables', async () => {
      c.config.bundles = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c'] }
      ];
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`,
        '/src/cmp-a.scss': `$color: red; body { color: $color; }`,
        '/src/cmp-b.tsx': `@Component({ tag: 'cmp-b', styleUrl: 'cmp-b.scss' }) export class CmpB {}`,
        '/src/cmp-b.scss': `body { color: white; }`,
        '/src/cmp-c.tsx': `@Component({ tag: 'cmp-c', styleUrl: 'cmp-c.scss' }) export class CmpC {}`,
        '/src/cmp-c.scss': `body { color: blue; }`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const cmpA = await c.fs.readFile('/www/build/app/cmp-a.js');
      expect(cmpA.includes(`body {\\n  color: red;\\n}`)).toBe(true);
      expect(cmpA.includes('body {\\n  color: white;\\n}')).toBe(true);

      const cmpC = await c.fs.readFile('/www/build/app/cmp-c.js');
      expect(cmpC.includes('body {\\n  color: blue;\\n}')).toBe(true);
    });

    it('should build one component w/ inline style', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a', styles: 'body { color: red; }' }) export class CmpA {}`,
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile('/www/build/app/cmp-a.js');
      expect(content.includes('body { color: red; }')).toBe(true);
    });

    it('should add mode styles to hashed filename/minified builds', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.minifyJs = true;
      c.config.minifyCss = true;
      c.config.hashFileNames = true;
      c.config.hashedFileNameLength = 1;
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({
          tag: 'cmp-a',
          styleUrls: {
            ios: '/src/cmp-a.ios.css',
            md: '/src/cmp-a.md.css'
          }
        })
        export class CmpA {}`,

        '/src/cmp-a.ios.css': `body{font:ios}`,

        '/src/cmp-a.md.css': `body{font:md}`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const iosContent = await c.fs.readFile('/www/build/app/u.js');
      expect(iosContent.includes(`body{font:ios}`)).toBe(true);
      expect(iosContent.includes(`static get styleMode(){return"ios"}`)).toBe(true);

      const mdContent = await c.fs.readFile('/www/build/app/w.js');
      expect(mdContent.includes(`body{font:md}`)).toBe(true);
      expect(mdContent.includes(`static get styleMode(){return"md"}`)).toBe(true);
    });

    it('should add default styles to hashed filename/minified builds', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.minifyJs = true;
      c.config.minifyCss = true;
      c.config.hashFileNames = true;
      c.config.hashedFileNameLength = 1;
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`,
        '/src/cmp-a.scss': `body{color:red}`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile('/www/build/app/y.js');
      expect(content.includes(`body{color:red}`)).toBe(true);
    });

    it('should minify styleUrl', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.minifyCss = true;
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`,
        '/src/cmp-a.scss': `body {    color:        red;    /** plz  minify me **/ }`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile('/www/build/app/cmp-a.js');
      expect(content.includes(`body{color:red}`)).toBe(true);
    });

    it('should build one component w/ styleUrl', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`,
        '/src/cmp-a.scss': `body { color: red; }`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);
      expect(r.stats.components.length).toBe(1);
      expect(r.stats.transpileBuildCount).toBe(1);
      expect(r.stats.bundleBuildCount).toBe(1);

      const content = await c.fs.readFile('/www/build/app/cmp-a.js');
      expect(content.includes(`body {\\n  color: red;\\n}`)).toBe(true);
    });

    var c: TestingCompiler;

    beforeEach(async () => {
      c = new TestingCompiler();
      await c.fs.writeFile('/src/index.html', `<cmp-a></cmp-a>`);
      await c.fs.commit();
    });

  });


  describe('cleanStyle', () => {

    it(`should allow @ in selectors`, () => {
      const cleaned = cleanStyle('.container--small\@tablet{}');
      expect(cleaned).toBe(`.container--small\\@tablet{}`);
    });

  });

});
