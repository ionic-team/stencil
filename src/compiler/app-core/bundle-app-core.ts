import * as d from '../../declarations';
import { bundleJson } from '../rollup-plugins/json';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { createOnWarnFn, getDependencies, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { globalScriptsPlugin } from '../rollup-plugins/global-scripts';
import { OutputChunk, OutputOptions, RollupBuild, RollupOptions } from 'rollup'; // types only
import { stencilBuildConditionalsPlugin } from '../rollup-plugins/stencil-build-conditionals';
import { stencilClientPlugin } from '../rollup-plugins/stencil-client';
import { loaderPlugin } from '../rollup-plugins/loader';
import { stencilExternalRuntimePlugin } from '../rollup-plugins/stencil-external-runtime';


export async function bundleApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, bundleAppOptions: d.BundleAppOptions) {
  const external = bundleAppOptions.skipDeps
    ? getDependencies(buildCtx)
    : [];

  try {
    const rollupOptions: RollupOptions = {
      input: bundleAppOptions.inputs,
      plugins: [
        stencilExternalRuntimePlugin(bundleAppOptions.externalRuntime),
        loaderPlugin({
          '@stencil/core': DEFAULT_CORE,
          '@core-entrypoint': DEFAULT_ENTRY,
          ...bundleAppOptions.loader
        }),
        stencilClientPlugin(config),
        stencilBuildConditionalsPlugin(build),
        globalScriptsPlugin(config, compilerCtx, buildCtx, build),
        componentEntryPlugin(config, compilerCtx, buildCtx, build, buildCtx.entryModules),
        config.sys.rollup.plugins.nodeResolve({
          mainFields: ['collection:main', 'jsnext:main', 'es2017', 'es2015', 'module', 'main']
        }),
        config.sys.rollup.plugins.emptyJsResolver(),
        config.sys.rollup.plugins.commonjs({
          include: /node_modules/,
          sourceMap: false
        }),
        bundleJson(config),
        inMemoryFsRead(config, compilerCtx, buildCtx),
        ...config.plugins
      ],
      treeshake: config.devMode ? false : {
        annotations: true,
        propertyReadSideEffects: false,
        pureExternalModules: false
      },
      cache: bundleAppOptions.cache,
      onwarn: createOnWarnFn(buildCtx.diagnostics),
      external
    };
    if (bundleAppOptions.emitCoreChunk) {
      rollupOptions.manualChunks = {
        [config.fsNamespace]: ['@stencil/core']
      };
    }

    const rollupBuild: RollupBuild = await config.sys.rollup.rollup(rollupOptions);
    return rollupBuild;

  } catch (e) {
    loadRollupDiagnostics(compilerCtx, buildCtx, e);
  }

  return undefined;
}

export async function generateRollupOutput(build: RollupBuild, options: OutputOptions, config: d.Config, entryModules: d.EntryModule[]): Promise<d.RollupResult[]> {
  if (build == null) {
    return null;
  }

  const { output } = await build.generate(options);
  return output
    .filter(chunk => !('isAsset' in chunk))
    .map((chunk: OutputChunk) => ({
      fileName: chunk.fileName,
      code: chunk.code,
      moduleFormat: options.format,
      entryKey: chunk.name,
      imports: chunk.imports,
      isEntry: !!chunk.isEntry,
      isComponent: !!chunk.isEntry && entryModules.some(m => m.entryKey === chunk.name),
      isCore: !chunk.isEntry && chunk.name === config.fsNamespace,
      isBrowserLoader: chunk.isEntry && chunk.name === config.fsNamespace,
      isIndex: chunk.isEntry && chunk.name === 'index',
    }));
}

export const DEFAULT_CORE = `
export * from '@stencil/core/platform';
`;

export const DEFAULT_ENTRY = `
export * from '@stencil/core';
`;
