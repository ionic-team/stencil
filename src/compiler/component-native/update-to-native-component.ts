import * as d from '@declarations';
import { COMPILER_BUILD } from '../build/compiler-build-id';
import { sys } from '@sys';
import { transformToNativeComponentText } from '../transformers/component-native/tranform-to-native-component';


export async function updateToNativeComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmps: d.ComponentCompilerMeta[]) {
  const promises = cmps.map(cmp => {
    return updateToNativeComponent(config, compilerCtx, buildCtx, build, cmp);
  });

  const nativeCmps = await Promise.all(promises);

  return nativeCmps.sort((a, b) => {
    if (a.componentClassName < b.componentClassName) return -1;
    if (a.componentClassName > b.componentClassName) return 1;
    return 0;
  });
}


async function updateToNativeComponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmp: d.ComponentCompilerMeta) {
  const inputFileName = sys.path.basename(cmp.jsFilePath);
  const inputJsText = await compilerCtx.fs.readFile(cmp.jsFilePath);

  const cacheKey = compilerCtx.cache.createKey('native', COMPILER_BUILD.id, COMPILER_BUILD.transpiler, build.es5, inputFileName, inputJsText);
  const outputFileName = `${cacheKey}-${inputFileName}`;
  const outputFilePath = sys.path.join(config.cacheDir, outputFileName);

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
