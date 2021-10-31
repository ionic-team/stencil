import type * as d from '@stencil/core/declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/testing-utils';
import { mockCreateCompiler, MockCompiler, mockCompilerRoot } from '../../../testing/mock-compiler';
import path from 'path';

describe('outputTarget, www', () => {
  jest.setTimeout(20000);
  let compiler: MockCompiler;
  let config: d.Config = {};

  it('default www files', async () => {
    config.namespace = 'App';
    config.buildAppCore = true;

    compiler = await mockCreateCompiler(config);
    config = compiler.config;

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
      path.join(mockCompilerRoot, 'www'),
      path.join(mockCompilerRoot, 'www', 'build'),
      path.join(mockCompilerRoot, 'www', 'build', 'app.js'),
      path.join(mockCompilerRoot, 'www', 'build', 'app.js.map'),
      path.join(mockCompilerRoot, 'www', 'build', 'app.esm.js'),
      path.join(mockCompilerRoot, 'www', 'build', 'cmp-a.entry.js'),
      path.join(mockCompilerRoot, 'www', 'build', 'cmp-a.entry.js.map'),

      path.join(mockCompilerRoot, 'www', 'index.html'),

      path.join(mockCompilerRoot, 'src', 'components.d.ts'),
    ]);

    doNotExpectFiles(compiler.compilerCtx.fs, [
      path.join(mockCompilerRoot, 'src', 'components', 'cmp-a.js'),

      path.join(mockCompilerRoot, 'dist', '/'),
      path.join(mockCompilerRoot, 'dist', 'collection'),
      path.join(mockCompilerRoot, 'dist', 'collection', 'collection-manifest.json'),
      path.join(mockCompilerRoot, 'dist', 'collection', 'components'),
      path.join(mockCompilerRoot, 'dist', 'collection', 'components', 'cmp-a.js'),

      path.join(mockCompilerRoot, 'dist', 'testapp', '/'),
      path.join(mockCompilerRoot, 'dist', 'testapp.js'),
      path.join(mockCompilerRoot, 'dist', 'testapp', 'cmp-a.entry.js'),
      path.join(mockCompilerRoot, 'dist', 'testapp', 'es5-build-disabled.js'),
      path.join(mockCompilerRoot, 'dist', 'testapp', 'testapp.core.js'),

      path.join(mockCompilerRoot, 'dist', 'types'),
      path.join(mockCompilerRoot, 'dist', 'types', 'components'),
      path.join(mockCompilerRoot, 'dist', 'types', 'components.d.ts'),
      path.join(mockCompilerRoot, 'dist', 'types', 'components', 'cmp-a.d.ts'),
      path.join(mockCompilerRoot, 'dist', 'types', 'stencil.core.d.ts'),
    ]);

    compiler.destroy();
  });
});
