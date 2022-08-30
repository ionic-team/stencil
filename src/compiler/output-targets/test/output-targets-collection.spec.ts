import { outputCollection } from '../dist-collection';
import type * as d from '../../../declarations';
import { mockValidatedConfig, mockBuildCtx, mockCompilerCtx, mockModule } from '@stencil/core/testing';
import * as test from '../../transformers/map-imports-to-path-aliases';

describe('Dist Collection output target', () => {
  let mockConfig: d.ValidatedConfig;
  let mockedBuildCtx: d.BuildCtx;
  let mockedCompilerCtx: d.CompilerCtx;
  let changedModules: d.Module[];

  let mapImportPathSpy: jest.SpyInstance;

  const mockTraverse = jest.fn().mockImplementation((source: any) => source);
  const mockMap = jest.fn().mockImplementation(() => mockTraverse);
  const target: d.OutputTargetDistCollection = {
    type: 'dist-collection',
    dir: '',
    collectionDir: '/dist/collection',
  };

  beforeEach(() => {
    mockConfig = mockValidatedConfig({
      srcDir: '/src',
    });
    mockedBuildCtx = mockBuildCtx();
    mockedCompilerCtx = mockCompilerCtx();
    changedModules = [
      mockModule({
        staticSourceFileText: '',
        jsFilePath: '/src/main.js',
        sourceFilePath: '/src/main.ts',
      }),
    ];

    jest.spyOn(mockedCompilerCtx.fs, 'writeFile');

    mapImportPathSpy = jest.spyOn(test, 'mapImportsToPathAliases');
    mapImportPathSpy.mockReturnValue(mockMap);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('transform aliased import paths', () => {
    it('transforms aliased import paths when the output target config flag is `true`', async () => {
      mockConfig.outputTargets = [
        {
          ...target,
          transformAliasedImportPaths: true,
        },
      ];

      await outputCollection(mockConfig, mockedCompilerCtx, mockedBuildCtx, changedModules);

      expect(mapImportPathSpy).toHaveBeenCalledWith(mockConfig, '/dist/collection/main.js', '/dist/collection');
      expect(mapImportPathSpy).toHaveBeenCalledTimes(1);
    });

    it('does not transform aliased import paths when the output target config flag is `false`', async () => {
      mockConfig.outputTargets = [
        {
          ...target,
          transformAliasedImportPaths: false,
        },
      ];

      await outputCollection(mockConfig, mockedCompilerCtx, mockedBuildCtx, changedModules);

      expect(mapImportPathSpy).toHaveBeenCalledTimes(0);
    });

    it('does not transform aliased import paths when the output target config flag is `undefined`', async () => {
      mockConfig.outputTargets = [target];

      await outputCollection(mockConfig, mockedCompilerCtx, mockedBuildCtx, changedModules);

      expect(mapImportPathSpy).toHaveBeenCalledTimes(0);
    });
  });
});
