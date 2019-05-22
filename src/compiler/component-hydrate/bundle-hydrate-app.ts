import * as d from '../../declarations';
import { bundleJson } from '../rollup-plugins/json';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { globalScriptsPlugin } from '../rollup-plugins/global-scripts';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { loaderPlugin } from '../rollup-plugins/loader';
import { RollupBuild, RollupOptions } from 'rollup'; // types only
import { stencilBuildConditionalsPlugin } from '../rollup-plugins/stencil-build-conditionals';
import { stencilHydratePlugin } from '../rollup-plugins/stencil-hydrate';


export async function bundleHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, appEntryCode: string) {
  try {
    const treeshake = !config.devMode && config.rollupConfig.inputOptions.treeshake !== false;
    const rollupOptions: RollupOptions = {
      ...config.rollupConfig.inputOptions,

      input: '@app-entry',
      inlineDynamicImports: true,
      plugins: [
        loaderPlugin({
          '@app-entry': appEntryCode
        }),
        stencilHydratePlugin(config),
        stencilBuildConditionalsPlugin(build, config.fsNamespace),
        globalScriptsPlugin(config, compilerCtx),
        componentEntryPlugin(config, compilerCtx, buildCtx, build, buildCtx.entryModules),
        ...config.plugins,
        config.sys.rollup.plugins.nodeResolve({
          mainFields: ['collection:main', 'jsnext:main', 'es2017', 'es2015', 'module', 'main'],
          ...config.nodeResolve
        }),
        config.sys.rollup.plugins.emptyJsResolver(),
        config.sys.rollup.plugins.commonjs({
          include: /node_modules/,
          sourceMap: false,
          ...config.commonjs
        }),
        bundleJson(config),
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
    loadRollupDiagnostics(compilerCtx, buildCtx, e);
  }

  return undefined;
}
