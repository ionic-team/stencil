import * as d from '../../declarations';
import { formatBrowserLoaderComponent } from '../../util/data-serialize';
import { generateLazyBundles } from '../bundle/generate-lazy-bundles';


export async function generateLazyLoadedAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, coreImportPath: string, build: d.Build) {
  const c: string[] = [];

  const cmpHostData = build.appModuleFiles.map(m => formatBrowserLoaderComponent(m.cmpCompilerMeta));

  c.push(`import { bootstrapLazy } from '${coreImportPath}';`);

  c.push(`bootstrapLazy(${JSON.stringify(cmpHostData)});`);

  if (build.vdomRender) {
    c.push(`export { h } from '${coreImportPath}';`);
  }

  await generateLazyBundles(config, compilerCtx, buildCtx);

  return c.join('\n');
}
