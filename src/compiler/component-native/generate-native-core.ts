import * as d from '@declarations';
import { bundleAppCore } from '../app-core/bundle-app-core';
import { formatComponentRuntimeMeta, stringifyRuntimeData } from '../app-core/format-component-runtime-meta';
import { sys } from '@sys';
import { updateToNativeComponents } from './update-to-native-component';


export async function generateNativeAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[], build: d.Build) {
  const appCoreEntryFilePath = await generateNativeAppCoreEntry(config, compilerCtx, buildCtx, build, cmps);

  return bundleAppCore(config, compilerCtx, buildCtx, build, [], appCoreEntryFilePath, {});
}


async function generateNativeAppCoreEntry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, cmps: d.ComponentCompilerMeta[]) {
  const appCoreEntryFileName = `${config.fsNamespace}-native.mjs`;
  const appCoreEntryFilePath = sys.path.join(config.cacheDir, appCoreEntryFileName);

  const coreText: string[] = [];
  const nativeCmps = await updateToNativeComponents(config, compilerCtx, buildCtx, build, cmps);

  const platformImports: string[] = [];
  platformImports.push('proxyComponent');

  coreText.push(`import { ${platformImports.join(', ')} } from '@stencil/core/platform';`);

  nativeCmps.forEach(cmpData => {
    coreText.push(`import { ${cmpData.componentClassName} } from '${cmpData.filePath}';`);
  });

  if (nativeCmps.length === 1) {
    // only one component, so get straight to the point
    const cmp = nativeCmps[0];
    const runtimeData = formatComponentRuntimeMeta(cmp.cmp, false);

    coreText.push(`customElements.define('${cmp.tagName}', proxyComponent(
      ${cmp.componentClassName},
      ${stringifyRuntimeData(runtimeData)},
      1 /* is element constructor */,
      1 /* proxy state */
    ));`);

  } else {
    // numerous components, so make it easy on minifying
    coreText.push(formatNativeComponentRuntimeData(nativeCmps));
    coreText.push(`.forEach(cmp => customElements.define(cmp[0], proxyComponent(cmp[1], cmp[2], 1, 1)));`);
  }

  const platformExports: string[] = [
    'registerHost',
    'connectedCallback',
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


function formatNativeComponentRuntimeData(cmps: d.ComponentCompilerNativeData[]) {
  return `[${cmps.map(cmp => {
    return formatNativeComponentRuntime(cmp);
  }).join(',\n')}]`;
}


function formatNativeComponentRuntime(cmp: d.ComponentCompilerNativeData) {
  const c: string[] = [];

  c.push(`[`);

  // 0
  c.push(`\n'${cmp.tagName}'`);

  // 1
  c.push(`,\n${cmp.componentClassName}`);

  // 2
  c.push(`,\n${stringifyRuntimeData(formatComponentRuntimeMeta(cmp.cmp, false))}`);

  c.push(`]\n`);

  return c.join('');
}
