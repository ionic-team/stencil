import * as d from '@declarations';
import { transformNativeComponent } from './transform-native-component';


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
  const inputJsText = await compilerCtx.fs.readFile(cmp.jsFilePath);

  const outputText = transformNativeComponent(config, buildCtx, build, cmp, inputJsText);

  const cmpData: d.ComponentCompilerNativeData = {
    filePath: cmp.jsFilePath,
    outputText: outputText,
    tagName: cmp.tagName,
    componentClassName: cmp.componentClassName,
    cmp: cmp
  };

  return cmpData;
}
