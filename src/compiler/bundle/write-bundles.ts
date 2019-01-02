import * as d from '../../declarations';
import { getBundleIdPlaceholder, getIntroPlaceholder } from '../../util/data-serialize';
import { generatePreamble } from '../util';
import { RollupBuild } from 'rollup';


export async function writeEsmModules(config: d.Config, rollupBuild: RollupBuild) {
  const { output } = await rollupBuild.generate({
    ...config.rollupConfig.outputOptions,
    format: 'es',
    banner: generatePreamble(config),
    intro: getIntroPlaceholder(),
    strict: false,
  });
  return <any>output as d.JSModuleList;
}


export async function writeAmdModules(config: d.Config, rollupBuild: RollupBuild, entryModules: d.EntryModule[]) {
  if (!config.buildEs5) {
    // only create legacy modules when generating es5 fallbacks
    return undefined;
  }

  rollupBuild.cache.modules.forEach(module => {
    const key = module.id;
    const entryModule = entryModules.find(b => b.entryKey === `./${key}.js`);
    if (entryModule) {
      entryModule.dependencies = module.dependencies.slice();
    }
  });

  const { output } = await rollupBuild.generate({
    ...config.rollupConfig.outputOptions,
    format: 'amd',
    amd: {
      id: getBundleIdPlaceholder(),
      define: `${config.namespace}.loadBundle`
    },
    banner: generatePreamble(config),
    intro: getIntroPlaceholder(),
    strict: false,
  });


  return <any>output as d.JSModuleList;
}

