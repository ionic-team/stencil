import * as d from '../../declarations';
import { formatBrowserLoaderComponent } from '../../util/data-serialize';


export function generateLazyLoadedAppCore(coreImportPath: string, build: d.Build) {
  const cmpHostData = build.appModuleFiles.map(m => formatBrowserLoaderComponent(m.cmpCompilerMeta));

  const c: string[] = [];

  c.push(`import {
    bootstrapLazy,
    h
  } from '${coreImportPath}';`);

  c.push(`bootstrapLazy(${JSON.stringify(cmpHostData)});`);

  if (build.vdomRender) {
    c.push(`export { h } from '${coreImportPath}';`);
  }

  return c.join('\n');
}
