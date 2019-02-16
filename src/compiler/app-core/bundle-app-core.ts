import * as d from '@declarations';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { globalScriptsPlugin } from '../rollup-plugins/global-scripts';
import { logger, sys } from '@sys';
import { OutputAsset, OutputChunk, OutputOptions, RollupOptions } from 'rollup'; // types only
import { stencilAppCorePlugin } from '../rollup-plugins/stencil-app-core';
import { stencilBuildConditionalsPlugin } from '../rollup-plugins/stencil-build-conditionals';
import { stencilClientEntryPointPlugin } from '../rollup-plugins/stencil-client-entrypoint';


export async function bundleAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModules: d.EntryModule[], bundleCoreOptions: d.BundleCoreOptions) {
  const rollupResults: d.RollupResult[] = [];

  bundleCoreOptions.entryInputs[config.fsNamespace] = '@core-entrypoint';

  try {
    const rollupOptions: RollupOptions = {
      input: bundleCoreOptions.entryInputs,
      plugins: [
        stencilAppCorePlugin(bundleCoreOptions.entryFilePath),
        stencilClientEntryPointPlugin(),
        stencilBuildConditionalsPlugin(build),
        globalScriptsPlugin(config, compilerCtx),
        componentEntryPlugin(compilerCtx, buildCtx, build, entryModules),
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
      manualChunks: {
        [config.fsNamespace]: [bundleCoreOptions.entryFilePath]
      },
      onwarn: createOnWarnFn(logger, buildCtx.diagnostics),
    };

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
          return createRollupResult(config, outputOption.format as any, rollupOutput);
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


async function createRollupResult(config: d.Config, moduleFormat: d.ModuleFormat, rollupOutput: OutputAsset | OutputChunk) {
  const rollupResult: d.RollupResult = {
    fileName: rollupOutput.fileName,
    code: rollupOutput.code,
    moduleFormat: moduleFormat,
    entryKey: null,
    isEntry: !!(rollupOutput as OutputChunk).isEntry,
    isAppCore: false
  };
  const rollupChunk = rollupOutput as OutputChunk;
  rollupResult.isAppCore = (rollupChunk.name === config.fsNamespace);

  if (!rollupResult.isEntry) {
    return rollupResult;
  }

  rollupResult.entryKey = rollupChunk.name;

  return rollupResult;
}
