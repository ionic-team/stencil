import { BuildConfig, BuildContext, Bundle, JSModuleList } from '../../util/interfaces';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble, hasError } from '../util';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpiled-in-memory';
import bundleEntryFile from './rollup-plugins/bundle-entry-file';
import { rollup, OutputBundle, InputOptions } from 'rollup';
import nodeEnvVars from './rollup-plugins/node-env-vars';


export async function createBundle(config: BuildConfig, ctx: BuildContext, bundles: Bundle[]) {
  let rollupBundle: OutputBundle;

  let rollupConfig: InputOptions = {
    input: bundles.map(b => b.entryKey),
    experimentalCodeSplitting: true,
    experimentalDynamicImport: true,
    plugins: [
      bundleEntryFile(config, bundles),
      transpiledInMemoryPlugin(config, ctx),
      localResolution(config),
      nodeEnvVars(config),
    ],
    onwarn: createOnWarnFn(ctx.diagnostics)
  };

  try {
    rollupBundle = await rollup(rollupConfig);

  } catch (err) {
    console.log(err);
    loadRollupDiagnostics(config, ctx.diagnostics, err);
  }

  if (hasError(ctx.diagnostics) || !rollupBundle) {
    throw new Error('rollup died');
  }

  return rollupBundle;
}


export async function writeEsModules(config: BuildConfig, rollupBundle: OutputBundle) {
  const results = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h, Context } = window.${config.namespace};`,
  });
  return <any>results as JSModuleList;
}


export async function writeLegacyModules(config: BuildConfig, rollupBundle: OutputBundle) {
  const results = await rollupBundle.generate({
    format: 'cjs',
    banner: generatePreamble(config),
    intro: `${config.namespace}.loadComponents(function(exports, h, Context){` +
           `"use strict";`,
            // module content w/ commonjs exports object
    outro: `\n},"${getBundleIdPlaceholder()}");`,
    strict: false,
  });
  return <any>results as JSModuleList;
}
