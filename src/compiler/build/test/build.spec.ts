import { expectFilesWritten } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/index';


describe('build', () => {

  it('should minify es5 build', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    c.config.minifyJs = true;
    c.config.buildEs5 = true;
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA { /** minify me plz **/ }`);

    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const output = await c.fs.readFile('/www/build/app/cmp-a.es5.js');
    expect(output).toContain('App.loadComponents(function(e,n,t){\"use strict\";Object.defineProperty(e,\"__esModule\",{value:!0});var r=function(){function e(){}return Object.defineProperty(e,\"is\",{get:function(){return\"cmp-a\"},enumerable:!0,configurable:!0}),e}();e.CmpA=r},\"cmp-a\");');
  });

  it('should minify es2015 build', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    c.config.minifyJs = true;
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA { /** minify me plz **/ }`);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    const output = await c.fs.readFile('/www/build/app/cmp-a.js');
    expect(output).toContain('const{h,Context}=window.App;class CmpA{static get is(){return"cmp-a"}}export{CmpA};');
  });

  it('should build one component', async () => {
    c.config.bundles = [ { components: ['cmp-a'] } ];
    await c.fs.writeFile('/src/cmp-a.tsx', `@Component({ tag: 'cmp-a' }) export class CmpA {}`);
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.stats.components.length).toBe(1);
    expect(r.stats.components).toContain('cmp-a');
    expect(r.stats.transpileBuildCount).toBe(1);
    expect(r.stats.bundleBuildCount).toBe(1);

    expectFilesWritten(r,
      '/src/components.d.ts',
      '/www/build/app/cmp-a.js',
      '/www/index.html'
    );
    expect(r.stats.filesWritten.length).toBe(3);
  });

  it('should build no components', async () => {
    const r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.stats.components.length).toBe(0);
    expect(r.stats.transpileBuildCount).toBe(0);
    expect(r.stats.bundleBuildCount).toBe(0);
  });


  var c: TestingCompiler;

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFile('/src/index.html', `<cmp-a></cmp-a>`);
    await c.fs.commit();
  });

});
