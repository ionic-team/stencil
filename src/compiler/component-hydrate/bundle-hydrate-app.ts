import * as d from '../../declarations';
import { bundleJson } from '../rollup-plugins/json';
import { componentEntryPlugin } from '../rollup-plugins/component-entry';
import { globalScriptsPlugin } from '../rollup-plugins/global-scripts';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { RollupBuild, RollupOptions } from 'rollup'; // types only
import { stencilBuildConditionalsPlugin } from '../rollup-plugins/stencil-build-conditionals';
import { stencilHydratePlugin } from '../rollup-plugins/stencil-hydrate';
import { loaderPlugin } from '../rollup-plugins/loader';


export async function bundleHydrateApp(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, appEntryCode: string) {
  try {
    const rollupOptions: RollupOptions = {
      input: [
        'index',
        'app'
      ],
      plugins: [
        loaderPlugin({
          'index': CORE_ENTRY,
          'app': appEntryCode
        }),
        stencilHydratePlugin(config),

        stencilBuildConditionalsPlugin(build, config.fsNamespace),
        globalScriptsPlugin(config, compilerCtx),
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
        inMemoryFsRead(config, compilerCtx),
        ...config.plugins
      ],
      external: [
        'fs',
        'path',
        'vm'
      ],
      treeshake: {
        annotations: true,
        propertyReadSideEffects: false,
        pureExternalModules: false
      },
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

const CORE_ENTRY = `export { hydrateDocument, renderToString } from '@stencil/core/hydrate';`;
