import * as d from '../../declarations';
import { formatBrowserLoaderComponent } from '../../util/data-serialize';


export async function generateLazyLoadedAppCore(_config: d.Config, _compilerCtx: d.CompilerCtx, build: d.Build, coreImportPath: string) {
  const c: string[] = [];

  const cmpHostData = build.appModuleFiles.map(m => formatBrowserLoaderComponent(m.cmpCompilerMeta));

  c.push(`import { bootstrapLazy } from '${coreImportPath}';`);

  c.push(`bootstrapLazy(${JSON.stringify(cmpHostData)});`);

  if (build.vdomRender) {
    c.push(`export { h } from '${coreImportPath}';`);
  }

  return c.join('\n');
}
