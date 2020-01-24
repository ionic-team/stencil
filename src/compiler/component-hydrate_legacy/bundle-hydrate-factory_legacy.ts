import * as d from '../../declarations';
import { appDataPlugin } from '../../compiler_next/bundle/app-data-plugin';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { coreResolvePlugin } from '../../compiler_next/bundle/core-resolve-plugin';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { loaderPlugin } from '../rollup-plugins/loader';
import { pluginHelper } from '../rollup-plugins/plugin-helper';
import { RollupBuild, RollupOptions } from 'rollup'; // types only


export const bundleHydrateFactory = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.BuildConditionals, appFactoryEntryCode: string) => {
  try {
    const treeshake = false;

    const rollupOptions: RollupOptions = {
      ...config.rollupConfig.inputOptions,

      input: '@app-factory-entry',
      inlineDynamicImports: true,
      plugins: [
        coreResolvePlugin(config, compilerCtx, 'hydrate'),
        loaderPlugin({
          '@app-factory-entry': appFactoryEntryCode
        }),
        appDataPlugin(config, compilerCtx, buildCtx, build, 'hydrate'),
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
          ...config.nodeResolve
        }),
        config.sys.rollup.plugins.json(),
        inMemoryFsRead(config, compilerCtx),
        config.sys.rollup.plugins.replace({
          'process.env.NODE_ENV': config.devMode ? '"development"' : '"production"'
        }),
      ],
      treeshake,
      cache: compilerCtx.rollupCacheHydrate,
      onwarn: createOnWarnFn(buildCtx.diagnostics),
    };

    const rollupBuild: RollupBuild = await config.sys.rollup.rollup(rollupOptions);
    if (rollupBuild != null) {
      compilerCtx.rollupCacheHydrate = rollupBuild.cache;
    } else {
      compilerCtx.rollupCacheHydrate = null;
    }

    return rollupBuild;

  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    }
  }

  return undefined;
};
