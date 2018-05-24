import * as path from 'path';
import { escapeCssForJs } from '../style';
import { TestingCompiler } from '../../../testing/testing-compiler';


describe('component-styles', () => {

  describe('build', () => {

    let c: TestingCompiler;
    const root = path.resolve('/');

    beforeEach(async () => {
      c = new TestingCompiler();
      await c.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
      await c.fs.commit();
    });


    it('should escape unicode characters', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.css')]: `.myclass:before { content: "\\F113"; }`,
        [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}`,
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
      expect(content).toContain('\\\\F113');
    });

    it('should escape octal literals', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.css')]: `.myclass:before { content: "\\2014 \\00A0"; }`,
        [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}`,
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
      expect(content).toContain('\\\\2014 \\\\00A0');
    });

    it('should build one component w/ inline style', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styles: 'body { color: red; }' }) export class CmpA {}`,
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
      expect(content).toContain('color: red');
    });

    it('should add mode styles to hashed filename/minified builds', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.minifyJs = true;
      c.config.minifyCss = true;
      c.config.hashFileNames = true;
      c.config.hashedFileNameLength = 1;
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({
          tag: 'cmp-a',
          styleUrls: {
            ios: 'cmp-a.ios.css',
            md: 'cmp-a.md.css'
          }
        })
        export class CmpA {}`,

        [path.join(root, 'src', 'cmp-a.ios.css')]: `body{font-family:Helvetica}`,
        [path.join(root, 'src', 'cmp-a.md.css')]: `body{font-family:Roboto}`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const iosContent = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'o.js'));
      expect(iosContent).toContain(`body{font-family:Helvetica}`);
      expect(iosContent).toContain(`static get styleMode(){return"ios"}`);

      const mdContent = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'd.js'));
      expect(mdContent).toContain(`body{font-family:Roboto}`);
      expect(mdContent).toContain(`static get styleMode(){return"md"}`);
    });

    it('should add default styles to hashed filename/minified builds', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.minifyJs = true;
      c.config.minifyCss = true;
      c.config.hashFileNames = true;
      c.config.hashedFileNameLength = 1;
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}`,
        [path.join(root, 'src', 'cmp-a.css')]: `body{color:red}`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 's.js'));
      expect(content).toContain(`body{color:red}`);
    });

    it('should minify styleUrl', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      c.config.minifyCss = true;
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}`,
        [path.join(root, 'src', 'cmp-a.css')]: `body {    color:        red;    /** plz  minify me **/ }`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);

      const content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
      expect(content).toContain(`body{color:red}`);
    });

    it('should build one component w/ styleUrl', async () => {
      c.config.bundles = [ { components: ['cmp-a'] } ];
      await c.fs.writeFiles({
        [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}`,
        [path.join(root, 'src', 'cmp-a.css')]: `body { color: red; }`
      });
      await c.fs.commit();

      const r = await c.build();
      expect(r.diagnostics).toEqual([]);
      expect(r.components).toHaveLength(1);
      expect(r.transpileBuildCount).toBe(1);
      expect(r.bundleBuildCount).toBe(1);

      const content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
      expect(content).toContain(`color: red`);
    });

  });


  describe('escapeCssForJs', () => {
    /* this is all weird cuz we're testing by writing css in JS
     then testing that CSS works in JS so there's more escaping
     that you'd think, but it's more of a unit test thing */

    it(`should escape unicode characters`, () => {
      const escaped = escapeCssForJs(`p { content: '\\F113' }`);
      expect(escaped).toBe(`p { content: '\\\\F113' }`);
    });

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
