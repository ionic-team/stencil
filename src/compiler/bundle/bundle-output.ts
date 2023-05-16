import { rollupCommonjsPlugin, rollupJsonPlugin, rollupNodeResolvePlugin, rollupReplacePlugin } from '@compiler-deps';
import { createOnWarnFn, isString, loadRollupDiagnostics } from '@utils';
import { rollup, RollupOptions, TreeshakingOptions } from 'rollup';

import type * as d from '../../declarations';
import { lazyComponentPlugin } from '../output-targets/dist-lazy/lazy-component-plugin';
import { createCustomResolverAsync } from '../sys/resolve/resolve-module-async';
import { appDataPlugin } from './app-data-plugin';
import type { BundleOptions } from './bundle-interface';
import { coreResolvePlugin } from './core-resolve-plugin';
import { devNodeModuleResolveId } from './dev-node-module-resolve';
import { extFormatPlugin } from './ext-format-plugin';
import { extTransformsPlugin } from './ext-transforms-plugin';
import { fileLoadPlugin } from './file-load-plugin';
import { loaderPlugin } from './loader-plugin';
import { pluginHelper } from './plugin-helper';
import { serverPlugin } from './server-plugin';
import { resolveIdWithTypeScript, typescriptPlugin } from './typescript-plugin';
import { userIndexPlugin } from './user-index-plugin';
import { workerPlugin } from './worker-plugin';

export const bundleOutput = async (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  bundleOpts: BundleOptions
) => {
  try {
    const rollupOptions = getRollupOptions(config, compilerCtx, buildCtx, bundleOpts);
    const rollupBuild = await rollup(rollupOptions);

    compilerCtx.rollupCache.set(bundleOpts.id, rollupBuild.cache);
    return rollupBuild;
  } catch (e: any) {
    if (!buildCtx.hasError) {
      // TODO(STENCIL-353): Implement a type guard that balances using our own copy of Rollup types (which are
      // breakable) and type safety (so that the error variable may be something other than `any`)
      loadRollupDiagnostics(config, compilerCtx, buildCtx, e);
    }
  }
  return undefined;
};

/**
 * Build the rollup options that will be used to transpile, minify, and otherwise transform a Stencil project
 * @param config the Stencil configuration for the project
 * @param compilerCtx the current compiler context
 * @param buildCtx a context object containing information about the current build
 * @param bundleOpts Rollup bundling options to apply to the base configuration setup by this function
 * @returns the rollup options to be used
 */
export const getRollupOptions = (
  config: d.ValidatedConfig,
  compilerCtx: d.CompilerCtx,
  buildCtx: d.BuildCtx,
  bundleOpts: BundleOptions
): RollupOptions => {
  const customResolveOptions = createCustomResolverAsync(config.sys, compilerCtx.fs, [
    '.tsx',
    '.ts',
    '.js',
    '.mjs',
    '.json',
    '.d.ts',
  ]);
  const nodeResolvePlugin = rollupNodeResolvePlugin({
    mainFields: ['collection:main', 'jsnext:main', 'es2017', 'es2015', 'module', 'main'],
    customResolveOptions,
    browser: true,
    rootDir: config.rootDir,
    ...(config.nodeResolve as any),
  });
  const orgNodeResolveId = nodeResolvePlugin.resolveId;
  const orgNodeResolveId2 = (nodeResolvePlugin.resolveId = async function (importee: string, importer: string) {
    const [realImportee, query] = importee.split('?');
    const resolved = await orgNodeResolveId.call(nodeResolvePlugin, realImportee, importer);
    if (resolved) {
      if (isString(resolved)) {
        return query ? resolved + '?' + query : resolved;
      }
      return {
        ...resolved,
        id: query ? resolved.id + '?' + query : resolved.id,
      };
    }
    return resolved;
  });
  if (config.devServer?.experimentalDevModules) {
    nodeResolvePlugin.resolveId = async function (importee: string, importer: string) {
      const resolvedId = await orgNodeResolveId2.call(nodeResolvePlugin, importee, importer);
      return devNodeModuleResolveId(config, compilerCtx.fs, resolvedId, importee);
    };
  }

  const beforePlugins = config.rollupPlugins.before || [];
  const afterPlugins = config.rollupPlugins.after || [];
  const rollupOptions: RollupOptions = {
    input: bundleOpts.inputs,
    output: {
      inlineDynamicImports: bundleOpts.inlineDynamicImports ?? false,
    },

    plugins: [
      coreResolvePlugin(config, compilerCtx, bundleOpts.platform, bundleOpts.externalRuntime),
      appDataPlugin(config, compilerCtx, buildCtx, bundleOpts.conditionals, bundleOpts.platform),
      lazyComponentPlugin(buildCtx),
      loaderPlugin(bundleOpts.loader),
      userIndexPlugin(config, compilerCtx),
      typescriptPlugin(compilerCtx, bundleOpts, config),
      extFormatPlugin(config),
      extTransformsPlugin(config, compilerCtx, buildCtx, bundleOpts),
      workerPlugin(config, compilerCtx, buildCtx, bundleOpts.platform, !!bundleOpts.inlineWorkers),
      serverPlugin(config, bundleOpts.platform),
      ...beforePlugins,
      nodeResolvePlugin,
      resolveIdWithTypeScript(config, compilerCtx),
      rollupCommonjsPlugin({
        include: /node_modules/,
        sourceMap: config.sourceMap,
        transformMixedEsModules: false,
        ...config.commonjs,
      }),
      ...afterPlugins,
      pluginHelper(config, buildCtx, bundleOpts.platform),
      rollupJsonPlugin({
        preferConst: true,
      }),
      rollupReplacePlugin({
        'process.env.NODE_ENV': config.devMode ? '"development"' : '"production"',
      }),
      fileLoadPlugin(compilerCtx.fs),
    ],

    treeshake: getTreeshakeOption(config, bundleOpts),
    preserveEntrySignatures: bundleOpts.preserveEntrySignatures ?? 'strict',

    onwarn: createOnWarnFn(buildCtx.diagnostics),

    cache: compilerCtx.rollupCache.get(bundleOpts.id),
  };

  return rollupOptions;
};

const getTreeshakeOption = (config: d.ValidatedConfig, bundleOpts: BundleOptions): TreeshakingOptions | boolean => {
  if (bundleOpts.platform === 'hydrate') {
    return {
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false,
    };
  }

  const treeshake =
    !config.devMode && config.rollupConfig.inputOptions.treeshake !== false
      ? {
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        }
      : false;
  return treeshake;
};
