import * as d from '../../declarations';
import abortPlugin from './rollup-plugins/abort-plugin';
import bundleJson from './rollup-plugins/json';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { getUserCompilerOptions } from '../transpile/compiler-options';
import localResolution from './rollup-plugins/local-resolution';
import inMemoryFsRead from './rollup-plugins/in-memory-fs-read';
import { RollupBuild, RollupDirOptions } from 'rollup'; // types only
import nodeEnvVars from './rollup-plugins/node-env-vars';
import pathsResolution from './rollup-plugins/paths-resolution';
import pluginHelper from './rollup-plugins/plugin-helper';
import rollupPluginReplace from './rollup-plugins/rollup-plugin-replace';
import globals from './rollup-plugins/node-globals';
import statsPlugin from './rollup-plugins/rollup-stats-plugin';


export async function createBundle(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, entryModules: d.EntryModule[]) {
  if (!buildCtx.isActiveBuild) {
    buildCtx.debug(`createBundle aborted, not active build`);
  }

  const buildConditionals = {
    isDev: !!config.devMode
  } as d.BuildConditionals;

  const replaceObj = Object.keys(buildConditionals).reduce((all, key) => {
    all[`Build.${key}`] = buildConditionals[key];
    return all;
  }, <{ [key: string]: any}>{});

  const timeSpan = buildCtx.createTimeSpan(`createBundle started`, true);

  let rollupBundle: RollupBuild;

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

  const tsCompilerOptions = await getUserCompilerOptions(config, compilerCtx);

  const rollupConfig: RollupDirOptions = {
    ...config.rollupConfig.inputOptions,
    input: entryModules.map(b => b.filePath),
    experimentalCodeSplitting: true,
    preserveSymlinks: false,
    optimizeChunks: true,
    chunkGroupingSize: 5500,
    plugins: [
      abortPlugin(buildCtx),
      rollupPluginReplace({
        values: replaceObj
      }),
      config.sys.rollup.plugins.nodeResolve(nodeResolveConfig),
      config.sys.rollup.plugins.commonjs(commonjsConfig),
      bundleJson(config),
      globals(),
      inMemoryFsRead(config, compilerCtx, buildCtx, entryModules),
      pathsResolution(config, compilerCtx, tsCompilerOptions),
      localResolution(config, compilerCtx),
      nodeEnvVars(config),
      ...config.plugins,
      statsPlugin(buildCtx),
      pluginHelper(config, compilerCtx, buildCtx),
      abortPlugin(buildCtx)
    ],
    onwarn: createOnWarnFn(config, buildCtx.diagnostics)
  };

  try {
    rollupBundle = await config.sys.rollup.rollup(rollupConfig);

  } catch (err) {
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
