import * as d from '../../declarations';
import { appDataPlugin } from './app-data-plugin';
import { BundleOptions } from './bundle-interface';
import { coreResolvePlugin } from './core-resolve-plugin';
import { createCustomResolverAsync } from '../sys/resolve/resolve-module-async';
import { createOnWarnFn, loadRollupDiagnostics } from '@utils';
import { devNodeModuleResolveId } from './dev-module';
import { extTransformsPlugin } from './ext-transforms-plugin';
import { fileLoadPlugin } from './file-load-plugin';
import { imagePlugin } from './image-plugin';
import { lazyComponentPlugin } from '../output-targets/dist-lazy/lazy-component-plugin';
import { loaderPlugin } from './loader-plugin';
import { pluginHelper } from './plugin-helper';
import { resolveIdWithTypeScript, typescriptPlugin } from './typescript-plugin';
import { rollupCommonjsPlugin, rollupJsonPlugin, rollupNodeResolvePlugin, rollupReplacePlugin } from '@compiler-plugins';
import { RollupOptions, TreeshakingOptions, rollup } from 'rollup';
import { textPlugin } from './text-plugin';
import { userIndexPlugin } from './user-index-plugin';
import { workerPlugin } from './worker-plugin';

export const bundleOutput = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => {
  try {
    const rollupOptions = getRollupOptions(config, compilerCtx, buildCtx, bundleOpts);
    const rollupBuild = await rollup(rollupOptions);

    compilerCtx.rollupCache.set(bundleOpts.id, rollupBuild.cache);
    return rollupBuild;
  } catch (e) {
    if (!buildCtx.hasError) {
      loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    }
  }
  return undefined;
};

export const getRollupOptions = (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, bundleOpts: BundleOptions) => {
  const customResolveOptions = createCustomResolverAsync(config.sys, compilerCtx.fs, ['.tsx', '.ts', '.js', '.mjs', '.json', '.d.ts']);
  const nodeResolvePlugin = rollupNodeResolvePlugin({
    mainFields: ['collection:main', 'jsnext:main', 'es2017', 'es2015', 'module', 'main'],
    customResolveOptions,
    browser: true,
    ...(config.nodeResolve as any),
  });
  const orgNodeResolveId = nodeResolvePlugin.resolveId;
  const orgNodeResolveId2 = nodeResolvePlugin.resolveId = async function(importee: string, importer: string) {
    const [readImportee, query] = importee.split('?');
    const resolved = await orgNodeResolveId.call(nodeResolvePlugin, readImportee, importer);
    if (resolved) {
      return {
        ...resolved,
        id: query
          ? resolved.id + '?' + query
          : resolved.id,
      }
    }
    return resolved;
  }
  if (config.devServer && config.devServer.experimentalDevModules) {

    nodeResolvePlugin.resolveId = async function(importee: string, importer: string) {
      const resolvedId = await orgNodeResolveId2.call(nodeResolvePlugin, importee, importer);
      return devNodeModuleResolveId(config, compilerCtx.fs, resolvedId, importee);
    };
  }

  const beforePlugins = config.rollupPlugins.before || [];
  const afterPlugins = config.rollupPlugins.after || [];
  const rollupOptions: RollupOptions = {
    input: bundleOpts.inputs,

    plugins: [
      coreResolvePlugin(config, compilerCtx, bundleOpts.platform),
      appDataPlugin(config, compilerCtx, buildCtx, bundleOpts.conditionals, bundleOpts.platform),
      lazyComponentPlugin(buildCtx),
      loaderPlugin(bundleOpts.loader),
      userIndexPlugin(config, compilerCtx),
      typescriptPlugin(compilerCtx, bundleOpts),
      imagePlugin(config, buildCtx),
      textPlugin(),
      extTransformsPlugin(config, compilerCtx, buildCtx, bundleOpts),
      workerPlugin(config, compilerCtx, buildCtx, bundleOpts.platform, !!bundleOpts.inlineWorkers),
      ...beforePlugins,
      nodeResolvePlugin,
      resolveIdWithTypeScript(config, compilerCtx),
      rollupCommonjsPlugin({
        include: /node_modules/,
        sourceMap: config.sourceMap,
        ...config.commonjs,
      }),
      ...afterPlugins,
      pluginHelper(config, buildCtx),
      rollupJsonPlugin({
        preferConst: true,
      }),
      rollupReplacePlugin({
        'process.env.NODE_ENV': config.devMode ? '"development"' : '"production"',
      }),
      fileLoadPlugin(compilerCtx.fs),
    ],

    treeshake: getTreeshakeOption(config, bundleOpts),
    inlineDynamicImports: bundleOpts.inlineDynamicImports,

    onwarn: createOnWarnFn(buildCtx.diagnostics),

    cache: compilerCtx.rollupCache.get(bundleOpts.id),
  };

  return rollupOptions;
};

const getTreeshakeOption = (config: d.Config, bundleOpts: BundleOptions) => {
  if (bundleOpts.platform === 'hydrate') {
    return {
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    };
  }
  const treeshake: TreeshakingOptions | boolean =
    !config.devMode && config.rollupConfig.inputOptions.treeshake !== false
      ? {
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        }
      : false;
  return treeshake;
};
