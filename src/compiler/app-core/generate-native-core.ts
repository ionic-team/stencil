import * as d from '../../declarations';
import { formatComponentRuntimeMembers, formatComponentRuntimeMeta } from './format-component-runtime-meta';
import { updateComponentSource } from './generate-component';


export async function generateNativeAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build, files: Map<string, string>) {
  const c: string[] = [];

  c.push(`import { proxyComponent } from '${coreImportPath}';`);

  const promises = build.appModuleFiles.map(moduleFile => {
    return updateToNativeComponent(config, compilerCtx, buildCtx, coreImportPath, build, moduleFile);
  });

  const cmps = await Promise.all(promises);

  cmps.sort((a, b) => {
    if (a.componentClassName < b.componentClassName) return -1;
    if (a.componentClassName > b.componentClassName) return 1;
    return 0;
  });

  cmps.forEach(cmpData => {
    c.push(`import { ${cmpData.componentClassName} } from '${cmpData.filePath}';`);

    files.set(cmpData.filePath, cmpData.outputText);
  });

  if (build.member) {
    // add proxies to the component's prototype

    if (cmps.length === 1) {
      // only one component, so get straight to the point
      c.push(`// define and proxy component`);
      const cmp = cmps[0];
      c.push(
        `customElements.define(
          '${cmp.tagName}',
          proxyComponent(
            ${cmp.componentClassName},
            ${formatComponentRuntimeMeta(cmp.cmpMeta)},
            ${formatComponentRuntimeMembers(cmp.cmpMeta)},
            1
          )
        );`
      );

    } else {
      // numerous components, so make it easy on minifying
      c.push(`// define and proxy components`);
      c.push(formatComponentRuntimeArrays(cmps));
      c.push(`.forEach(cmp =>
        customElements.define(
          cmp[0],
          proxyComponent(
            cmp[1],
            cmp[2],
            cmp[3],
            1
          )
        ));`);
    }

  } else {
    // no members to proxy
    if (cmps.length === 1) {
      // only one component, so get straight to the point
      c.push(`// define component`);
      const cmp = cmps[0];
      c.push(
        `customElements.define('${cmp.tagName}', ${cmp.componentClassName});`
      );

    } else {
      // numerous components, so make it easy on minifying
      c.push(`// define components`);
      c.push(formatComponentRuntimeArrays(cmps));
      c.push(`.forEach(cmp =>
        customElements.define(cmp[0],cmp[1]));`);
    }
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
    cmpMeta: moduleFile.cmpCompilerMeta
  };

  return cmpData;
}


function formatComponentRuntimeArrays(cmps: ComponentSourceData[]) {
  return `[${cmps.map(formatComponentRuntimeArray).join(', ')}]`;
}


function formatComponentRuntimeArray(cmp: ComponentSourceData) {
  const c: string[] = [];

  c.push(`[`);

  // 0
  c.push(`/* TagName */ '${cmp.tagName}'`);

  // 1
  c.push(`, /* Constructor */ ${cmp.componentClassName}`);

  // 2
  c.push(`, /* Meta */ ${formatComponentRuntimeMeta(cmp.cmpMeta)}`);

  // 3
  c.push(`, /* Members */ ${formatComponentRuntimeMembers(cmp.cmpMeta)}`);

  c.push(`]`);

  return c.join('');
}


interface ComponentSourceData {
  filePath: string;
  outputText: string;
  tagName: string;
  componentClassName: string;
  cmpMeta: d.ComponentCompilerMeta;
}
