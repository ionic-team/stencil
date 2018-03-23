import { expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/index';


describe('build', () => {

  let c: TestingCompiler;

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFile('/src/index.html', `<cmp-a></cmp-a>`);
    await c.fs.commit();
  });


  it('should minify es5 build', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    c.config.minifyJs = true;
    c.config.buildEs5 = true;
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA { /** minify me plz **/ }`);

    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const output = await c.fs.readFile('/www/build/app/cmp-a.es5.js');
    /*! Built with http://stenciljs.com */
    expect(output).toContain('App.loadBundle(\"cmp-a\",[\"exports\"],function(e){window.App.h;var n=function(){function e(){}return Object.defineProperty(e,\"is\",{get:function(){return\"cmp-a\"},enumerable:!0,configurable:!0}),e}();e.CmpA=n,Object.defineProperty(e,\"__esModule\",{value:!0})});');
  });

  it('should minify es2015 build', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    c.config.minifyJs = true;
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA { /** minify me plz **/ }`);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const output = await c.fs.readFile('/www/build/app/cmp-a.js');
    expect(output).toContain('/*! Built with http://stenciljs.com */\nconst{h:t}=window.App;class s{static get is(){return"cmp-a"}}export{s as CmpA};');
  });

  it('should build one component', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.entries).toHaveLength(1);
    expect(r.entries[0].components[0].tag).toContain('cmp-a');
    expect(r.transpileBuildCount).toBe(1);
    expect(r.bundleBuildCount).toBe(1);
    expect(r.filesWritten.length).toBe(2);

    expectFiles(c.fs, [
      '/src/components.d.ts',
      '/www/build/app/cmp-a.js',
      '/www/index.html'
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
