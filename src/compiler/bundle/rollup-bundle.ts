import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleList } from '../../declarations';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble, hasError } from '../util';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import pathsResolution from './rollup-plugins/paths-resolution';
import localResolution from './rollup-plugins/local-resolution';
import transpiledInMemoryPlugin from './rollup-plugins/transpiled-in-memory';
import bundleEntryFile from './rollup-plugins/bundle-entry-file';
import { InputOptions, OutputChunk, rollup } from 'rollup';
import nodeEnvVars from './rollup-plugins/node-env-vars';
import bundleJson from './rollup-plugins/json';


export async function createBundle(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]) {
  const builtins = require('rollup-plugin-node-builtins');
  const globals = require('rollup-plugin-node-globals');
  let rollupBundle: OutputChunk;

  const rollupConfig: InputOptions = {
    input: entryModules.map(b => b.entryKey),
    experimentalCodeSplitting: true,
    preserveSymlinks: false,
    plugins: [
      config.sys.rollup.plugins.nodeResolve({
        jsnext: true,
        main: true
      }),
      config.sys.rollup.plugins.commonjs({
        include: 'node_modules/**',
        sourceMap: false
      }),
      bundleJson(config),
      globals(),
      builtins(),
      bundleEntryFile(config, entryModules),
      transpiledInMemoryPlugin(config, compilerCtx),
      await pathsResolution(config, compilerCtx),
      localResolution(config),
      nodeEnvVars(config),
      ...config.plugins
    ],
    onwarn: createOnWarnFn(config, buildCtx.diagnostics)
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


export async function writeEsModules(config: Config, rollupBundle: OutputChunk) {
  const results = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h, Context } = window.${config.namespace};`,
  });
  return <any>results as JSModuleList;
}


export async function writeLegacyModules(config: Config, rollupBundle: OutputChunk, entryModules: EntryModule[]) {
  const { chunks } = <any>rollupBundle;
  Object.keys(chunks).map(key => {
    return [key, chunks[key]];
  }).forEach(([key, value]) => {
    const entryModule = entryModules.find(b => b.entryKey === `./${key}.js`);
    if (entryModule) {
      entryModule.dependencies = (<any>value).imports.slice();
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
