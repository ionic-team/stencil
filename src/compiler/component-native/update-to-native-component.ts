import * as d from '../../declarations';
import { transformNativeComponent } from './transform-native-component';


export async function updateToNativeComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build) {
  const promises = build.appModuleFiles.map(moduleFile => {
    return updateToNativeComponent(config, compilerCtx, buildCtx, coreImportPath, build, moduleFile);
  });

  const cmps = await Promise.all(promises);

  cmps.sort((a, b) => {
    if (a.componentClassName < b.componentClassName) return -1;
    if (a.componentClassName > b.componentClassName) return 1;
    return 0;
  });

  return cmps;
}


async function updateToNativeComponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build, moduleFile: d.Module) {
  const inputJsText = await compilerCtx.fs.readFile(moduleFile.jsFilePath);

  const outputText = transformNativeComponent(config, buildCtx, coreImportPath, build, moduleFile, inputJsText);

  const cmpData: d.ComponentCompilerNativeData = {
    filePath: moduleFile.jsFilePath,
    outputText: outputText,
    tagName: moduleFile.cmpCompilerMeta.tagName,
    componentClassName: moduleFile.cmpCompilerMeta.componentClassName,
    cmpCompilerMeta: moduleFile.cmpCompilerMeta
  };

  return cmpData;
}
