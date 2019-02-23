import * as d from '@declarations';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { globalScriptsPlugin } from '../rollup-plugins/global-scripts';
import { logger, sys } from '@sys';
import { OutputAsset, OutputChunk, OutputOptions, RollupOptions } from 'rollup'; // types only
import { stencilBuildConditionalsPlugin } from '../rollup-plugins/stencil-build-conditionals';
import { stencilClientPlugin } from '../rollup-plugins/stencil-client';
import { stencilLoaderPlugin } from '../rollup-plugins/stencil-loader';

export async function bundleApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, bundleCoreOptions: d.BundleCoreOptions) {
  const rollupResults: d.RollupResult[] = [];

  try {
    const rollupOptions: RollupOptions = {
      input: {
        // Generate entry point
        [config.fsNamespace]: '@core-entrypoint',
        ...bundleCoreOptions.entryInputs,
      },
      plugins: [
        stencilLoaderPlugin({
          '@stencil/core/app': DEFAULT_CORE,
          '@core-entrypoint': DEFAULT_ENTRY,
          ...bundleCoreOptions.loader
        }),
        stencilClientPlugin(),
        stencilBuildConditionalsPlugin(build),
        globalScriptsPlugin(config, compilerCtx),
        componentEntryPlugin(compilerCtx, buildCtx, build, buildCtx.entryModules),
        sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        sys.rollup.plugins.emptyJsResolver(),
        sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        inMemoryFsRead(compilerCtx, buildCtx),
        ...config.plugins
      ],
      onwarn: createOnWarnFn(logger, buildCtx.diagnostics),
    };
    if (bundleCoreOptions.coreChunk) {
      rollupOptions.manualChunks = {
        [config.fsNamespace]: ['@stencil/core/app']
      };
    }

    const rollupBuild = await sys.rollup.rollup(rollupOptions);

    const outputOptions = bundleCoreOptions.moduleFormats.map(moduleFormat => {
      const outputOptions: OutputOptions = {
        format: moduleFormat
      };
      return outputOptions;
    });

    const generatePromises = outputOptions.map(async outputOption => {
      const { output } = await rollupBuild.generate({
        ...outputOption,
        chunkFileNames: config.devMode ? '[name]-[hash].js' : '[hash].js'
      });

      if (!buildCtx.shouldAbort) {
        const outputPromises = output.map(rollupOutput => {
          return createRollupResult(config, outputOption.format as any, rollupOutput, buildCtx.entryModules);
        });
        rollupResults.push(...(await Promise.all(outputPromises)));
      }
    });

    await Promise.all(generatePromises);

  } catch (e) {
    loadRollupDiagnostics(compilerCtx, buildCtx, e);

    if (logger.level === 'debug') {
      logger.error(`bundleAppCore, bundleEntryInputs: ${bundleCoreOptions.entryInputs}`);
    }
  }

  return rollupResults;
}


async function createRollupResult(config: d.Config, moduleFormat: d.ModuleFormat, rollupOutput: OutputAsset | OutputChunk, entryModules: d.EntryModule[]) {
  const rollupChunk = rollupOutput as OutputChunk;
  const rollupResult: d.RollupResult = {
    fileName: rollupOutput.fileName,
    code: rollupOutput.code,
    moduleFormat: moduleFormat,
    entryKey: null,
    isEntry: !!rollupChunk.isEntry,
    isComponent: !!rollupChunk.isEntry && entryModules.some(m => m.entryKey === rollupChunk.name),
    isAppCore: rollupChunk.name === config.fsNamespace
  };

  if (!rollupResult.isEntry) {
    return rollupResult;
  }

  rollupResult.entryKey = rollupChunk.name;

  return rollupResult;
}

export const DEFAULT_CORE = `
import '@global-scripts';
export * from '@stencil/core/platform';
`;

export const DEFAULT_ENTRY = `
import '@stencil/core/app';
`;
