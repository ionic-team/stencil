import * as path from 'path';
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
    config.rootDir = path.join('/', 'User', 'testing', '/');

    c = new TestingCompiler(config);

    await c.fs.writeFiles({
      [path.join('/', 'User', 'testing', 'src', 'index.html')]: `<cmp-a></cmp-a>`,
      [path.join('/', 'User', 'testing', 'src', 'components', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      path.join('/', 'User', 'testing', 'www'),
      path.join('/', 'User', 'testing', 'www', 'build'),
      path.join('/', 'User', 'testing', 'www', 'build', 'app'),
      path.join('/', 'User', 'testing', 'www', 'build', 'app.js'),
      path.join('/', 'User', 'testing', 'www', 'build', 'app', 'cmp-a.js'),
      path.join('/', 'User', 'testing', 'www', 'build', 'app', 'es5-build-disabled.js'),
      path.join('/', 'User', 'testing', 'www', 'build', 'app', 'app.core.js'),
      path.join('/', 'User', 'testing', 'www', 'build', 'app', 'app.registry.json'),

      path.join('/', 'User', 'testing', 'www', 'index.html'),

      path.join('/', 'User', 'testing', 'src', 'components.d.ts'),
    ]);

    doNotExpectFiles(c.fs, [
      path.join('/', 'User', 'testing', '__tmp__in__memory__', 'components', 'cmp-a.js'),

      path.join('/', 'User', 'testing', 'dist', '/'),
      path.join('/', 'User', 'testing', 'dist', 'collection'),
      path.join('/', 'User', 'testing', 'dist', 'collection', 'collection-manifest.json'),
      path.join('/', 'User', 'testing', 'dist', 'collection', 'components'),
      path.join('/', 'User', 'testing', 'dist', 'collection', 'components', 'cmp-a.js'),

      path.join('/', 'User', 'testing', 'dist', 'testapp', '/'),
      path.join('/', 'User', 'testing', 'dist', 'testapp.js'),
      path.join('/', 'User', 'testing', 'dist', 'testapp', 'cmp-a.js'),
      path.join('/', 'User', 'testing', 'dist', 'testapp', 'es5-build-disabled.js'),
      path.join('/', 'User', 'testing', 'dist', 'testapp', 'testapp.core.js'),

      path.join('/', 'User', 'testing', 'dist', 'types'),
      path.join('/', 'User', 'testing', 'dist', 'types', 'components'),
      path.join('/', 'User', 'testing', 'dist', 'types', 'components.d.ts'),
      path.join('/', 'User', 'testing', 'dist', 'types', 'components', 'cmp-a.d.ts'),
      path.join('/', 'User', 'testing', 'dist', 'types', 'stencil.core.d.ts'),
    ]);
  });

  it('default dist files', async () => {
    config = new TestingConfig();
    config.buildAppCore = true;
    config.rootDir = path.join('/', 'User', 'testing', '/');
    config.namespace = 'TestApp';
    config.outputTargets = [{ type: 'dist' }];

    c = new TestingCompiler(config);

    await c.fs.writeFiles({
      [path.join('/', 'User', 'testing', 'package.json')]: `{
        "main": "dist/testapp.js",
        "collection": "dist/collection/collection-manifest.json",
        "types": "dist/types/components.d.ts"
      }`,
      [path.join('/', 'User', 'testing', 'src', 'index.html')]: `<cmp-a></cmp-a>`,
      [path.join('/', 'User', 'testing', 'src', 'components', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      path.join('/', 'User', 'testing', 'dist', '/'),

      path.join('/', 'User', 'testing', 'dist', 'collection'),
      path.join('/', 'User', 'testing', 'dist', 'collection', 'collection-manifest.json'),
      path.join('/', 'User', 'testing', 'dist', 'collection', 'components'),
      path.join('/', 'User', 'testing', 'dist', 'collection', 'components', 'cmp-a.js'),

      path.join('/', 'User', 'testing', 'dist', 'testapp', '/'),
      path.join('/', 'User', 'testing', 'dist', 'testapp.js'),
      path.join('/', 'User', 'testing', 'dist', 'testapp', 'cmp-a.js'),
      path.join('/', 'User', 'testing', 'dist', 'testapp', 'es5-build-disabled.js'),
      path.join('/', 'User', 'testing', 'dist', 'testapp', 'testapp.core.js'),

      path.join('/', 'User', 'testing', 'dist', 'types'),
      path.join('/', 'User', 'testing', 'dist', 'types', 'components'),
      path.join('/', 'User', 'testing', 'dist', 'types', 'components.d.ts'),
      path.join('/', 'User', 'testing', 'dist', 'types', 'components', 'cmp-a.d.ts'),
      path.join('/', 'User', 'testing', 'dist', 'types', 'stencil.core.d.ts'),

      path.join('/', 'User', 'testing', 'src', 'components.d.ts'),
    ]);

    doNotExpectFiles(c.fs, [
      path.join('/', 'User', 'testing', 'www', '/'),
      path.join('/', 'User', 'testing', 'www', 'index.html'),
    ]);
  });

  it('dist, www and readme files w/ custom paths', async () => {
    config = new TestingConfig();
    config.flags.docs = true;
    config.buildAppCore = true;
    config.rootDir = path.join('/', 'User', 'testing', '/');
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
      [path.join('/', 'User', 'testing', 'package.json')]: `{
        "main": "custom-dist/dist-build/testapp.js",
        "collection": "custom-dist/dist-collection/collection-manifest.json",
        "types": "custom-dist/custom-types/components.d.ts"
      }`,
      [path.join('/', 'User', 'testing', 'src', 'index.html')]: `<cmp-a></cmp-a>`,
      [path.join('/', 'User', 'testing', 'src', 'components', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      path.join('/', 'User', 'testing', 'custom-dist'),
      path.join('/', 'User', 'testing', 'custom-dist', 'dist-collection'),
      path.join('/', 'User', 'testing', 'custom-dist', 'dist-collection', 'collection-manifest.json'),
      path.join('/', 'User', 'testing', 'custom-dist', 'dist-collection', 'components'),
      path.join('/', 'User', 'testing', 'custom-dist', 'dist-collection', 'components', 'cmp-a.js'),

      path.join('/', 'User', 'testing', 'custom-dist', 'dist-build', 'testapp'),
      path.join('/', 'User', 'testing', 'custom-dist', 'dist-build', 'testapp.js'),
      path.join('/', 'User', 'testing', 'custom-dist', 'dist-build', 'testapp', 'cmp-a.js'),
      path.join('/', 'User', 'testing', 'custom-dist', 'dist-build', 'testapp', 'es5-build-disabled.js'),
      path.join('/', 'User', 'testing', 'custom-dist', 'dist-build', 'testapp', 'testapp.core.js'),

      path.join('/', 'User', 'testing', 'custom-dist', 'custom-types'),
      path.join('/', 'User', 'testing', 'custom-dist', 'custom-types', 'components'),
      path.join('/', 'User', 'testing', 'custom-dist', 'custom-types', 'components.d.ts'),
      path.join('/', 'User', 'testing', 'custom-dist', 'custom-types', 'components', 'cmp-a.d.ts'),
      path.join('/', 'User', 'testing', 'custom-dist', 'custom-types', 'stencil.core.d.ts'),

      path.join('/', 'User', 'testing', 'custom-www'),
      path.join('/', 'User', 'testing', 'custom-www', 'www-build'),
      path.join('/', 'User', 'testing', 'custom-www', 'www-build', 'testapp'),
      path.join('/', 'User', 'testing', 'custom-www', 'www-build', 'testapp.js'),
      path.join('/', 'User', 'testing', 'custom-www', 'www-build', 'testapp', 'cmp-a.js'),
      path.join('/', 'User', 'testing', 'custom-www', 'www-build', 'testapp', 'es5-build-disabled.js'),
      path.join('/', 'User', 'testing', 'custom-www', 'www-build', 'testapp', 'testapp.core.js'),
      path.join('/', 'User', 'testing', 'custom-www', 'www-build', 'testapp', 'testapp.registry.json'),
      path.join('/', 'User', 'testing', 'custom-www', 'custom-index.htm'),

      path.join('/', 'User', 'testing', 'src', 'components', 'readme.md')
    ]);

    doNotExpectFiles(c.fs, [
      path.join('/', 'User', 'testing', 'www', '/'),
      path.join('/', 'User', 'testing', 'www', 'index.html'),
      path.join('/', 'User', 'testing', 'www', 'custom-index.htm'),
      path.join('/', 'User', 'testing', 'custom-www', 'index.html'),
    ]);
  });

});
