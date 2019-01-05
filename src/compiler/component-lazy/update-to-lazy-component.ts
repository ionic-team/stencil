import * as d from '../../declarations';
import { dashToPascalCase } from '../../util/helpers';
import { normalizePath } from '../util';
import { transformLazyComponent } from './transform-lazy-component';


export async function updateToLazyComponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModule: d.EntryModule, moduleFile: d.Module) {
  const inputJsText = await compilerCtx.fs.readFile(moduleFile.jsFilePath);

  const outputText = transformLazyComponent(config, buildCtx, build, moduleFile, inputJsText);

  const lazyModuleFilePath = `${moduleFile.jsFilePath}.lazy.mjs`;

  await compilerCtx.fs.writeFile(lazyModuleFilePath, outputText, { inMemoryOnly: true});

  const cmpData: d.ComponentCompilerLazyData = {
    filePath: lazyModuleFilePath,
    exportLine: createComponentExport(config, entryModule, moduleFile, lazyModuleFilePath),
    tagName: moduleFile.cmpCompilerMeta.tagName
  };

  return cmpData;
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
