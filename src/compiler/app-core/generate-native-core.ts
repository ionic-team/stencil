import * as d from '../../declarations';
import { formatComponentRuntimeMeta } from './format-component-runtime-meta';
import { updateComponentSource } from './generate-component';
import { getComponentsWithStyles, setStylePlaceholders } from './register-styles';


export async function generateNativeAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build, files: Map<string, string>) {
  const c: string[] = [];

  const promises = build.appModuleFiles.map(moduleFile => {
    return updateToNativeComponent(config, compilerCtx, buildCtx, coreImportPath, build, moduleFile);
  });

  const cmps = await Promise.all(promises);

  cmps.sort((a, b) => {
    if (a.componentClassName < b.componentClassName) return -1;
    if (a.componentClassName > b.componentClassName) return 1;
    return 0;
  });

  c.push(`import { initHostComponent } from '${coreImportPath}';`);

  cmps.forEach(cmpData => {
    c.push(`import { ${cmpData.componentClassName} } from '${cmpData.filePath}';`);

    files.set(cmpData.filePath, cmpData.outputText);
  });

  if (cmps.length === 1) {
    // only one component, so get straight to the point
    const cmp = cmps[0];

    c.push(`customElements.define('${cmp.tagName}', initHostComponent(
      ${cmp.componentClassName},
      ${JSON.stringify(formatComponentRuntimeMeta(build, cmp.cmpCompilerMeta))},
      1
    ));`);

  } else {
    // numerous components, so make it easy on minifying
    c.push(formatComponentRuntimeArrays(build, cmps));
    c.push(`.forEach(cmp => customElements.define(cmp[0], initHostComponent(cmp[1], cmp[2], 1)));`);
  }

  const cmpsWithStyles = getComponentsWithStyles(build);
  if (cmpsWithStyles.length > 0) {
    const styles = await setStylePlaceholders(cmpsWithStyles, coreImportPath);
    c.push(styles);
  }

  return c.join('\n');
}


async function updateToNativeComponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build, moduleFile: d.Module) {
  const inputJsText = await compilerCtx.fs.readFile(moduleFile.jsFilePath);

  const outputText = updateComponentSource(config, buildCtx, coreImportPath, build, moduleFile, inputJsText);

  const cmpData: ComponentSourceData = {
    filePath: moduleFile.jsFilePath,
    outputText: outputText,
    tagName: moduleFile.cmpCompilerMeta.tagName,
    componentClassName: moduleFile.cmpCompilerMeta.componentClassName,
    cmpCompilerMeta: moduleFile.cmpCompilerMeta
  };

  return cmpData;
}


function formatComponentRuntimeArrays(build: d.Build, cmps: ComponentSourceData[]) {
  return `[${cmps.map(cmp => {
    return formatComponentRuntimeArray(build, cmp);
  }).join(',\n')}]`;
}


function formatComponentRuntimeArray(build: d.Build, cmp: ComponentSourceData) {
  const c: string[] = [];

  c.push(`[`);

  // 0
  c.push(`\n'${cmp.tagName}'`);

  // 1
  c.push(`,\n${cmp.componentClassName}`);

  // 2
  c.push(`,\n${formatComponentRuntimeMeta(build, cmp.cmpCompilerMeta)}`);

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
