import * as d from '../../declarations';
import { appDataPlugin } from './app-data-plugin';
import { BundleOptions } from './bundle-interface';
import { coreResolvePlugin } from './core-resolve-plugin';
import { createCustomResolverAsync } from '../sys/resolve/resolve-module';
import { createOnWarnFn, loadRollupDiagnostics, hasError } from '@utils';
import { extTransformsPlugin } from './ext-transforms-plugin';
import { fileLoadPlugin } from './file-load-plugin';
import { textPlugin } from './text-plugin';
import { imagePlugin } from '../../compiler/rollup-plugins/image-plugin';
import { lazyComponentPlugin } from '../output-targets/dist-lazy/lazy-component-plugin';
import { loaderPlugin } from '../../compiler/rollup-plugins/loader';
import { pluginHelper } from '../../compiler/rollup-plugins/plugin-helper';
import { rollupCommonjsPlugin, rollupJsonPlugin, rollupNodeResolvePlugin, rollupReplacePlugin } from '@compiler-plugins';
import { RollupOptions, TreeshakingOptions, rollup, OutputChunk } from 'rollup';
import { typescriptPlugin } from './typescript-plugin';
import { userIndexPlugin } from './user-index-plugin';
import { workerPlugin } from './worker-plugin';
import { optimizeModule } from '../optimize/optimize-module';


export const bundleApp = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => {
  try {
    const rollupOptions = getRollupOptions(config, compilerCtx, buildCtx, bundleOpts);
    const rollupBuild = await rollup(rollupOptions);

    compilerCtx.rollupCache.set(
      bundleOpts.id,
      rollupBuild.cache
    );
    return rollupBuild;

  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(compilerCtx, buildCtx, e);
    }
  }
  return undefined;
};


export const getRollupOptions = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => {
  const customResolveOptions = createCustomResolverAsync(
    config,
    compilerCtx.fs,
    ['.tsx', '.ts', '.js', '.mjs', '.json']
  );

  const rollupOptions: RollupOptions = {

    input: bundleOpts.inputs,

    plugins: [
      coreResolvePlugin(config, compilerCtx, bundleOpts.platform),
      appDataPlugin(config, compilerCtx, bundleOpts.conditionals, bundleOpts.platform),
      lazyComponentPlugin(buildCtx),
      loaderPlugin(bundleOpts.loader),
      userIndexPlugin(config, compilerCtx),
      typescriptPlugin(compilerCtx, bundleOpts),
      imagePlugin(config, compilerCtx, buildCtx),
      textPlugin(),
      extTransformsPlugin(config, compilerCtx, buildCtx),
      workerPlugin(config, compilerCtx, buildCtx),
      ...config.rollupPlugins,
      rollupNodeResolvePlugin({
        mainFields: ['browser', 'collection:main', 'jsnext:main', 'es2017', 'es2015', 'module', 'main'],
        customResolveOptions,
        ...config.nodeResolve as any
      }),
      rollupCommonjsPlugin({
        include: /node_modules/,
        sourceMap: config.sourceMap,
        ...config.commonjs
      }),
      pluginHelper(config, buildCtx),
      rollupJsonPlugin(),
      rollupReplacePlugin({
        'process.env.NODE_ENV': config.devMode ? '"development"' : '"production"'
      }),
      fileLoadPlugin(compilerCtx.fs),
    ],

    treeshake: getTreeshakeOption(config),
    inlineDynamicImports: bundleOpts.inlineDynamicImports,

    onwarn: createOnWarnFn(buildCtx.diagnostics),

    cache: compilerCtx.rollupCache.get(bundleOpts.id),
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

export const bundleOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions, format: d.ModuleFormat = 'es') => {
  const build = await bundleApp(config, compilerCtx, buildCtx, bundleOpts);
  const rollupOutput = await build.generate({
    format,
    sourcemap: config.sourceMap,
  });
  const chunk = rollupOutput.output.find(o => o.type === 'chunk') as OutputChunk;
  let code = chunk.code;
  const optimizeResults = await optimizeModule(config, compilerCtx, {
    input: code,
    isCore: true,
    minify: config.minifyJs
  });
  buildCtx.diagnostics.push(...optimizeResults.diagnostics);
  if (hasError(optimizeResults.diagnostics) && typeof optimizeResults.output === 'string') {
    code = optimizeResults.output;
  }
  return code;
};
