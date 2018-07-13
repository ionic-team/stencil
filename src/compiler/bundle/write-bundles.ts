import * as d from '../../declarations';
import { generatePreamble } from '../util';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import { getHyperScriptFnEsmFileName } from '../app/app-file-naming';
import { BundleSet, OutputChunk } from 'rollup';


export async function writeEsModules(config: d.Config, rollupBundle: BundleSet) {
  const results: { [chunkName: string]: OutputChunk } = await rollupBundle.generate({
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h } = window.${config.namespace};`,
  });
  return <any>results as d.JSModuleList;
}


export async function writeLegacyModules(config: d.Config, rollupBundle: BundleSet, entryModules: d.EntryModule[]) {
  if (!config.buildEs5) {
    // only create legacy modules when generating es5 fallbacks
    return null;
  }

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

  return <any>results as d.JSModuleList;
}


export async function writeEsmEs5Modules(config: d.Config, rollupBundle: BundleSet) {
  if (config.outputTargets.some(o => o.type === 'dist')) {
    const results: { [chunkName: string]: OutputChunk } = await rollupBundle.generate({
      format: 'es',
      banner: generatePreamble(config),
      intro: `import { h } from './${getHyperScriptFnEsmFileName(config)}';`,
      strict: false,
    });

    return <any>results as d.JSModuleList;
  }

  return null;
}
