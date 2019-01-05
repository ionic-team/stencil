import * as d from '../../declarations';
import { formatComponentRuntimeArrays } from '../component-native/format-native-runtime-meta';
import { formatComponentRuntimeMeta } from './format-component-runtime-meta';
import { getComponentsWithStyles, setStylePlaceholders } from './register-app-styles';
import { updateToNativeComponents } from '../component-native/update-to-native-component';


export async function generateNativeAppCore(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, build: d.Build, coreImportPath: string, files: Map<string, string>) {
  const c: string[] = [];

  c.push(`import { initHostComponent } from '${coreImportPath}';`);

  const cmps = await updateToNativeComponents(config, compilerCtx, buildCtx, coreImportPath, build);

  cmps.forEach(cmpData => {
    c.push(`import { ${cmpData.componentClassName} } from '${cmpData.filePath}';`);

    files.set(cmpData.filePath, cmpData.outputText);
  });

  if (cmps.length === 1) {
    // only one component, so get straight to the point
    const cmp = cmps[0];

    c.push(`customElements.define('${cmp.tagName}', initHostComponent(
      ${cmp.componentClassName},
      ${formatComponentRuntimeMeta(cmp.cmpCompilerMeta, false)},
      1
    ));`);

  } else {
    // numerous components, so make it easy on minifying
    c.push(formatComponentRuntimeArrays(cmps));
    c.push(`.forEach(cmp => customElements.define(cmp[0], initHostComponent(cmp[1], cmp[2], 1)));`);
  }

  const cmpsWithStyles = getComponentsWithStyles(build);
  if (cmpsWithStyles.length > 0) {
    const styles = await setStylePlaceholders(cmpsWithStyles, coreImportPath);
    c.push(styles);
  }

  return c.join('\n');
}
