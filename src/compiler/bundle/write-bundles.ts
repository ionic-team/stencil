import * as d from '../../declarations';
import { getBundleIdPlaceholder } from '../../util/data-serialize';
import { getHyperScriptFnEsmFileName } from '../app/app-file-naming';
import { OutputChunk, RollupBuild } from 'rollup';
import { dashToPascalCase } from '../../util/helpers';
import { EntryModule } from '../../declarations';
import { generatePreamble, normalizePath } from '../util';


export async function writeEntryModules(config: d.Config, entryModules: EntryModule[]) {
  const path = config.sys.path;

  Promise.all(
    entryModules.map(entryModule => {
      const fileContents = entryModule.moduleFiles
        .map(moduleFile => {
          const originalClassName = moduleFile.cmpMeta.componentClass;
          const pascalCasedClassName = dashToPascalCase(moduleFile.cmpMeta.tagNameMeta);

          const filePath = normalizePath(path.relative(path.dirname(entryModule.entryKey), moduleFile.jsFilePath));
          return `export { ${originalClassName} as ${pascalCasedClassName} } from './${filePath}';`;
        })
        .join('\n');
      return config.sys.fs.writeFile(entryModule.entryKey, fileContents);
    })
  );
}

export async function writeEsModules(config: d.Config, rollupBundle: RollupBuild) {
  const { output } = await rollupBundle.generate({
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
