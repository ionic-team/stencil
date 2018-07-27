import * as path from 'path';
import * as d from '../../../declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { TestingConfig } from '../../../testing/testing-config';

const root = path.resolve('/');

describe('outputTargets', () => {

  jest.setTimeout(20000);
  let c: TestingCompiler;
  let config: TestingConfig;

  it('dist, www and readme files w/ custom paths', async () => {
    config = new TestingConfig();
    config.flags.docs = true;
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');
    config.namespace = 'TestApp';
    config.outputTargets = [
      {
        type: 'www',
        dir: 'custom-www',
        buildDir: 'www-build',
        indexHtml: 'custom-index.htm'
      } as any as d.OutputTargetDist,
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
      } as d.OutputTargetDocs
    ];

    c = new TestingCompiler(config);

    await c.fs.writeFiles({
      [path.join(root, 'User', 'testing', 'package.json')]: `{
        "module": "custom-dist/dist-build/esm/index.js",
        "main": "custom-dist/dist-build/index.js",
        "collection": "custom-dist/dist-collection/collection-manifest.json",
        "types": "custom-dist/custom-types/components.d.ts"
      }`,
      [path.join(root, 'User', 'testing', 'src', 'index.html')]: `<cmp-a></cmp-a>`,
      [path.join(root, 'User', 'testing', 'src', 'components', 'cmp-a.tsx')]: `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await c.fs.commit();

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);

    expectFiles(c.fs, [
      path.join(root, 'User', 'testing', 'custom-dist'),
      path.join(root, 'User', 'testing', 'custom-dist', 'dist-collection'),
      path.join(root, 'User', 'testing', 'custom-dist', 'dist-collection', 'collection-manifest.json'),
      path.join(root, 'User', 'testing', 'custom-dist', 'dist-collection', 'components'),
      path.join(root, 'User', 'testing', 'custom-dist', 'dist-collection', 'components', 'cmp-a.js'),

      path.join(root, 'User', 'testing', 'custom-dist', 'dist-build', 'esm', 'index.js'),
      path.join(root, 'User', 'testing', 'custom-dist', 'dist-build', 'index.js'),

      path.join(root, 'User', 'testing', 'custom-dist', 'dist-build', 'testapp'),
      path.join(root, 'User', 'testing', 'custom-dist', 'dist-build', 'testapp.js'),
      path.join(root, 'User', 'testing', 'custom-dist', 'dist-build', 'testapp', 'cmp-a.js'),
      path.join(root, 'User', 'testing', 'custom-dist', 'dist-build', 'testapp', 'es5-build-disabled.js'),
      path.join(root, 'User', 'testing', 'custom-dist', 'dist-build', 'testapp', 'testapp.core.js'),

      // these are written by the worker thread now which is hard to test
      // path.join(root, 'User', 'testing', 'custom-dist', 'custom-types'),
      // path.join(root, 'User', 'testing', 'custom-dist', 'custom-types', 'components'),
      // path.join(root, 'User', 'testing', 'custom-dist', 'custom-types', 'components.d.ts'),
      // path.join(root, 'User', 'testing', 'custom-dist', 'custom-types', 'components', 'cmp-a.d.ts'),
      // path.join(root, 'User', 'testing', 'custom-dist', 'custom-types', 'stencil.core.d.ts'),

      path.join(root, 'User', 'testing', 'custom-www'),
      path.join(root, 'User', 'testing', 'custom-www', 'www-build'),
      path.join(root, 'User', 'testing', 'custom-www', 'www-build', 'testapp'),
      path.join(root, 'User', 'testing', 'custom-www', 'www-build', 'testapp.js'),
      path.join(root, 'User', 'testing', 'custom-www', 'www-build', 'testapp', 'cmp-a.js'),
      path.join(root, 'User', 'testing', 'custom-www', 'www-build', 'testapp', 'es5-build-disabled.js'),
      path.join(root, 'User', 'testing', 'custom-www', 'www-build', 'testapp', 'testapp.core.js'),
      path.join(root, 'User', 'testing', 'custom-www', 'www-build', 'testapp', 'testapp.registry.json'),
      path.join(root, 'User', 'testing', 'custom-www', 'custom-index.htm'),

      path.join(root, 'User', 'testing', 'src', 'components', 'readme.md')
    ]);

    doNotExpectFiles(c.fs, [
      path.join(root, 'User', 'testing', 'www', '/'),
      path.join(root, 'User', 'testing', 'www', 'index.html'),
      path.join(root, 'User', 'testing', 'www', 'custom-index.htm'),
      path.join(root, 'User', 'testing', 'custom-www', 'index.html'),
    ]);
  });

});
