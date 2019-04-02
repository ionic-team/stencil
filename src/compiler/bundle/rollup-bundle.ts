import * as d from '../../declarations';
import abortPlugin from './rollup-plugins/abort-plugin';
import bundleJson from './rollup-plugins/json';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { getUserCompilerOptions } from '../transpile/compiler-options';
import localResolution from './rollup-plugins/local-resolution';
import inMemoryFsRead from './rollup-plugins/in-memory-fs-read';
import { RollupBuild, RollupOptions } from 'rollup'; // types only
import pathsResolution from './rollup-plugins/paths-resolution';
import pluginHelper from './rollup-plugins/plugin-helper';
import rollupPluginReplace from './rollup-plugins/rollup-plugin-replace';
import statsPlugin from './rollup-plugins/rollup-stats-plugin';


export async function createBundle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (!buildCtx.isActiveBuild) {
    buildCtx.debug(`createBundle aborted, not active build`);
  }

  const timeSpan = buildCtx.createTimeSpan(`createBundle started`, true);

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
    input: entryModules.map(b => b.filePath),
    preserveSymlinks: false,
    treeshake: !config.devMode,
    cache: config.enableCache ? compilerCtx.rollupCache : undefined,
    plugins: [
      abortPlugin(buildCtx),
      config.sys.rollup.plugins.nodeResolve(nodeResolveConfig),
      config.sys.rollup.plugins.emptyJsResolver(),
      config.sys.rollup.plugins.commonjs(commonjsConfig),
      bundleJson(config),
      inMemoryFsRead(config, compilerCtx, buildCtx, entryModules),
      pathsResolution(config, compilerCtx, tsCompilerOptions),
      localResolution(config, compilerCtx),
      rollupPluginReplace({
        values: replaceObj
      }),
      ...config.plugins,
      statsPlugin(buildCtx),
      pluginHelper(config, compilerCtx, buildCtx),
      abortPlugin(buildCtx)
    ],
    onwarn: createOnWarnFn(config, buildCtx.diagnostics)
  };

  let rollupBundle: RollupBuild;
  try {
    rollupBundle = await config.sys.rollup.rollup(rollupConfig);
    compilerCtx.rollupCache = rollupBundle ? rollupBundle.cache : undefined;

  } catch (err) {
    // clean rollup cache if error
    compilerCtx.rollupCache = undefined;

    // looks like there was an error bundling!
    if (buildCtx.isActiveBuild) {
      loadRollupDiagnostics(config, compilerCtx, buildCtx, err);

    } else {
      buildCtx.debug(`createBundle errors ignored, not active build`);
    }
  }

  timeSpan.finish(`createBundle finished`);
  return rollupBundle;
}
