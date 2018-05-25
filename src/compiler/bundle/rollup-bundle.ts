import { BuildCtx, CompilerCtx, Config, EntryModule, JSModuleList, NodeResolveConfig } from '../../declarations';
import bundleEntryFile from './rollup-plugins/bundle-entry-file';
import bundleJson from './rollup-plugins/json';
import { createOnWarnFn, loadRollupDiagnostics } from '../../util/logger/logger-rollup';
import { generatePreamble } from '../util';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import { getHyperScriptFnEsmFileName } from '../app/app-file-naming';
import localResolution from './rollup-plugins/local-resolution';
import inMemoryFsRead from './rollup-plugins/in-memory-fs-read';
import { BundleSet, OutputChunk, RollupDirOptions, rollup } from 'rollup';
import nodeEnvVars from './rollup-plugins/node-env-vars';
import pathsResolution from './rollup-plugins/paths-resolution';
import resolveCollections from './rollup-plugins/resolve-collections';


export async function createBundle(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, entryModules: EntryModule[]) {
  const builtins = require('rollup-plugin-node-builtins');
  const globals = require('rollup-plugin-node-globals');
  let rollupBundle: BundleSet;

  const commonjsConfig = {
    include: 'node_modules/**',
    sourceMap: false,
    ...config.commonjs
  };

  const nodeResolveConfig: NodeResolveConfig = {
    jsnext: true,
    main: true,
    ...config.nodeResolve
  };

  const rollupConfig: RollupDirOptions = {
    input: entryModules.map(b => b.entryKey),
    experimentalCodeSplitting: true,
    preserveSymlinks: false,
    experimentalDynamicImport: true,
    plugins: [
      resolveCollections(compilerCtx),
      config.sys.rollup.plugins.nodeResolve(nodeResolveConfig),
      config.sys.rollup.plugins.commonjs(commonjsConfig),
      bundleJson(config),
      globals(),
      builtins(),
      bundleEntryFile(config, entryModules),
      inMemoryFsRead(config, config.sys.path, compilerCtx),
      await pathsResolution(config, compilerCtx),
      localResolution(config, compilerCtx),
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

  return rollupBundle;
}


export async function writeEsModules(config: Config, rollupBundle: BundleSet) {
  const results: { [chunkName: string]: OutputChunk } = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h } = window.${config.namespace};`,
  });
  return <any>results as JSModuleList;
}


export async function writeLegacyModules(config: Config, rollupBundle: BundleSet, entryModules: EntryModule[]) {
  rollupBundle.cache.modules.forEach(module => {
    const key = module.id;
    const entryModule = entryModules.find(b => b.entryKey === `./${key}.js`);
    if (entryModule) {
      entryModule.dependencies = module.dependencies.slice();
    }
  });

  const results: { [chunkName: string]: OutputChunk } = await rollupBundle.generate({
    format: 'amd',
    amd: {
      id: getBundleIdPlaceholder(),
      define: `${config.namespace}.loadBundle`
    },
    banner: generatePreamble(config),
    intro: `const h = window.${config.namespace}.h;`,
    strict: false,
  });

  return <any>results as JSModuleList;
}


export async function writeEsmEs5Modules(config: Config, rollupBundle: BundleSet) {
  const results: { [chunkName: string]: OutputChunk } = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `import { h } from './${getHyperScriptFnEsmFileName(config)}';`,
    strict: false,
  });

  return <any>results as JSModuleList;
}
