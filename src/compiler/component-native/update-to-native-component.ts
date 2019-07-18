import * as d from '../../declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { dashToPascalCase, normalizePath } from '@utils';
import { transformToNativeComponentText } from '../transformers/component-native/tranform-to-native-component';


export const updateToNativeComponent = async (config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmp: d.ComponentCompilerMeta): Promise<d.ComponentCompilerData> => {
  const inputFilePath = cmp.jsFilePath;
  const inputFileDir = config.sys.path.dirname(inputFilePath);
  const inputFileName = config.sys.path.basename(inputFilePath);
  const inputJsText = await compilerCtx.fs.readFile(inputFilePath);

  const cacheKey = await compilerCtx.cache.createKey('native', COMPILER_BUILD.id, COMPILER_BUILD.transpiler, inputJsText);
  const outputFileName = `${cacheKey}-${inputFileName}`;
  const outputFilePath = config.sys.path.join(inputFileDir, outputFileName);

  let outputJsText = await compilerCtx.cache.get(cacheKey);
  if (outputJsText == null) {
    outputJsText = transformToNativeComponentText(compilerCtx, buildCtx, cmp, inputJsText);

    await compilerCtx.cache.put(cacheKey, outputJsText);
  }

  await compilerCtx.fs.writeFile(outputFilePath, outputJsText, { inMemoryOnly: true });

  return {
    filePath: outputFilePath,
    exportLine: createComponentExport(cmp, outputFilePath),
    cmp
  };
};

const createComponentExport = (cmp: d.ComponentCompilerMeta, lazyModuleFilePath: string) => {
  const originalClassName = cmp.componentClassName;
  const pascalCasedClassName = dashToPascalCase(cmp.tagName);
  const filePath = normalizePath(lazyModuleFilePath);
  return `export { ${originalClassName} as ${pascalCasedClassName} } from '${filePath}';`;
};
