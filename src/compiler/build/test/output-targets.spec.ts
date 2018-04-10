import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';


describe('outputTargets', () => {

  jest.setTimeout(20000);
  let c: TestingCompiler;
  let config: TestingConfig;


  it('default www files', async () => {

    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = '/User/testing/';

    c = new TestingCompiler(config);

    await c.fs.writeFiles({
      '/User/testing/src/index.html': `<cmp-a></cmp-a>`,
      '/User/testing/src/components/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      '/User/testing/www',
      '/User/testing/www/build',
      '/User/testing/www/build/app',
      '/User/testing/www/build/app.js',
      '/User/testing/www/build/app/cmp-a.js',
      '/User/testing/www/build/app/es5-build-disabled.js',
      '/User/testing/www/build/app/app.core.js',
      '/User/testing/www/build/app/app.registry.json',

      '/User/testing/www/index.html',

      '/User/testing/src/components.d.ts',
    ]);

    doNotExpectFiles(c.fs, [
      '/User/testing/__tmp__in__memory__/components/cmp-a.js',

      '/User/testing/dist/',
      '/User/testing/dist/collection',
      '/User/testing/dist/collection/collection-manifest.json',
      '/User/testing/dist/collection/components',
      '/User/testing/dist/collection/components/cmp-a.js',

      '/User/testing/dist/testapp/',
      '/User/testing/dist/testapp.js',
      '/User/testing/dist/testapp/cmp-a.js',
      '/User/testing/dist/testapp/es5-build-disabled.js',
      '/User/testing/dist/testapp/testapp.core.js',

      '/User/testing/dist/types',
      '/User/testing/dist/types/components',
      '/User/testing/dist/types/components.d.ts',
      '/User/testing/dist/types/components/cmp-a.d.ts',
      '/User/testing/dist/types/stencil.core.d.ts',
    ]);
  });

  it('default dist files', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = '/User/testing/';
    config.namespace = 'TestApp';
    config.outputTargets = [{ type: 'dist' }];

    c = new TestingCompiler(config);

    await c.fs.writeFiles({
      '/User/testing/package.json': `{
        "main": "dist/testapp.js",
        "collection": "dist/collection/collection-manifest.json",
        "types": "dist/types/components.d.ts"
      }`,
      '/User/testing/src/index.html': `<cmp-a></cmp-a>`,
      '/User/testing/src/components/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      '/User/testing/dist/',

      '/User/testing/dist/collection',
      '/User/testing/dist/collection/collection-manifest.json',
      '/User/testing/dist/collection/components',
      '/User/testing/dist/collection/components/cmp-a.js',

      '/User/testing/dist/testapp/',
      '/User/testing/dist/testapp.js',
      '/User/testing/dist/testapp/cmp-a.js',
      '/User/testing/dist/testapp/es5-build-disabled.js',
      '/User/testing/dist/testapp/testapp.core.js',

      '/User/testing/dist/types',
      '/User/testing/dist/types/components',
      '/User/testing/dist/types/components.d.ts',
      '/User/testing/dist/types/components/cmp-a.d.ts',
      '/User/testing/dist/types/stencil.core.d.ts',

      '/User/testing/src/components.d.ts',
    ]);

    doNotExpectFiles(c.fs, [
      '/User/testing/www/',
      '/User/testing/www/index.html',
    ]);
  });

  it('dist, www and readme files w/ custom paths', async () => {
    config = new TestingConfig();
    config.flags.docs = true;
    config.buildAppCore = true;
    config.rootDir = '/User/testing/';
    config.namespace = 'TestApp';
    config.outputTargets = [
      {
        type: 'www',
        dir: 'custom-www',
        buildDir: 'www-build',
        indexHtml: 'custom-index.htm'
      },
      {
        type: 'dist',
        dir: 'custom-dist',
        buildDir: 'dist-build',
        collectionDir: 'dist-collection',
        typesDir: 'custom-types'
      },
      {
        type: 'docs',
        format: 'readme'
      }
    ];

    c = new TestingCompiler(config);

    await c.fs.writeFiles({
      '/User/testing/package.json': `{
        "main": "custom-dist/dist-build/testapp.js",
        "collection": "custom-dist/dist-collection/collection-manifest.json",
        "types": "custom-dist/custom-types/components.d.ts"
      }`,
      '/User/testing/src/index.html': `<cmp-a></cmp-a>`,
      '/User/testing/src/components/cmp-a.tsx': `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      '/User/testing/custom-dist',
      '/User/testing/custom-dist/dist-collection',
      '/User/testing/custom-dist/dist-collection/collection-manifest.json',
      '/User/testing/custom-dist/dist-collection/components',
      '/User/testing/custom-dist/dist-collection/components/cmp-a.js',

      '/User/testing/custom-dist/dist-build/testapp',
      '/User/testing/custom-dist/dist-build/testapp.js',
      '/User/testing/custom-dist/dist-build/testapp/cmp-a.js',
      '/User/testing/custom-dist/dist-build/testapp/es5-build-disabled.js',
      '/User/testing/custom-dist/dist-build/testapp/testapp.core.js',

      '/User/testing/custom-dist/custom-types',
      '/User/testing/custom-dist/custom-types/components',
      '/User/testing/custom-dist/custom-types/components.d.ts',
      '/User/testing/custom-dist/custom-types/components/cmp-a.d.ts',
      '/User/testing/custom-dist/custom-types/stencil.core.d.ts',

      '/User/testing/custom-www',
      '/User/testing/custom-www/www-build',
      '/User/testing/custom-www/www-build/testapp',
      '/User/testing/custom-www/www-build/testapp.js',
      '/User/testing/custom-www/www-build/testapp/cmp-a.js',
      '/User/testing/custom-www/www-build/testapp/es5-build-disabled.js',
      '/User/testing/custom-www/www-build/testapp/testapp.core.js',
      '/User/testing/custom-www/www-build/testapp/testapp.registry.json',
      '/User/testing/custom-www/custom-index.htm',

      '/User/testing/src/components/readme.md'
    ]);

    doNotExpectFiles(c.fs, [
      '/User/testing/www/',
      '/User/testing/www/index.html',
      '/User/testing/www/custom-index.htm',
      '/User/testing/custom-www/index.html',
    ]);
  });

});
