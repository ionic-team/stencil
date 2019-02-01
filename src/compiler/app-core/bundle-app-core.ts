import * as d from '@declarations';
import { buildConditionalsPlugin } from '../rollup-plugins/build-conditionals';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { logger, sys } from '@sys';
import { OutputAsset, OutputChunk, OutputOptions, RollupBuild, RollupOptions } from 'rollup'; // types only
import { stencilDependenciesPlugin } from '../rollup-plugins/stencil-dependencies';


export async function bundleAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModules: d.EntryModule[], appCoreEntryFilePath: string, bundleEntryInputs: d.BundleEntryInputs) {
  const rollupResults: d.RollupResult[] = [];

  bundleEntryInputs[config.fsNamespace] = appCoreEntryFilePath;

  try {
    const rollupOptions: RollupOptions = {
      input: bundleEntryInputs,
      plugins: [
        stencilDependenciesPlugin(config, appCoreEntryFilePath),
        buildConditionalsPlugin(build),
        componentEntryPlugin(config, compilerCtx, buildCtx, build, entryModules),
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

    const rollupBuild: RollupBuild = await sys.rollup.rollup(rollupOptions);

    const outputOptions: OutputOptions[] = [];

    outputOptions.push({
      format: 'esm'
    });

    if (build.es5) {
      outputOptions.push({
        format: 'amd'
      });
    }

    const generatePromises = outputOptions.map(async outputOption => {
      const { output } = await rollupBuild.generate(outputOption);

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
      logger.error(`bundleAppCore, bundleEntryInputs: ${bundleEntryInputs}`);
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

  if (!rollupResult.isEntry) {
    return rollupResult;
  }

  const rollupChunk = rollupOutput as OutputChunk;

  rollupResult.isAppCore = (rollupChunk.name === config.fsNamespace);
  rollupResult.entryKey = rollupChunk.name;

  return rollupResult;
}
