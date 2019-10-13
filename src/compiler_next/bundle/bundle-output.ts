import * as d from '../../declarations';
import { appDataPlugin } from './app-data-plugin';
import { BundleOptions } from './bundle-interface';
import { coreResolvePlugin } from './core-resolve-plugin';
import { createCustomResolverAsync } from '../sys/resolve/resolve-module';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { extensionTransformerPlugin } from './extension-transformer-plugin';
import { imagePlugin } from '../../compiler/rollup-plugins/image-plugin';
import { lazyCorePlugin } from '../output-targets/component-lazy/lazy-core-plugin';
import { lazyComponentPlugin } from '../output-targets/component-lazy/lazy-component-plugin';
import { pluginHelper } from '../../compiler/rollup-plugins/plugin-helper';
import { rollupCommonjsPlugin, rollupJsonPlugin, rollupNodeResolvePlugin, rollupReplacePlugin } from '@compiler-plugins';
import { RollupOptions, TreeshakingOptions, rollup } from 'rollup';
import { sysPlugin } from './sys-plugin';
import { typescriptPlugin } from './typescript-plugin';
import { userIndexPlugin } from './user-index-plugin';
import { writeBuildOutputs } from './write-outputs';


export const bundleOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => {
  try {
    const rollupOptions = getRollupOptions(config, compilerCtx, buildCtx, bundleOpts);

    const rollupBuild = await rollup(rollupOptions);

    const rollupOutput = await rollupBuild.generate(bundleOpts.outputOptions);

    compilerCtx.rollupCache.set(
      bundleOpts.id,
      rollupBuild.cache
    );

    await writeBuildOutputs(compilerCtx, buildCtx, bundleOpts.outputTargets, rollupOutput);

  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(compilerCtx, buildCtx, e);
    }
  }
};


const getRollupOptions = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => {

  const rollupOptions: RollupOptions = {

    input: bundleOpts.inputs,

    plugins: [
      coreResolvePlugin(config, compilerCtx, bundleOpts.platform),
      appDataPlugin(config, compilerCtx, bundleOpts.conditionals, bundleOpts.platform),
      lazyComponentPlugin(buildCtx),
      lazyCorePlugin(config, buildCtx),
      userIndexPlugin(config, compilerCtx),
      rollupCommonjsPlugin({
        include: /node_modules/,
        sourceMap: false,
        ...config.commonjs
      }),
      ...config.rollupPlugins,
      pluginHelper(config, buildCtx),
      rollupNodeResolvePlugin({
        mainFields: ['collection:main', 'jsnext:main', 'es2017', 'es2015', 'module', 'main'],
        browser: true,
        customResolveOptions: createCustomResolverAsync(config, compilerCtx.fs, ['.tsx', '.ts', '.mjs', '.js', '.json']),
        ...config.nodeResolve as any
      }),
      rollupJsonPlugin(),
      imagePlugin(config, buildCtx),
      extensionTransformerPlugin(config, compilerCtx, buildCtx),
      rollupReplacePlugin({
        'process.env.NODE_ENV': config.devMode ? '"development"' : '"production"'
      }),
      typescriptPlugin(bundleOpts),
      sysPlugin(compilerCtx.fs)
    ],

    treeshake: getTreeshakeOption(config),

    onwarn: createOnWarnFn(buildCtx.diagnostics),

    cache: compilerCtx.rollupCache.get(bundleOpts.id)
  };

  return rollupOptions;
};

const getTreeshakeOption = (config: d.Config) => {
  const treeshake: TreeshakingOptions | boolean = !config.devMode && config.rollupConfig.inputOptions.treeshake !== false
    ? {
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    }
    : false;
  return treeshake;
};
