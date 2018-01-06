import { BuildConfig, BuildContext, Bundle, RollupBundle } from '../../util/interfaces';
import { Module } from './graph';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble, hasError } from '../util';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpiled-in-memory';
import bundleEntryFile from './rollup-plugins/bundle-entry-file';


export async function runRollup(config: BuildConfig, ctx: BuildContext, mod: Module, bundles: Bundle[]) {
  let rollupBundle: RollupBundle;
  let rollupConfig = {
    input: mod.id,
    cache: ctx.rollupCache[mod.id],
    external: (id: string) => {
      return mod.external(id, config.sys.path.dirname(mod.id));
    },
    plugins: [
      config.sys.rollup.plugins.nodeResolve({
        jsnext: true,
        main: true
      }),
      config.sys.rollup.plugins.commonjs({
        include: 'node_modules/**',
        sourceMap: false
      }),
      bundleEntryFile(config, bundles),
      transpiledInMemoryPlugin(config, ctx),
      localResolution(config),
    ],
    onwarn: createOnWarnFn(ctx.diagnostics)
  };

  try {
    rollupBundle = await config.sys.rollup.rollup(rollupConfig);

  } catch (err) {
    loadRollupDiagnostics(config, ctx.diagnostics, err);
  }

  if (hasError(ctx.diagnostics) || !rollupBundle) {
    throw new Error('rollup died');
  }

  // cache for later
  // watch out for any rollup cache bugs
  // https://github.com/rollup/rollup/issues/1372
  ctx.rollupCache[mod.id] = rollupBundle;

  return rollupBundle;
}


export async function generateEsModule(config: BuildConfig, rollupBundle: RollupBundle, absolutePaths: Map<string, string>) {
  const { code } = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h, Context } = window.${config.namespace};`,
    globals: (id: string) => absolutePaths.get(id),
  });
  return code;
}


export async function generateLegacyModule(config: BuildConfig, rollupBundle: RollupBundle, absolutePaths: Map<string, string>) {
  const { code } = await rollupBundle.generate({
    format: 'cjs',
    banner: generatePreamble(config),
    intro: `${config.namespace}.loadComponents(function(exports,h,Context){` +
           `"use strict";`,
            // module content w/ commonjs exports object
    outro: `\n},"${getBundleIdPlaceholder()}");`,
    strict: false,
    globals: (id: string) => absolutePaths.get(id),
  });

  return code;
}
