import * as d from '../../declarations';
import { formatBrowserLoaderBundleIds, formatBrowserLoaderComponent } from '../../util/data-serialize';
import { updateComponentSource } from './generate-component';


export async function generateNativeAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build, files: Map<string, string>) {
  const c: string[] = [];

  c.push(`import { proxyComponent } from '${coreImportPath}';`);

  const promises = build.appModuleFiles.map(moduleFile => {
    return updateToNativeComponent(config, compilerCtx, buildCtx, coreImportPath, build, moduleFile);
  });

  const cmps = await Promise.all(promises);

  const cmpData: {
    /** componentClass */
    [0]: string;
    [1]: any ;
  }[] = [];

  cmps.sort((a, b) => {
    if (a.componentClassName < b.componentClassName) return -1;
    if (a.componentClassName > b.componentClassName) return 1;
    return 0;
  }).forEach(mutatedComponent => {
    c.push(`import { ${mutatedComponent.componentClassName} } from '${mutatedComponent.filePath}';`);
    files.set(mutatedComponent.filePath, mutatedComponent.output);

    cmpData.push([
      mutatedComponent.componentClassName,
      mutatedComponent.cmpData
    ]);
  });

  if (build.member) {
    // add proxies to the component's prototype

    if (cmpData.length === 1) {
      // only one component, so get straight to the point
      const cmp = cmpData[0];
      c.push(
        `customElements.define('${cmp[1][0]}', proxyComponent(plt, ${cmp[0]}, ${JSON.stringify(cmp[1])}, 1));`
      );

    } else {
      // numerous components, so make it easy on minifying
      c.push(`${JSON.stringify(cmps)}
        .forEach(cmp => customElements.define(
          cmp[1][0],
          proxyComponent(plt, cmp[0], cmp[1], 1)
        ));`);
    }

  } else {
    // no members to proxy
    if (build.appModuleFiles.length === 1) {
      const cmpMeta = build.appModuleFiles[0].cmpCompilerMeta;

      c.push(`customElements.define('${cmpMeta.tagName}', ${cmpMeta.componentClassName});`);

    } else {
      c.push(`[${build.appModuleFiles.map(m => m.cmpCompilerMeta.componentClassName).join(', ')}]
        .forEach(c => customElements.define(c.is, c));`);
    }
  }

  return c.join('\n');
}


async function updateToNativeComponent(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build, moduleFile: d.Module) {
  const inputJsText = await compilerCtx.fs.readFile(moduleFile.jsFilePath);

  const output = updateComponentSource(config, buildCtx, coreImportPath, build, moduleFile, inputJsText);

  return {
    cmpData: formatBrowserLoaderComponent(moduleFile.cmpCompilerMeta),
    filePath: moduleFile.jsFilePath,
    output: output,
    componentClassName: moduleFile.cmpCompilerMeta.componentClassName,
    bundleIds: formatBrowserLoaderBundleIds(moduleFile.cmpCompilerMeta.bundleIds as d.BundleIds),
  };
}
