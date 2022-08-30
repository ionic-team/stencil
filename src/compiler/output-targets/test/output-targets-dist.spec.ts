import type * as d from '@stencil/core/declarations';
import { expectFilesDoNotExist, expectFilesExist } from '../../../testing/testing-utils';
import { mockCreateCompiler, MockCompiler, mockCompilerRoot } from '../../../testing/mock-compiler';
import path from 'path';

describe('outputTarget, dist', () => {
  jest.setTimeout(20000);
  let compiler: MockCompiler;
  let config: d.Config = {};

  it('default dist files', async () => {
    config = {
      buildAppCore: true,
      buildEs5: true,
      globalScript: path.join(mockCompilerRoot, 'src', 'global.ts'),
      namespace: 'TestApp',
      outputTargets: [{ type: 'dist' }],
      sourceMap: true,
    };

    compiler = await mockCreateCompiler(config);
    config = compiler.config;

    await config.sys.writeFile(
      config.packageJsonFilePath,
      `{
        "module": "dist/index.js",
        "main": "dist/index.cjs.js",
        "collection": "dist/collection/collection-manifest.json",
        "types": "dist/types/components.d.ts"
      }`
    );
    await config.sys.writeFile(
      path.join(config.srcDir, 'components', 'cmp-a.tsx'),
      `
      import { Component, h } from '@stencil/core';
      @Component({
        tag: 'cmp-a',
        styleUrls: {
          ios: 'cmp-a.ios.css',
          md: 'cmp-a.md.css'
        }
      }) export class CmpA {}
    `
    );
    await config.sys.writeFile(path.join(config.srcDir, 'components', 'cmp-a.ios.css'), `cmp-a { color: blue; }`);
    await config.sys.writeFile(path.join(config.srcDir, 'components', 'cmp-a.md.css'), `cmp-a { color: green; }`);
    await config.sys.writeFile(
      path.join(config.srcDir, 'global.ts'),
      `export default function() { console.log('my global'); }`
    );

    const r = await compiler.build();
    expect(r.diagnostics).toHaveLength(0);

    expectFilesExist(compiler.compilerCtx.fs, [
      path.join(mockCompilerRoot, 'dist', 'index.js'),

      path.join(mockCompilerRoot, 'dist', 'collection', 'collection-manifest.json'),
      path.join(mockCompilerRoot, 'dist', 'collection', 'components', 'cmp-a.js'),
      path.join(mockCompilerRoot, 'dist', 'collection', 'components', 'cmp-a.js.map'),
      path.join(mockCompilerRoot, 'dist', 'collection', 'components', 'cmp-a.ios.css'),
      path.join(mockCompilerRoot, 'dist', 'collection', 'components', 'cmp-a.md.css'),
      path.join(mockCompilerRoot, 'dist', 'collection', 'global.js'),
      path.join(mockCompilerRoot, 'dist', 'collection', 'global.js.map'),

      path.join(mockCompilerRoot, 'dist', 'esm', 'index.js'),
      path.join(mockCompilerRoot, 'dist', 'esm', 'index.js.map'),
      path.join(mockCompilerRoot, 'dist', 'esm', 'loader.js'),
      path.join(mockCompilerRoot, 'dist', 'esm-es5', 'index.js'),
      path.join(mockCompilerRoot, 'dist', 'esm-es5', 'index.js.map'),
      path.join(mockCompilerRoot, 'dist', 'esm-es5', 'loader.js'),
      path.join(mockCompilerRoot, 'dist', 'esm', 'polyfills'),
      path.join(mockCompilerRoot, 'dist', 'loader'),
      path.join(mockCompilerRoot, 'dist', 'types'),
      path.join(mockCompilerRoot, 'src', 'components.d.ts'),
    ]);

    expectFilesDoNotExist(compiler.compilerCtx.fs, [
      path.join(mockCompilerRoot, 'build'),
      path.join(mockCompilerRoot, 'esm'),
      path.join(mockCompilerRoot, 'es5'),
      path.join(mockCompilerRoot, 'www'),
      path.join(mockCompilerRoot, 'index.html'),
    ]);

    compiler.destroy();
  });
});
