import type * as d from '@stencil/core/declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/testing-utils';
import { Compiler, Config } from '@stencil/core/compiler';
import { mockConfig } from '@stencil/core/testing';
import path from 'path';

xdescribe('outputTarget, www / dist / docs', () => {
  jest.setTimeout(20000);
  let compiler: Compiler;
  let config: Config;
  const root = path.resolve('/');

  it('dist, www and readme files w/ custom paths', async () => {
    config = mockConfig();
    config.flags.docs = true;
    config.buildAppCore = true;
    config.rootDir = path.join(root, 'User', 'testing', '/');
    config.namespace = 'TestApp';
    config.outputTargets = [
      {
        type: 'www',
        dir: 'custom-www',
        buildDir: 'www-build',
        indexHtml: 'custom-index.htm',
      } as any as d.OutputTargetDist,
      {
        type: 'dist',
        dir: 'custom-dist',
        buildDir: 'dist-build',
        collectionDir: 'dist-collection',
        typesDir: 'custom-types',
      },
      {
        type: 'docs',
      } as d.OutputTargetDocsReadme,
    ];

    compiler = new Compiler(config);

    await compiler.fs.writeFiles({
      [path.join(root, 'User', 'testing', 'package.json')]: `{
        "module": "custom-dist/index.mjs",
        "main": "custom-dist/index.js",
        "collection": "custom-dist/dist-collection/collection-manifest.json",
        "types": "custom-dist/custom-types/components.d.ts"
      }`,
      [path.join(root, 'User', 'testing', 'src', 'index.html')]: `<cmp-a></cmp-a>`,
      [path.join(config.sys.getClientPath('polyfills/index.js'))]: `/* polyfills */`,
      [path.join(
        root,
        'User',
        'testing',
        'src',
        'components',
        'cmp-a.tsx'
      )]: `@Component({ tag: 'cmp-a' }) export class CmpA {}`,
    });
    await compiler.fs.commit();

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    expectFiles(compiler.fs, [
      path.join(root, 'User', 'testing', 'custom-dist', 'cjs'),
      path.join(root, 'User', 'testing', 'custom-dist', 'esm', 'polyfills', 'index.js'),
    ]);

    doNotExpectFiles(compiler.fs, [
      path.join(root, 'User', 'testing', 'www', '/'),
      path.join(root, 'User', 'testing', 'www', 'index.html'),
      path.join(root, 'User', 'testing', 'www', 'custom-index.htm'),
      path.join(root, 'User', 'testing', 'custom-www', 'index.html'),
    ]);
  });
});
