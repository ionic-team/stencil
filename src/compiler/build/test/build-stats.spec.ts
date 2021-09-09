import type * as d from '@stencil/core/declarations';
import { mockConfig, mockCompilerCtx, mockBuildCtx } from '@stencil/core/testing';
import { generateBuildResults } from '../build-results';
import { generateBuildStats } from '../build-stats';
import path from 'path';

describe('generateBuildStats', () => {
  const root = path.resolve('/');
  const config = mockConfig();
  let compilerCtx: d.CompilerCtx;
  let buildCtx: d.BuildCtx;

  beforeEach(() => {
    compilerCtx = mockCompilerCtx(config);
    buildCtx = mockBuildCtx(config, compilerCtx);
  });

  it('should return a structured json object', async () => {
    buildCtx.buildResults = generateBuildResults(config, compilerCtx, buildCtx);

    const result = generateBuildStats(config, buildCtx);

    if (result.hasOwnProperty('timestamp')) {
      delete result.timestamp;
    }

    expect(result).toStrictEqual({
      app: { bundles: 0, components: 0, entries: 0, fsNamespace: undefined, namespace: 'Testing', outputs: [] },
      collections: [],
      compiler: { name: 'in-memory', version: '0.0.0-dev.20210827160156' },
      componentGraph: {},
      components: [],
      entries: [],
      formats: { commonjs: [], es5: [], esm: [], esmBrowser: [], system: [] },
      options: {
        buildEs5: false,
        hashFileNames: false,
        hashedFileNameLength: undefined,
        minifyCss: false,
        minifyJs: false,
      },
      rollupResults: undefined,
      sourceGraph: {},
    });
  });

  it('should return diagnostics if an error is hit', async () => {
    buildCtx.buildResults = generateBuildResults(config, compilerCtx, buildCtx);

    buildCtx.buildResults.hasError = true;
    buildCtx.buildResults.diagnostics = ['Something bad happened'];

    const result = generateBuildStats(config, buildCtx);

    expect(result).toStrictEqual({
      diagnostics: ['Something bad happened'],
    });
  });
});
