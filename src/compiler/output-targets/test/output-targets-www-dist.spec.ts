import type * as d from '@stencil/core/declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/testing-utils';
import { mockCreateCompiler, MockCompiler, mockCompilerRoot } from '../../../testing/mock-compiler';
import path from 'path';

describe('outputTarget, www / dist / docs', () => {
  jest.setTimeout(20000);
  let compiler: MockCompiler;
  let config: d.Config = {};

  it('dist, www and readme files w/ custom paths', async () => {
    config.flags = {};
    config.flags.docs = true;
    config.buildAppCore = true;
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
        type: 'docs-readme',
      } as d.OutputTargetDocsReadme,
    ];

    compiler = await mockCreateCompiler(config);
    config = compiler.config;

    await compiler.sys.writeFile(
      config.packageJsonFilePath,
      `{
      "module": "custom-dist/index.js",
      "main": "custom-dist/index.cjs.js",
      "collection": "custom-dist/dist-collection/collection-manifest.json",
      "types": "custom-dist/custom-types/components.d.ts"
    }`
    );
    await compiler.sys.writeFile(path.join(mockCompilerRoot, 'polyfills', 'index.js'), `/* polyfills */`);
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({ tag: 'cmp-a' }) export class CmpA {
        constructor() { }
      }
    `
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    expectFiles(compiler.compilerCtx.fs, [
      path.join(mockCompilerRoot, 'custom-dist', 'cjs'),
      path.join(mockCompilerRoot, 'custom-dist', 'esm', 'polyfills', 'index.js'),
      path.join(mockCompilerRoot, 'custom-dist', 'esm', 'polyfills', 'index.js.map'),
    ]);

    doNotExpectFiles(compiler.compilerCtx.fs, [
      path.join(mockCompilerRoot, 'www', '/'),
      path.join(mockCompilerRoot, 'www', 'index.html'),
      path.join(mockCompilerRoot, 'www', 'custom-index.htm'),
      path.join(mockCompilerRoot, 'custom-www', 'index.html'),
    ]);

    compiler.destroy();
  });
});
