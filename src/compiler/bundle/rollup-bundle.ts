import { Config, CompilerCtx, Bundle, BuildCtx, JSModuleList } from '../../util/interfaces';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble, hasError } from '../util';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpiled-in-memory';
import bundleEntryFile from './rollup-plugins/bundle-entry-file';
import { rollup, OutputBundle, InputOptions } from 'rollup';
import nodeEnvVars from './rollup-plugins/node-env-vars';


export async function createBundle(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, bundles: Bundle[]) {
  let rollupBundle: OutputBundle;

  let rollupConfig: InputOptions = {
    input: bundles.map(b => b.entryKey),
    experimentalCodeSplitting: true,
    experimentalDynamicImport: true,
    plugins: [
      bundleEntryFile(config, bundles),
      transpiledInMemoryPlugin(config, compilerCtx),
      localResolution(config, compilerCtx),
      nodeEnvVars(config),
    ],
    onwarn: createOnWarnFn(buildCtx.diagnostics)
  };

  try {
    rollupBundle = await rollup(rollupConfig);

  } catch (err) {
    console.log(err);
    loadRollupDiagnostics(config, compilerCtx, buildCtx, err);
  }

  if (hasError(buildCtx.diagnostics) || !rollupBundle) {
    throw new Error('rollup died');
  }

  return rollupBundle;
}


export async function writeEsModules(config: Config, rollupBundle: OutputBundle) {
  const results = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h, Context } = window.${config.namespace};`,
  });
  return <any>results as JSModuleList;
}


export async function writeLegacyModules(config: Config, rollupBundle: OutputBundle, bundles: Bundle[]) {
  Object.entries((<any>rollupBundle).chunks).forEach(([key, value]) => {
    const b = bundles.find(b => b.entryKey === `./${key}.js`);
    if (b) {
      b.dependencies = value.imports.slice();
    }
  });

  const results = await rollupBundle.generate({
    format: 'amd',
    amd: {
      id: getBundleIdPlaceholder(),
      define: `${config.namespace}.loadBundle`
    },
    banner: generatePreamble(config),
    intro:
`const h = window.${config.namespace}.h;
const Context = window.${config.namespace}.Context;`,
    strict: false,
  });

  return <any>results as JSModuleList;
}
