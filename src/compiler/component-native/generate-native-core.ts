import * as d from '@declarations';
import { formatComponentRuntimeMeta } from '../app-core/format-component-runtime-meta';
import { setStylePlaceholders } from '../app-core/register-app-styles';
import { sys } from '@sys';
import { updateToNativeComponents } from './update-to-native-component';


export async function generateNativeAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[], build: d.Build, inputFiles: Map<string, string>) {
  const appCoreInput = sys.path.join(config.srcDir, 'core', 'native', `${config.fsNamespace}.js`);

  const c: string[] = [];

  c.push(`import { proxyComponent } from '@stencil/core/runtime';`);

  const cmpData = await updateToNativeComponents(config, compilerCtx, buildCtx, build, cmps);

  cmpData.forEach(cmpData => {
    c.push(`import { ${cmpData.componentClassName} } from '${cmpData.filePath}';`);

    inputFiles.set(cmpData.filePath, cmpData.outputText);
  });

  if (cmpData.length === 1) {
    // only one component, so get straight to the point
    const cmp = cmpData[0];

    c.push(`customElements.define('${cmp.tagName}', proxyComponent(
      ${cmp.componentClassName},
      ${JSON.stringify(formatComponentRuntimeMeta(cmp.cmp, false))},
      1 /* is element constructor */,
      1 /* proxy state */
    ));`);

  } else {
    // numerous components, so make it easy on minifying
    c.push(formatNativeComponentRuntimeData(cmpData));
    c.push(`.forEach(cmp => customElements.define(cmp[0], proxyComponent(cmp[1], cmp[2], 1, 1)));`);
  }

  const cmpsWithStyles = cmps.filter(cmp => cmp.styles.length > 0);
  if (cmpsWithStyles.length > 0) {
    const styles = await setStylePlaceholders(build, cmpsWithStyles);
    c.push(styles);
  }

  inputFiles.set(appCoreInput, c.join('\n'));

  return appCoreInput;
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
  c.push(`,\n${formatComponentRuntimeMeta(cmp.cmp, false)}`);

  c.push(`]\n`);

  return c.join('');
}
