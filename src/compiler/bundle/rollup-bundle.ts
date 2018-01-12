import { BuildConfig, BuildContext, Bundle, RollupBundle } from '../../util/interfaces';
import bundleEntryFile from './rollup-plugins/bundle-entry-file';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble, hasError } from '../util';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpiled-in-memory';
import nodeEnvVars from './rollup-plugins/node-env-vars';


export async function runRollup(config: BuildConfig, ctx: BuildContext, bundle: Bundle) {
  let rollupBundle: RollupBundle;

  try {
    rollupBundle = await config.sys.rollup.rollup({
      input: bundle.entryKey,
      cache: ctx.rollupCache[bundle.entryKey],
      plugins: [
        config.sys.rollup.plugins.nodeResolve({
          jsnext: true,
          main: true
        }),
        config.sys.rollup.plugins.commonjs({
          include: 'node_modules/**',
          sourceMap: false
        }),
        bundleEntryFile(bundle),
        transpiledInMemoryPlugin(config, ctx),
        localResolution(config),
        nodeEnvVars(config),
      ],
      onwarn: createOnWarnFn(ctx.diagnostics, bundle.moduleFiles)

    });

  } catch (err) {
    loadRollupDiagnostics(config, ctx.diagnostics, err);
  }

  if (hasError(ctx.diagnostics) || !rollupBundle) {
    throw new Error('rollup died');
  }

  // cache for later
  // watch out for any rollup cache bugs
  // https://github.com/rollup/rollup/issues/1372
  ctx.rollupCache[bundle.entryKey] = rollupBundle;

  return rollupBundle;
}


export async function generateEsModule(config: BuildConfig, rollupBundle: RollupBundle) {
  const { code } = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h, Context } = window.${config.namespace};`
  });

  return code;
}


export async function generateLegacyModule(config: BuildConfig, rollupBundle: RollupBundle) {
  const { code } = await rollupBundle.generate({
    format: 'cjs',
    banner: generatePreamble(config),
    intro: `${config.namespace}.loadComponents(function(exports,h,Context){` +
           `"use strict";`,
            // module content w/ commonjs exports object
    outro: `\n},"${getBundleIdPlaceholder()}");`,
    strict: false
  });

  return code;
}
