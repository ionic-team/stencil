import * as d from '@declarations';
import { bundleAppCore } from '../app-core/bundle-app-core';
import { formatComponentRuntimeMeta } from '../app-core/format-component-runtime-meta';
import { setStylePlaceholders } from '../app-core/register-app-styles';
import { updateToNativeComponents } from './update-to-native-component';
import { sys } from '@sys';


export async function generateNativeAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[], build: d.Build) {
  const appCoreEntryFilePath = await generateNativeAppCoreEntry(config, compilerCtx, buildCtx, cmps, build);

  return bundleAppCore(config, compilerCtx, buildCtx, build, [], appCoreEntryFilePath, {});
}


export async function generateNativeAppCoreEntry(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[], build: d.Build) {
  const appCoreEntryFileName = `${config.fsNamespace}-native.mjs`;
  const appCoreEntryFilePath = sys.path.join(config.srcDir, appCoreEntryFileName);

  const coreText: string[] = [];

  coreText.push(`// ${appCoreEntryFileName}`);
  coreText.push(`import { proxyComponent } from '@stencil/core/runtime';`);

  const cmpData = await updateToNativeComponents(config, compilerCtx, buildCtx, build, cmps);

  cmpData.forEach(cmpData => {
    coreText.push(`import { ${cmpData.componentClassName} } from '${cmpData.filePath}';`);
  });

  if (cmpData.length === 1) {
    // only one component, so get straight to the point
    const cmp = cmpData[0];

    coreText.push(`customElements.define('${cmp.tagName}', proxyComponent(
      ${cmp.componentClassName},
      ${JSON.stringify(formatComponentRuntimeMeta(cmp.cmp, false))},
      1 /* is element constructor */,
      1 /* proxy state */
    ));`);

  } else {
    // numerous components, so make it easy on minifying
    coreText.push(formatNativeComponentRuntimeData(cmpData));
    coreText.push(`.forEach(cmp => customElements.define(cmp[0], proxyComponent(cmp[1], cmp[2], 1, 1)));`);
  }

  const cmpsWithStyles = cmps.filter(cmp => cmp.styles.length > 0);
  if (cmpsWithStyles.length > 0) {
    const styles = await setStylePlaceholders(build, cmpsWithStyles);
    coreText.push(styles);
  }

  await compilerCtx.fs.writeFile(appCoreEntryFilePath, coreText.join('\n'), { inMemoryOnly: true });

  return appCoreEntryFileName;
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
  c.push(`,\n${JSON.stringify(formatComponentRuntimeMeta(cmp.cmp, false))}`);

  c.push(`]\n`);

  return c.join('');
}
