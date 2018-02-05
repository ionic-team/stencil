import { escapeCssForJs } from '../style';
import { expectFilesWritten } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/index';


describe('component-styles', () => {

  describe('build', () => {

    it('should build 2 bundles w/ 3 components w/ styleUrls and css variables', async () => {
      c.config.bundles = [
        { components: ['cmp-a', 'cmp-b'] },
        { components: ['cmp-c'] }
      ];
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.scss' }) export class CmpA {}`,
        '/src/cmp-a.scss': `$color: red; body { color: $color; }`,
        '/src/cmp-b.tsx': `@Component({ tag: 'cmp-b', styleUrl: 'cmp-b.scss' }) export class CmpB {}`,
        '/src/cmp-b.scss': `$color: white; body { color: $color; }`,
        '/src/cmp-c.tsx': `@Component({ tag: 'cmp-c', styleUrl: 'cmp-c.css' }) export class CmpC {}`,
        '/src/cmp-c.css': `body { color: blue; }`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const cmpA = await c.fs.readFile('/www/build/app/cmp-a.js');
      expect(cmpA).toContain(`body {\\n  color: red;\\n}`);
      expect(cmpA).toContain('body {\\n  color: white;\\n}');

      const cmpC = await c.fs.readFile('/www/build/app/cmp-c.js');
      expect(cmpC).toContain('body { color: blue; }');
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
      expect(content).toContain('body { color: red; }');
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
      expect(iosContent).toContain(`body{font:ios}`);
      expect(iosContent).toContain(`static get styleMode(){return"ios"}`);

      const mdContent = await c.fs.readFile('/www/build/app/w.js');
      expect(mdContent).toContain(`body{font:md}`);
      expect(mdContent).toContain(`static get styleMode(){return"md"}`);
    });

    it('should add default styles to hashed filename/minified builds', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.minifyJs = true;
      c.config.minifyCss = true;
      c.config.hashFileNames = true;
      c.config.hashedFileNameLength = 1;
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}`,
        '/src/cmp-a.css': `body{color:red}`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile('/www/build/app/y.js');
      expect(content).toContain(`body{color:red}`);
    });

    it('should minify styleUrl', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.minifyCss = true;
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}`,
        '/src/cmp-a.css': `body {    color:        red;    /** plz  minify me **/ }`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile('/www/build/app/cmp-a.js');
      expect(content).toContain(`body{color:red}`);
    });

    it('should build one component w/ styleUrl', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        '/src/cmp-a.tsx': `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}`,
        '/src/cmp-a.css': `body { color: red; }`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);
      expect(r.components).toHaveLength(1);
      expect(r.transpileBuildCount).toBe(1);
      expect(r.bundleBuildCount).toBe(1);

      const content = await c.fs.readFile('/www/build/app/cmp-a.js');
      expect(content).toContain(`body { color: red; }`);
    });

    var c: TestingCompiler;

    beforeEach(async () => {
      c = new TestingCompiler();
      await c.fs.writeFile('/src/index.html', `<cmp-a></cmp-a>`);
      await c.fs.commit();
    });

  });


  describe('escapeCssForJs', () => {
    /* this is all weird cuz we're testing by writing css in JS
     then testing that CSS works in JS so there's more escaping
     that you'd think, but it's more of a unit test thing */

    it(`should octal escape sequences 0 to 7 (not 8 or 9)`, () => {
      let escaped = escapeCssForJs(`p { content: '\\0660' }`);
      expect(escaped).toBe(`p { content: '\\\\0660' }`);

      escaped = escapeCssForJs(`p { content: '\\1660' }`);
      expect(escaped).toBe(`p { content: '\\\\1660' }`);

      escaped = escapeCssForJs(`p { content: '\\2660' }`);
      expect(escaped).toBe(`p { content: '\\\\2660' }`);

      escaped = escapeCssForJs(`p { content: '\\3660' }`);
      expect(escaped).toBe(`p { content: '\\\\3660' }`);

      escaped = escapeCssForJs(`p { content: '\\4660' }`);
      expect(escaped).toBe(`p { content: '\\\\4660' }`);

      escaped = escapeCssForJs(`p { content: '\\5660' }`);
      expect(escaped).toBe(`p { content: '\\\\5660' }`);

      escaped = escapeCssForJs(`p { content: '\\6660' }`);
      expect(escaped).toBe(`p { content: '\\\\6660' }`);

      escaped = escapeCssForJs(`p { content: '\\7660' }`);
      expect(escaped).toBe(`p { content: '\\\\7660' }`);

      escaped = escapeCssForJs(`p { content: '\\8660' }`);
      expect(escaped).toBe(`p { content: '\\8660' }`);

      escaped = escapeCssForJs(`p { content: '\\9660' }`);
      expect(escaped).toBe(`p { content: '\\9660' }`);
    });

    it(`should escape double quotes`, () => {
      const escaped = escapeCssForJs(`body { font-family: "Comic Sans MS"; }`);
      expect(escaped).toBe(`body { font-family: \\\"Comic Sans MS\\\"; }`);
    });

    it(`should escape new lines`, () => {
      const escaped = escapeCssForJs(`
      body {
        color: red;
      }`);
      expect(escaped).toBe(`\\n      body {\\n        color: red;\\n      }`);
    });

    it(`should escape @ in selectors`, () => {
      const escaped = escapeCssForJs('.container--small\@tablet{}');
      expect(escaped).toBe(`.container--small\\@tablet{}`);
    });

  });

});
