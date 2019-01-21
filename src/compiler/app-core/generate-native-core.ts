import * as d from '@declarations';
import { formatComponentRuntimeMeta } from './format-component-runtime-meta';
import { setStylePlaceholders } from './register-app-styles';
import { updateToNativeComponents } from '../component-native/update-to-native-component';


export async function generateNativeAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, cmps: d.ComponentCompilerMeta[], build: d.Build, files: Map<string, string>) {
  const c: string[] = [];

  c.push(`import { initHostComponent } from 'TODO';`);

  const cmpData = await updateToNativeComponents(config, compilerCtx, buildCtx, build, cmps);

  cmpData.forEach(cmpData => {
    c.push(`import { ${cmpData.componentClassName} } from '${cmpData.filePath}';`);

    files.set(cmpData.filePath, cmpData.outputText);
  });

  if (cmpData.length === 1) {
    // only one component, so get straight to the point
    const cmp = cmpData[0];

    c.push(`customElements.define('${cmp.tagName}', initHostComponent(
      ${cmp.componentClassName},
      ${formatComponentRuntimeMeta(cmp.cmp, false)},
      1
    ));`);

  } else {
    // numerous components, so make it easy on minifying
    c.push(formatNativeComponentRuntimeData(cmpData));
    c.push(`.forEach(cmp => customElements.define(cmp[0], initHostComponent(cmp[1], cmp[2], 1)));`);
  }

  const cmpsWithStyles = cmps.filter(cmp => cmp.styles.length > 0);
  if (cmpsWithStyles.length > 0) {
    const styles = await setStylePlaceholders(build, cmpsWithStyles);
    c.push(styles);
  }

  return c.join('\n');
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
