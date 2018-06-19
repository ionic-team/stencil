import * as path from 'path';
import { TestingCompiler } from '../../../testing/testing-compiler';


describe('component-styles', () => {

  let c: TestingCompiler;
  const root = path.resolve('/');

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
    await c.fs.commit();
  });


  it('should escape unicode characters', async () => {
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
    c.config.watch = true;
    await c.fs.writeFiles({
      [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styles: 'body { color: red; }' }) export class CmpA {}`,
    });
    await c.fs.commit();

    let r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.styleBuildCount).toBe(1);

    let content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(content).toContain('color: red');

    const rebuildListener = c.once('buildFinish');

    await c.fs.writeFiles({
      [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styles: 'body { color: green; }' }) export class CmpA {}`,
    }, { clearFileCache: true });
    await c.fs.commit();

    c.trigger('fileUpdate', path.join(root, 'src', 'cmp-a.tsx'));

    r = await rebuildListener;
    expect(r.diagnostics).toEqual([]);
    expect(r.styleBuildCount).toBe(1);

    content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(content).toContain(`color: green`);
  });

  it('should add mode styles to hashed filename/minified builds', async () => {
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
    c.config.watch = true;
    c.config.minifyCss = true;
    await c.fs.writeFiles({
      [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA {}`,
      [path.join(root, 'src', 'cmp-a.css')]: `body {    color:        red;    /** plz  minify me **/ }`
    });
    await c.fs.commit();

    let r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.styleBuildCount).toBe(1);

    let content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(content).toContain(`body{color:red}`);

    const rebuildListener = c.once('buildFinish');

    await c.fs.writeFiles({
      [path.join(root, 'src', 'cmp-a.css')]: `body {    color:        green;    /** plz  minify me **/ }`
    }, { clearFileCache: true });
    await c.fs.commit();

    c.trigger('fileUpdate', path.join(root, 'src', 'cmp-a.css'));

    r = await rebuildListener;
    expect(r.diagnostics).toEqual([]);
    expect(r.styleBuildCount).toBe(1);

    content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(content).toContain(`color:green`);
  });

  it('should build one component w/ styleUrl', async () => {
    c.config.watch = true;
    await c.fs.writeFiles({
      [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css', shadow: true }) export class CmpA {}`,
      [path.join(root, 'src', 'cmp-a.css')]: `body { color: red; }`
    });
    await c.fs.commit();

    let r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.components).toHaveLength(1);
    expect(r.transpileBuildCount).toBe(1);
    expect(r.bundleBuildCount).toBe(1);
    expect(r.styleBuildCount).toBe(1);

    let content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(content).toContain(`color: red`);

    const rebuildListener = c.once('buildFinish');

    await c.fs.writeFiles({
      [path.join(root, 'src', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a', styleUrl: 'cmp-a.css' }) export class CmpA { constructor() { console.log('88'); } }`,
    }, { clearFileCache: true });
    await c.fs.commit();

    c.trigger('fileUpdate', path.join(root, 'src', 'cmp-a.tsx'));

    r = await rebuildListener;
    expect(r.diagnostics).toEqual([]);
    expect(r.styleBuildCount).toBe(0);

    content = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(content).toContain(`color: red`);
    expect(content).toContain(`console.log('88')`);
  });

});
