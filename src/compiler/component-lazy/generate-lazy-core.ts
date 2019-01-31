import * as d from '@declarations';
import { bundleAppCore } from '../app-core/bundle-app-core';
import { sys } from '@sys';


export async function generateLazyAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const appCoreEntryFilePath = await generateLazyAppCoreEntry(config, compilerCtx, build);

  const bundleEntryInputs: d.BundleEntryInputs = {};

  buildCtx.entryModules.forEach(entryModule => {
    bundleEntryInputs[entryModule.entryKey] = entryModule.entryKey;
  });

  return bundleAppCore(config, compilerCtx, buildCtx, build, buildCtx.entryModules, appCoreEntryFilePath, bundleEntryInputs);
}


async function generateLazyAppCoreEntry(config: d.Config, compilerCtx: d.CompilerCtx, _build: d.Build) {
  const appCoreEntryFileName = `${config.fsNamespace}-lazy.mjs`;
  const appCoreEntryFilePath = sys.path.join(config.cacheDir, appCoreEntryFileName);

  const coreText: string[] = [];

  coreText.push(`import { bootstrapLazy } from '@stencil/core/runtime';`);
  coreText.push(`bootstrapLazy([]);`);

  const runtimeExports: string[] = [];
  const platformExports: string[] = [];

  runtimeExports.push('createEvent');
  runtimeExports.push('getConnect');
  runtimeExports.push('getElement');
  runtimeExports.push('h');

  platformExports.push('getContext');
  platformExports.push('registerInstance');
  platformExports.push('registerStyle');


  if (platformExports.length > 0) {
    coreText.push(`export { ${platformExports.join(', ')} } from '@stencil/core/platform';`);
  }

  if (runtimeExports.length > 0) {
    coreText.push(`export { ${runtimeExports.join(', ')} } from '@stencil/core/runtime';`);
  }

  await compilerCtx.fs.writeFile(appCoreEntryFilePath, coreText.join('\n'), { inMemoryOnly: true });

  return appCoreEntryFilePath;
}
