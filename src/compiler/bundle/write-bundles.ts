import * as d from '../../declarations';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import { getHyperScriptFnEsmFileName } from '../app/app-file-naming';
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

export async function writeEsModules(config: d.Config, rollupBundle: RollupBuild) {
  const { output } = await rollupBundle.generate({
    ...config.rollupConfig.outputOptions,
    format: 'es',
    banner: generatePreamble(config),
    intro: `const { h } = window.${config.namespace};`,
  });
  return <any>output as d.JSModuleList;
}


export async function writeLegacyModules(config: d.Config, rollupBundle: RollupBuild, entryModules: d.EntryModule[]) {
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

  const { output } = await rollupBundle.generate({
    ...config.rollupConfig.outputOptions,
    format: 'amd',
    amd: {
      id: getBundleIdPlaceholder(),
      define: `${config.namespace}.loadBundle`
    },
    banner: generatePreamble(config),
    intro: `const h = window.${config.namespace}.h;`,
    strict: false,
  });

  return <any>output as d.JSModuleList;
}


export async function writeEsmEs5Modules(config: d.Config, rollupBundle: RollupBuild) {
  if (config.outputTargets.some(o => o.type === 'dist')) {
    const { output } = await rollupBundle.generate({
      ...config.rollupConfig.outputOptions,
      format: 'es',
      banner: generatePreamble(config),
      intro: `import { h } from './${getHyperScriptFnEsmFileName(config)}';`,
      strict: false,
    });

    return <any>output as d.JSModuleList;
  }

  return null;
}
