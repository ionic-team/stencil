import * as d from '../../declarations';
import { formatComponentRuntimeMeta } from './format-component-runtime-meta';
import { getComponentsWithStyles, setStylePlaceholders } from './register-styles';
import { transformNativeComponent } from '../transformers/transform-native-component';


export async function generateNativeAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, coreImportPath: string, files: Map<string, string>) {
  const c: string[] = [];

  c.push(`import { initHostComponent } from '${coreImportPath}';`);

  const cmps = await updateToNativeComponents(config, compilerCtx, buildCtx, coreImportPath, build);

  cmps.forEach(cmpData => {
    c.push(`import { ${cmpData.componentClassName} } from '${cmpData.filePath}';`);

    files.set(cmpData.filePath, cmpData.outputText);
  });

  if (cmps.length === 1) {
    // only one component, so get straight to the point
    const cmp = cmps[0];

    c.push(`customElements.define('${cmp.tagName}', initHostComponent(
      ${cmp.componentClassName},
      ${formatComponentRuntimeMeta(cmp.cmpCompilerMeta, false)},
      1
    ));`);

  } else {
    // numerous components, so make it easy on minifying
    c.push(formatComponentRuntimeArrays(cmps));
    c.push(`.forEach(cmp => customElements.define(cmp[0], initHostComponent(cmp[1], cmp[2], 1)));`);
  }

  const cmpsWithStyles = getComponentsWithStyles(build);
  if (cmpsWithStyles.length > 0) {
    const styles = await setStylePlaceholders(cmpsWithStyles, coreImportPath);
    c.push(styles);
  }

  return c.join('\n');
}


async function updateToNativeComponents(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build) {
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

  const cmpData: ComponentSourceData = {
    filePath: moduleFile.jsFilePath,
    outputText: outputText,
    tagName: moduleFile.cmpCompilerMeta.tagName,
    componentClassName: moduleFile.cmpCompilerMeta.componentClassName,
    cmpCompilerMeta: moduleFile.cmpCompilerMeta
  };

  return cmpData;
}


function formatComponentRuntimeArrays(cmps: ComponentSourceData[]) {
  return `[${cmps.map(cmp => {
    return formatComponentRuntimeArray(cmp);
  }).join(',\n')}]`;
}


function formatComponentRuntimeArray(cmp: ComponentSourceData) {
  const c: string[] = [];

  c.push(`[`);

  // 0
  c.push(`\n'${cmp.tagName}'`);

  // 1
  c.push(`,\n${cmp.componentClassName}`);

  // 2
  c.push(`,\n${formatComponentRuntimeMeta(cmp.cmpCompilerMeta, false)}`);

  c.push(`]\n`);

  return c.join('');
}


interface ComponentSourceData {
  filePath: string;
  outputText: string;
  tagName: string;
  componentClassName: string;
  cmpCompilerMeta: d.ComponentCompilerMeta;
}
