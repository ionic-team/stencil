import * as d from '@declarations';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { globalScriptsPlugin } from '../rollup-plugins/global-scripts';
import { OutputChunk, OutputOptions, RollupBuild, RollupOptions } from 'rollup'; // types only
import { stencilBuildConditionalsPlugin } from '../rollup-plugins/stencil-build-conditionals';
import { stencilClientPlugin } from '../rollup-plugins/stencil-client';
import { stencilLoaderPlugin } from '../rollup-plugins/stencil-loader';
import { sys } from '@sys';


export async function bundleApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, bundleCoreOptions: d.BundleCoreOptions) {
  try {
    const rollupOptions: RollupOptions = {
      input: bundleCoreOptions.entryInputs,
      plugins: [
        stencilLoaderPlugin({
          '@stencil/core/app': DEFAULT_CORE,
          '@core-entrypoint': DEFAULT_ENTRY,
          ...bundleCoreOptions.loader
        }),
        stencilClientPlugin(),
        stencilBuildConditionalsPlugin(build),
        globalScriptsPlugin(config, compilerCtx, buildCtx, build),
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
      onwarn: createOnWarnFn(buildCtx.diagnostics),
    };
    if (bundleCoreOptions.coreChunk) {
      rollupOptions.manualChunks = {
        [config.fsNamespace]: ['@stencil/core/app']
      };
    }

    const rollupBuild = await sys.rollup.rollup(rollupOptions);
    return rollupBuild;

  } catch (e) {
    loadRollupDiagnostics(compilerCtx, buildCtx, e);
  }

  return undefined;
}

export async function generateRollupBuild(build: RollupBuild, options: OutputOptions, config: d.Config, entryModules: d.EntryModule[]): Promise<d.RollupResult[]> {
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
      isEntry: !!chunk.isEntry,
      isComponent: !!chunk.isEntry && entryModules.some(m => m.entryKey === chunk.name),
      isAppCore: !chunk.isEntry && chunk.name === config.fsNamespace
    }));
}

export const DEFAULT_CORE = `
export * from '@stencil/core/platform';
`;

export const DEFAULT_ENTRY = `
import '@stencil/core/app';
`;
