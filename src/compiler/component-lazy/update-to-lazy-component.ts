import * as d from '@declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { dashToPascalCase, normalizePath } from '@utils';
import { sys } from '@sys';
import { transformToLazyComponentText } from '../transformers/component-lazy/transform-lazy-component';


export async function updateToLazyComponent(_config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta) {
  const inputFilePath = cmp.jsFilePath;
  const inputFileDir = sys.path.dirname(inputFilePath);
  const inputFileName = sys.path.basename(inputFilePath);
  const inputText = await compilerCtx.fs.readFile(inputFilePath);

  const cacheKey = compilerCtx.cache.createKey('lazy', COMPILER_BUILD.id, COMPILER_BUILD.transpiler, build.es5, inputText);
  const outputFileName = `${cacheKey}-${inputFileName}`;
  const outputFilePath = sys.path.join(inputFileDir, outputFileName);

  const cmpData: d.ComponentCompilerLazyData = {
    filePath: outputFilePath,
    exportLine: createComponentExport(cmp, outputFilePath),
    tagName: cmp.tagName
  };

  let outputJsText = await compilerCtx.cache.get(cacheKey);
  if (outputJsText == null) {
    const transformOpts: d.TransformOptions = {
      addCompilerMeta: false,
      addStyle: true
    };
    outputJsText = transformToLazyComponentText(compilerCtx, buildCtx, build, transformOpts, cmp, inputText);

    await compilerCtx.cache.put(cacheKey, outputJsText);
  }

  await compilerCtx.fs.writeFile(outputFilePath, outputJsText, { inMemoryOnly: true });

  return cmpData;
}


function createComponentExport(cmp: d.ComponentCompilerMeta, lazyModuleFilePath: string) {
  const originalClassName = cmp.componentClassName;
  const pascalCasedClassName = dashToPascalCase(cmp.tagName);
  const filePath = normalizePath(lazyModuleFilePath);

  if (originalClassName === pascalCasedClassName) {
    return `export { ${originalClassName} } from '${filePath}';`;
  }

  return `export { ${originalClassName} as ${pascalCasedClassName} } from '${filePath}';`;
}
