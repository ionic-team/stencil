import * as d from '@declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { sys } from '@sys';
import { transformToNativeComponentText } from '../transformers/component-native/tranform-to-native-component';
import { dashToPascalCase, normalizePath } from '@utils';


export async function updateToNativeComponent(compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta): Promise<d.ComponentCompilerData> {
  const inputFilePath = cmp.jsFilePath;
  const inputFileDir = sys.path.dirname(inputFilePath);
  const inputFileName = sys.path.basename(inputFilePath);
  const inputJsText = await compilerCtx.fs.readFile(inputFilePath);

  const cacheKey = compilerCtx.cache.createKey('native', COMPILER_BUILD.id, COMPILER_BUILD.transpiler, build.es5, inputJsText);
  const outputFileName = `${cacheKey}-${inputFileName}`;
  const outputFilePath = sys.path.join(inputFileDir, outputFileName);


  let outputJsText = await compilerCtx.cache.get(cacheKey);
  if (outputJsText == null) {
    outputJsText = transformToNativeComponentText(compilerCtx, buildCtx, build, cmp, inputJsText);

    await compilerCtx.cache.put(cacheKey, outputJsText);
  }

  await compilerCtx.fs.writeFile(outputFilePath, outputJsText, { inMemoryOnly: true });

  return {
    filePath: outputFilePath,
    exportLine: createComponentExport(cmp, outputFilePath),
    cmp
  };
}

function createComponentExport(cmp: d.ComponentCompilerMeta, lazyModuleFilePath: string) {
  const originalClassName = cmp.componentClassName;
  const pascalCasedClassName = dashToPascalCase(cmp.tagName);
  const filePath = normalizePath(lazyModuleFilePath);
  return `export { ${originalClassName} as ${pascalCasedClassName} } from '${filePath}';`;
}
