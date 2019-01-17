import * as d from '../../declarations';
import { getBundleIdPlaceholder, getIntroPlaceholder } from '../../util/data-serialize';
import { RollupBuild } from 'rollup';
import { dashToPascalCase } from '../../util/helpers';
import { EntryModule } from '../../declarations';
import { generatePreamble, normalizePath } from '../util';


export async function writeEntryModules(config: d.Config, compilerCtx: d.CompilerCtx, entryModules: EntryModule[]) {
  const path = config.sys.path;

  await Promise.all(
    entryModules.map(async (entryModule) => {
      const fileContents = entryModule.moduleFiles
        .map(moduleFile => {
          const originalClassName = moduleFile.cmpMeta.componentClass;
          const pascalCasedClassName = dashToPascalCase(moduleFile.cmpMeta.tagNameMeta);

          const filePath = normalizePath(path.relative(path.dirname(entryModule.filePath), moduleFile.jsFilePath));
          return `export { ${originalClassName} as ${pascalCasedClassName} } from './${filePath}';`;
        })
        .join('\n');
      await compilerCtx.fs.writeFile(entryModule.filePath, fileContents, { inMemoryOnly: true});
    })
  );
}

export async function writeEsmModules(config: d.Config, rollupBundle: RollupBuild) {
  const { output } = await rollupBundle.generate({
    ...config.rollupConfig.outputOptions,
    format: 'es',
    banner: generatePreamble(config),
    intro: getIntroPlaceholder(),
    strict: false,
  });

  return output
    .map(({ fileName, code }) => ({ [fileName]: { code } }))
    .reduce((acc, val) => ({ ...acc, ...val })) as d.JSModuleList;
}


export async function writeAmdModules(config: d.Config, rollupBundle: RollupBuild, entryModules: d.EntryModule[]) {
  if (!config.buildEs5) {
    // only create legacy modules when generating es5 fallbacks
    return undefined;
  }

  rollupBundle.cache.modules.forEach(module => {
    const key = module.id;
    const entryModule = entryModules.find(b => b.entryKey === `./${key}.js`);
    if (entryModule) {
      entryModule.dependencies = module.dependencies.slice();
    }
  });

  const { output } = await rollupBundle.generate({
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


  return output
    .map(({ fileName, code }) => ({ [fileName]: { code } }))
    .reduce((acc, val) => ({ ...acc, ...val })) as d.JSModuleList;
}

