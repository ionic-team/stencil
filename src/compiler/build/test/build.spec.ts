import * as path from 'path';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';


describe('build', () => {
  const root = path.resolve('/');

  let c: TestingCompiler;

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
    await c.fs.commit();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
  });


  it('should minify es5 build', async () => {
    jest.setTimeout(15000);
    c.config.bundles = [ { components: ['cmp-a'] } ];
    c.config.minifyJs = true;
    c.config.buildEs5 = true;
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `@Component({ tag: 'cmp-a' }) export class CmpA { /** minify me plz **/ }`);

    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const output = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.es5.js'));
    /*! Built with http://stenciljs.com */
    expect(output).toContain('App.loadBundle(\"cmp-a\",[\"exports\"],function(e){window.App.h;var n=function(){function e(){}return Object.defineProperty(e,\"is\",{get:function(){return\"cmp-a\"},enumerable:!0,configurable:!0}),e}();e.CmpA=n,Object.defineProperty(e,\"__esModule\",{value:!0})});');
  });

  it('should minify es2017 build', async () => {
    jest.setTimeout(15000);
    c.config.minifyJs = true;
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `@Component({ tag: 'cmp-a' }) export class CmpA { /** minify me plz **/ }`);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expect(r.hasSlot).toBe(false);
    expect(r.hasSvg).toBe(false);

    const output = await c.fs.readFile(path.join(root, 'www', 'build', 'app', 'cmp-a.js'));
    expect(output).toContain('/*! Built with http://stenciljs.com */\nconst{h:t}=window.App;class s{static get is(){return"cmp-a"}}export{s as CmpA};');
  });

  it('should build app files, app global and component', async () => {
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `@Component({ tag: 'cmp-a' }) export class CmpA {}`);
    await c.fs.writeFile(path.join(root, 'src', 'global.ts'), `export const MyGlobal: any = {};`);
    await c.fs.commit();

    c.config.globalScript = path.join(root, 'src', 'global.ts');
    c.config.buildAppCore = true;

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.entries).toHaveLength(1);
    expect(r.entries[0].components[0].tag).toContain('cmp-a');
    expect(r.transpileBuildCount).toBe(2);
    expect(r.bundleBuildCount).toBe(1);
    expect(r.filesWritten).toHaveLength(7);

    expectFiles(c.fs, [
      path.join(root, 'src', 'components.d.ts'),
      path.join(root, 'www', 'build', 'app.js'),
      path.join(root, 'www', 'build', 'app', 'app.core.js'),
      path.join(root, 'www', 'build', 'app', 'app.global.js'),
      path.join(root, 'www', 'build', 'app', 'app.registry.json'),
      path.join(root, 'www', 'build', 'app', 'cmp-a.js'),
      path.join(root, 'www', 'index.html')
    ]);

    // double check we're not saving dist files in the wrong locations
    doNotExpectFiles(c.fs, [
      path.join(root, 'build'),
      path.join(root, 'dist'),
      path.join(root, 'esm'),
      path.join(root, 'es5'),
      path.join(root, 'www', 'dist'),
      path.join(root, 'www', 'esm'),
      path.join(root, 'www', 'es5'),
      path.join(root, 'www', 'build', 'dist'),
      path.join(root, 'www', 'build', 'esm'),
      path.join(root, 'www', 'build', 'es5'),
    ]);
  });

  it('should build no components', async () => {
    const r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.entries).toHaveLength(0);
    expect(r.transpileBuildCount).toBe(0);
    expect(r.bundleBuildCount).toBe(0);
  });

});
