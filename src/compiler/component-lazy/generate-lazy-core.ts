import * as d from '@declarations';
import { bundleAppCore } from '../app-core/bundle-app-core';
import { sys } from '@sys';


export async function generateLazyAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build) {
  const appCoreEntryFilePath = await generateLazyAppCoreEntry(config, compilerCtx);

  const bundleCoreOptions: d.BundleCoreOptions = {
    entryFilePath: appCoreEntryFilePath,
    entryInputs: {},
    moduleFormats: ['esm']
  };

  buildCtx.entryModules.forEach(entryModule => {
    bundleCoreOptions.entryInputs[entryModule.entryKey] = entryModule.entryKey;
  });

  return bundleAppCore(config, compilerCtx, buildCtx, build, buildCtx.entryModules, bundleCoreOptions);
}


async function generateLazyAppCoreEntry(config: d.Config, compilerCtx: d.CompilerCtx) {
  const appCoreEntryFileName = `${config.fsNamespace}-lazy.mjs`;
  const appCoreEntryFilePath = sys.path.join(config.cacheDir, appCoreEntryFileName);

  const coreText: string[] = [];

  coreText.push(`import { bootstrapLazy } from '@stencil/core/platform';`);
  coreText.push(`import '@global-scripts';`);

  coreText.push(`bootstrapLazy([/*!__STENCIL_LAZY_DATA__*/]);`);

  const platformExports: string[] = [
    'registerInstance',
    'createEvent',
    'getConnect',
    'getContext',
    'getElement',
    'setMode',
    'getMode',
    'Build',
    'Host',
    'h',
  ];
  coreText.push(`export { ${platformExports.join(', ')} } from '@stencil/core/platform';`);

  await compilerCtx.fs.writeFile(appCoreEntryFilePath, coreText.join('\n'), { inMemoryOnly: true });

  return appCoreEntryFilePath;
}
