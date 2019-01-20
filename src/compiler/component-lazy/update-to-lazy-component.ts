import * as d from '@declarations';
import { dashToPascalCase, normalizePath } from '@utils';
import { sys } from '@sys';
import { transformLazyComponent } from './transform-lazy-component';


export async function updateToLazyComponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, entryModule: d.EntryModule, cmp: d.ComponentCompilerMeta) {
  const inputJsText = await compilerCtx.fs.readFile(cmp.jsFilePath);

  const outputText = transformLazyComponent(config, buildCtx, build, cmp, inputJsText);

  const lazyModuleFilePath = `${cmp.jsFilePath}.${cmp.tagName}.lazy.mjs`;

  await compilerCtx.fs.writeFile(lazyModuleFilePath, outputText, { inMemoryOnly: true});

  const cmpData: d.ComponentCompilerLazyData = {
    filePath: lazyModuleFilePath,
    exportLine: createComponentExport(entryModule, cmp, lazyModuleFilePath),
    tagName: cmp.tagName
  };

  return cmpData;
}


function createComponentExport(entryModule: d.EntryModule, cmp: d.ComponentCompilerMeta, lazyModuleFilePath: string) {
  const originalClassName = cmp.componentClassName;
  const pascalCasedClassName = dashToPascalCase(cmp.tagName);
  const relPath = sys.path.relative(sys.path.dirname(entryModule.filePath), lazyModuleFilePath);
  const filePath = normalizePath(relPath);

  if (originalClassName === pascalCasedClassName) {
    return `export { ${originalClassName} } from './${filePath}';`;
  }

  return `export { ${originalClassName} as ${pascalCasedClassName} } from './${filePath}';`;
}
