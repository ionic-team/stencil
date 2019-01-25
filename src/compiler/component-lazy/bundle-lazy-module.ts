import * as d from '@declarations';
import { abortPlugin } from '../rollup-plugins/abort-plugin';
import { bundleJson } from '../rollup-plugins/json';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { getUserCompilerOptions } from '../transpile/compiler-options';
import { localResolution } from '../rollup-plugins/local-resolution';
import { logger, sys } from '@sys';
import { inMemoryFsRead } from '../rollup-plugins/in-memory-fs-read';
import { RollupBuild, RollupOptions } from 'rollup'; // types only
import { pathsResolver } from '../rollup-plugins/paths-resolution';
import { pluginHelper } from '../rollup-plugins/plugin-helper';
import { replacePlugin } from '../rollup-plugins/rollup-plugin-replace';
import { statsPlugin } from '../rollup-plugins/rollup-stats-plugin';


export async function bundleLazyModule(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryInputPaths: string[]) {
  if (!buildCtx.isActiveBuild) {
    buildCtx.debug(`bundleLazyModule aborted, not active build`);
  }

  const timeSpan = buildCtx.createTimeSpan(`bundleLazyModule started`, true);

  const replaceObj = {
    'Build.isDev': !!config.devMode,
    'process.env.NODE_ENV': config.devMode ? '"development"' : '"production"'
  };
  const commonjsConfig = {
    include: 'node_modules/**',
    sourceMap: false,
    ...config.commonjs
  };

  const nodeResolveConfig: d.NodeResolveConfig = {
    jsnext: true,
    main: true,
    ...config.nodeResolve
  };

  const tsCompilerOptions = await getUserCompilerOptions(config, compilerCtx, buildCtx);

  const rollupConfig: RollupOptions = {
    ...config.rollupConfig.inputOptions,
    input: entryInputPaths,
    preserveSymlinks: false,
    treeshake: !config.devMode,
    cache: config.enableCache ? compilerCtx.rollupCache : undefined,
    plugins: [
      abortPlugin(buildCtx),
      sys.rollup.plugins.nodeResolve(nodeResolveConfig),
      sys.rollup.plugins.emptyJsResolver(),
      sys.rollup.plugins.commonjs(commonjsConfig),
      bundleJson(config),
      inMemoryFsRead(compilerCtx, buildCtx),
      pathsResolver(config, compilerCtx, tsCompilerOptions),
      localResolution(compilerCtx),
      replacePlugin({
        values: replaceObj
      }),
      ...config.plugins,
      statsPlugin(buildCtx),
      pluginHelper(config, compilerCtx, buildCtx),
      abortPlugin(buildCtx)
    ],
    onwarn: createOnWarnFn(logger, buildCtx.diagnostics)
  };

  let rollupBuild: RollupBuild = null;
  try {
    rollupBuild = await sys.rollup.rollup(rollupConfig);
    compilerCtx.rollupCache = rollupBuild ? rollupBuild.cache : undefined;

  } catch (err) {
    // clean rollup cache if error
    compilerCtx.rollupCache = undefined;

    // looks like there was an error bundling!
    if (buildCtx.isActiveBuild) {
      loadRollupDiagnostics(sys, config, compilerCtx, buildCtx, err);

    } else {
      buildCtx.debug(`bundleLazyModule errors ignored, not active build`);
    }
  }

  timeSpan.finish(`bundleLazyModule finished`);

  return rollupBuild;
}
