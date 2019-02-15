import * as d from '@declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { sys } from '@sys';
import { transformToNativeComponentText } from '../transformers/component-native/tranform-to-native-component';
import { sortBy } from '@utils';


export async function updateToNativeComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmps: d.ComponentCompilerMeta[]) {
  const nativeCmps = await Promise.all(
    cmps.map(cmp => updateToNativeComponent(config, compilerCtx, buildCtx, build, cmp))
  );
  return sortBy(nativeCmps, c => c.componentClassName);
}


async function updateToNativeComponent(_config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta) {
  const inputFilePath = cmp.jsFilePath;
  const inputFileDir = sys.path.dirname(inputFilePath);
  const inputFileName = sys.path.basename(inputFilePath);
  const inputJsText = await compilerCtx.fs.readFile(inputFilePath);

  const cacheKey = compilerCtx.cache.createKey('native', COMPILER_BUILD.id, COMPILER_BUILD.transpiler, build.es5, inputJsText);
  const outputFileName = `${cacheKey}-${inputFileName}`;
  const outputFilePath = sys.path.join(inputFileDir, outputFileName);

  const cmpData: d.ComponentCompilerNativeData = {
    filePath: outputFilePath,
    tagName: cmp.tagName,
    componentClassName: cmp.componentClassName,
    cmp: cmp
  };

  let outputJsText = await compilerCtx.cache.get(cacheKey);
  if (outputJsText == null) {
    outputJsText = transformToNativeComponentText(compilerCtx, buildCtx, build, cmp, inputJsText);

    await compilerCtx.cache.put(cacheKey, outputJsText);
  }

  await compilerCtx.fs.writeFile(outputFilePath, outputJsText, { inMemoryOnly: true });

  return cmpData;
}
