import { mockBuildCtx, mockValidatedConfig } from '@stencil/core/testing';
import childProcess from 'child_process';

import * as d from '../../../declarations';
import { stubComponentCompilerMeta } from '../../types/tests/ComponentCompilerMeta.stub';
import { writeExportMaps } from '../write-export-maps';

describe('writeExportMaps', () => {
  let config: d.ValidatedConfig;
  let buildCtx: d.BuildCtx;
  let execSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    config = mockValidatedConfig();
    buildCtx = mockBuildCtx(config);

    execSyncSpy = jest.spyOn(childProcess, 'execSync').mockImplementation(() => '');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should always generate the default exports', () => {
    writeExportMaps(config, buildCtx);

    expect(execSyncSpy).toHaveBeenCalledTimes(2);
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[.][import]"="./dist/${config.fsNamespace}/${config.fsNamespace}.esm.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[.][require]"="./dist/${config.fsNamespace}/${config.fsNamespace}.cjs.js"`,
    );
  });

  it('should generate the lazy loader exports if the output target is present', () => {
    config.rootDir = '/';
    config.outputTargets.push({
      type: 'dist-lazy-loader',
      dir: '/dist/lazy-loader',
      empty: true,
      esmDir: '/dist/esm',
      cjsDir: '/dist/cjs',
      componentDts: '/dist/components.d.ts',
    });

    writeExportMaps(config, buildCtx);

    expect(execSyncSpy).toHaveBeenCalledTimes(5);
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[.][import]"="./dist/${config.fsNamespace}/${config.fsNamespace}.esm.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[.][require]"="./dist/${config.fsNamespace}/${config.fsNamespace}.cjs.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(`npm pkg set "exports[./loader][import]"="./dist/lazy-loader/index.js"`);
    expect(execSyncSpy).toHaveBeenCalledWith(`npm pkg set "exports[./loader][require]"="./dist/lazy-loader/index.cjs"`);
    expect(execSyncSpy).toHaveBeenCalledWith(`npm pkg set "exports[./loader][types]"="./dist/lazy-loader/index.d.ts"`);
  });

  it('should generate the custom elements exports if the output target is present', () => {
    config.rootDir = '/';
    config.outputTargets.push({
      type: 'dist-custom-elements',
      dir: '/dist/components',
      generateTypeDeclarations: true,
    });

    buildCtx.components = [
      stubComponentCompilerMeta({
        tagName: 'my-component',
        componentClassName: 'MyComponent',
      }),
    ];

    writeExportMaps(config, buildCtx);

    expect(execSyncSpy).toHaveBeenCalledTimes(4);
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[.][import]"="./dist/${config.fsNamespace}/${config.fsNamespace}.esm.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[.][require]"="./dist/${config.fsNamespace}/${config.fsNamespace}.cjs.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[./my-component][import]"="./dist/components/my-component.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[./my-component][types]"="./dist/components/my-component.d.ts"`,
    );
  });

  it('should generate the custom elements exports for multiple components', () => {
    config.rootDir = '/';
    config.outputTargets.push({
      type: 'dist-custom-elements',
      dir: '/dist/components',
      generateTypeDeclarations: true,
    });

    buildCtx.components = [
      stubComponentCompilerMeta({
        tagName: 'my-component',
        componentClassName: 'MyComponent',
      }),
      stubComponentCompilerMeta({
        tagName: 'my-other-component',
        componentClassName: 'MyOtherComponent',
      }),
    ];

    writeExportMaps(config, buildCtx);

    expect(execSyncSpy).toHaveBeenCalledTimes(6);
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[.][import]"="./dist/${config.fsNamespace}/${config.fsNamespace}.esm.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[.][require]"="./dist/${config.fsNamespace}/${config.fsNamespace}.cjs.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[./my-component][import]"="./dist/components/my-component.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[./my-component][types]"="./dist/components/my-component.d.ts"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[./my-other-component][import]"="./dist/components/my-other-component.js"`,
    );
    expect(execSyncSpy).toHaveBeenCalledWith(
      `npm pkg set "exports[./my-other-component][types]"="./dist/components/my-other-component.d.ts"`,
    );
  });
});
