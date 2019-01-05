import * as d from '../../declarations';
import { dashToPascalCase } from '../../util/helpers';
import { normalizePath } from '../util';


export async function updateToLazyComponent(config: d.Config, compilerCtx: d.CompilerCtx, entryModule: d.EntryModule, moduleFile: d.Module) {
  const lazyModuleFilePath = `${moduleFile.jsFilePath}.lazy.mjs`;

  const lazyModuleContent = `export class ${moduleFile.cmpCompilerMeta.componentClassName} {}`;

  await compilerCtx.fs.writeFile(lazyModuleFilePath, lazyModuleContent, { inMemoryOnly: true});
  // console.log('write', lazyModuleFilePath)

  const lazyModule: d.ComponentCompilerLazyData = {
    filePath: lazyModuleFilePath,
    exportLine: createComponentExport(config, entryModule, moduleFile, lazyModuleFilePath),
    tagName: moduleFile.cmpCompilerMeta.tagName
  };

  return lazyModule;
}


function createComponentExport(config: d.Config, entryModule: d.EntryModule, moduleFile: d.Module, lazyModuleFilePath: string) {
  const originalClassName = moduleFile.cmpCompilerMeta.componentClassName;
  const pascalCasedClassName = dashToPascalCase(moduleFile.cmpCompilerMeta.tagName);
  const relPath = config.sys.path.relative(config.sys.path.dirname(entryModule.filePath), lazyModuleFilePath);
  const filePath = normalizePath(relPath);

  if (originalClassName === pascalCasedClassName) {
    return `export { ${originalClassName} } from './${filePath}';`;
  }

  return `export { ${originalClassName} as ${pascalCasedClassName} } from './${filePath}';`;
}
