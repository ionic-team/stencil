import * as d from '../../declarations';
import { appDataPlugin } from '../../compiler_next/bundle/app-data-plugin';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { coreResolvePlugin } from '../../compiler_next/bundle/core-resolve-plugin';
import { createOnWarnFn, getDependencies, loadRollupDiagnostics } from '@utils';
import { loaderPlugin } from '../rollup-plugins/loader';
import { imagePlugin } from '../rollup-plugins/image-plugin';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { OutputOptions, RollupBuild, RollupOptions, TreeshakingOptions } from 'rollup'; // types only
import { pluginHelper } from '../rollup-plugins/plugin-helper';
import { stencilClientPlugin } from '../rollup-plugins/stencil-client';
import { stencilExternalRuntimePlugin } from '../rollup-plugins/stencil-external-runtime';
import { STENCIL_INTERNAL_CLIENT_ID } from '../../compiler_next/bundle/entry-alias-ids';


export const bundleApp = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.BuildConditionals, bundleAppOptions: d.BundleAppOptions) => {
  const external = bundleAppOptions.skipDeps
    ? getDependencies(buildCtx)
    : [];

  try {
    const treeshake: TreeshakingOptions | boolean = !config.devMode && config.rollupConfig.inputOptions.treeshake !== false
      ? {
        unknownGlobalSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      }
      : false;
    const rollupOptions: RollupOptions = {
      ...config.rollupConfig.inputOptions,

      input: bundleAppOptions.inputs,
      plugins: [
        coreResolvePlugin(config, compilerCtx, 'client'),
        stencilExternalRuntimePlugin(bundleAppOptions.externalRuntime),
        loaderPlugin({
          '@stencil/core': DEFAULT_CORE,
          '@core-entrypoint': DEFAULT_ENTRY,
          ...bundleAppOptions.loader
        }),
        stencilClientPlugin(config),
        appDataPlugin(config, compilerCtx, buildCtx, build, 'client'),
        componentEntryPlugin(config, compilerCtx, buildCtx, build, buildCtx.entryModules),
        config.sys.rollup.plugins.commonjs({
          include: /node_modules/,
          sourceMap: false,
          ...config.commonjs
        }),
        ...config.rollupPlugins,
        pluginHelper(config, buildCtx),
        config.sys.rollup.plugins.nodeResolve({
          mainFields: ['collection:main', 'jsnext:main', 'es2017', 'es2015', 'module', 'main'],
          browser: true,
          ...config.nodeResolve
        }),
        config.sys.rollup.plugins.json(),
        imagePlugin(config, compilerCtx, buildCtx),
        inMemoryFsRead(config, compilerCtx),
        config.sys.rollup.plugins.replace({
          'process.env.NODE_ENV': config.devMode ? '"development"' : '"production"'
        }),
      ],
      treeshake,
      cache: bundleAppOptions.cache,
      onwarn: createOnWarnFn(buildCtx.diagnostics),
      external
    };

    const rollupBuild: RollupBuild = await config.sys.rollup.rollup(rollupOptions);
    return rollupBuild;

  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    }
  }

  return undefined;
};

export const generateRollupOutput = async (build: RollupBuild, options: OutputOptions, config: d.Config, entryModules: d.EntryModule[]): Promise<d.RollupResult[]> => {
  if (build == null) {
    return null;
  }

  const { output } = await build.generate(options);
  return output
    .map((chunk) => {
      if (chunk.type === 'chunk') {
        const isCore = Object.keys(chunk.modules).some(m => m.includes('@stencil/core'));
        return {
          type: 'chunk',
          fileName: chunk.fileName,
          code: chunk.code,
          moduleFormat: options.format,
          entryKey: chunk.name,
          imports: chunk.imports,
          isEntry: !!chunk.isEntry,
          isComponent: !!chunk.isEntry && entryModules.some(m => m.entryKey === chunk.name),
          isBrowserLoader: chunk.isEntry && chunk.name === config.fsNamespace,
          isIndex: chunk.isEntry && chunk.name === 'index',
          isCore,
        };
      } else {
        return {
          type: 'asset',
          fileName: chunk.fileName,
          content: chunk.source as any
        };
      }
    });
};

export const DEFAULT_CORE = `
export * from '${STENCIL_INTERNAL_CLIENT_ID}';
`;

export const DEFAULT_ENTRY = `
export * from '@stencil/core';
`;
