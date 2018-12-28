import * as d from '../../declarations';
import { DEFAULT_STYLE_MODE } from '../../util/constants';


export function getComponentsWithStyles(build: d.Build) {
  return build.appModuleFiles
    .filter(m => m.cmpCompilerMeta && m.cmpCompilerMeta.styles && m.cmpCompilerMeta.styles.length > 0)
    .map(m => m.cmpCompilerMeta);
}


export function setStylePlaceholders(cmpsWithStyles: d.ComponentCompilerMeta[], coreImportPath: string) {
  const c: string[] = [];

  c.push(`import { registerStyle } from '${coreImportPath}';`);

  cmpsWithStyles.forEach(cmpWithStyles => {
    c.push(`registerStyle('${cmpWithStyles.tagName}${STYLE_ID_PLACEHOLDER}', '${cmpWithStyles.tagName}${STYLE_TEXT_PLACEHOLDER}');`);
  });

  return c.join('\n');
}


export function replaceStylePlaceholders(appModuleFiles: d.Module[], modeName: string, bundleInput: string) {
  const cmpsWithStyles = appModuleFiles
    .filter(m => m.cmpCompilerMeta && m.cmpCompilerMeta.styles && m.cmpCompilerMeta.styles.length > 0)
    .map(m => m.cmpCompilerMeta);

  cmpsWithStyles.forEach(cmpWithStyles => {
    const style = cmpWithStyles.styles.find(s => s.modeName === modeName);
    if (!style || style.compiledStyleText) {
      return;
    }

    const styleIdPlaceholder = `${cmpWithStyles.tagName}${STYLE_ID_PLACEHOLDER}`;
    const styleTextPlaceholder = `${cmpWithStyles.tagName}${STYLE_TEXT_PLACEHOLDER}`;

    const styleId = `${cmpWithStyles.tagName}${modeName === DEFAULT_STYLE_MODE ? '' : modeName}`;

    bundleInput = bundleInput.replace(styleIdPlaceholder, styleId);
    bundleInput = bundleInput.replace(styleTextPlaceholder, style.compiledStyleText);
  });

  return bundleInput;
}


const STYLE_ID_PLACEHOLDER = `$STYLE-ID-PLACEHOLDER`;
const STYLE_TEXT_PLACEHOLDER = `$STYLE-TEXT-PLACEHOLDER`;
