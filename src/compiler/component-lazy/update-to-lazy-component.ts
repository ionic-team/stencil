import * as d from '../../declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { normalizePath } from '@utils';
import { transformToLazyComponentText } from '../transformers/component-lazy/transform-lazy-component';


export async function updateToLazyComponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta): Promise<d.ComponentCompilerData> {
  const inputFilePath = cmp.jsFilePath;
  const inputFileDir = config.sys.path.dirname(inputFilePath);
  const inputFileName = config.sys.path.basename(inputFilePath);
  const inputText = await compilerCtx.fs.readFile(inputFilePath);

  const cacheKey = compilerCtx.cache.createKey('lazy', COMPILER_BUILD.id, COMPILER_BUILD.transpiler, build.es5, inputText);
  const outputFileName = `${cacheKey}-${inputFileName}`;
  const outputFilePath = config.sys.path.join(inputFileDir, outputFileName);

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

  return {
    filePath: outputFilePath,
    exportLine: createComponentExport(cmp, outputFilePath),
    cmp
  };
}


function createComponentExport(cmp: d.ComponentCompilerMeta, lazyModuleFilePath: string) {
  const originalClassName = cmp.componentClassName;
  const underscoredClassName = cmp.tagName.replace(/-/g, '_');
  const filePath = normalizePath(lazyModuleFilePath);
  return `export { ${originalClassName} as ${underscoredClassName} } from '${filePath}';`;
}
